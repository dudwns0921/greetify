from fastapi import APIRouter
from typing import Dict

router = APIRouter()

@router.post("/greet")
def post_greeting() -> Dict[str, str]:
    return {"message": "Hello, World!"}