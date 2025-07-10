from fastapi import FastAPI
from app.core.config import settings
from app.core.middleware import setup_middleware
from app.api.api import api_router
from app.core.database.db import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug
)

# 미들웨어 설정
setup_middleware(app)

# DB 초기화
init_db()

# 라우터 등록
app.include_router(api_router, prefix="/api/v1")
