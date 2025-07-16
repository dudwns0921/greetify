from langgraph.graph import StateGraph
from ..workflows.langgraph_tools import (
    predict_gender_age_tool,
    get_latest_location_tool,
    get_weather_tool,
    generate_greeting_tool,
)


def safe_merge(prev, new):
    return {**prev, **(new or {})}


def print_arguments(state):
    """greeting 노드로 전달되는 모든 인자들을 출력하는 함수"""
    print("=== Greeting 노드로 전달되는 인자들 ===")
    print(f"gender: {state.get('gender', 'N/A')}")
    print(f"age_group: {state.get('age_group', 'N/A')}")
    print(f"weather_info: {state.get('weather_info', 'N/A')}")
    print(f"temp: {state.get('temp', 'N/A')}")
    print(f"location: {state.get('location', 'N/A')}")
    print(f"emotion: {state.get('emotion', 'N/A')}")
    print("=====================================")
    return state


def build_greet_graph(model_gender, model_age, model_emotion, weather_api_key, session_id):
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
        lambda prev: safe_merge(prev, get_latest_location_tool({"inputs": {"session_id": session_id}})),
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

    graph.add_node(
        "print_arguments",
        print_arguments,
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
    graph.add_edge("weather", "print_arguments")
    graph.add_edge("print_arguments", "greeting")
    graph.set_entry_point("predict")
    return graph.compile()
