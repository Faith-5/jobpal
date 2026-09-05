from typing import Optional, Literal
from pydantic import BaseModel

class ApplicationBase(BaseModel):
    company: str
    role: str
    logoText: Optional[str] = None
    status: Optional[Literal['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected']] = "Applied"
    appliedDate: Optional[str] = None
    atsScore: Optional[int] = 0
    location: Optional[str] = None
    salary: Optional[str] = None
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    logoText: Optional[str] = None
    status: Optional[Literal['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected']] = None
    appliedDate: Optional[str] = None
    atsScore: Optional[int] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    notes: Optional[str] = None

class ApplicationOut(ApplicationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
