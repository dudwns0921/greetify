import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY가 설정되어 있지 않습니다.")

# 환경 변수로 API 키 설정
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
llm = ChatOpenAI(model="gpt-4o", temperature=0.7)


def generate_greeting(gender, age_group, weather_info, temp, location, emotion):
    """
    LLM을 사용하여 모든 정보를 종합한 맞춤형 인사말을 생성합니다.

    Args:
        gender: 성별 (남성/여성)
        age_group: 나이대 (예: 20~29)
        weather_info: 날씨 정보
        temp: 온도
        location: 위치 정보
        emotion: 감정 상태

    Returns:
        list[str]: 맞춤형 인사말 또는 브리핑을 문장별로 분리한 배열
    """

    prompt = PromptTemplate(
        input_variables=[
            "gender",
            "age_group",
            "weather_info",
            "temp",
            "location",
            "emotion",
        ],
        template=(
            "다음 정보를 바탕으로 사용자에게 맞춤형 인사말이나 브리핑을 생성해주세요:\n\n"
            "- 성별: {gender}\n"
            "- 나이대: {age_group}\n"
            "- 현재 날씨: {weather_info}\n"
            "- 현재 온도: {temp}도\n"
            "- 위치: {location}\n"
            "- 감정 상태: {emotion}\n\n"
            "다음 지침을 따라주세요:\n"
            "1. 모든 정보를 자연스럽게 활용하여 개인화된 메시지를 만들어주세요\n"
            "2. 단순한 인사말뿐만 아니라 날씨, 감정, 위치 정보를 종합한 유용한 브리핑도 가능합니다\n"
            "3. 감정 상태에 따라 적절한 위로나 격려를 포함할 수 있습니다\n"
            "4. 나이대와 성별에 맞는 친근하고 존중하는 톤을 사용해주세요\n"
            "5. 날씨 정보를 활용하여 일상적인 조언이나 제안을 포함할 수 있습니다\n"
            "6. 위치 정보를 활용할 때는 단순히 위치명을 언급하는 것이 아니라, 해당 지역의 특징, 명소, 문화, 역사, 맛집, 관광지 등의 유용한 정보를 포함해주세요\n"
            "7. 위치 기반 정보는 사용자의 관심을 끌고 실용적인 가치가 있도록 제공해주세요\n"
            "8. 위치명이 영어로 되어 있다면 한국어로 번역하여 사용해주세요 (예: 'Seoul' → '서울', 'Busan' → '부산', 'Gangnam-gu' → '강남구')\n"
            "9. 한국어로 자연스럽고 친근하게 작성해주세요\n"
            "10. 응답은 각 문장을 줄바꿈 문자로 나눠서 전달해줘\n\n"
            "응답:"
        ),
    )

    formatted_prompt = prompt.format(
        gender=gender,
        age_group=age_group,
        weather_info=weather_info,
        temp=temp,
        location=location,
        emotion=emotion,
    )

    try:
        result = llm.invoke(formatted_prompt)
        response_text = str(result.content).strip()
        return response_text.split("\n")
    except Exception as e:
        # LLM 호출 실패 시 기본 인사말로 fallback
        fallback_greeting = [
            f"안녕하세요! {age_group}대 {gender}님,",
            f"현재 위치의 날씨는 '{weather_info}', 온도는 {temp}도입니다.",
            f"오늘 {emotion}한 표정이네요!",
            "오늘도 좋은 하루 보내세요!",
        ]
        print(f"LLM 호출 실패, 기본 인사말 사용: {e}")
        return fallback_greeting
