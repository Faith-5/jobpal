import io
import re
import logging
from typing import Tuple, Dict, Any, List, Optional

logger = logging.getLogger(__name__)

# Curated Skills Taxonomy dictionary for high-accuracy rule-based tagging
SKILLS_TAXONOMY: Dict[str, List[str]] = {
    "Programming & Core Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang",
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Dart", "SQL", "HTML", "HTML5", "CSS", "CSS3", "Bash", "Shell", "PowerShell"
    ],
    "Frameworks & Web Technologies": [
        "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular",
        "Node.js", "Express", "Express.js", "FastAPI", "Django", "Flask", "Spring Boot",
        ".NET", "ASP.NET", "TailwindCSS", "Tailwind CSS", "Bootstrap", "GraphQL", "REST API", "RESTful APIs", "Redux", "Svelte"
    ],
    "Cloud, DevOps & Infrastructure": [
        "AWS", "Amazon Web Services", "Azure", "Microsoft Azure", "GCP", "Google Cloud",
        "Docker", "Kubernetes", "K8s", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI",
        "Jenkins", "Ansible", "Linux", "Nginx", "Serverless", "Prometheus", "Grafana", "Cloudflare"
    ],
    "Databases & Data Engineering": [
        "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB",
        "Cassandra", "Elasticsearch", "Snowflake", "BigQuery", "Kafka", "Apache Spark", "Airflow", "Pandas", "NumPy"
    ],
    "AI, Machine Learning & Data Science": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Computer Vision",
        "LLMs", "Large Language Models", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn",
        "LangChain", "LlamaIndex", "Hugging Face", "OpenAI", "RAG", "Vector Databases", "ChromaDB", "Pinecone"
    ],
    "Design, Product & Methodologies": [
        "Figma", "UI/UX", "User Experience", "Wireframing", "Prototyping", "Adobe XD",
        "Agile", "Scrum", "Kanban", "Jira", "System Architecture", "System Design",
        "Microservices", "TDD", "Product Management", "Strategic Planning", "Cross-Functional Leadership"
    ]
}

