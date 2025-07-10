from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI) -> None:
    """CORS 미들웨어 설정"""
    origins = [
        "http://localhost:5173"
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

def setup_middleware(app: FastAPI) -> None:
    """모든 미들웨어 설정"""
    setup_cors(app)