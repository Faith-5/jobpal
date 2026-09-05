from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, default="My Resume")
    raw_text = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    
    # ATS Score breakdown data
    overallScore = Column(Integer, default=0)
    scoreStatus = Column(String, default="Needs Work")
    summary = Column(Text, nullable=True)
    keywordsScore = Column(Integer, default=0)
    keywordsSummary = Column(Text, nullable=True)
    formattingScore = Column(Integer, default=0)
    formattingSummary = Column(Text, nullable=True)
    impactScore = Column(Integer, default=0)
    impactSummary = Column(Text, nullable=True)
    targetRole = Column(String, nullable=True)
    
    # Suggestions list (Pydantic SuggestionItem list stored as JSON)
    suggestions = Column(JSON, default=list)

    # Relationships
    owner = relationship("User", back_populates="resumes")
