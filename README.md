## Overview

이 저장소는 **React 19 + TanStack Router + Tailwind v4 + shadcn/ui** 조합으로 구성된 프론트엔드 보일러플레이트입니다. 빠르게 복제하여 새 프로젝트 UI를 구축하고, GitHub Template로 배포해 재사용하는 것을 목표로 합니다.

## 주요 특징
- 최신 React 19, Vite 7, TypeScript 5.7 환경
- TanStack Router 기반 파일 라우팅과 자동 코드 스플릿
- Tailwind v4 + shadcn/ui 조합, Lucide 아이콘, 유틸리티 함수 포함
- React Query, Zustand, Zod, MSW를 활용한 타입 안전 API 계층
- `API_INTEGRATION.md`로 모킹↔실서버 전환, `BACKEND_ROADMAP.md`로 FastAPI+Prisma 확장 계획 정리

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
- Prisma schema를 단일 소스로 사용해 Zod/Pydantic 스키마를 동기화
- 상세 절차는 `BACKEND_ROADMAP.md` 참고

## GitHub Template로 사용하기
1. Settings → Template repository 활성화
2. 새 프로젝트에서 “Use this template” 선택
3. `.env.example` 복사 후 `VITE_API_MODE`, `VITE_API_BASE_URL` 설정
4. 필요 시 백엔드 디렉터리 추가 (`BACKEND_ROADMAP.md` 가이드)

---

아이디어나 개선 사항은 Issues에 남겨 주세요. Template로 복제 후 프로젝트 목적에 맞게 README를 수정해도 좋습니다.
