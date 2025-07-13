import numpy as np


def predict_gender_age(model_gender, model_age, image_arr):
    pred_gender = model_gender.predict(image_arr)[0][0]
    gender = "남성" if pred_gender < 0.5 else "여성"
    pred_age = model_age.predict(image_arr)[0]
    age_class = int(np.argmax(pred_age))
    age_group = f"{age_class*10}~{age_class*10+9}"
    return gender, age_group
