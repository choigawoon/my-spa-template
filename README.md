## Overview

이 저장소는 **React 19 + TanStack Router + Tailwind v4 + shadcn/ui** 조합으로 구성된 프론트엔드 보일러플레이트입니다. 빠르게 복제하여 새 프로젝트 UI를 구축하고, GitHub Template로 배포해 재사용하는 것을 목표로 합니다.

## 주요 특징
- 최신 React 19, Vite 7, TypeScript 5.7 환경
- TanStack Router 기반 파일 라우팅과 자동 코드 스플릿
- Tailwind v4 + shadcn/ui 조합, Lucide 아이콘, 유틸리티 함수 포함
- React Query, Zustand, Zod, MSW를 활용한 타입 안전 API 계층
- **단계별 확장 가능**: MSW 모킹 → 단일 백엔드 → MSA 구조로 점진적 확장
- 프론트엔드 코드 변경 없이 환경 변수만으로 백엔드 전환
- `API_INTEGRATION.md`로 모킹↔실서버 전환, `BACKEND_ROADMAP.md`로 FastAPI+Prisma 확장 계획 정리

## 핵심 기능

### ✅ 현재 구현된 기능

#### 1. 타입 안전한 API 계층
- **Zod 스키마 기반 검증**: Request/Response 타입을 Zod로 정의하고 TypeScript 타입으로 추론
- **MSW 모킹**: 개발 환경에서 실제 백엔드 없이 API 테스트 가능
- **환경별 전환**: `VITE_API_MODE`로 mock/real 모드 전환 (`API_INTEGRATION.md` 참고)
- **React Query 통합**: 캐싱, 리프레시, 에러 핸들링 자동화

#### 2. 상태 관리
- **Zustand Slice 패턴**: 모듈화된 상태 관리 (`src/stores/slices/**`)
- **타입 안전성**: TypeScript로 완전한 타입 추론

#### 3. 라우팅
- **파일 기반 라우팅**: `src/routes/**` 디렉터리 구조로 자동 라우트 생성
- **코드 스플릿**: 자동 코드 분할로 최적화된 번들 크기
- **타입 안전 네비게이션**: TanStack Router의 타입 안전 링크와 네비게이션

#### 4. 스타일링
- **Tailwind CSS v4**: 최신 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 복사 가능한 컴포넌트 라이브러리
- **반응형 디자인**: 모바일 우선 접근 방식

#### 5. 개발 도구
- **TanStack DevTools**: Router, Query 디버깅 도구
- **Vitest**: 빠른 단위 테스트 환경
- **TypeScript**: 엄격한 타입 체크

### 🚧 추가 예정 기능

#### 6. 다국어 지원 (i18n)
- **다국어 처리 기반**: 언어 전환 및 번역 파일 관리 구조
- **타입 안전 번역**: 번역 키의 타입 체크 지원
- **동적 언어 로딩**: 필요한 언어만 로드하여 번들 크기 최적화

#### 7. PWA 지원
- **Service Worker**: 오프라인 지원 및 캐싱 전략
- **Web App Manifest**: 설치 가능한 앱으로 변환
- **오프라인 폴백**: 네트워크 오류 시 기본 페이지 제공
- **앱 아이콘**: 다양한 크기의 아이콘 세트

#### 8. Tauri 통합 준비
- **RPC 기반 통합**: Tauri의 invoke 시스템과 통합할 수 있는 구조
- **타입 안전 RPC**: 프론트엔드-백엔드 간 타입 안전 통신
- **네이티브 기능 접근**: 파일 시스템, 시스템 정보 등 네이티브 API 래퍼
- **크로스 플랫폼**: Windows, macOS, Linux 데스크톱 앱 빌드 지원

## Getting Started
```bash
pnpm install
pnpm dev            # http://localhost:3000
```

### Scripts
- `pnpm dev` : 개발 서버
- `pnpm build` : 프로덕션 빌드 + 타입체크
- `pnpm serve` : 빌드 결과 확인
- `pnpm test` : Vitest

## Frontend Stack
- **Routing**: `src/routes/**` 파일 기반 + `routeTree.gen.ts`
- **State**: Zustand slice 패턴 (`src/stores/**`)
- **API**: Fetch wrapper & React Query (`src/api/**`)
- **Mock**: MSW + Zod 검증 (`src/mocks/**`)
- **Styling**: Tailwind v4, shadcn/ui
  ```bash
  pnpx shadcn@latest add button
  ```

## Backend 계획
- FastAPI + Prisma(py) 기반 백엔드로 확장 예정
- **Prisma 스키마를 단일 소스로 사용**: 실제 DB 없이도 Prisma 스키마 → Zod 자동 생성 → MSW 목업 가능
- Prisma schema를 단일 소스로 사용해 Zod/Pydantic 스키마를 동기화
- 상세 절차는 `BACKEND_ROADMAP.md` 참고

## 기능 로드맵
- 현재 구현 상태와 작업 리스트는 `FEATURES_ROADMAP.md` 참고
- 각 기능별 진행률과 체크리스트 제공

## 단계별 확장 가능성 ⭐

이 템플릿의 핵심 가치는 **프론트엔드 코드 변경 없이 단계별로 확장 가능**하다는 점입니다:

1. **Stage 1: MSW 모킹** - 백엔드 없이 풀스택처럼 개발
   - Prisma 스키마 작성 → Zod 자동 생성 → MSW 목업
   - 실제 데이터베이스 설정 불필요
   - Prisma 모델 스펙으로 타입 안전한 개발
   - 빠른 프로토타이핑

2. **Stage 2: 단일 백엔드 + DB** - 실제 백엔드로 전환
   - FastAPI + Prisma + Database
   - Vite 프록시로 CORS 해결
   - 환경 변수만 변경하여 전환

3. **Stage 3: MSA 구조** - nginx 리버스 프록시로 확장
   - 여러 마이크로서비스로 분리
   - nginx로 라우팅 및 로드 밸런싱
   - 프론트엔드 코드는 그대로 유지

**상세 가이드:** [`SERVICE_ARCHITECTURE.md`](./SERVICE_ARCHITECTURE.md) 참고

## GitHub Template로 사용하기
1. Settings → Template repository 활성화
2. 새 프로젝트에서 “Use this template” 선택
3. `.env.example` 복사 후 `VITE_API_MODE`, `VITE_API_BASE_URL` 설정
4. 필요 시 백엔드 디렉터리 추가 (`BACKEND_ROADMAP.md` 가이드)

---

아이디어나 개선 사항은 Issues에 남겨 주세요. Template로 복제 후 프로젝트 목적에 맞게 README를 수정해도 좋습니다.
