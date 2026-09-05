import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeOut, SuggestionItem
from app.services.pdf_service import pdf_service
from app.services.groq_service import groq_service

router = APIRouter()

@router.post("/upload", response_model=ResumeOut)
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Senior Product Designer"),
    job_description: str = Form(""),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Upload a resume PDF, extract its text, run ATS analysis against a job description,
    and save the resume data linked to the current user.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    try:
        contents = await file.read()
        
        # 1. Extract text from PDF
        extracted_text = pdf_service.extract_text_from_pdf(contents)
        
        # 2. Analyze using Groq service (with mock fallback if no API key is set)
        analysis = groq_service.analyze_resume(extracted_text, job_description)
        
        # 3. Save Resume & Analysis to DB
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
    cv_data: dict,  # Receives arbitrary structured CV JSON representing skills, exp, edu
    current_user: User = Depends(deps.get_current_user)
):
    """
    Generate a professional ReportLab PDF from custom CV details and return it as a download stream.
    """
    try:
        # Prepopulate with user details if not provided in JSON
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

        # Generate PDF Bytes
        pdf_bytes = pdf_service.generate_cv_pdf(cv_data)
        
        # Return as streaming attachment
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
