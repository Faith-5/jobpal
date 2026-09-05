from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    primaryGoal = Column(String, default="actively_searching")  # 'actively_searching' | 'exploring'
    role = Column(String, nullable=True)
    avatarUrl = Column(String, nullable=True)
    plan = Column(String, default="Free Plan")
    experienceCount = Column(Integer, default=0)
    educationCount = Column(Integer, default=0)
    projectsCount = Column(Integer, default=0)
    skills = Column(JSON, default=list)  # Stored as JSON array of strings

    # Relationships
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="owner", cascade="all, delete-orphan")
