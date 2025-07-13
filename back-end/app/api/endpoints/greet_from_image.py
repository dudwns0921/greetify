from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os
import logging
from app.core.response.response import BaseResponse
from app.core.greet.image.workflows.graph import build_greet_graph

router = APIRouter()

# 모델 경로를 정확하게 수정
MODEL_PATH_GENDER = os.path.join(os.path.dirname(__file__), "../../model/gender")
MODEL_PATH_AGE = os.path.join(os.path.dirname(__file__), "../../model/age")
MODEL_FILE_GENDER = None
MODEL_FILE_AGE = None
if os.path.exists(MODEL_PATH_GENDER):
    files = [f for f in os.listdir(MODEL_PATH_GENDER) if f.endswith(".keras")]
    if files:
        MODEL_FILE_GENDER = os.path.join(
            MODEL_PATH_GENDER, sorted(files)[-1]
        )  # 가장 최근 파일 사용
if os.path.exists(MODEL_PATH_AGE):
    files = [f for f in os.listdir(MODEL_PATH_AGE) if f.endswith(".keras")]
    if files:
        MODEL_FILE_AGE = os.path.join(MODEL_PATH_AGE, sorted(files)[-1])

if MODEL_FILE_GENDER:
    model_gender = load_model(MODEL_FILE_GENDER)
else:
    model_gender = None

if MODEL_FILE_AGE:
    model_age = load_model(MODEL_FILE_AGE)
else:
    model_age = None


def preprocess_image(image_bytes):
    img = Image.open(image_bytes).convert("L").resize((64, 64))
    arr = np.array(img).reshape(1, 64, 64, 1) / 255.0
    return arr


@router.post("/greet-from-image")
async def greet_from_image(file: UploadFile = File(...)):
    if not model_gender or not model_age:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")
    try:
        arr = preprocess_image(file.file)
        # langgraph 파이프라인 실행
        app = build_greet_graph(
            model_gender, model_age, weather_api_key=os.getenv("OPEN_WEATHER_API_KEY")
        )
        result = app.invoke(arr)
        return BaseResponse(status="success", data=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 오류: {str(e)}")
