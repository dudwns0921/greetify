from fastapi import APIRouter
import pkgutil
import importlib
from app.api import endpoints

api_router = APIRouter()

# endpoints 패키지 내의 모든 모듈을 순회
for _, module_name, _ in pkgutil.iter_modules(endpoints.__path__):
    module = importlib.import_module(f"app.api.endpoints.{module_name}")
    # 각 모듈에 router 객체가 있으면 등록
    if hasattr(module, "router"):
        api_router.include_router(module.router)