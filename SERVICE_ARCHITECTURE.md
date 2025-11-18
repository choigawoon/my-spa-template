# 서비스 아키텍처 및 개발 워크플로우

이 문서는 템플릿의 서비스 구조, 프록시 설정, MSW → 백엔드 전환 프로세스를 설명합니다.

---

## 📋 목차

1. [단계별 확장 시나리오](#단계별-확장-시나리오) ⭐
2. [전체 아키텍처 개요](#전체-아키텍처-개요)
3. [개발 워크플로우](#개발-워크플로우)
4. [프록시 설정](#프록시-설정)
5. [MSW 모킹 단계](#msw-모킹-단계)
6. [백엔드 연동 단계](#백엔드-연동-단계)
7. [환경 변수 설정](#환경-변수-설정)
8. [트러블슈팅](#트러블슈팅)

---

## 단계별 확장 시나리오

이 템플릿의 핵심 가치는 **단계별로 확장 가능한 아키텍처**입니다. 작은 프로젝트에서 시작해 점진적으로 확장할 수 있으며, 각 단계에서 프론트엔드 코드 변경 없이 백엔드 인프라만 교체하면 됩니다.

### 🎯 확장 단계 개요

```
Stage 1: MSW 모킹 (풀스택처럼 개발)
    ↓
Stage 2: 단일 백엔드 + DB 분리
    ↓
Stage 3: MSA 구조 (nginx 리버스 프록시)
```

---

### Stage 1: MSW 모킹 - 풀스택처럼 개발

**목적:** 백엔드 없이 프론트엔드에서 모든 기능을 풀스택처럼 개발

#### 아키텍처

```
┌─────────────────────────────────────────┐
│     Frontend (React + Vite)            │
│  ┌───────────────────────────────────┐  │
│  │  MSW Worker (Mock API)           │  │
│  │  - 메모리 기반 데이터 저장        │  │
│  │  - Zod 스키마 검증                │  │
│  │  - FastAPI 스타일 응답            │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 특징
- ✅ **백엔드 서버 불필요**: MSW가 브라우저에서 모든 API 요청 처리
- ✅ **Prisma 스키마 기반**: 실제 DB 없이도 Prisma 스키마 → Zod 자동 생성 → MSW 목업
- ✅ **타입 안전성**: Prisma 모델 스펙으로 프론트엔드 타입 자동 생성
- ✅ **빠른 개발**: 데이터베이스 설정 없이 즉시 개발 시작
- ✅ **API 스펙 정의**: Prisma 스키마를 단일 소스로 사용해 Zod/Pydantic 동기화
- ✅ **실제 백엔드와 동일한 형식**: FastAPI 스타일 응답으로 나중에 전환 용이

#### 설정
```bash
# .env
VITE_API_MODE=mock
```

#### Prisma + Zod 통합 워크플로우

**실제 DB 없이도 Prisma 스키마로 타입 안전한 개발:**

```
1. Prisma 스키마 작성 (prisma/schema.prisma)
   ↓
2. Zod 스키마 자동 생성 (prisma-zod-generator)
   → src/lib/prisma-zod/** 에 생성
   ↓
3. MSW 핸들러에서 생성된 Zod 스키마 사용
   → 타입 안전한 Mock 데이터
   ↓
4. 나중에 실제 DB 연결 시
   → Prisma Client로 동일한 스키마 사용
   → 프론트엔드 코드 변경 불필요
```

**예시:**
```prisma
// prisma/schema.prisma
model Item {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  category    String
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}
```

```typescript
// 자동 생성된 src/lib/prisma-zod/Item.ts
import { z } from 'zod'
export const ItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})
```

```typescript
// src/mocks/handlers.ts
import { ItemSchema } from '@/lib/prisma-zod/Item'

// 생성된 Zod 스키마로 타입 안전한 Mock 데이터
let items: z.infer<typeof ItemSchema>[] = [...]
```

#### 사용 시나리오
- 프로토타이핑 및 초기 UI/UX 개발
- 프론트엔드 개발자가 백엔드와 독립적으로 작업
- Prisma 스키마로 DB 모델 설계 및 타입 생성
- 실제 DB 없이도 Prisma 모델 스펙으로 개발
- API 스펙 협의 및 문서화
- 프론트엔드 단위 테스트

---

### Stage 2: 단일 백엔드 + DB 분리

**목적:** 실제 백엔드 서버와 데이터베이스로 전환, 모놀리식 구조

#### 아키텍처

```
┌─────────────────────────────────────────┐
│     Frontend (React + Vite)            │
│  ┌───────────────────────────────────┐  │
│  │  Vite Dev Proxy                   │  │
│  │  (개발 환경)                       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
              │
              │ HTTP /api/*
              │
              ▼
┌─────────────────────────────────────────┐
│     Backend (FastAPI)                  │
│  ┌───────────────────────────────────┐  │
│  │  API Routes                       │  │
│  │  - /api/items                     │  │
│  │  - /api/users                     │  │
│  │  - /api/auth                      │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Prisma ORM                       │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Database (PostgreSQL/MySQL)      │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 특징
- ✅ **프론트엔드 코드 변경 없음**: 환경 변수만 변경
- ✅ **실제 데이터 저장**: 데이터베이스에 영구 저장
- ✅ **프록시를 통한 CORS 해결**: Vite 개발 서버 프록시 활용
- ✅ **단일 서버 구조**: 간단한 모놀리식 아키텍처

#### 설정
```bash
# .env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000
```

#### 마이그레이션 단계
1. FastAPI 백엔드 프로젝트 생성 (`BACKEND_ROADMAP.md` 참고)
2. **Prisma 스키마는 이미 작성됨** (Stage 1에서 작성)
3. 실제 데이터베이스 연결 및 마이그레이션
4. FastAPI 라우트 구현 (Prisma Client 사용)
5. 환경 변수 변경 (`VITE_API_MODE=real`)
6. 프론트엔드 재시작

**중요:** Prisma 스키마는 Stage 1에서 이미 작성했으므로, Stage 2에서는 실제 DB 연결만 하면 됩니다.

#### 사용 시나리오
- 실제 데이터가 필요한 개발
- 백엔드와 프론트엔드 통합 테스트
- 소규모 프로젝트 운영
- MVP (Minimum Viable Product) 배포

---

### Stage 3: MSA 구조 - nginx 리버스 프록시

**목적:** 마이크로서비스 아키텍처로 확장, 여러 백엔드 서비스 분리

#### 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React)                           │
│              (정적 파일 서빙)                            │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│              nginx (리버스 프록시)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  /api/auth    → auth-service:8001                │  │
│  │  /api/users   → user-service:8002                │  │
│  │  /api/items   → item-service:8003                │  │
│  │  /api/orders  → order-service:8004               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │  User    │ │  Item    │ │  Order   │
│ Service  │ │ Service  │ │ Service  │ │ Service  │
│ :8001    │ │ :8002    │ │ :8003    │ │ :8004    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
     │            │            │            │
     └────────────┴────────────┴────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Shared Database     │
            │   (PostgreSQL)        │
            │   또는                │
            │   각 서비스별 DB 분리  │
            └───────────────────────┘
```

#### nginx 설정 예시

```nginx
# /etc/nginx/sites-available/your-app
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend 정적 파일
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 리버스 프록시
    location /api/auth {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/users {
        proxy_pass http://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/items {
        proxy_pass http://localhost:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/orders {
        proxy_pass http://localhost:8004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 특징
- ✅ **프론트엔드 코드 변경 없음**: API 경로는 동일하게 유지
- ✅ **서비스 분리**: 각 도메인별로 독립적인 마이크로서비스
- ✅ **확장성**: 각 서비스를 독립적으로 스케일링
- ✅ **로드 밸런싱**: nginx에서 여러 인스턴스로 요청 분산 가능
- ✅ **SSL/TLS 종료**: nginx에서 HTTPS 처리

#### 설정
```bash
# .env.production
VITE_API_MODE=real
VITE_API_BASE_URL=https://yourdomain.com
```

#### 마이그레이션 단계
1. 각 도메인별로 백엔드 서비스 분리
   - `auth-service`: 인증/인가
   - `user-service`: 사용자 관리
   - `item-service`: 상품 관리
   - `order-service`: 주문 처리
2. 각 서비스별 독립적인 데이터베이스 (선택사항)
3. nginx 리버스 프록시 설정
4. 프론트엔드 빌드 및 배포
5. 환경 변수 설정 (`VITE_API_BASE_URL`)

#### 사용 시나리오
- 대규모 프로젝트 운영
- 팀별로 서비스 독립 개발/배포
- 서비스별 독립적인 스케일링 필요
- 마이크로서비스 아키텍처 적용

---

### 단계별 전환 체크리스트

#### Stage 1 → Stage 2 (MSW → 단일 백엔드)

- [ ] FastAPI 백엔드 프로젝트 생성
- [ ] Prisma 스키마 작성 (MSW Zod 스키마 기반)
- [ ] FastAPI 라우트 구현
- [ ] 데이터베이스 설정 및 마이그레이션
- [ ] `.env`에서 `VITE_API_MODE=real` 설정
- [ ] `VITE_API_BASE_URL` 설정
- [ ] Vite 프록시 설정 확인 (`vite.config.ts`)
- [ ] 백엔드 서버 실행
- [ ] 프론트엔드 재시작 및 테스트
- [ ] API 응답 형식 일치 확인

#### Stage 2 → Stage 3 (단일 백엔드 → MSA)

- [ ] 서비스 도메인 분석 및 분리 계획
- [ ] 각 마이크로서비스 프로젝트 생성
- [ ] 서비스별 데이터베이스 분리 (선택사항)
- [ ] nginx 설치 및 설정
- [ ] nginx 리버스 프록시 설정
- [ ] 각 서비스별 포트 설정
- [ ] SSL 인증서 설정 (Let's Encrypt 등)
- [ ] 프론트엔드 빌드 (`pnpm build`)
- [ ] 정적 파일 배포 (nginx 또는 CDN)
- [ ] `.env.production` 설정
- [ ] 각 서비스 배포 및 테스트
- [ ] 모니터링 및 로깅 설정

---

### 핵심 원칙

1. **프론트엔드 코드는 변경하지 않음**
   - 모든 단계에서 동일한 API 클라이언트 사용
   - 환경 변수만 변경하여 백엔드 전환

2. **API 스펙은 Zod 스키마로 정의**
   - MSW 단계에서 Zod로 API 인터페이스 명확히 정의
   - 백엔드 구현 시 동일한 스펙 준수

3. **점진적 확장**
   - 작은 규모에서 시작해 필요에 따라 확장
   - 각 단계에서 실제 운영 가능

4. **인프라만 교체**
   - 프론트엔드 로직은 그대로 유지
   - 백엔드 인프라만 단계별로 교체

---

## 전체 아키텍처 개요

### 시스템 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  src/api/client.ts                                   │  │
│  │  - 환경 변수 기반 API 모드 결정                       │  │
│  │  - Mock/Real 모드 자동 전환                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP Request
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌──────────────┐                  ┌──────────────────┐
│  MSW Mode    │                  │  Real Backend    │
│  (Mock)      │                  │  (FastAPI)       │
│              │                  │                  │
│  ┌────────┐  │                  │  ┌────────────┐  │
│  │ MSW    │  │                  │  │ FastAPI   │  │
│  │ Worker │  │                  │  │ Server    │  │
│  └────────┘  │                  │  └────────────┘  │
│              │                  │        │         │
│  - 메모리    │                  │        │         │
│    데이터    │                  │        ▼         │
│  - Zod 검증  │                  │  ┌────────────┐  │
│  - FastAPI   │                  │  │  Prisma    │  │
│    스타일    │                  │  │  ORM       │  │
│    응답      │                  │  └────────────┘  │
└──────────────┘                  │        │         │
                                  │        ▼         │
                                  │  ┌────────────┐  │
                                  │  │  Database  │  │
                                  │  │ (PostgreSQL│  │
                                  │  │  / MySQL)  │  │
                                  │  └────────────┘  │
                                  └──────────────────┘
```

### 요청 흐름

#### Mock 모드 (VITE_API_MODE=mock)
```
Frontend → API Client → MSW Worker → Mock Handlers → Zod 검증 → 응답
```

#### Real 모드 (VITE_API_MODE=real)
```
Frontend → API Client → Vite Proxy → FastAPI Backend → Prisma → Database → 응답
```

---

## 개발 워크플로우

### 단계별 개발 프로세스

#### 1단계: MSW로 프론트엔드 개발 (초기)
```
┌─────────────────────────────────────────────────────────┐
│ 목적: 백엔드 없이 프론트엔드 UI/UX 개발                  │
│                                                          │
│ 작업:                                                    │
│ 1. Zod 스키마로 API 인터페이스 정의                      │
│ 2. MSW 핸들러로 Mock API 구현                            │
│ 3. React Query 훅으로 데이터 페칭                       │
│ 4. UI 컴포넌트 개발 및 테스트                            │
└─────────────────────────────────────────────────────────┘
```

**설정:**
```bash
# .env
VITE_API_MODE=mock
```

**장점:**
- 백엔드 개발과 독립적으로 프론트엔드 개발 가능
- 빠른 프로토타이핑
- API 스펙을 Zod로 명확히 정의
- 실제 백엔드와 동일한 응답 형식 (FastAPI 스타일)

#### 2단계: 백엔드 개발 및 연동
```
┌─────────────────────────────────────────────────────────┐
│ 목적: 실제 백엔드 구현 및 프론트엔드와 연동              │
│                                                          │
│ 작업:                                                    │
│ 1. FastAPI 백엔드 프로젝트 생성                          │
│ 2. Prisma 스키마 작성 (Zod 스키마 기반)                  │
│ 3. FastAPI 라우트 구현                                   │
│ 4. 프록시 설정으로 프론트엔드와 연동                     │
│ 5. 환경 변수 변경으로 Real 모드 전환                     │
└─────────────────────────────────────────────────────────┘
```

**설정:**
```bash
# .env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000
```

**장점:**
- 프론트엔드 코드 변경 없이 백엔드 전환
- 점진적 마이그레이션 가능
- 개발/프로덕션 환경 분리

#### 3단계: 프로덕션 배포
```
┌─────────────────────────────────────────────────────────┐
│ 목적: 실제 서비스 배포                                    │
│                                                          │
│ 작업:                                                    │
│ 1. 백엔드 서버 배포                                       │
│ 2. 프론트엔드 빌드 (Real 모드)                           │
│ 3. 환경 변수 설정                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 프록시 설정

### Vite 프록시 구성

`vite.config.ts`에서 프록시 설정:

```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
      changeOrigin: true,
      // 백엔드가 /api prefix를 사용하지 않으면 주석 해제
      // rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### 프록시 동작 방식

#### Mock 모드
- 프록시 **비활성화**
- MSW Worker가 `/api/*` 요청을 가로채서 처리
- 실제 네트워크 요청 없음

#### Real 모드
- 프록시 **활성화**
- `/api/*` 요청을 `VITE_API_BASE_URL`로 전달
- CORS 문제 해결
- 개발 서버와 백엔드 서버 간 통신

### 프록시 설정 예시

#### 백엔드가 `/api` prefix 사용하는 경우
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```
- 요청: `http://localhost:3000/api/items`
- 프록시: `http://localhost:8000/api/items`

#### 백엔드가 prefix 없이 사용하는 경우
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```
- 요청: `http://localhost:3000/api/items`
- 프록시: `http://localhost:8000/items`

---

## MSW 모킹 단계

### 1. Zod 스키마 정의

`src/mocks/schemas.ts`에서 API 인터페이스 정의:

```typescript
export const ItemSchema = z.object({
  id: PositiveIntSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  created_at: DateTimeSchema,
  updated_at: DateTimeSchema,
})

export type Item = z.infer<typeof ItemSchema>
```

### 2. MSW 핸들러 구현

`src/mocks/handlers.ts`에서 Mock API 구현:

```typescript
http.get('/api/items', ({ request }) => {
  // Query 파라미터 파싱
  const url = new URL(request.url)
  const skip = parseInt(url.searchParams.get('skip') || '0')
  const limit = parseInt(url.searchParams.get('limit') || '100')

  // Mock 데이터 반환
  const response = {
    items: items.slice(skip, skip + limit),
    total: items.length,
    skip,
    limit,
  }

  // Zod 검증
  const validated = ItemsListResponseSchema.parse(response)
  return HttpResponse.json(validated)
})
```

### 3. API 클라이언트 사용

프론트엔드 코드는 동일하게 사용:

```typescript
// src/api/services/items.ts
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => apiClient.get<ItemsListResponse>('/api/items'),
  })
}
```

**Mock 모드에서:**
- MSW가 요청을 가로채서 Mock 핸들러 실행

**Real 모드에서:**
- 실제 백엔드로 요청 전송

---

## 백엔드 연동 단계

### 1. 백엔드 프로젝트 생성

`BACKEND_ROADMAP.md` 참고하여 FastAPI + Prisma 백엔드 구성

### 2. API 스펙 일치 확인

MSW에서 사용한 Zod 스키마와 FastAPI 응답 형식이 일치하는지 확인:

```python
# backend/models/item.py
class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    created_at: datetime
    updated_at: datetime
```

### 3. 환경 변수 변경

```bash
# .env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000
```

### 4. 백엔드 서버 실행

```bash
# 백엔드 디렉터리에서
uvicorn main:app --reload --port 8000
```

### 5. 프론트엔드 재시작

```bash
pnpm dev
```

이제 모든 API 요청이 실제 백엔드로 전송됩니다.

---

## 환경 변수 설정

### 개발 환경 (.env.development)

```bash
# Mock 모드 (초기 개발)
VITE_API_MODE=mock
VITE_API_BASE_URL=http://localhost:8000

# Real 모드 (백엔드 연동 후)
# VITE_API_MODE=real
# VITE_API_BASE_URL=http://localhost:8000
```

### 프로덕션 환경 (.env.production)

```bash
VITE_API_MODE=real
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 환경 변수 로드 순서

1. `.env` (모든 환경)
2. `.env.local` (로컬, gitignore)
3. `.env.[mode]` (모드별)
4. `.env.[mode].local` (모드별 로컬)

---

## 트러블슈팅

### 문제: MSW가 요청을 가로채지 않음

**원인:**
- Service Worker가 제대로 등록되지 않음
- `VITE_API_MODE=mock`이 설정되지 않음

**해결:**
1. 브라우저 DevTools → Application → Service Workers 확인
2. `.env` 파일에서 `VITE_API_MODE=mock` 확인
3. 개발 서버 재시작

### 문제: CORS 에러 발생

**원인:**
- Real 모드에서 프록시가 제대로 동작하지 않음
- 백엔드 CORS 설정 문제

**해결:**
1. `vite.config.ts`의 프록시 설정 확인
2. 백엔드 CORS 미들웨어 설정 확인
3. 개발 서버 재시작

### 문제: 프록시가 404 반환

**원인:**
- 백엔드 서버가 실행되지 않음
- `VITE_API_BASE_URL`이 잘못 설정됨

**해결:**
1. 백엔드 서버 실행 확인
2. `VITE_API_BASE_URL` 값 확인
3. 네트워크 탭에서 실제 요청 URL 확인

### 문제: Mock과 Real 모드 간 응답 형식 불일치

**원인:**
- MSW 핸들러와 FastAPI 응답 형식이 다름

**해결:**
1. Zod 스키마를 기준으로 양쪽 모두 검증
2. FastAPI 응답 모델이 Zod 스키마와 일치하는지 확인
3. `API_INTEGRATION.md`의 스펙 문서 참고

---

## 모드 전환 체크리스트

### Mock → Real 전환 시

- [ ] 백엔드 서버 실행 확인
- [ ] `.env`에서 `VITE_API_MODE=real` 설정
- [ ] `VITE_API_BASE_URL` 올바르게 설정
- [ ] 프록시 설정 확인 (`vite.config.ts`)
- [ ] 개발 서버 재시작
- [ ] 네트워크 탭에서 실제 백엔드 요청 확인
- [ ] API 응답 형식 일치 확인

### Real → Mock 전환 시

- [ ] `.env`에서 `VITE_API_MODE=mock` 설정
- [ ] 개발 서버 재시작
- [ ] MSW Worker 등록 확인 (DevTools)
- [ ] Mock 핸들러가 요청을 처리하는지 확인

---

## 참고 문서

- [API 통합 가이드](./API_INTEGRATION.md) - API 클라이언트 사용법
- [백엔드 로드맵](./BACKEND_ROADMAP.md) - FastAPI + Prisma 설정
- [기능 로드맵](./FEATURES_ROADMAP.md) - 전체 기능 진행 상황

