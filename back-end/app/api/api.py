from fastapi import APIRouter
from app.api.endpoints import greet

api_router = APIRouter()

api_router.include_router(
    greet.router
)