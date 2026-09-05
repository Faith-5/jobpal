import json
import logging
from typing import Dict, Any, List
from groq import Groq
from app.core.config import settings

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.client = None
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")

    def analyze_resume(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Analyze a resume against a job description using Groq LLM.
        Returns a structured ATS analysis output.
        """
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
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            response_text = chat_completion.choices[0].message.content
            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Groq API resume analysis error: {e}. Falling back to mock data.")
            return self._get_mock_ats_analysis(job_description)

    def generate_cover_letter(self, user_profile: Dict[str, Any], company_name: str, job_title: str, job_description: str) -> Dict[str, Any]:
        """
        Generate a professional tailored cover letter based on user's profile and target job description.
        """
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
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            response_text = chat_completion.choices[0].message.content
            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Groq API cover letter generation error: {e}. Falling back to mock letter.")
            return self._get_mock_cover_letter(user_profile, company_name, job_title)

    def _get_mock_ats_analysis(self, job_description: str) -> Dict[str, Any]:
        # Generate clean response tailored to the target role
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
        
        name = user_profile.get("name", "Sarah Jenkins")
        role = user_profile.get("role", "Senior Product Designer")
        email = user_profile.get("email", "sarah.jenkins@example.com")
        phone = user_profile.get("phone", "+1 (555) 019-2834")
        loc = f"{user_profile.get('state', 'CA')}, {user_profile.get('country', 'USA')}"

        return {
            "applicantName": name,
            "applicantTitle": role,
            "email": email,
            "phone": phone,
            "location": loc,
            "linkedin": "linkedin.com/in/profilesample",
            "date": today,
            "hiringManager": "Hiring Manager",
            "companyName": company_name,
            "companyAddress": "123 Technology Way",
            "cityStateZip": "Innovation District",
            "paragraphs": [
                f"I am writing to express my enthusiastic interest in the {job_title} position at {company_name}. With my strong foundation in {', '.join(user_profile.get('skills', ['UI/UX design', 'Figma'])[:3])} and my experience in driving user-centered product design, I am highly confident in my ability to make a major impact on your team.",
                f"In my previous roles, I have consistently focused on creating high-quality, polished designs that connect user needs with core business outcomes. My experience aligns closely with the goals of {company_name}, particularly in terms of building scalable user-facing features and maintaining design system integrity.",
                "Thank you for your time and consideration. I welcome the opportunity to discuss further how my unique skills and passion can contribute to your goals."
            ],
            "signatureName": name
        }

groq_service = GroqService()
