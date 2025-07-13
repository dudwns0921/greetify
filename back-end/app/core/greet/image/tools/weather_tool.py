import requests


def get_weather(lat, lon, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&lang=kr&units=metric"
    resp = requests.get(url)
    if resp.status_code == 200:
        data = resp.json()
        weather = data["weather"][0]["description"]
        temp = data["main"]["temp"]
        city_name = data["name"]
        country = data["sys"]["country"]
        location = f"{city_name}, {country}"
        return {"weather_info": weather, "temp": temp, "location": location}
    return None
