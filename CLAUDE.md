# RFP Management System - Claude Code Instructions

## 📋 프로젝트 개요

**프로젝트명**: RFP Management System
**레벨**: Dynamic (풀스택 웹앱)
**기술 스택**: Next.js 15 + TypeScript + Tailwind CSS + Supabase
**목적**: 제안요청서(RFP) 접수 → AI 분석 → 제안서 작성 → UI 프로토타입 생성

## 🎯 핵심 기능

1. **RFP 관리**: 제안요청서 접수, 분석, 상태 관리
2. **AI 분석**: RFP 요구사항 자동 분석 및 위험도 평가
3. **제안서 생성**: AI 기반 제안서 자동 생성 및 편집
4. **UI 프로토타입**: 와이어프레임 및 Figma 프로토타입 관리

## 📂 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 메인 대시보드
│   ├── layout.tsx
│   └── page.tsx
├── components/             # UI 컴포넌트
│   └── ui/                # 기본 UI 컴포넌트
├── features/               # 기능별 모듈
│   ├── rfp/               # RFP 관련
│   ├── proposal/          # 제안서 관련
│   └── prototype/         # UI 프로토타입 관련
├── hooks/                  # Custom Hooks
├── lib/                    # 유틸리티
│   ├── supabase.ts        # Supabase 클라이언트
│   └── utils.ts
├── services/               # API 서비스 레이어
├── stores/                 # 상태 관리 (Zustand)
└── types/                  # TypeScript 타입 정의

docs/                       # PDCA 문서
├── 01-plan/               # 계획 문서
├── 02-design/             # 설계 문서
├── 03-analysis/           # 분석 문서
└── 04-report/             # 보고서
```

## 🔑 환경 변수

```bash
# .env.local에 설정 필요
NEXT_PUBLIC_SUPABASE_URL=https://tqkwnbcydlheutkbzeah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI 서비스 (향후 추가)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4-turbo-preview
```

## 📖 컨벤션 및 규칙

**상세 규칙**: `CONVENTIONS.md` 참조
**용어 정의**: `docs/01-plan/glossary.md` 참조
**데이터 스키마**: `docs/01-plan/schema.md` 참조

### 핵심 컨벤션

1. **명명 규칙**
   - 컴포넌트: PascalCase (`RfpCard.tsx`)
   - 함수: camelCase (`getRfpList`)
   - 상수: UPPER_SNAKE_CASE (`STATUS_MAP`)
   - 파일: kebab-case (`rfp-list.tsx`)

2. **Import 순서**
   ```typescript
   // 1. React/Next.js
   import { useState } from 'react';
   import Link from 'next/link';

   // 2. 외부 라이브러리
   import { useQuery } from '@tanstack/react-query';

   // 3. 내부 모듈
   import { Button } from '@/components/ui/button';
   import { rfpService } from '@/services/rfp.service';

   // 4. 타입
   import type { RFP } from '@/types';
   ```

3. **API 호출 패턴**
   ```
   Component → Hook → Service → bkend Client
   ```

## 🏗️ 개발 가이드라인

### Dynamic 레벨 특화 사항

1. **백엔드**: bkend.ai BaaS 사용
   - 데이터베이스: MongoDB (자동 관리)
   - 인증: JWT (Access 1h, Refresh 7d)
   - 파일 스토리지: bkend.ai Storage

2. **상태 관리**
   - 서버 상태: TanStack Query
   - 클라이언트 상태: Zustand
   - 폼 상태: React Hook Form

3. **스타일링**
   - Tailwind CSS + CSS Variables
   - Dark Mode First
   - Glassmorphism 효과

## 🚀 개발 워크플로우

1. **Phase 1-3 완료**: 스키마, 컨벤션, 목업 ✅
2. **Phase 4**: bkend.ai 테이블 생성 및 API 연동 (진행 중)
3. **Phase 5**: Design System 구축 (예정)
4. **Phase 6**: UI 구현 및 API 통합 (예정)
5. **Phase 7-9**: SEO/보안, 리뷰, 배포 (예정)

## 📝 작업 시 주의사항

### ✅ DO

- 모든 API 호출은 `src/services/` 계층을 통해 수행
- 컴포넌트는 재사용 가능하게 설계
- TypeScript 타입을 명시적으로 정의
- 에러 처리는 글로벌 에러 핸들러 사용
- PDCA 문서를 항상 최신 상태로 유지

### ❌ DON'T

- 컴포넌트에서 직접 `fetch` 호출 금지
- 하드코딩된 값 사용 금지 (상수로 분리)
- `any` 타입 남발 금지
- 중복 코드 작성 금지 (재사용 고려)

## 🔗 참조 문서

- **Glossary**: `docs/01-plan/glossary.md`
- **Schema**: `docs/01-plan/schema.md`
- **Conventions**: `CONVENTIONS.md`
- **API Spec**: `docs/02-design/api-spec.md`
- **Mockup Spec**: `docs/02-design/mockup-spec.md`

## 🤖 AI 에이전트 활용

- **bkend-expert**: bkend.ai 통합 및 BaaS 기능 구현 시
- **gap-detector**: 설계-구현 갭 분석 시
- **pdca-iterator**: 자동 개선 반복 시
- **code-analyzer**: 코드 품질 검증 시

---

**Last Updated**: 2026-02-11
**Current Phase**: Phase 4 (API Design/Implementation)
