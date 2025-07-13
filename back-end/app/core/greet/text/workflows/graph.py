from langgraph.graph import StateGraph, END
from pydantic import BaseModel
from ..tools.judge_greet_tool import greeting_judge_tool


class GreetState(BaseModel):
    text: str
    result: dict = None


def judge_node(state: GreetState):
    result = greeting_judge_tool(state.text)
    return {"text": state.text, "result": result}


graph = StateGraph(GreetState)
graph.add_node("judge", judge_node)
graph.set_entry_point("judge")
graph.add_edge("judge", END)
greet_graph = graph.compile()
