# 기능 로드맵 및 진행 상황

이 문서는 템플릿의 핵심 기능 구현 현황과 작업 리스트를 추적합니다.

---

## 📋 목차

1. [타입 안전한 API 계층](#1-타입-안전한-api-계층)
2. [상태 관리](#2-상태-관리)
3. [라우팅](#3-라우팅)
4. [스타일링](#4-스타일링)
5. [개발 도구](#5-개발-도구)
6. [다국어 지원 (i18n)](#6-다국어-지원-i18n)
7. [PWA 지원](#7-pwa-지원)
8. [Tauri 통합 준비](#8-tauri-통합-준비)

---

## 1. 타입 안전한 API 계층

### 작업 리스트

#### Zod 스키마 기반 검증
- [x] Zod 스키마 정의 (`src/mocks/schemas.ts`)
- [x] Request/Response 타입 추론 (`z.infer`)
- [x] 기본 스키마 (DateTime, PositiveInt 등)
- [x] Item 스키마 (Create, Update, Response)
- [x] User 스키마 (Create, Response)
- [x] Auth 스키마 (Login Request/Response)
- [x] Error 스키마 (HTTPError, ValidationError)
- [x] Query Parameters 스키마 (Pagination, Filter)

#### MSW 모킹
- [x] MSW 설치 및 설정
- [x] Browser Worker 설정 (`src/mocks/browser.ts`)
- [x] Request Handlers 구현 (`src/mocks/handlers.ts`)
- [x] FastAPI 스타일 에러 응답 포맷팅
- [x] Zod 검증 통합 (요청/응답 모두 검증)
- [x] Mock 데이터 저장소 (메모리 기반)

#### 환경별 전환
- [x] API 모드 설정 (`src/api/config.ts`)
- [x] `VITE_API_MODE` 환경 변수 지원
- [x] Mock/Real 모드 전환 로직
- [x] `API_INTEGRATION.md` 문서화

#### React Query 통합
- [x] React Query 설치 및 설정
- [x] QueryClient 설정 (`src/lib/query-client.ts`)
- [x] QueryClientProvider 설정 (`src/main.tsx`)
- [x] React Query DevTools 통합
- [x] API 서비스 훅 구현 (`src/api/services/**`)
- [x] 캐싱, 리프레시, 에러 핸들링 자동화

#### API 클라이언트
- [x] Fetch wrapper 구현 (`src/api/client.ts`)
- [x] 타입 안전한 HTTP 메서드 (GET, POST, PUT, DELETE)
- [x] 자동 Base URL 추가
- [x] 에러 핸들링

#### MSW → 백엔드 전환 프로세스
- [x] Vite 프록시 설정 (`vite.config.ts`)
- [x] 환경 변수 기반 모드 전환
- [x] Mock/Real 모드 자동 스위칭
- [x] 프록시를 통한 CORS 해결
- [x] 개발 워크플로우 문서화 (`SERVICE_ARCHITECTURE.md`)
- [x] MSW → 백엔드 전환 체크리스트

**진행률: 100% ✅**

---

## 2. 상태 관리

### 작업 리스트

#### Zustand Slice 패턴
- [x] Zustand 설치 및 설정
- [x] Slice 패턴 구조 (`src/stores/slices/**`)
- [x] ApiSlice 구현
- [x] UiSlice 구현
- [x] TaskSlice 구현
- [x] WorkflowSlice 구현
- [x] Store 통합 (`src/stores/index.ts`)

#### 타입 안전성
- [x] TypeScript 타입 정의
- [x] 완전한 타입 추론
- [x] Selector hooks (`useStore` 기반)

#### 상태 지속성
- [x] Zustand Persist 미들웨어 통합
- [x] LocalStorage 저장 (UI 설정만)
- [x] DevTools 통합 (개발 모드)

**진행률: 100% ✅**

---

## 3. 라우팅

### 작업 리스트

#### 파일 기반 라우팅
- [x] TanStack Router 설치 및 설정
- [x] 파일 기반 라우트 구조 (`src/routes/**`)
- [x] 자동 라우트 트리 생성 (`routeTree.gen.ts`)
- [x] Router Plugin 설정 (`vite.config.ts`)

#### 코드 스플릿
- [x] 자동 코드 분할 활성화
- [x] Lazy loading 지원

#### 타입 안전 네비게이션
- [x] Router 타입 등록
- [x] 타입 안전 Link 컴포넌트
- [x] 타입 안전 네비게이션 함수

#### 라우터 기능
- [x] Scroll restoration
- [x] Preload 설정 (intent 기반)
- [x] Structural sharing
- [x] Router DevTools 통합

**진행률: 100% ✅**

---

## 4. 스타일링

### 작업 리스트

#### Tailwind CSS v4
- [x] Tailwind CSS v4 설치
- [x] Vite 플러그인 통합
- [x] 전역 스타일 설정 (`src/styles.css`)
- [x] 유틸리티 함수 (`src/lib/utils.ts` - `cn()`)

#### shadcn/ui
- [x] shadcn/ui 설정 (`components.json`)
- [x] 컴포넌트 설치 방법 문서화
- [x] CVA (class-variance-authority) 통합

#### 아이콘
- [x] Lucide React 설치
- [x] 아이콘 사용 예시

#### 반응형 디자인
- [x] 모바일 우선 접근 방식
- [x] Viewport 메타 태그 설정

**진행률: 100% ✅**

---

## 5. 개발 도구

### 작업 리스트

#### TanStack DevTools
- [x] Router DevTools 설치 및 통합
- [x] Query DevTools 설치 및 통합
- [x] 개발 모드에서만 활성화

#### 테스트 환경
- [x] Vitest 설치 및 설정
- [x] Testing Library 설치
- [x] jsdom 설정
- [x] 테스트 스크립트 설정

#### TypeScript
- [x] TypeScript 5.7 설정
- [x] 엄격한 타입 체크
- [x] 빌드 시 타입 체크 (`pnpm build`)

#### 성능 모니터링
- [x] Web Vitals 통합 (`reportWebVitals.ts`)

**진행률: 100% ✅**

---

## 6. 다국어 지원 (i18n)

### 작업 리스트

#### 기본 구조
- [x] 언어 상태 관리 (Zustand UiSlice)
- [x] 언어 타입 정의 (`'en' | 'ko' | 'ja'`)
- [x] 언어 변경 함수 (`setLanguage`)
- [x] HTML lang 속성 업데이트
- [ ] i18n 라이브러리 선택 및 설치 (react-i18next 권장)
- [ ] 번역 파일 구조 설계 (`src/locales/**`)
- [ ] 번역 파일 생성 (en, ko, ja)

#### 타입 안전 번역
- [ ] 번역 키 타입 정의
- [ ] TypeScript 타입 생성 도구 설정
- [ ] 번역 키 자동완성 지원

#### 동적 언어 로딩
- [ ] 언어별 번들 분리
- [ ] 필요 시에만 번역 파일 로드
- [ ] 언어 변경 시 번역 파일 교체

#### i18n 통합
- [ ] i18n Provider 설정
- [ ] 번역 훅 구현 (`useTranslation`)
- [ ] Zustand 언어 상태와 i18n 동기화
- [ ] 언어 선택 UI 컴포넌트
- [ ] 브라우저 언어 자동 감지
- [ ] 언어 설정 LocalStorage 저장

#### 고급 기능
- [ ] 복수형 처리
- [ ] 날짜/시간 포맷팅
- [ ] 숫자 포맷팅
- [ ] RTL 언어 지원 (선택사항)

**진행률: 20% 🚧**

---

## 7. PWA 지원

### 작업 리스트

#### Web App Manifest
- [x] 기본 manifest.json 파일 (`public/manifest.json`)
- [ ] Manifest 내용 커스터마이징 (앱 이름, 설명 등)
- [ ] 다양한 크기의 아이콘 생성 (192x192, 512x512 등)
- [ ] 아이콘 파일 추가
- [ ] Theme color 설정
- [ ] Background color 설정
- [ ] Display mode 설정 (standalone, fullscreen 등)

#### Service Worker
- [ ] Vite PWA 플러그인 설치 (`vite-plugin-pwa`)
- [ ] Service Worker 자동 생성 설정
- [ ] 오프라인 지원 전략 설계
- [ ] 캐싱 전략 구현 (Cache First, Network First 등)
- [ ] 정적 자산 캐싱
- [ ] API 응답 캐싱 (선택사항)
- [ ] Service Worker 업데이트 전략

#### 오프라인 폴백
- [ ] 오프라인 페이지 생성
- [ ] 네트워크 오류 감지
- [ ] 오프라인 상태 UI 표시
- [ ] 오프라인에서도 기본 기능 동작

#### PWA 기능
- [ ] 설치 프롬프트 처리
- [ ] 설치 상태 감지
- [ ] 설치 버튼 UI
- [ ] 업데이트 알림
- [ ] 백그라운드 동기화 (선택사항)

#### 빌드 설정
- [ ] PWA 플러그인 Vite 설정 통합
- [ ] 프로덕션 빌드 시 Service Worker 생성 확인
- [ ] Manifest 파일 빌드 확인

**진행률: 10% 🚧**

---

## 8. Tauri 통합 준비

### 작업 리스트

#### Tauri 기본 설정
- [ ] Tauri CLI 설치
- [ ] Tauri 프로젝트 초기화 (`pnpm create tauri-app`)
- [ ] Tauri 설정 파일 생성 (`src-tauri/tauri.conf.json`)
- [ ] Rust 도구 체인 설정 확인

#### RPC 기반 통합
- [ ] Tauri RPC 타입 정의 구조 설계
- [ ] 프론트엔드 RPC 클라이언트 구현 (`src/lib/tauri-rpc.ts`)
- [ ] 타입 안전 RPC 래퍼 함수 생성
- [ ] 에러 핸들링 구조 설계

#### 타입 안전 RPC
- [ ] TypeScript 타입 정의
- [ ] Rust 백엔드 타입과 동기화 방법 설계
- [ ] RPC 메서드 타입 생성 도구 (선택사항)
- [ ] Request/Response 타입 검증

#### 네이티브 기능 접근
- [ ] 파일 시스템 API 래퍼 (`src/lib/tauri/fs.ts`)
- [ ] 시스템 정보 API 래퍼 (`src/lib/tauri/system.ts`)
- [ ] 다이얼로그 API 래퍼 (`src/lib/tauri/dialog.ts`)
- [ ] 윈도우 관리 API 래퍼 (`src/lib/tauri/window.ts`)
- [ ] 알림 API 래퍼 (`src/lib/tauri/notification.ts`)

#### Rust 백엔드 구조
- [ ] Rust 프로젝트 구조 설계 (`src-tauri/src/**`)
- [ ] Command 핸들러 구현 예시
- [ ] 에러 처리 구조
- [ ] 상태 관리 (AppState)

#### 빌드 및 배포
- [ ] 개발 모드 실행 설정
- [ ] 프로덕션 빌드 설정
- [ ] 크로스 플랫폼 빌드 (Windows, macOS, Linux)
- [ ] 코드 서명 설정 (선택사항)

#### 통합 테스트
- [ ] Tauri + React 통합 테스트
- [ ] RPC 호출 테스트
- [ ] 네이티브 기능 테스트

#### 문서화
- [ ] Tauri 설정 가이드 작성
- [ ] RPC 사용 예시 문서화
- [ ] 네이티브 API 사용 가이드

**진행률: 0% 📝**

---

## 전체 진행률 요약

| 기능 | 진행률 | 상태 |
|------|--------|------|
| 타입 안전한 API 계층 | 100% | ✅ 완료 |
| 상태 관리 | 100% | ✅ 완료 |
| 라우팅 | 100% | ✅ 완료 |
| 스타일링 | 100% | ✅ 완료 |
| 개발 도구 | 100% | ✅ 완료 |
| 다국어 지원 (i18n) | 20% | 🚧 진행 중 |
| PWA 지원 | 10% | 🚧 진행 중 |
| Tauri 통합 준비 | 0% | 📝 계획 중 |

**전체 진행률: 66.25%**

---

## 다음 단계 우선순위

1. **다국어 지원 (i18n)** - 기본 구조는 있으나 실제 번역 시스템 필요
2. **PWA 지원** - Manifest는 있으나 Service Worker 및 오프라인 기능 필요
3. **Tauri 통합** - 완전히 새로운 기능, 데스크톱 앱 지원을 위해 필요

---

## 참고 문서

- [API 통합 가이드](./API_INTEGRATION.md) - API 클라이언트 사용법
- [백엔드 로드맵](./BACKEND_ROADMAP.md) - FastAPI + Prisma 설정
- [서비스 아키텍처](./SERVICE_ARCHITECTURE.md) - 프록시, MSW → 백엔드 전환 프로세스
- [README](./README.md) - 프로젝트 개요

