import numpy as np


def predict_gender_age_emotion(model_gender, model_age, model_emotion, image_arr):
    """
    성별, 나이, 감정을 모두 예측하는 함수

    Args:
        model_gender: 성별 예측 모델
        model_age: 나이 예측 모델
        model_emotion: 감정 예측 모델
        image_arr: 이미지 배열

    Returns:
        tuple: (gender, age_group, emotion)
    """
    # 성별 예측
    pred_gender = model_gender.predict(image_arr)[0][0]
    gender = "남성" if pred_gender < 0.5 else "여성"

    # 나이 예측
    pred_age = model_age.predict(image_arr)[0]
    age_class = int(np.argmax(pred_age))
    age_group = f"{age_class*10}~{age_class*10+9}"

    # 감정 예측
    pred_emotion = model_emotion.predict(image_arr)[0]
    emotion_class = int(np.argmax(pred_emotion))

    # 감정 매핑
    emotion_mapping = {
        0: "화남",
        1: "역겨움",
        2: "두려움",
        3: "행복",
        4: "슬픔",
        5: "놀람",
        6: "무표정",
    }
    emotion = emotion_mapping.get(emotion_class, "알 수 없음")

    return gender, age_group, emotion
