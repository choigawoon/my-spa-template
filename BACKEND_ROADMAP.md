# Backend Roadmap

> 목적: FastAPI + Prisma(py) 기반 백엔드를 구축해 현재 React/Zod 프론트엔드와 타입 안전하게 연동하고, 이후 GitHub Template로 재사용 가능하도록 표준 절차를 문서화한다.

## 1. 환경 세팅
- Python 관리는 `uv` 기준
  - `uv venv .venv`
  - `source .venv/bin/activate`
  - `uv pip install fastapi uvicorn prisma`
- Node/Prisma CLI는 루트 `pnpm` 환경에서 실행

## 2. 디렉터리 구조 제안
```
backend/
├── app/
│   ├── main.py          # FastAPI 엔트리
│   ├── routes/          # 라우터 (items, users, auth 등)
│   ├── schemas/         # Pydantic BaseModel (입출력)
│   ├── services/        # 비즈니스 로직
│   └── db.py            # Prisma 클라이언트 래퍼
├── prisma/
│   ├── schema.prisma    # 단일 소스 스키마
│   └── migrations/
└── README.md            # 백엔드 실행/배포 가이드
```

## 3. Prisma 설정
1. `pnpm dlx prisma init --datasource-provider postgresql`
2. `schema.prisma`에서 모델 정의 (프론트의 `ItemSchema`, `UserSchema`와 필드 일치)
3. generator 추가
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   generator zod {
     provider = "zod-prisma-types"
     output   = "../src/lib/prisma-zod"
   }
   ```
4. 마이그레이션: `pnpm prisma migrate dev --name init`

## 4. FastAPI + Prisma(py)
1. `uv pip install "prisma[fastapi]" pydantic-settings`
2. `backend/app/db.py`
   ```python
   from prisma import Prisma

   prisma = Prisma()

   async def lifespan(app):
       await prisma.connect()
       yield
       await prisma.disconnect()
   ```
3. `backend/app/main.py`
   ```python
   from fastapi import FastAPI
   from .db import lifespan
   from .routes import items

   app = FastAPI(lifespan=lifespan)
   app.include_router(items.router, prefix="/api/items", tags=["items"])
   ```
4. 라우트에서 Prisma Client 호출 후 Pydantic 모델(`BaseModel`)을 이용해 응답 검증.

## 5. 타입 동기화 전략
- Prisma 스키마를 단일 진실로 유지
- 자동 생성된 Zod 스키마를 프론트(`src/lib/prisma-zod`)에서 import하여 기존 `schemas.ts`를 점진적으로 대체
- FastAPI에서는 Pydantic 모델을 수동 정의하되, Prisma 필드 이름과 타입을 동일하게 유지
- 필요 시 `pydantic.BaseModel.model_validate(prisma_record)`로 DB → 응답 변환

## 6. 테스트 및 검증
- FastAPI: `uvicorn backend.app.main:app --reload`
- 계약 테스트: 프론트 Zod 스키마로 실제 API 응답을 검증하는 e2e 테스트 (MSW 제거 후)
- DB: `pnpm prisma studio`로 데이터 확인

## 7. 배포 체크리스트
- `.env` 분리 (`.env`, `.env.production`), `VITE_API_BASE_URL`을 FastAPI 배포 주소로 맞추기
- 생산 데이터베이스 URL, Prisma 마이그레이션 자동화 (CI/CD)
- GitHub Template로 변환 시 `backend/README.md`, `.env.example`, `scripts/` 등을 포함

---

이 문서는 백엔드 구현 시작 전에 참조용 가이드이며, 실제 구축 후 세부 절차(마이그레이션 명령, 서비스별 라우터 등)를 업데이트해야 한다.

