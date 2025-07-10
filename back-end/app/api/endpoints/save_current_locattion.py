from fastapi import APIRouter
from pydantic import BaseModel
from app.core.database.db import save_location
from app.core.response.response import BaseResponse

router = APIRouter()

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

@router.post('/save-current-location', response_model=BaseResponse)
async def save_current_location(request: LocationRequest):
    save_location(request.latitude, request.longitude)
    return BaseResponse(status="success", data=None)