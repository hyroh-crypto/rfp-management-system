# Phase 2: Coding Convention - 완료

> 제안요청서 관리 시스템 코딩 컨벤션 정의

## 📋 Phase 2 개요

**목표**: 일관된 코드 스타일을 유지하고 AI와의 협업 규칙을 명확히 정의

**완료일**: 2026-02-11

## 📁 산출물

| 문서 | 설명 | 위치 | 상태 |
|------|------|------|------|
| CONVENTIONS.md | 전체 코딩 컨벤션 | 프로젝트 루트 | ✅ 완료 |
| .env.example | 환경 변수 템플릿 | 프로젝트 루트 | ✅ 완료 |
| naming.md | 네이밍 규칙 상세 | docs/01-plan/ | ✅ 완료 |
| structure.md | 구조 규칙 상세 | docs/01-plan/ | ✅ 완료 |

## 🎯 정의된 주요 규칙

### 1. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `RfpList`, `ProposalCard` |
| 함수/변수 | camelCase | `getRfpById`, `isApproved` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| 타입 | PascalCase | `User`, `RfpStatus` |
| 파일 (컴포넌트) | PascalCase | `RfpCard.tsx` |
| 파일 (유틸) | kebab-case | `api-client.ts` |
| 폴더 | kebab-case | `use-cases/` |

### 2. 폴더 구조

```
src/
├── app/                    # Next.js App Router
├── components/            # 공용 컴포넌트
├── features/              # 기능별 모듈
│   ├── rfp/
│   ├── proposal/
│   ├── prototype/
│   └── client/
├── hooks/                 # 전역 훅
├── lib/                   # 유틸리티
├── types/                 # 타입 정의
└── constants/             # 상수
```

### 3. Clean Architecture

4계층 아키텍처 적용:
- **Presentation** (app/, components/) → UI
- **Application** (features/*/services/) → 비즈니스 로직
- **Domain** (types/, constants/) → 도메인 규칙
- **Infrastructure** (lib/api/, lib/db/) → 외부 연동

### 4. 환경 변수 네이밍

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_` | 클라이언트 노출 | `NEXT_PUBLIC_API_URL` |
| `DB_` | 데이터베이스 | `DB_HOST`, `DB_PASSWORD` |
| `API_` | 외부 API | `API_OPENAI_KEY` |
| `AUTH_` | 인증 | `AUTH_SECRET` |

## ✅ Phase 2 체크리스트

- [x] 네이밍 규칙 정의 (컴포넌트, 함수, 변수, 상수)
- [x] 파일/폴더 구조 설계
- [x] Clean Architecture 계층 정의
- [x] 환경 변수 컨벤션 정의
- [x] Import 규칙 정의
- [x] 코드 스타일 규칙 (Prettier 기준)
- [x] 타입스크립트 규칙
- [x] React 컴포넌트 규칙
- [x] API 클라이언트 규칙
- [x] 에러 처리 규칙

## 🎁 핵심 성과

### 1. AI 친화적 컨벤션
- AI가 코드 생성 시 참조할 명확한 규칙
- CONVENTIONS.md에 모든 규칙 문서화
- 예시 코드로 이해도 향상

### 2. 확장 가능한 구조
- Feature 기반 모듈화
- Clean Architecture 적용
- 독립적인 도메인 모듈

### 3. 보안 고려
- 환경 변수 분리 (.env.example, .env.local)
- 클라이언트 노출 변수 명확히 구분 (NEXT_PUBLIC_)
- Secrets 관리 가이드

### 4. 개발 생산성
- 절대 경로 import (@/)
- 일관된 폴더 구조
- 재사용 가능한 패턴

## 📊 정의된 패턴 수

- **네이밍 패턴**: 15개
- **폴더 구조**: 3계층
- **아키텍처 레이어**: 4계층
- **환경 변수 카테고리**: 10개
- **코드 스타일 규칙**: 20개+

## 🎯 다음 단계: Phase 3

Phase 2가 완료되었습니다!

**다음**: Phase 3 - Mockup Development

Phase 3에서는:
- HTML/CSS/JS로 목업 제작
- 기능 검증 및 사용자 피드백
- UI/UX 프로토타입

등을 진행합니다.

## 📚 참고 문서

- [Phase 1: Schema & Terminology](./README.md)
- [CONVENTIONS.md](../../CONVENTIONS.md)
- [.env.example](../../.env.example)

---

**프로젝트**: 제안요청서 관리 시스템
**Phase**: 2 - Coding Convention
**버전**: 1.0.0
**작성일**: 2026-02-11
