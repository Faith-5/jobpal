from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ParsedContactInfo(BaseModel):
    name: str = Field(default="", description="Full legal or professional name")
    role: str = Field(default="", description="Target or current professional title/headline")
    email: str = Field(default="", description="Extracted email address")
    phone: str = Field(default="", description="Extracted contact phone number")
    city: Optional[str] = Field(default="", description="City of residence")
    state: Optional[str] = Field(default="", description="State or province")
    country: Optional[str] = Field(default="", description="Country")
    location: Optional[str] = Field(default="", description="Combined location string")
    linkedin: Optional[str] = Field(default="", description="LinkedIn profile URL or handle")
    github: Optional[str] = Field(default="", description="GitHub profile URL or handle")
    portfolio: Optional[str] = Field(default="", description="Personal website or portfolio link")

class ParsedExperience(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for experience item")
    company: str = Field(default="", description="Organization or company name")
    role: str = Field(default="", description="Job title or role held")
    location: Optional[str] = Field(default="", description="Job location or Remote")
    dates: str = Field(default="", description="Formatted date range (e.g. 2022 - Present or Jan 2020 - Dec 2022)")
    isCurrent: bool = Field(default=False, description="Whether the user is currently working here")
    bullets: List[str] = Field(default_factory=list, description="Extracted bullet points of responsibilities and achievements")
    metrics: List[str] = Field(default_factory=list, description="Specific quantifiable achievements, numbers, KPIs or percentage improvements detected")
    technologies: List[str] = Field(default_factory=list, description="Tools, technologies, and skills utilized in this role")

class ParsedEducation(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for education item")
    institution: str = Field(default="", description="College, university, or academy name")
    degree: str = Field(default="", description="Degree type (e.g. B.S., M.S., Bachelor of Arts)")
    fieldOfStudy: Optional[str] = Field(default="", description="Major or area of study (e.g. Computer Science)")
    dates: str = Field(default="", description="Attendance date range or graduation year")
    gpa: Optional[str] = Field(default="", description="GPA or grade if listed")
    highlights: List[str] = Field(default_factory=list, description="Honors, relevant coursework, or achievements")

class ParsedSkillCategory(BaseModel):
    category: str = Field(..., description="Category name (e.g. 'Core Technical', 'Frameworks & Libraries', 'Cloud & DevOps', 'Tools & Platforms', 'Leadership & Soft Skills')")
    skills: List[str] = Field(default_factory=list, description="List of specific skills in this category")

class ParsedCertification(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for certification")
    title: str = Field(default="", description="Certification name or title")
    issuer: str = Field(default="", description="Issuing organization (e.g. AWS, Google, Scrum Alliance)")
    date: str = Field(default="", description="Issue date or year")
    credentialId: Optional[str] = Field(default="", description="License/Credential ID if available")
    credentialUrl: Optional[str] = Field(default="", description="Verification URL if available")

class ParsedProject(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for project")
    title: str = Field(default="", description="Project title or system name")
    description: str = Field(default="", description="Concise summary of what was built and its purpose")
    role: Optional[str] = Field(default="", description="User's role in the project")
    link: Optional[str] = Field(default="", description="Live URL or repository link")
    skills: List[str] = Field(default_factory=list, description="Technologies and methods used")

class ParsedLanguage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for language")
    language: str = Field(default="", description="Language name")
    proficiency: str = Field(default="Fluent", description="Proficiency level (Native, Fluent, Conversational, Basic)")

class ParsedCareerProfile(BaseModel):
    contact: ParsedContactInfo = Field(default_factory=ParsedContactInfo)
    summary: str = Field(default="", description="Executive career summary or professional objective")
    allSkills: List[str] = Field(default_factory=list, description="Flat list of all detected skills for rapid tagging")
    skillCategories: List[ParsedSkillCategory] = Field(default_factory=list, description="Categorized skill taxonomy")
    experiences: List[ParsedExperience] = Field(default_factory=list, description="Chronological work experiences")
    education: List[ParsedEducation] = Field(default_factory=list, description="Academic education history")
    certifications: List[ParsedCertification] = Field(default_factory=list, description="Certifications and licenses")
    projects: List[ParsedProject] = Field(default_factory=list, description="Featured projects or case studies")
    languages: List[ParsedLanguage] = Field(default_factory=list, description="Spoken/written languages")
    detectedSeniority: str = Field(default="mid", description="Inferred experience level: 'junior' | 'mid' | 'senior'")
    totalYearsExperience: Optional[int] = Field(default=0, description="Estimated total years of professional experience")

class ResumeParseResponse(BaseModel):
    success: bool = True
    filename: str
    file_type: str
    character_count: int
    raw_text_preview: str
    profile: ParsedCareerProfile
    metadata: Dict[str, Any] = Field(default_factory=dict)
