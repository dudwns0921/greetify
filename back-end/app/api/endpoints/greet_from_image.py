from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os
import logging

router = APIRouter()

# 모델 경로를 정확하게 수정
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../model/gender')
MODEL_FILE = None
if os.path.exists(MODEL_PATH):
    files = [f for f in os.listdir(MODEL_PATH) if f.endswith('.keras')]
    if files:
        MODEL_FILE = os.path.join(MODEL_PATH, sorted(files)[-1])  # 가장 최근 파일 사용

if MODEL_FILE:
    model = load_model(MODEL_FILE)
else:
    model = None

def preprocess_image(image_bytes):
    img = Image.open(image_bytes).convert('L').resize((64, 64))
    arr = np.array(img).reshape(1, 64, 64, 1) / 255.0
    return arr

@router.post("/greet-from-image/")
async def greet_from_image(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")
    try:
        arr = preprocess_image(file.file)
        pred = model.predict(arr)[0][0]
        gender = "남성" if pred < 0.5 else "여성"
        logging.info(f"예측된 성별: {gender}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 오류: {str(e)}")

    return {"gender": gender} 