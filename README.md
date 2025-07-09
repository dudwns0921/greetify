# Greetify

AI 기반 맞춤형 인사말 생성 서비스
사용자의 얼굴 이미지, 감정, 나이, 위치, 날씨, 시간 등 다양한 정보를 바탕으로 상황에 맞는 인사말을 생성합니다.

---

## 📚 프로젝트 개요

- **프론트엔드**: React + TypeScript  
  - 카메라로 얼굴 이미지 캡처, 위치 정보 수집, 결과(TTS/텍스트) 출력
- **백엔드**: FastAPI + Python  
  - 이미지 수신, 얼굴 특성 분석(CNN), 외부 API(날씨 등) 연동, 인사말 생성
- **딥러닝**: TensorFlow, Keras  
  - 감정/나이대 분석 모델 학습 및 추론

---

## 🗂️ 디렉토리 구조

```
greetify/
  ├─ back-end/         # FastAPI 백엔드 서버
  │   ├─ app/
  │   │   ├─ api/      # API 라우터 및 엔드포인트
  │   │   ├─ core/     # 설정, 미들웨어 등
  │   │   └─ main.py   # 서버 실행 진입점
  │   └─ pyproject.toml
  ├─ front-end/        # React 프론트엔드
  │   ├─ src/
  │   │   ├─ hooks/    # 커스텀 훅
  │   │   ├─ util/     # 유틸리티
  │   │   └─ types/    # 타입 정의
  │   └─ public/
  ├─ model/            # (예정) 모델 학습/추론 코드, 데이터, 체크포인트 등
  └─ README.md         # 프로젝트 설명서
```

---

## 🚀 설치 및 실행 방법

### 1. 백엔드(FastAPI) 실행

```bash
# poetry가 없다면 먼저 설치
pip install poetry

cd back-end
poetry install
poetry shell
uvicorn app.main:app --reload
```

### 2. 프론트엔드(React) 실행

```bash
cd front-end
npm install
npm run dev
```

---

## 🧑‍💻 주요 기능

- **얼굴 이미지 분석**: 감정, 나이대 등 추출 (CNN 기반)
- **외부 정보 연동**: 위치, 날씨, 시간 등 수집
- **맞춤형 인사말 생성**: 분석 결과 기반 텍스트 생성
- **TTS 지원**: 인사말 음성 출력

---

## 🛡️ 라이선스

본 프로젝트는 MIT 라이선스를 따릅니다.

---

## ✨ 문의

- 정영준 (프로젝트 담당자)
- 이메일: [dudwns0921@gmail.com]
