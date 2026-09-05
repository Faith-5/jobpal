from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    logoText = Column(String, nullable=True)
    status = Column(String, default="Applied")  # 'Draft' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'
    appliedDate = Column(String, nullable=True)
    atsScore = Column(Integer, default=0)
    location = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="applications")
