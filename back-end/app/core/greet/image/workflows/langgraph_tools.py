from langchain.tools import tool
from ..tools.predict_tool import predict_gender_age_emotion
from ..tools.location_tool import get_latest_location
from ..tools.weather_tool import get_weather
from ..tools.greeting_tool import generate_greeting


@tool
def predict_gender_age_tool(inputs: dict):
    """이미지 배열과 모델을 받아 성별, 나이대, 감정을 예측합니다."""
    image_arr = inputs["image_arr"]
    model_gender = inputs["model_gender"]
    model_age = inputs["model_age"]
    model_emotion = inputs["model_emotion"]

    gender, age_group, emotion = predict_gender_age_emotion(
        model_gender, model_age, model_emotion, image_arr
    )
    return {"gender": gender, "age_group": age_group, "emotion": emotion}


@tool
def get_latest_location_tool(inputs: dict):
    """DB에서 최신 위도, 경도 위치를 조회합니다."""
    session_id = inputs.get("session_id")
    lat, lon = get_latest_location(session_id)
    return {"lat": lat, "lon": lon}


@tool
def get_weather_tool(inputs: dict):
    """위도, 경도를 받아 OpenWeather API로 날씨 정보를 조회합니다."""
    lat = inputs["lat"]
    lon = inputs["lon"]
    api_key = inputs["api_key"]
    result = get_weather(lat, lon, api_key)
    return result


@tool
def generate_greeting_tool(inputs: dict):
    """성별, 나이대, 감정, 날씨, 위치 정보를 받아 인사말을 생성합니다."""
    gender = inputs["gender"]
    age_group = inputs["age_group"]
    weather_info = inputs["weather_info"]
    temp = inputs["temp"]
    location = inputs.get("location")
    emotion = inputs.get("emotion")
    return generate_greeting(gender, age_group, weather_info, temp, location, emotion)
