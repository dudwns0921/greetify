from typing import Any, Optional
from pydantic import BaseModel

class BaseResponse(BaseModel):
    status: str
    data: Optional[Any] = None