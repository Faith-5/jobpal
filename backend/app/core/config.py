import secrets
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JobPal AI"
    
    # Database
    DATABASE_URL: str = "sqlite:///./jobpal.db"
    
    # Security
    SECRET_KEY: str = "SUPER_SECRET_KEY_PLEASE_CHANGE_THIS_IN_PRODUCTION_12345"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Groq Client
    GROQ_API_KEY: str = ""
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
