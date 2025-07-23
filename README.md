# Greetify

AI 기반 맞춤형 인사말 생성 서비스
사용자의 얼굴 이미지, 감정, 나이, 위치, 날씨, 시간 등 다양한 정보를 바탕으로 상황에 맞는 인사말을 생성합니다.

**[https://elioground.com/greetify/](https://elioground.com/greetify/)**

---

## 📚 프로젝트 개요

- **프론트엔드**: React + TypeScript  
  - 카메라로 얼굴 이미지 캡처, 위치 정보 수집, 결과(TTS/텍스트) 출력
- **백엔드**: FastAPI + Python  
  - 이미지 수신, 얼굴 특성 분석(CNN), 외부 API(날씨 등) 연동
- **AI**: TensorFlow, Keras, llm
  - 감정/나이대 분석 모델 학습 및 추론
  - 수집된 정보들을 바탕으로 llm으로 인사말 생성

---

## 🗂️ 디렉토리 구조

```
greetify/
 ├─ back-end/                        # FastAPI 백엔드 서버
 │  └─ app/                          # 백엔드 앱 루트
 │     ├─ api/                       # API 라우터 및 엔드포인트
 │     │  └─ endpoints/              # greet, image, text 처리 엔드포인트
 │     ├─ core/                      # 설정, DB, 미들웨어, 인사말 생성 로직
 │     │  ├─ config/                 # 설정값 로딩
 │     │  ├─ database/               # DB 연결 설정
 │     │  ├─ greet/
 │     │  │  ├─ image/               # 이미지 기반 인사 생성
 │     │  │  │  ├─ tools/            # 분석 도구 (감정, 위치, 날씨 등)
 │     │  │  │  └─ workflows/        # LangGraph 기반 인사말 처리
 │     │  │  └─ text/                # 텍스트 기반 인사 생성
 │     │  │     ├─ tools/            # 텍스트 분석 도구
 │     │  │     └─ workflows/        # LangGraph 기반 텍스트 처리
 │     ├─ middleware/                # 요청 전처리 미들웨어
 │     ├─ response/                  # 표준 응답 포맷 정의
 │     └─ model/
 │        ├─ age/                    # 나이 추정 모델 파일 보관용
 │        ├─ emotion/                # 감정 추정 모델 파일 보관용
 │        └─ gender/                 # 성별 추정 모델 파일 보관용
 │
 ├─ front-end/                      # React 프론트엔드
 │  ├─ src/                         # 프론트엔드 소스 코드
 │  │  ├─ assets/                   # 정적 자산 (오디오, 이미지 등)
 │  │  │  ├─ audio/                 # 사운드 파일 저장
 │  │  │  └─ images/                # 배경 이미지 등
 │  │  ├─ components/               # UI 컴포넌트 모음
 │  │  │  ├─ ActionButton/          # 마이크, 카메라 버튼
 │  │  │  ├─ Flash/                 # 플래시 효과
 │  │  │  ├─ MessagePortal/         # 메시지 출력용 포탈
 │  │  │  └─ WebcamModal/           # 웹캠 캡처용 모달
 │  │  ├─ constants/                # 텍스트 상수 등 정의
 │  │  ├─ hooks/                    # 커스텀 훅
 │  │  ├─ styles/                   # 전역 스타일 (reset, base 등)
 │  │  ├─ types/                    # 타입 정의
 │  │  │  └─ http/                  # 요청/응답 관련 타입
 │  │  └─ util/                     # 공통 유틸 함수 및 타입
 │  └─ public/                      # HTML 템플릿 및 공개 리소스

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
poetry run uvicorn app.main:app --reload
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

---

## 🛡️ 라이선스

본 프로젝트는 MIT 라이선스를 따릅니다.

---

## ✨ 문의

- 정영준 (프로젝트 담당자)
- 이메일: [dudwns0921@gmail.com]
