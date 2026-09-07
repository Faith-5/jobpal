import json
import logging
import uuid
import re
from typing import Dict, Any, List, Optional, Tuple
from groq import Groq
from app.core.config import settings

logger = logging.getLogger(__name__)

# Preferred model ladder for Groq inference (active high-parameter LLMs)
MODEL_PREFERENCES = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "groq/compound",
    "qwen/qwen3.6-27b"
]

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.client = None
        self.active_model = "llama-3.3-70b-versatile"
        self._init_client()

    def _init_client(self):
        self.api_key = settings.GROQ_API_KEY
        if self.api_key and self.api_key.strip():
            try:
                self.client = Groq(api_key=self.api_key.strip())
                logger.info("Groq client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                self.client = None
        else:
            self.client = None

    def _create_completion(self, messages: List[Dict[str, str]], temperature: float = 0.2) -> Tuple[str, str]:
        """
        Executes chat completion on Groq with automatic model failover.
        Returns (response_text, model_used).
        """
        if not self.client:
            raise ValueError("Groq client not initialized")

        last_error = None
        for model in MODEL_PREFERENCES:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=messages,
                    model=model,
                    temperature=temperature,
                    response_format={"type": "json_object"}
                )
                self.active_model = model
                return chat_completion.choices[0].message.content, model
            except Exception as e:
                last_error = e
                logger.warning(f"Groq model {model} failed: {e}. Trying next preferred model...")

        raise RuntimeError(f"All Groq models failed. Last error: {last_error}")

    def parse_resume_to_career_profile(self, resume_text: str, filename: str = "Uploaded Resume") -> Dict[str, Any]:
        """
        Step 1: Multi-Modal Intelligent Resume Ingestion & Parsing Engine.
        Uses Groq LLMs (LLaMA 70B / GPT-OSS 120B) to parse arbitrary resume formats into
        a rich normalized Career Profile JSON schema.
        """
        self._init_client()

        if not self.client:
            logger.warning("Groq API key not set or invalid. Returning intelligent parsed mock schema.")
            return self._get_fallback_parsed_profile(resume_text, filename)

        system_prompt = (
            "You are an elite, world-class Career Data Ontologist, Technical Recruiter, and Resume Parser. "
            "Your mission is to rigorously analyze raw resume text extracted from any resume format "
            "(chronological, functional, two-column, markdown, academic CV) and convert it into a structured, "
            "rich, standardized Career Profile JSON object.\n\n"
            "PARSING INSTRUCTIONS:\n"
            "1. CONTACT INFO: Extract the applicant's full name, headline/role title, primary email, phone number, "
            "location (city, state, country), and profile links (LinkedIn, GitHub, Portfolio website).\n"
            "2. SUMMARY: Extract or synthesize a compelling 2-4 sentence executive summary highlighting key background and domain expertise.\n"
            "3. SKILLS TAXONOMY: Identify all technical, domain, and soft skills. Group them into intuitive categories "
            "(e.g. 'Core Technical & Languages', 'Frameworks & Libraries', 'Cloud, Databases & DevOps', 'Tools & Platforms', 'Leadership & Methodologies'). "
            "Also output a flat list in 'allSkills'.\n"
            "4. WORK EXPERIENCES: Extract all professional roles in reverse-chronological order. "
            "For each role, extract company, role title, location, dates (e.g., 'Jan 2022 - Present'), whether it's current (isCurrent: boolean), "
            "the list of bullet points (clean action-driven statements), quantifiable metrics/KPIs detected (e.g. 'increased conversion by 25%'), "
            "and technologies used in that role.\n"
            "5. EDUCATION: Extract institutions, degree title, field of study, dates, GPA (if stated), and highlights/honors.\n"
            "6. CERTIFICATIONS: Extract any licenses or certificates (e.g. AWS Certified, PMP, Scrum Master) with issuer and dates.\n"
            "7. PROJECTS: Extract notable projects, system builds, or portfolio highlights with descriptions, links, and technologies.\n"
            "8. LANGUAGES: Extract spoken/written languages and proficiency levels.\n"
            "9. SENIORITY & YEARS: Infer overall seniority level ('junior' | 'mid' | 'senior' | 'lead') and estimated total professional years.\n\n"
            "JSON SCHEMA REQUIREMENT:\n"
            "You MUST respond ONLY with a single valid JSON object strictly matching this schema:\n"
            "{\n"
            "  \"contact\": {\n"
            "    \"name\": \"string\",\n"
            "    \"role\": \"string\",\n"
            "    \"email\": \"string\",\n"
            "    \"phone\": \"string\",\n"
            "    \"city\": \"string\",\n"
            "    \"state\": \"string\",\n"
            "    \"country\": \"string\",\n"
            "    \"location\": \"string\",\n"
            "    \"linkedin\": \"string\",\n"
            "    \"github\": \"string\",\n"
            "    \"portfolio\": \"string\"\n"
            "  },\n"
            "  \"summary\": \"string\",\n"
            "  \"allSkills\": [\"string\"],\n"
            "  \"skillCategories\": [\n"
            "    {\n"
            "      \"category\": \"string\",\n"
            "      \"skills\": [\"string\"]\n"
            "    }\n"
            "  ],\n"
            "  \"experiences\": [\n"
            "    {\n"
            "      \"id\": \"string (e.g. exp-1)\",\n"
            "      \"company\": \"string\",\n"
            "      \"role\": \"string\",\n"
            "      \"location\": \"string\",\n"
            "      \"dates\": \"string\",\n"
            "      \"isCurrent\": false,\n"
            "      \"bullets\": [\"string\"],\n"
            "      \"metrics\": [\"string\"],\n"
            "      \"technologies\": [\"string\"]\n"
            "    }\n"
            "  ],\n"
            "  \"education\": [\n"
            "    {\n"
            "      \"id\": \"string (e.g. edu-1)\",\n"
            "      \"institution\": \"string\",\n"
            "      \"degree\": \"string\",\n"
            "      \"fieldOfStudy\": \"string\",\n"
            "      \"dates\": \"string\",\n"
            "      \"gpa\": \"string\",\n"
            "      \"highlights\": [\"string\"]\n"
            "    }\n"
            "  ],\n"
            "  \"certifications\": [\n"
            "    {\n"
            "      \"id\": \"string (e.g. cert-1)\",\n"
            "      \"title\": \"string\",\n"
            "      \"issuer\": \"string\",\n"
            "      \"date\": \"string\",\n"
            "      \"credentialId\": \"string\",\n"
            "      \"credentialUrl\": \"string\"\n"
            "    }\n"
            "  ],\n"
            "  \"projects\": [\n"
            "    {\n"
            "      \"id\": \"string (e.g. proj-1)\",\n"
            "      \"title\": \"string\",\n"
            "      \"description\": \"string\",\n"
            "      \"role\": \"string\",\n"
            "      \"link\": \"string\",\n"
            "      \"skills\": [\"string\"]\n"
            "    }\n"
            "  ],\n"
            "  \"languages\": [\n"
            "    {\n"
            "      \"id\": \"string (e.g. lang-1)\",\n"
            "      \"language\": \"string\",\n"
            "      \"proficiency\": \"Native or Bilingual\" | \"Fluent\" | \"Conversational\" | \"Basic\"\n"
            "    }\n"
            "  ],\n"
            "  \"detectedSeniority\": \"junior\" | \"mid\" | \"senior\",\n"
            "  \"totalYearsExperience\": int\n"
            "}\n"
            "Do not output markdown codeblocks (no ```json). Output raw valid JSON ONLY."
        )

        user_content = f"SOURCE DOCUMENT FILENAME: {filename}\n\nRAW RESUME EXTRACTED CONTENT:\n{resume_text}"

        try:
            response_content, used_model = self._create_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.15
            )
            parsed_data = self._clean_and_parse_json(response_content)
            result = self._normalize_parsed_profile(parsed_data, filename)
            result["_engine_model"] = used_model
            return result

        except Exception as e:
            logger.error(f"Groq API resume parsing error: {e}. Generating fallback structured profile.")
            return self._get_fallback_parsed_profile(resume_text, filename)

    def _clean_and_parse_json(self, raw_str: str) -> Dict[str, Any]:
        """Sanitizes and safely loads JSON from LLM output."""
        cleaned = raw_str.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}', cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise

    def _normalize_parsed_profile(self, data: Dict[str, Any], filename: str) -> Dict[str, Any]:
        """Ensures all required fields and unique IDs are populated."""
        contact = data.get("contact", {})
        if not contact.get("name") or contact.get("name") == "string":
            contact["name"] = filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()

        # Clean city / state / location
        city = contact.get("city", "")
        state = contact.get("state", "")
        country = contact.get("country", "")
        if not contact.get("location"):
            parts = [p for p in [city, state, country] if p and p != "string"]
            contact["location"] = ", ".join(parts) if parts else "Location not specified"

        # Ensure ID keys exist on arrays
        for idx, exp in enumerate(data.get("experiences", [])):
            if not exp.get("id"):
                exp["id"] = f"exp-{idx + 1}"
            if not isinstance(exp.get("bullets"), list):
                exp["bullets"] = [str(exp.get("bullets", ""))] if exp.get("bullets") else []
            if not isinstance(exp.get("metrics"), list):
                exp["metrics"] = []
            if not isinstance(exp.get("technologies"), list):
                exp["technologies"] = []

        for idx, edu in enumerate(data.get("education", [])):
            if not edu.get("id"):
                edu["id"] = f"edu-{idx + 1}"
            if not isinstance(edu.get("highlights"), list):
                edu["highlights"] = []

        for idx, cert in enumerate(data.get("certifications", [])):
            if not cert.get("id"):
                cert["id"] = f"cert-{idx + 1}"

        for idx, proj in enumerate(data.get("projects", [])):
            if not proj.get("id"):
                proj["id"] = f"proj-{idx + 1}"
            if not isinstance(proj.get("skills"), list):
                proj["skills"] = []

        for idx, lang in enumerate(data.get("languages", [])):
            if not lang.get("id"):
                lang["id"] = f"lang-{idx + 1}"

        # Flatten skills if allSkills is missing
        if not data.get("allSkills"):
            flat = []
            for cat in data.get("skillCategories", []):
                flat.extend(cat.get("skills", []))
            data["allSkills"] = list(dict.fromkeys(flat))

        return data

    def _get_fallback_parsed_profile(self, resume_text: str, filename: str) -> Dict[str, Any]:
        """Intelligent fallback structured profile if API key is not yet set or fails."""
        detected_role = "Senior Full-Stack Engineer"
        lower_text = (resume_text + " " + filename).lower()
        if "design" in lower_text or "figma" in lower_text or "ui/ux" in lower_text:
            detected_role = "Senior Product Designer"
        elif "product manager" in lower_text or "pm" in lower_text:
            detected_role = "Product Manager"
        elif "operations" in lower_text or "logistics" in lower_text:
            detected_role = "Operations Director"
        elif "marketing" in lower_text or "growth" in lower_text:
            detected_role = "Growth Marketing Lead"

        name_candidate = "Alex Morgan"
        lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
        if lines and len(lines[0].split()) <= 4 and not any(k in lines[0].lower() for k in ['resume', 'curriculum', 'cv', 'page']):
            name_candidate = lines[0].title()

        return {
            "contact": {
                "name": name_candidate,
                "role": detected_role,
                "email": "alex.morgan@example.com",
                "phone": "+1 (555) 234-5678",
                "city": "San Francisco",
                "state": "CA",
                "country": "United States",
                "location": "San Francisco, CA, USA",
                "linkedin": "linkedin.com/in/alexmorgan",
                "github": "github.com/alexmorgan",
                "portfolio": "alexmorgan.dev"
            },
            "summary": f"High-performing {detected_role} with extensive experience leading cross-functional initiatives, scaling resilient architectures, and driving user-centric outcomes in high-velocity teams.",
            "allSkills": [
                "TypeScript", "React", "Node.js", "Python", "FastAPI",
                "PostgreSQL", "Docker", "AWS", "System Architecture", "Agile Leadership"
            ],
            "skillCategories": [
                {
                    "category": "Core Engineering & Languages",
                    "skills": ["TypeScript", "Python", "JavaScript", "SQL", "Go"]
                },
                {
                    "category": "Frameworks & Libraries",
                    "skills": ["React 19", "Next.js", "FastAPI", "TailwindCSS", "Node.js"]
                },
                {
                    "category": "Cloud & Infrastructure",
                    "skills": ["AWS", "Docker", "PostgreSQL", "Redis", "CI/CD Pipelines"]
                },
                {
                    "category": "Leadership & Workflow",
                    "skills": ["System Design", "Agile Methodologies", "Code Review", "Cross-Functional Collaboration"]
                }
            ],
            "experiences": [
                {
                    "id": "exp-1",
                    "company": "Nexus Technologies",
                    "role": f"Lead {detected_role}",
                    "location": "San Francisco, CA (Hybrid)",
                    "dates": "2022 - Present",
                    "isCurrent": True,
                    "bullets": [
                        "Architected and deployed high-throughput microservices handling 12M+ monthly requests with 99.98% uptime.",
                        "Spearheaded redesign of core web application, reducing page load latency by 42% and increasing user retention by 18%.",
                        "Mentored a team of 6 engineers and standardized automated CI/CD deployment pipelines."
                    ],
                    "metrics": ["12M+ monthly requests", "99.98% uptime", "42% latency reduction", "18% retention boost"],
                    "technologies": ["React", "FastAPI", "PostgreSQL", "Docker", "AWS"]
                },
                {
                    "id": "exp-2",
                    "company": "Vanguard Digital Lab",
                    "role": detected_role,
                    "location": "New York, NY (Remote)",
                    "dates": "2019 - 2022",
                    "isCurrent": False,
                    "bullets": [
                        "Engineered full-stack features from conception to production, collaborating directly with design and product leads.",
                        "Optimized database query performance, decreasing P95 API response times from 340ms to 65ms."
                    ],
                    "metrics": ["P95 response time cut from 340ms to 65ms"],
                    "technologies": ["TypeScript", "Node.js", "GraphQL", "Redis"]
                }
            ],
            "education": [
                {
                    "id": "edu-1",
                    "institution": "University of California, Berkeley",
                    "degree": "Bachelor of Science",
                    "fieldOfStudy": "Computer Science",
                    "dates": "2015 - 2019",
                    "gpa": "3.85 / 4.0",
                    "highlights": ["Dean's Honors List", "President of Software Engineering Club"]
                }
            ],
            "certifications": [
                {
                    "id": "cert-1",
                    "title": "AWS Certified Solutions Architect – Associate",
                    "issuer": "Amazon Web Services",
                    "date": "2023",
                    "credentialId": "AWS-PSA-98214",
                    "credentialUrl": "https://aws.amazon.com/verification"
                }
            ],
            "projects": [
                {
                    "id": "proj-1",
                    "title": "AI Workflow Automation Engine",
                    "description": "High-speed document intelligence platform parsing unstructured data with streaming LLM inference.",
                    "role": "Lead Architect",
                    "link": "https://github.com/example/ai-workflow",
                    "skills": ["FastAPI", "React", "Groq LLaMA", "Docker"]
                }
            ],
            "languages": [
                {
                    "id": "lang-1",
                    "language": "English",
                    "proficiency": "Native or Bilingual"
                }
            ],
            "detectedSeniority": "senior",
            "totalYearsExperience": 6,
            "_engine_model": "offline-fallback"
        }

    def analyze_resume(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Analyze a resume against a job description using Groq LLM.
        Returns a structured ATS analysis output.
        """
        self._init_client()
        if not self.client:
            logger.warning("Groq API key not set. Returning mock ATS analysis.")
            return self._get_mock_ats_analysis(job_description)

        system_prompt = (
            "You are an expert ATS (Applicant Tracking System) parser and career coach. "
            "Your task is to analyze the user's resume text against the provided job description and return a detailed, professional evaluation in structured JSON format. "
            "The JSON must strictly conform to this schema: \n"
            "{\n"
            "  \"overallScore\": int (0-100),\n"
            "  \"scoreStatus\": \"Excellent\" | \"Good\" | \"Needs Work\",\n"
            "  \"summary\": \"string summary evaluation\",\n"
            "  \"keywordsScore\": int (0-100),\n"
            "  \"keywordsSummary\": \"string evaluation of keywords matching\",\n"
            "  \"formattingScore\": int (0-100),\n"
            "  \"formattingSummary\": \"string evaluation of layout structure\",\n"
            "  \"impactScore\": int (0-100),\n"
            "  \"impactSummary\": \"string evaluation of accomplishments/metrics quantification\",\n"
            "  \"targetRole\": \"string title of the target job\",\n"
            "  \"suggestions\": [\n"
            "    {\n"
            "      \"id\": \"string unique identifier\",\n"
            "      \"type\": \"warning\" | \"lightbulb\" | \"check\",\n"
            "      \"title\": \"string action title\",\n"
            "      \"description\": \"string detailed advice\",\n"
            "      \"actionText\": \"string button action name\",\n"
            "      \"applied\": false,\n"
            "      \"category\": \"impact\" | \"keyword\" | \"format\"\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Respond ONLY with valid, raw JSON. Do not include markdown codeblocks or any additional text."
        )

        user_content = (
            f"RESUME TEXT:\n{resume_text}\n\n"
            f"JOB DESCRIPTION:\n{job_description}"
        )

        try:
            response_text, _ = self._create_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.2
            )
            return self._clean_and_parse_json(response_text)
        except Exception as e:
            logger.error(f"Groq API resume analysis error: {e}. Falling back to mock data.")
            return self._get_mock_ats_analysis(job_description)

    def generate_cover_letter(self, user_profile: Dict[str, Any], company_name: str, job_title: str, job_description: str) -> Dict[str, Any]:
        """
        Generate a professional tailored cover letter based on user's profile and target job description.
        """
        self._init_client()
        if not self.client:
            logger.warning("Groq API key not set. Returning mock cover letter.")
            return self._get_mock_cover_letter(user_profile, company_name, job_title)

        system_prompt = (
            "You are an elite career counselor and professional resume writer. "
            "Write a highly tailored, persuasive, and modern cover letter. "
            "Respond ONLY with a structured JSON object conforming to this schema:\n"
            "{\n"
            "  \"applicantName\": \"string\",\n"
            "  \"applicantTitle\": \"string\",\n"
            "  \"email\": \"string\",\n"
            "  \"phone\": \"string\",\n"
            "  \"location\": \"string\",\n"
            "  \"linkedin\": \"string\",\n"
            "  \"date\": \"string\",\n"
            "  \"hiringManager\": \"string\",\n"
            "  \"companyName\": \"string\",\n"
            "  \"companyAddress\": \"string\",\n"
            "  \"cityStateZip\": \"string\",\n"
            "  \"paragraphs\": [\"string list containing each paragraph body\"],\n"
            "  \"signatureName\": \"string\"\n"
            "}\n"
            "Respond ONLY with valid, raw JSON. Do not include markdown codeblocks or any additional text."
        )

        user_content = (
            f"USER CAREER PROFILE:\n{json.dumps(user_profile, indent=2)}\n\n"
            f"TARGET COMPANY: {company_name}\n"
            f"TARGET JOB TITLE: {job_title}\n"
            f"JOB DESCRIPTION:\n{job_description}"
        )

        try:
            response_text, _ = self._create_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.7
            )
            return self._clean_and_parse_json(response_text)
        except Exception as e:
            logger.error(f"Groq API cover letter generation error: {e}. Falling back to mock letter.")
            return self._get_mock_cover_letter(user_profile, company_name, job_title)

    def _get_mock_ats_analysis(self, job_description: str) -> Dict[str, Any]:
        target_role = "Senior Product Designer"
        if "engineer" in job_description.lower() or "developer" in job_description.lower():
            target_role = "Senior Software Engineer"
        elif "manager" in job_description.lower():
            target_role = "Product Manager"

        return {
            "overallScore": 82,
            "scoreStatus": "Good",
            "summary": f"Your profile holds a solid baseline alignment with the {target_role} description. Adding quantitative metrics and reinforcing core technical skills will optimize parsing viability.",
            "keywordsScore": 88,
            "keywordsSummary": "Primary skill keywords are matched. Secondary toolchains/frameworks are missing.",
            "formattingScore": 90,
            "formattingSummary": "Clean section markers detected. Simple table-free structures ensure flawless parsing.",
            "impactScore": 68,
            "impactSummary": "Several job achievements are descriptive. Quantifying them with clear percentage improvements will boost the score.",
            "targetRole": target_role,
            "suggestions": [
                {
                    "id": "sug-groq-1",
                    "type": "warning",
                    "title": "Add Quantitative Metrics",
                    "description": "Specify concrete KPIs. For example: 'increased user conversion by 18%' or 'reduced page loading time by 30%'.",
                    "actionText": "Quantify Achievements",
                    "applied": False,
                    "category": "impact"
                },
                {
                    "id": "sug-groq-2",
                    "type": "lightbulb",
                    "title": "Incorporate Target Skill Keywords",
                    "description": "The job description emphasizes prototyping tools. Make sure to specify advanced design systems experience in your core list.",
                    "actionText": "Update Skills List",
                    "applied": False,
                    "category": "keyword"
                }
            ]
        }

    def _get_mock_cover_letter(self, user_profile: Dict[str, Any], company_name: str, job_title: str) -> Dict[str, Any]:
        import datetime
        today = datetime.date.today().strftime("%B %d, %Y")
        
        name = user_profile.get("name", "Alex Morgan")
        role = user_profile.get("role", "Senior Software Engineer")
        email = user_profile.get("email", "alex.morgan@example.com")
        phone = user_profile.get("phone", "+1 (555) 234-5678")
        loc = f"{user_profile.get('state', 'CA')}, {user_profile.get('country', 'USA')}"

        return {
            "applicantName": name,
            "applicantTitle": role,
            "email": email,
            "phone": phone,
            "location": loc,
            "linkedin": "linkedin.com/in/alexmorgan",
            "date": today,
            "hiringManager": "Hiring Manager",
            "companyName": company_name,
            "companyAddress": "123 Innovation Way",
            "cityStateZip": "San Francisco, CA 94105",
            "paragraphs": [
                f"I am writing to express my enthusiastic interest in the {job_title} position at {company_name}. With my extensive technical background and passion for scalable product development, I am confident in my ability to deliver substantial value to your engineering team.",
                f"Throughout my career, I have consistently focused on building resilient, user-centered architectures that bridge customer needs with core business outcomes. My experience aligns seamlessly with {company_name}'s technical roadmap and ambitious goals.",
                "Thank you for your time and consideration. I look forward to the opportunity to discuss how my skill set can accelerate your team's objectives."
            ],
            "signatureName": name
        }

groq_service = GroqService()
