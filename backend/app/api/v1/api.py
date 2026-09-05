from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, resumes, applications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
