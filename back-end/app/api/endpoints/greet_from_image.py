from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import os
import logging
from app.core.response import BaseResponse

router = APIRouter()

# 모델 경로를 정확하게 수정
MODEL_PATH_GENDER = os.path.join(os.path.dirname(__file__), '../../model/gender')
MODEL_PATH_AGE = os.path.join(os.path.dirname(__file__), '../../model/age')
MODEL_FILE_GENDER = None
MODEL_FILE_AGE = None
if os.path.exists(MODEL_PATH_GENDER):
    files = [f for f in os.listdir(MODEL_PATH_GENDER) if f.endswith('.keras')]
    if files:
        MODEL_FILE_GENDER = os.path.join(MODEL_PATH_GENDER, sorted(files)[-1])  # 가장 최근 파일 사용
if os.path.exists(MODEL_PATH_AGE):
    files = [f for f in os.listdir(MODEL_PATH_AGE) if f.endswith('.keras')]
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
    img = Image.open(image_bytes).convert('L').resize((64, 64))
    arr = np.array(img).reshape(1, 64, 64, 1) / 255.0
    return arr

@router.post("/greet-from-image/")
async def greet_from_image(file: UploadFile = File(...)):
    if not model_gender or not model_age:
        raise HTTPException(status_code=500, detail="모델이 로드되지 않았습니다.")
    try:
        arr = preprocess_image(file.file)
        # gender 예측
        pred_gender = model_gender.predict(arr)[0][0]
        gender = "남성" if pred_gender < 0.5 else "여성"
        # age 예측
        pred_age = model_age.predict(arr)[0]
        age_class = int(np.argmax(pred_age))
        age_group = f"{age_class*10}~{age_class*10+9}"
        logging.info(f"예측된 성별: {gender}, 예측된 나이 그룹: {age_group}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"이미지 처리 오류: {str(e)}")

    return BaseResponse(status="success", data={"gender": gender, "age_group": age_group}) 