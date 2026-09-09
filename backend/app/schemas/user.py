from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    primaryGoal: Optional[Literal['actively_searching', 'career_pivot', 'exploring']] = "actively_searching"
    role: Optional[str] = None
    avatarUrl: Optional[str] = None
    skills: List[str] = []

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    primaryGoal: Optional[Literal['actively_searching', 'career_pivot', 'exploring']] = None
    role: Optional[str] = None
    avatarUrl: Optional[str] = None
    skills: Optional[List[str]] = None

class UserOut(UserBase):
    id: int
    plan: str
    experienceCount: int
    educationCount: int
    projectsCount: int

    class Config:
        from_attributes = True
