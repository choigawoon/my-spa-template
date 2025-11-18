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

### 3.1 초기 설정 (실제 DB 없이도 가능)

**중요:** 실제 데이터베이스가 없어도 Prisma 스키마를 작성하고 Zod 스키마를 자동 생성할 수 있습니다.

1. `pnpm dlx prisma init --datasource-provider postgresql`
2. `schema.prisma`에서 모델 정의
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
4. **실제 DB 없이 Zod 스키마 생성:**
   ```bash
   # DB 연결 없이 스키마만 검증 및 Zod 생성
   pnpm prisma generate
   ```
   - 이 명령은 실제 DB 연결 없이도 실행 가능
   - `src/lib/prisma-zod/**`에 Zod 스키마 자동 생성
   - MSW에서 이 Zod 스키마를 사용하여 타입 안전한 목업 가능

### 3.2 실제 DB 연결 후 마이그레이션

실제 데이터베이스를 연결할 준비가 되면:

```bash
# 실제 DB URL 설정 (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 마이그레이션 실행
pnpm prisma migrate dev --name init

# Prisma Client 생성
pnpm prisma generate
```

### 3.3 Prisma 스키마 예시

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

generator zod {
  provider = "zod-prisma-types"
  output   = "../src/lib/prisma-zod"
}

model Item {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  category    String
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  @@map("items")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  full_name String   @map("full_name")
  is_active Boolean  @default(true)
  created_at DateTime @default(now())

  @@map("users")
}
```

**생성되는 Zod 스키마:**
- `src/lib/prisma-zod/Item.ts` - Item 모델의 Zod 스키마
- `src/lib/prisma-zod/User.ts` - User 모델의 Zod 스키마
- 각 스키마는 Prisma 모델과 완전히 동기화됨

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

### 5.1 단일 소스 원칙 (Single Source of Truth)

**Prisma 스키마가 모든 타입의 단일 소스:**

```
Prisma Schema (prisma/schema.prisma)
    ↓
    ├─→ Zod Schema (자동 생성) → 프론트엔드 타입
    │   └─→ src/lib/prisma-zod/** 
    │       └─→ MSW 핸들러에서 사용
    │
    ├─→ Prisma Client (자동 생성) → 백엔드 DB 접근
    │   └─→ FastAPI에서 사용
    │
    └─→ Pydantic Model (수동 작성, 스펙 일치) → FastAPI 응답
        └─→ backend/app/schemas/**
```

### 5.2 실제 DB 없이 개발하는 방법

1. **Prisma 스키마 작성** (실제 DB 연결 불필요)
2. **Zod 스키마 자동 생성:**
   ```bash
   pnpm prisma generate
   ```
   - `src/lib/prisma-zod/**`에 Zod 스키마 생성
3. **MSW에서 생성된 Zod 스키마 사용:**
   ```typescript
   // src/mocks/handlers.ts
   import { ItemSchema } from '@/lib/prisma-zod/Item'
   import type { z } from 'zod'
   
   type Item = z.infer<typeof ItemSchema>
   
   let items: Item[] = [
     {
       id: 1,
       name: '노트북',
       description: '고성능 노트북',
       price: 1500000,
       category: '전자제품',
       created_at: new Date(),
       updated_at: new Date(),
     },
   ]
   
   // MSW 핸들러에서 Zod 검증
   http.get('/api/items', () => {
     const validated = z.array(ItemSchema).parse(items)
     return HttpResponse.json({ items: validated, total: items.length })
   })
   ```
4. **나중에 실제 DB 연결:**
   - Prisma 스키마는 이미 작성됨
   - `DATABASE_URL` 설정 후 마이그레이션만 실행
   - 프론트엔드 코드는 변경 불필요

### 5.3 기존 schemas.ts와의 통합

**점진적 마이그레이션 전략:**

```typescript
// src/mocks/schemas.ts (기존)
export const ItemSchema = z.object({...}) // 수동 정의

// src/lib/prisma-zod/Item.ts (자동 생성)
export const ItemSchema = z.object({...}) // Prisma에서 생성

// 통합 방법 1: 직접 교체
import { ItemSchema } from '@/lib/prisma-zod/Item'

// 통합 방법 2: 래퍼로 확장
import { ItemSchema as PrismaItemSchema } from '@/lib/prisma-zod/Item'
export const ItemSchema = PrismaItemSchema.extend({
  // 추가 필드나 검증
})
```

### 5.4 FastAPI에서의 타입 동기화

- **Pydantic 모델은 수동 정의**하되, Prisma 필드 이름과 타입을 동일하게 유지
- Prisma Client로 조회한 데이터를 Pydantic 모델로 변환:
  ```python
  from pydantic import BaseModel
  
  class ItemResponse(BaseModel):
      id: int
      name: str
      description: str
      price: float
      category: str
      created_at: datetime
      updated_at: datetime
      
      class Config:
          from_attributes = True
  
  # Prisma → Pydantic 변환
  item = await prisma.item.find_unique(where={"id": item_id})
  return ItemResponse.model_validate(item)
  ```

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

