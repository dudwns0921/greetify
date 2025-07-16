from fastapi import APIRouter, Request, Response
from pydantic import BaseModel
from app.core.database.db import save_location
from app.core.response.response import BaseResponse
import uuid

router = APIRouter()


class LocationRequest(BaseModel):
    latitude: float
    longitude: float


@router.post("/save-current-location", response_model=BaseResponse)
async def save_current_location(request: Request, response: Response, body: LocationRequest):
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax")
    save_location(session_id, body.latitude, body.longitude)
    return BaseResponse(status="success", data={"session_id": session_id})
