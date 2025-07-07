from fastapi import APIRouter
from app.api.endpoints import greet_from_image

api_router = APIRouter()

api_router.include_router(
    greet_from_image.router
)