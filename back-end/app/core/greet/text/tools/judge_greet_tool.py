import os
from dotenv import load_dotenv
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.tools import tool

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY가 설정되어 있지 않습니다.")

llm = OpenAI(openai_api_key=OPENAI_API_KEY, temperature=0.0)


@tool
def greeting_judge_tool(text: str) -> dict:
    """
    입력된 문장이 인사말인지 판별하고, 결과와 이유를 반환하는 LangChain Tool입니다.
    """
    prompt = PromptTemplate(
        input_variables=["text"],
        template=(
            "다음 문장이 인사말인지 아닌지 판단해 주세요.\n"
            "인사말이면 true, 아니면 false로 대답하고, 이유를 한글로 설명해 주세요.\n"
            "만약 인사말이 아니라면, 이유를 설명한 뒤 '다시 한 번 인사해 주세요.'라는 문장을 추가해 주세요.\n"
            "각 문장은 온점(.)으로 구분해 주세요.\n"
            "문장: {text}\n"
            '응답 형식: {{"is_greeting": <true/false>, "reason": "설명"}}'
        ),
    )
    _prompt = prompt.format(text=text)
    result = llm(_prompt)
    import json

    try:
        parsed = json.loads(result)
    except Exception:
        is_greeting = "true" in result.lower()
        reason = result
        parsed = {"is_greeting": is_greeting, "reason": reason}
    return parsed
