from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.application import JobApplication
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut

router = APIRouter()

@router.get("/", response_model=List[ApplicationOut])
def get_applications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get all job applications tracked by the current user.
    """
    return db.query(JobApplication).filter(JobApplication.user_id == current_user.id).all()

@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create a new job application tracker card.
    """
    db_app = JobApplication(
        user_id=current_user.id,
        company=app_in.company,
        role=app_in.role,
        logoText=app_in.logoText,
        status=app_in.status,
        appliedDate=app_in.appliedDate,
        atsScore=app_in.atsScore,
        location=app_in.location,
        salary=app_in.salary,
        notes=app_in.notes
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: int,
    app_in: ApplicationUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update details of a tracked job application card.
    """
    db_app = db.query(JobApplication).filter(
        JobApplication.id == app_id, 
        JobApplication.user_id == current_user.id
    ).first()
    
    if not db_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Application tracker not found."
        )
        
    update_data = app_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_app, field, value)
        
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete a tracked job application card.
    """
    db_app = db.query(JobApplication).filter(
        JobApplication.id == app_id, 
        JobApplication.user_id == current_user.id
    ).first()
    
    if not db_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Application tracker not found."
        )
        
    db.delete(db_app)
    db.commit()
    return
