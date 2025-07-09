from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise RuntimeError('OPENAI_API_KEY가 설정되어 있지 않습니다.')

llm = OpenAI(openai_api_key=OPENAI_API_KEY, temperature=0.0)

class GreetTextRequest(BaseModel):
    text: str

@router.post('/greet-from-text')
async def greet_from_text(request: GreetTextRequest):
    prompt = PromptTemplate(
        input_variables=["text"],
        template=(
            "다음 문장이 인사말인지 아닌지 판단해 주세요.\n"
            "인사말이면 true, 아니면 false로 대답하고, 이유를 한글로 설명해 주세요.\n"
            "만약 인사말이 아니라면, 이유를 설명한 뒤 '다시 한 번 인사해 주세요.'라는 문장을 추가해 주세요.\n"
            "각 문장은 온점(.)으로 구분해 주세요.\n"
            "문장: {text}\n"
            "응답 형식: {{\"is_greeting\": <true/false>, \"reason\": \"설명\"}}"
        )
    )
    try:
        _prompt = prompt.format(text=request.text)
        result = llm(_prompt)
        # LangChain LLM의 응답이 JSON 형식이 아닐 수 있으므로 파싱 시도
        import json
        try:
            parsed = json.loads(result)
        except Exception:
            # JSON 파싱 실패 시, 간단히 파싱 시도
            import re
            is_greeting = 'true' in result.lower()
            reason = result
            parsed = {"is_greeting": is_greeting, "reason": reason}
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM 처리 오류: {str(e)}") 