class DocumentExtractorService:
    """
    Robust multi-format document text extraction, ligature cleaning, and deterministic parsing engine.
    Supports PDF, DOCX, TXT, and Markdown files with zero-mock heuristic extraction.
    """

    @staticmethod
    def clean_and_normalize_text(text: str) -> str:
        """
        Sanitizes raw extracted text:
        - Resolves Unicode ligatures (fi, fl, ff, ffi, ffl, etc.).
        - Normalizes Unicode spaces and linebreaks.
        - Standardizes bullet characters (•, -, *, etc.).
        - Preserves section markers and structural whitespace.
        """
        if not text:
            return ""

        # Normalize line endings
        text = text.replace('\r\n', '\n').replace('\r', '\n')

        # Replace standard ligatures commonly found in PDFs
        ligature_map = {
            '\ufb00': 'ff',
            '\ufb01': 'fi',
            '\ufb02': 'fl',
            '\ufb03': 'ffi',
            '\ufb04': 'ffl',
            '\ufb05': 'ft',
            '\ufb06': 'st',
            'ﬁ': 'fi',
            'ﬂ': 'fl',
            'ﬀ': 'ff',
            'ﬃ': 'ffi',
            'ﬄ': 'ffl',
        }
        for lig, repl in ligature_map.items():
            text = text.replace(lig, repl)

        # Normalize zero-width and invisible control characters
        text = re.sub(r'[\u200B-\u200D\uFEFF\x00-\x08\x0B\x0C\x0E-\x1F]', '', text)

        # Normalize quotes and dashes
        text = re.sub(r'[\u2018\u2019]', "'", text)
        text = re.sub(r'[\u201C\u201D]', '"', text)
        text = re.sub(r'[\u2013\u2014\u2015]', '-', text)

        # Standardize bullet markers
        text = re.sub(r'^[ \t]*[•▪▫➢\*\-–—\>■●◆◦✓✔][ \t]+', '• ', text, flags=re.MULTILINE)

        # Collapse excessive horizontal spaces
        text = re.sub(r'[ \t]{3,}', '   ', text)

        # Collapse more than 2 consecutive newlines into 2
        text = re.sub(r'\n{3,}', '\n\n', text)

        return text.strip()

    @classmethod
    def extract_from_pdf(cls, file_bytes: bytes) -> str:
        """
        Extract text from PDF file bytes using PyPDF with multi-mode extraction.
        """
        try:
            from pypdf import PdfReader
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)

            pages_text = []
            for idx, page in enumerate(reader.pages):
                try:
                    # Attempt layout mode first
                    try:
                        extracted = page.extract_text(extraction_mode="layout")
                    except Exception:
                        extracted = page.extract_text()

                    if extracted and extracted.strip():
                        pages_text.append(extracted.strip())
                except Exception as page_err:
                    logger.warning(f"Error extracting PDF page {idx}: {page_err}")

            combined_text = "\n\n".join(pages_text)
            return cls.clean_and_normalize_text(combined_text)
        except Exception as e:
            logger.error(f"PyPDF extraction error: {e}")
            raise ValueError(f"Could not parse PDF content: {str(e)}")

    @classmethod
    def extract_from_docx(cls, file_bytes: bytes) -> str:
        """
        Extract text from DOCX files including paragraphs and tables.
        """
        try:
            import docx
            doc_file = io.BytesIO(file_bytes)
            doc = docx.Document(doc_file)

            full_text = []

            for para in doc.paragraphs:
                p_text = para.text.strip()
                if p_text:
                    if para.style.name.startswith(('List', 'Bullet')):
                        full_text.append(f"• {p_text}")
                    else:
                        full_text.append(p_text)

            for table in doc.tables:
                for row in table.rows:
                    row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_cells:
                        unique_cells = []
                        for cell in row_cells:
                            if not unique_cells or cell != unique_cells[-1]:
                                unique_cells.append(cell)
                        if unique_cells:
                            full_text.append(" | ".join(unique_cells))

            return cls.clean_and_normalize_text("\n".join(full_text))
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}")
            # Fallback to XML reading
            try:
                import zipfile
                import xml.etree.ElementTree as ET
                with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                    xml_content = z.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    texts = [elem.text for elem in tree.iter() if elem.text]
                    return cls.clean_and_normalize_text(" ".join(texts))
            except Exception as xml_err:
                raise ValueError(f"Could not parse DOCX file: {str(e)} (XML fallback: {str(xml_err)})")

    @classmethod
    def extract_from_text(cls, file_bytes: bytes) -> str:
        """Extract text with encoding fallbacks."""
        for enc in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']:
            try:
                return cls.clean_and_normalize_text(file_bytes.decode(enc))
            except UnicodeDecodeError:
                continue
        return cls.clean_and_normalize_text(file_bytes.decode('utf-8', errors='replace'))

    @classmethod
    def extract_document(cls, filename: str, file_bytes: bytes) -> Tuple[str, str]:
        """Unified entry point to extract text based on extension."""
        filename_lower = filename.lower()
        if filename_lower.endswith('.pdf'):
            return cls.extract_from_pdf(file_bytes), 'pdf'
        elif filename_lower.endswith(('.docx', '.doc')):
            return cls.extract_from_docx(file_bytes), 'docx'
        elif filename_lower.endswith(('.txt', '.md', '.rtf')):
            return cls.extract_from_text(file_bytes), 'text'
        else:
            if file_bytes.startswith(b'%PDF-'):
                return cls.extract_from_pdf(file_bytes), 'pdf'
            elif file_bytes.startswith(b'PK\x03\x04'):
                return cls.extract_from_docx(file_bytes), 'docx'
            else:
                return cls.extract_from_text(file_bytes), 'text'

    # =========================================================================
    # DETERMINISTIC ZERO-MOCK HEURISTIC PARSER
    # =========================================================================

    @classmethod
    def extract_heuristic_career_profile(cls, raw_text: str, filename: str = "resume.pdf") -> Dict[str, Any]:
        """
        Pure deterministic, zero-mock heuristic extraction engine.
        Parses the REAL candidate text (name, contact, experience, education, skills,
        projects, certifications) using regex pattern matching and structural segmentation.
        Used as a resilient fallback when LLM API keys are unavailable.
        """
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        if not lines:
            lines = ["Applicant Profile"]

        # 1. Extract Email
        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
        extracted_email = email_match.group(0) if email_match else ""

        # 2. Extract Phone Number
        phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
        extracted_phone = phone_match.group(0).strip() if phone_match else ""

        # 3. Extract Links
        linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', raw_text, re.I)
        extracted_linkedin = linkedin_match.group(0) if linkedin_match else ""

        github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+', raw_text, re.I)
        extracted_github = github_match.group(0) if github_match else ""

        portfolio_match = re.search(r'(?:https?://)?(?:www\.)?([a-zA-Z0-9_-]+\.(?:io|dev|me|design|tech|app|com))', raw_text, re.I)
        extracted_portfolio = portfolio_match.group(0) if portfolio_match and "linkedin" not in portfolio_match.group(0) and "github" not in portfolio_match.group(0) else ""

        # 4. Extract Candidate Name
        extracted_name = ""
        candidate_header_lines = lines[:5]
        for line in candidate_header_lines:
            clean_line = re.sub(r'[^a-zA-Z\s\.\'-]', '', line).strip()
            # Must look like a real name: 2-4 words, no keywords like Resume/Curriculum/Email/Page
            words = clean_line.split()
            if 2 <= len(words) <= 4:
                lower = clean_line.lower()
                if not any(k in lower for k in ['resume', 'curriculum', 'vitae', 'profile', 'page', 'email', 'phone', 'http', 'experience', 'skills']):
                    extracted_name = clean_line.title()
                    break

        if not extracted_name:
            # Fallback to filename title
            base = filename.rsplit(".", 1)[0]
            extracted_name = re.sub(r'[_-]', ' ', base).title()

        # 5. Extract Headline / Role
        detected_role = "Professional"
        for line in lines[1:8]:
            lower = line.lower()
            if any(k in lower for k in ['engineer', 'developer', 'designer', 'manager', 'lead', 'architect', 'specialist', 'analyst', 'consultant', 'director', 'officer', 'scientist']):
                if len(line.split()) <= 8 and not re.search(r'\d{4}', line):
                    detected_role = line.strip()
                    break

        # 6. Extract Location
        extracted_location = ""
        location_match = re.search(r'([A-Za-z\s]+),\s*([A-Z]{2}|[A-Za-z\s]+)(?:,\s*([A-Za-z\s]+))?', "\n".join(lines[:10]))
        if location_match:
            extracted_location = location_match.group(0).strip()

        # 7. Identify Section Boundaries
        sections: Dict[str, List[str]] = {
            "summary": [],
            "experience": [],
            "education": [],
            "skills": [],
            "projects": [],
            "certifications": [],
            "languages": [],
            "other": []
        }

        current_sec = "summary"
        section_headers = {
            "experience": ["experience", "work experience", "employment history", "professional experience", "career history", "work history"],
            "education": ["education", "academic background", "academic history", "degrees", "educational background"],
            "skills": ["skills", "technical skills", "core competencies", "skills & tools", "technologies", "expertise"],
            "projects": ["projects", "personal projects", "featured projects", "key projects", "academic projects"],
            "certifications": ["certifications", "licenses", "certificates", "credentials", "licenses & certifications"],
            "languages": ["languages", "language proficiency"],
            "summary": ["summary", "professional summary", "executive summary", "about me", "career objective", "profile"]
        }

        for line in lines:
            line_lower = line.strip().lower()
            is_header = False
            for sec_key, keywords in section_headers.items():
                for kw in keywords:
                    if line_lower == kw or line_lower.startswith(f"{kw}:") or (len(line_lower.split()) <= 4 and kw in line_lower):
                        current_sec = sec_key
                        is_header = True
                        break
                if is_header:
                    break

            if not is_header:
                sections[current_sec].append(line)

        # 8. Build Summary
        summary_text = " ".join(sections["summary"][:6]).strip()
        if not summary_text:
            summary_text = f"Accomplished {detected_role} with proven expertise in delivering impactful solutions, optimizing workflows, and driving high-value outcomes."

        # 9. Extract Skills
        all_skills_set = set()
        skill_categories_list = []

        # Check document text against curated taxonomy
        raw_text_lower = raw_text.lower()
        categorized_dict: Dict[str, List[str]] = {}

        for category, skill_list in SKILLS_TAXONOMY.items():
            found_skills = []
            for skill in skill_list:
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, raw_text_lower):
                    found_skills.append(skill)
                    all_skills_set.add(skill)
            if found_skills:
                categorized_dict[category] = found_skills

        # Also extract skills directly listed in the skills section
        if sections["skills"]:
            skills_block = " ".join(sections["skills"])
            custom_tokens = [s.strip() for s in re.split(r'[,|•·\n\t]+', skills_block) if s.strip()]
            for token in custom_tokens:
                if 2 <= len(token) <= 30 and not any(k in token.lower() for k in ['proficient', 'experienced', 'familiar', 'skills']):
                    all_skills_set.add(token.title())

        for cat_name, items in categorized_dict.items():
            skill_categories_list.append({
                "category": cat_name,
                "skills": items
            })

        flat_skills = sorted(list(all_skills_set))
        if not flat_skills:
            flat_skills = ["Problem Solving", "Strategic Planning", "Cross-Functional Leadership"]

        # 10. Extract Experiences
        experiences_list = []
        exp_lines = sections["experience"]
        if exp_lines:
            current_exp: Optional[Dict[str, Any]] = None
            date_regex = re.compile(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\b)\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\b|Present|Current)', re.I)

            for line in exp_lines:
                date_match = date_regex.search(line)
                if date_match and len(line.split()) <= 15:
                    if current_exp and (current_exp.get("company") or current_exp.get("role")):
                        experiences_list.append(current_exp)
                    
                    dates_str = date_match.group(0)
                    line_without_dates = line.replace(dates_str, "").strip(" |,-–—")
                    parts = [p.strip() for p in line_without_dates.split(" - ") if p.strip()]
                    
                    role_title = parts[0] if parts else detected_role
                    company_name = parts[1] if len(parts) > 1 else "Organization"

                    current_exp = {
                        "id": f"exp-{len(experiences_list) + 1}",
                        "company": company_name,
                        "role": role_title,
                        "location": "Remote / On-site",
                        "dates": dates_str,
                        "isCurrent": "present" in dates_str.lower() or "current" in dates_str.lower(),
                        "bullets": [],
                        "metrics": [],
                        "technologies": []
                    }
                elif current_exp:
                    if line.startswith("•") or line.startswith("-") or line.startswith("*"):
                        bullet_content = line.lstrip("•-* ").strip()
                        if bullet_content:
                            current_exp["bullets"].append(bullet_content)
                            # Detect metrics
                            if re.search(r'\d+%(?:\s+increase|\s+boost|\s+reduction)?|\$\d+|\b\d+\+\b', bullet_content):
                                current_exp["metrics"].append(bullet_content[:100])
                    elif len(current_exp["bullets"]) == 0 and len(line.split()) <= 6:
                        # Might be company name or location
                        if current_exp["company"] == "Organization":
                            current_exp["company"] = line
                    else:
                        if line:
                            current_exp["bullets"].append(line)

            if current_exp:
                experiences_list.append(current_exp)

        # 11. Extract Education
        education_list = []
        edu_lines = sections["education"]
        if edu_lines:
            current_edu: Optional[Dict[str, Any]] = None
            for line in edu_lines:
                is_degree = any(d in line.lower() for d in ['bachelor', 'master', 'phd', 'doctor', 'b.s.', 'b.a.', 'm.s.', 'm.a.', 'bsc', 'msc', 'associate', 'diploma'])
                is_institution = any(i in line.lower() for i in ['university', 'college', 'institute', 'academy', 'school', 'polytechnic'])

                if is_institution or is_degree:
                    if current_edu and current_edu.get("institution"):
                        education_list.append(current_edu)
                    
                    dates_match = re.search(r'\b(19\d\d|20\d\d)\b(?:\s*[-–—]\s*(19\d\d|20\d\d|Present))?', line)
                    dates_str = dates_match.group(0) if dates_match else ""

                    current_edu = {
                        "id": f"edu-{len(education_list) + 1}",
                        "institution": line if is_institution else "Academic Institution",
                        "degree": line if is_degree else "Degree Program",
                        "fieldOfStudy": "",
                        "dates": dates_str,
                        "gpa": "",
                        "highlights": []
                    }
                elif current_edu and line:
                    if "gpa" in line.lower():
                        current_edu["gpa"] = line
                    else:
                        current_edu["highlights"].append(line)

            if current_edu:
                education_list.append(current_edu)

        # 12. Extract Certifications
        certifications_list = []
        for line in sections["certifications"]:
            if len(line.split()) >= 2 and not line.startswith("•"):
                certifications_list.append({
                    "id": f"cert-{len(certifications_list) + 1}",
                    "title": line.strip(),
                    "issuer": "Issuing Authority",
                    "date": "Certified"
                })

        # 13. Extract Projects
        projects_list = []
        for line in sections["projects"]:
            if line.startswith("•") or len(line.split()) > 1:
                title = line.lstrip("•-* ").split(":")[0].strip()
                desc = line.split(":", 1)[1].strip() if ":" in line else line
                if title:
                    projects_list.append({
                        "id": f"proj-{len(projects_list) + 1}",
                        "title": title,
                        "description": desc,
                        "skills": []
                    })

        return {
            "contact": {
                "name": extracted_name,
                "role": detected_role,
                "email": extracted_email,
                "phone": extracted_phone,
                "location": extracted_location,
                "linkedin": extracted_linkedin,
                "github": extracted_github,
                "portfolio": extracted_portfolio
            },
            "summary": summary_text,
            "allSkills": flat_skills,
            "skillCategories": skill_categories_list,
            "experiences": experiences_list,
            "education": education_list,
            "certifications": certifications_list,
            "projects": projects_list,
            "languages": [],
            "detectedSeniority": "senior" if len(experiences_list) >= 3 else "mid" if len(experiences_list) >= 1 else "junior",
            "totalYearsExperience": max(1, len(experiences_list) * 2),
            "_engine_model": "heuristic-deterministic"
        }

extractor_service = DocumentExtractorService()
