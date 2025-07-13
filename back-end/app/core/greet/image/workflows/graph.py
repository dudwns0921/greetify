from langgraph.graph import StateGraph
from ..workflows.langgraph_tools import (
    predict_gender_age_tool,
    get_latest_location_tool,
    get_weather_tool,
    generate_greeting_tool,
)


def safe_merge(prev, new):
    return {**prev, **(new or {})}


def build_greet_graph(model_gender, model_age, model_emotion, weather_api_key):
    graph = StateGraph(state_schema=dict)
    graph.add_node(
        "predict",
        lambda image_arr: predict_gender_age_tool(
            {
                "inputs": {
                    "image_arr": image_arr,
                    "model_gender": model_gender,
                    "model_age": model_age,
                    "model_emotion": model_emotion,
                }
            }
        ),
    )

    graph.add_node(
        "location",
        lambda prev: safe_merge(prev, get_latest_location_tool({"inputs": {}})),
    )

    graph.add_node(
        "weather",
        lambda prev: safe_merge(
            prev,
            get_weather_tool(
                {
                    "inputs": {
                        "lat": prev["lat"],
                        "lon": prev["lon"],
                        "api_key": weather_api_key,
                    }
                }
            ),
        ),
    )

    # weather 노드 결과를 콘솔로 출력
    graph.add_node(
        "print_weather", lambda prev: print(f"날씨 노드 결과: {prev}") or prev
    )

    graph.add_node(
        "greeting",
        lambda prev: generate_greeting_tool(
            {
                "inputs": {
                    "gender": prev["gender"],
                    "age_group": prev["age_group"],
                    "weather_info": prev.get("weather_info", ""),
                    "temp": prev.get("temp", 0),
                    "location": prev.get("location"),
                    "emotion": prev.get("emotion"),
                }
            }
        ),
    )

    graph.add_edge("predict", "location")
    graph.add_edge("location", "weather")
    graph.add_edge("weather", "print_weather")
    graph.add_edge("print_weather", "greeting")
    graph.set_entry_point("predict")
    return graph.compile()
