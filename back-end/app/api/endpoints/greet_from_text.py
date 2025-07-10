from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.greet.judge import greet_graph, GreetState

router = APIRouter()

class GreetTextRequest(BaseModel):
    text: str

@router.post('/greet-from-text')
async def greet_from_text(request: GreetTextRequest):
    try:
        state = GreetState(text=request.text)
        result = greet_graph.invoke(state)
        return result["result"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangGraph 처리 오류: {str(e)}") 