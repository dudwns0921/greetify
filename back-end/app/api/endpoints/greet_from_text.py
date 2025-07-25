from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.greet.text.workflows.graph import greet_graph, GreetState
from app.core.response.response import BaseResponse

router = APIRouter()


class GreetTextRequest(BaseModel):
    text: str


@router.post("/greet-from-text")
async def greet_from_text(request: GreetTextRequest):
    try:
        state = GreetState(text=request.text)
        result = greet_graph.invoke(state)
        return BaseResponse(status="success", data=result["result"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangGraph 처리 오류: {str(e)}")
