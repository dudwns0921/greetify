def generate_greeting(gender, age_group, weather_info, temp, location):
    # weather_info와 temp가 유효한지 확인
    if weather_info and temp:
        greeting = (
            f"안녕하세요! {age_group}대 {gender}님, "
            f"현재 위치의 날씨는 '{weather_info}', 온도는 {temp}도입니다. "
            "오늘도 좋은 하루 보내세요!"
        )
    else:
        # 날씨 정보가 없거나 잘못된 경우
        greeting = (
            f"안녕하세요! {age_group}대 {gender}님, " "오늘도 좋은 하루 보내세요!"
        )
    return greeting
