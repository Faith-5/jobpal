from typing import List, Optional, Literal
from pydantic import BaseModel

class SuggestionItem(BaseModel):
    id: str
    type: Literal['warning', 'lightbulb', 'check']
    title: str
    description: str
    actionText: str
    applied: bool
    category: Literal['impact', 'keyword', 'format']

class AtsBreakdownBase(BaseModel):
    overallScore: int
    scoreStatus: Literal['Excellent', 'Good', 'Needs Work']
    summary: str
    keywordsScore: int
    keywordsSummary: str
    formattingScore: int
    formattingSummary: str
    impactScore: int
    impactSummary: str
    targetRole: str
    suggestions: List[SuggestionItem]

class ResumeBase(BaseModel):
    title: str
    raw_text: Optional[str] = None
    file_path: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeOut(ResumeBase, AtsBreakdownBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
