import io
import time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeOut
from app.schemas.career_profile import ResumeParseResponse, ParsedCareerProfile
from app.services.pdf_service import pdf_service
from app.services.extractor_service import extractor_service
from app.services.groq_service import groq_service

router = APIRouter()

@router.post("/parse-and-extract", response_model=ResumeParseResponse)
async def parse_and_extract_career_profile(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    filename: Optional[str] = Form(None)
):
    """
    Step 1 Engine Endpoint: Multi-Modal Ingestion & AI Career Profile Extraction.
    Accepts a PDF, DOCX, or TXT file (or direct pasted text) and runs Groq LLaMA 3.3 70B
    to return a rich, normalized JSON career profile ready for application state integration.
    """
    start_time = time.time()
    
    extracted_text = ""
    detected_type = "text"
    resolved_filename = filename or "pasted_resume.txt"

    try:
        if file and file.filename:
            resolved_filename = file.filename
            contents = await file.read()
            if not contents:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded file is empty."
                )
            extracted_text, detected_type = extractor_service.extract_document(resolved_filename, contents)
        elif raw_text and raw_text.strip():
            extracted_text = extractor_service.clean_and_normalize_text(raw_text)
            detected_type = "raw_text"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please upload a resume file (PDF, DOCX, TXT) or provide raw resume text."
            )

        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract legible text from the provided document. Please check the file format."
            )

        # Execute Groq LLaMA 70B parsing
        parsed_dict = groq_service.parse_resume_to_career_profile(extracted_text, resolved_filename)
        
        # Validate into Pydantic schema
        profile = ParsedCareerProfile(**parsed_dict)
        
        elapsed_ms = int((time.time() - start_time) * 1000)

        return ResumeParseResponse(
            success=True,
            filename=resolved_filename,
            file_type=detected_type,
            character_count=len(extracted_text),
            raw_text_preview=extracted_text[:400] + ("..." if len(extracted_text) > 400 else ""),
            profile=profile,
            metadata={
                "model": parsed_dict.get("_engine_model", "groq-llama-70b"),
                "latency_ms": elapsed_ms,
                "experiences_count": len(profile.experiences),
                "skills_count": len(profile.allSkills),
                "education_count": len(profile.education),
                "groq_active": bool(groq_service.client is not None)
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        elapsed_ms = int((time.time() - start_time) * 1000)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Career extraction engine failure: {str(e)}"
        )

@router.post("/upload", response_model=ResumeOut)
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Senior Product Designer"),
    job_description: str = Form(""),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Upload a resume file, extract its text, run ATS analysis against a target job description,
    and save the resume data linked to the current user.
    """
    try:
        contents = await file.read()
        extracted_text, _ = extractor_service.extract_document(file.filename, contents)
        
        # Analyze using Groq service
        analysis = groq_service.analyze_resume(extracted_text, job_description)
        
        # Save Resume & Analysis to DB
        resume = Resume(
            user_id=current_user.id,
            title=file.filename,
            raw_text=extracted_text,
            overallScore=analysis.get("overallScore", 70),
            scoreStatus=analysis.get("scoreStatus", "Needs Work"),
            summary=analysis.get("summary", ""),
            keywordsScore=analysis.get("keywordsScore", 70),
            keywordsSummary=analysis.get("keywordsSummary", ""),
            formattingScore=analysis.get("formattingScore", 70),
            formattingSummary=analysis.get("formattingSummary", ""),
            impactScore=analysis.get("impactScore", 70),
            impactSummary=analysis.get("impactSummary", ""),
            targetRole=target_role,
            suggestions=analysis.get("suggestions", [])
        )
        
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return resume

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process and analyze resume: {str(e)}"
        )

@router.get("/", response_model=List[ResumeOut])
def get_my_resumes(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve all uploaded resumes and analysis history for the current user.
    """
    return db.query(Resume).filter(Resume.user_id == current_user.id).all()

@router.post("/generate-pdf")
def download_custom_cv_pdf(
    cv_data: dict,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Generate a professional ReportLab PDF from custom CV details and return it as a download stream.
    """
    try:
        if "name" not in cv_data:
            cv_data["name"] = current_user.name
        if "email" not in cv_data:
            cv_data["email"] = current_user.email
        if "phone" not in cv_data:
            cv_data["phone"] = current_user.phone
        if "state" not in cv_data:
            cv_data["state"] = current_user.state
        if "country" not in cv_data:
            cv_data["country"] = current_user.country
        if "role" not in cv_data:
            cv_data["role"] = current_user.role

        pdf_bytes = pdf_service.generate_cv_pdf(cv_data)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cv_optimized.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate CV PDF: {str(e)}"
        )
