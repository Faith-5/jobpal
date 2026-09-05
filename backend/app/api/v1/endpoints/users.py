from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get current user details.
    """
    return current_user

@router.put("/me", response_model=UserOut)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update profile details for the current user.
    """
    update_data = user_in.model_dump(exclude_unset=True)
    
    # Handle password hashing if updated
    if "password" in update_data:
        from app.core import security
        current_user.hashed_password = security.get_password_hash(update_data["password"])
        del update_data["password"]
        
    for field, value in update_data.items():
        setattr(current_user, field, value)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
