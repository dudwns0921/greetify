def generate_greeting(gender, age_group, weather_info, temp, location, emotion=None):
    greeting = (
        f"안녕하세요! {age_group}대 {gender}님, "
        f"현재 위치의 날씨는 '{weather_info}', 온도는 {temp}도입니다. "
        f"오늘 {emotion}한 표정이네요! "
        "오늘도 좋은 하루 보내세요!"
    )
    return greeting
