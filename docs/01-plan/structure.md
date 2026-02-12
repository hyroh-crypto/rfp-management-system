# 구조 규칙 (Structure Conventions)

> RFP Management System 폴더 구조 및 아키텍처 규칙

**버전**: 1.0.0
**작성일**: 2026-02-11

---

## 📋 목차

1. [전체 프로젝트 구조](#1-전체-프로젝트-구조)
2. [src/ 디렉토리 구조](#2-src-디렉토리-구조)
3. [Feature 모듈 구조](#3-feature-모듈-구조)
4. [Clean Architecture 적용](#4-clean-architecture-적용)
5. [파일 구성 규칙](#5-파일-구성-규칙)
6. [Import 경로 규칙](#6-import-경로-규칙)

---

## 1. 전체 프로젝트 구조

```
rfp-management/
├── .next/                      # Next.js 빌드 출력 (Git 제외)
├── node_modules/               # 의존성 (Git 제외)
│
├── public/                     # 정적 파일
│   ├── images/                # 이미지
│   │   ├── logos/
│   │   └── placeholders/
│   ├── icons/                 # 아이콘
│   └── uploads/               # 로컬 업로드 파일 (개발용)
│
├── src/                        # 소스 코드 (상세는 아래)
│
├── docs/                       # 프로젝트 문서
│   ├── 01-plan/               # Phase 1: 계획
│   │   ├── glossary.md
│   │   ├── schema.md
│   │   ├── domain-model.md
│   │   ├── naming.md
│   │   ├── structure.md
│   │   └── README.md
│   ├── 02-design/             # Phase 2: 설계 (추후 생성)
│   ├── 03-analysis/           # Phase 3: 분석 (추후 생성)
│   └── 04-report/             # Phase 4: 보고 (추후 생성)
│
├── .env.example               # 환경 변수 템플릿
├── .env.local                 # 로컬 환경 변수 (Git 제외)
├── .gitignore
├── CONVENTIONS.md             # 코딩 컨벤션
├── README.md                  # 프로젝트 README
│
├── next.config.js             # Next.js 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
├── package.json
└── package-lock.json
```

---

## 2. src/ 디렉토리 구조

```
src/
├── app/                        # Next.js 14 App Router
│   ├── (auth)/                # 인증 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx         # 인증 레이아웃
│   │
│   ├── (dashboard)/           # 대시보드 라우트 그룹
│   │   ├── rfps/
│   │   │   ├── page.tsx       # RFP 목록
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # RFP 상세
│   │   │       └── analyze/
│   │   │           └── page.tsx
│   │   ├── proposals/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── layout.tsx         # 대시보드 레이아웃
│   │
│   ├── api/                   # API 라우트
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── signup/
│   │   │       └── route.ts
│   │   ├── rfps/
│   │   │   ├── route.ts       # GET /api/rfps, POST /api/rfps
│   │   │   └── [id]/
│   │   │       ├── route.ts   # GET, PUT, DELETE /api/rfps/:id
│   │   │       └── analyze/
│   │   │           └── route.ts
│   │   ├── proposals/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── sections/
│   │   │       │   └── route.ts
│   │   │       └── generate/
│   │   │           └── route.ts
│   │   └── ai/
│   │       ├── analyze/
│   │       │   └── route.ts
│   │       └── generate/
│   │           └── route.ts
│   │
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈 페이지
│   └── globals.css            # 글로벌 스타일
│
├── components/                # 공용 컴포넌트
│   ├── ui/                    # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   └── shared/                # 프로젝트 공유 컴포넌트
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── features/                  # 기능별 모듈 (도메인 중심)
│   ├── rfp/
│   │   ├── components/       # RFP 전용 컴포넌트
│   │   │   ├── RfpList.tsx
│   │   │   ├── RfpCard.tsx
│   │   │   ├── RfpDetailPanel.tsx
│   │   │   ├── RfpAnalysisPanel.tsx
│   │   │   ├── RfpStatusBadge.tsx
│   │   │   └── RfpFilters.tsx
│   │   ├── hooks/            # RFP 전용 훅
│   │   │   ├── useRfps.ts
│   │   │   ├── useRfp.ts
│   │   │   ├── useRfpAnalysis.ts
│   │   │   └── useCreateRfp.ts
│   │   └── services/         # RFP 비즈니스 로직
│   │       └── rfp.service.ts
│   │
│   ├── proposal/
│   │   ├── components/
│   │   │   ├── ProposalList.tsx
│   │   │   ├── ProposalCard.tsx
│   │   │   ├── ProposalEditor.tsx
│   │   │   ├── ProposalSectionList.tsx
│   │   │   ├── ProposalReviewPanel.tsx
│   │   │   └── ProposalStatusBadge.tsx
│   │   ├── hooks/
│   │   │   ├── useProposals.ts
│   │   │   ├── useProposal.ts
│   │   │   ├── useProposalGeneration.ts
│   │   │   └── useProposalSections.ts
│   │   └── services/
│   │       └── proposal.service.ts
│   │
│   ├── prototype/
│   │   ├── components/
│   │   │   ├── PrototypeGallery.tsx
│   │   │   ├── PrototypeCard.tsx
│   │   │   ├── PrototypeGenerator.tsx
│   │   │   ├── PrototypePreview.tsx
│   │   │   └── PrototypeEditor.tsx
│   │   ├── hooks/
│   │   │   ├── usePrototypes.ts
│   │   │   └── usePrototypeGeneration.ts
│   │   └── services/
│   │       └── prototype.service.ts
│   │
│   ├── client/
│   │   ├── components/
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   └── ClientContactInfo.tsx
│   │   ├── hooks/
│   │   │   ├── useClients.ts
│   │   │   └── useClient.ts
│   │   └── services/
│   │       └── client.service.ts
│   │
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── SignupForm.tsx
│       │   └── UserAvatar.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useUser.ts
│       └── services/
│           └── auth.service.ts
│
├── hooks/                     # 전역 커스텀 훅
│   ├── use-toast.ts
│   ├── use-local-storage.ts
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-outside-click.ts
│
├── lib/                       # 유틸리티 & 인프라
│   ├── api/                  # API 클라이언트
│   │   ├── client.ts         # Axios/Fetch 기본 설정
│   │   ├── rfp.api.ts        # RFP API 함수
│   │   ├── proposal.api.ts   # Proposal API 함수
│   │   ├── prototype.api.ts  # Prototype API 함수
│   │   ├── client.api.ts     # Client API 함수
│   │   └── ai.api.ts         # AI API 함수
│   │
│   ├── utils/                # 유틸리티 함수
│   │   ├── date.ts           # 날짜 포맷팅
│   │   ├── format.ts         # 텍스트 포맷팅
│   │   ├── validation.ts     # 검증 함수
│   │   ├── file.ts           # 파일 처리
│   │   └── cn.ts             # classnames 유틸
│   │
│   ├── db/                   # 데이터베이스 (bkend.ai 또는 Prisma)
│   │   ├── client.ts         # DB 클라이언트
│   │   └── schema.ts         # DB 스키마 (Prisma 사용 시)
│   │
│   ├── ai/                   # AI 서비스
│   │   ├── openai.ts         # OpenAI 클라이언트
│   │   ├── prompts.ts        # AI 프롬프트 템플릿
│   │   └── analyzers/        # AI 분석 로직
│   │       ├── rfp-analyzer.ts
│   │       └── requirement-analyzer.ts
│   │
│   └── errors.ts             # 커스텀 에러 클래스
│
├── types/                     # 타입 정의
│   ├── index.ts              # 전체 export
│   ├── rfp.types.ts
│   ├── proposal.types.ts
│   ├── prototype.types.ts
│   ├── requirement.types.ts
│   ├── client.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── constants/                 # 상수
│   ├── index.ts
│   ├── status.ts             # 상태 상수
│   ├── routes.ts             # 라우트 경로
│   ├── config.ts             # 앱 설정
│   └── priorities.ts         # 우선순위 상수
│
└── styles/                    # 스타일
    ├── globals.css
    └── themes.css
```

---

## 3. Feature 모듈 구조

각 Feature는 독립적인 모듈로 구성됩니다.

### 3.1 Feature 모듈 템플릿

```
features/{feature-name}/
├── components/              # UI 컴포넌트
│   ├── {Feature}List.tsx   # 목록
│   ├── {Feature}Card.tsx   # 카드
│   ├── {Feature}Form.tsx   # 폼
│   └── ...
├── hooks/                   # 커스텀 훅
│   ├── use{Feature}s.ts    # 목록 조회
│   ├── use{Feature}.ts     # 단건 조회
│   ├── useCreate{Feature}.ts
│   └── useUpdate{Feature}.ts
└── services/                # 비즈니스 로직
    └── {feature}.service.ts
```

### 3.2 서비스 파일 구조

```typescript
// features/rfp/services/rfp.service.ts

import { apiClient } from '@/lib/api/client';
import type { RFP, CreateRfpDto, RfpFilters } from '@/types';

/**
 * RFP 서비스
 * RFP 관련 비즈니스 로직을 처리합니다.
 */
export const rfpService = {
  // CRUD 메서드
  async getList(filters?: RfpFilters): Promise<RFP[]> {
    // 구현...
  },

  async getById(id: string): Promise<RFP> {
    // 구현...
  },

  async create(data: CreateRfpDto): Promise<RFP> {
    // 구현...
  },

  async update(id: string, data: Partial<RFP>): Promise<RFP> {
    // 구현...
  },

  async delete(id: string): Promise<void> {
    // 구현...
  },

  // 비즈니스 로직 메서드
  async analyze(id: string): Promise<AIAnalysis> {
    // 구현...
  },

  async updateStatus(id: string, status: RfpStatus): Promise<RFP> {
    // 구현...
  },
};
```

---

## 4. Clean Architecture 적용

### 4.1 계층 구조

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
│  (app/, components/, features/*/components/)    │
│  - UI 컴포넌트, 페이지                          │
│  - 사용자 인터랙션 처리                         │
└───────────────────┬─────────────────────────────┘
                    │ depends on
┌───────────────────▼─────────────────────────────┐
│             Application Layer                   │
│      (features/*/hooks/, features/*/services/)  │
│  - 비즈니스 로직                                │
│  - Use Case 구현                                │
└───────────────────┬─────────────────────────────┘
                    │ depends on
┌───────────────────▼─────────────────────────────┐
│               Domain Layer                      │
│            (types/, constants/)                 │
│  - 도메인 엔티티, 타입                          │
│  - 비즈니스 규칙 (순수 로직)                    │
└───────────────────▲─────────────────────────────┘
                    │ depends on
┌───────────────────┴─────────────────────────────┐
│           Infrastructure Layer                  │
│        (lib/api/, lib/db/, lib/ai/)             │
│  - 외부 시스템 연동                             │
│  - API 클라이언트, DB 클라이언트                │
└─────────────────────────────────────────────────┘
```

### 4.2 의존성 규칙

```typescript
// ✅ Presentation → Application
// app/(dashboard)/rfps/page.tsx
import { useRfps } from '@/features/rfp/hooks/useRfps';  // ✅

// ✅ Application → Domain
// features/rfp/services/rfp.service.ts
import type { RFP } from '@/types/rfp.types';  // ✅

// ✅ Application → Infrastructure
// features/rfp/services/rfp.service.ts
import { apiClient } from '@/lib/api/client';  // ✅

// ✅ Infrastructure → Domain
// lib/api/rfp.api.ts
import type { RFP } from '@/types/rfp.types';  // ✅

// ❌ Domain → Infrastructure (금지!)
// types/rfp.types.ts
import { apiClient } from '@/lib/api/client';  // ❌ 의존성 역전!

// ❌ Infrastructure → Presentation (금지!)
// lib/api/client.ts
import { useToast } from '@/hooks/use-toast';  // ❌ 의존성 역전!
```

---

## 5. 파일 구성 규칙

### 5.1 컴포넌트 파일

```typescript
// features/rfp/components/RfpCard.tsx

// 1. Import (순서 중요)
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RFP } from '@/types';

// 2. Props 타입
interface RfpCardProps {
  rfp: RFP;
  onSelect?: (id: string) => void;
}

// 3. 서브 컴포넌트 (필요시)
function RfpStatusBadge({ status }: { status: RfpStatus }) {
  return <Badge>{status}</Badge>;
}

// 4. 메인 컴포넌트
export function RfpCard({ rfp, onSelect }: RfpCardProps) {
  // 4-1. 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // 4-2. 이벤트 핸들러
  const handleClick = () => {
    onSelect?.(rfp.id);
  };

  // 4-3. 파생 값
  const isOverdue = new Date(rfp.dueDate) < new Date();

  // 4-4. JSX 반환
  return (
    <Card onClick={handleClick}>
      <h3>{rfp.title}</h3>
      <RfpStatusBadge status={rfp.status} />
      {/* ... */}
    </Card>
  );
}

// 5. Export 타입 (필요시)
export type { RfpCardProps };
```

### 5.2 훅 파일

```typescript
// features/rfp/hooks/useRfps.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService } from '../services/rfp.service';
import type { RfpFilters, CreateRfpDto } from '@/types';

// 목록 조회 훅
export function useRfps(filters?: RfpFilters) {
  return useQuery({
    queryKey: ['rfps', filters],
    queryFn: () => rfpService.getList(filters),
    staleTime: 1000 * 60 * 5,  // 5분
  });
}

// 단건 조회 훅
export function useRfp(id: string) {
  return useQuery({
    queryKey: ['rfp', id],
    queryFn: () => rfpService.getById(id),
    enabled: !!id,
  });
}

// 생성 훅
export function useCreateRfp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rfpService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
}
```

### 5.3 API 파일

```typescript
// lib/api/rfp.api.ts

import { apiClient } from './client';
import type { RFP, CreateRfpDto, RfpFilters } from '@/types';

export const rfpApi = {
  async getList(filters?: RfpFilters): Promise<RFP[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.clientId) params.set('clientId', filters.clientId);

    const response = await apiClient.get(`/rfps?${params}`);
    return response.data;
  },

  async getById(id: string): Promise<RFP> {
    const response = await apiClient.get(`/rfps/${id}`);
    return response.data;
  },

  async create(data: CreateRfpDto): Promise<RFP> {
    const response = await apiClient.post('/rfps', data);
    return response.data;
  },

  async update(id: string, data: Partial<RFP>): Promise<RFP> {
    const response = await apiClient.put(`/rfps/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/rfps/${id}`);
  },
};
```

---

## 6. Import 경로 규칙

### 6.1 절대 경로 vs 상대 경로

```typescript
// ✅ 절대 경로 사용 (tsconfig.json의 @ 별칭)
import { Button } from '@/components/ui/button';
import { useRfps } from '@/features/rfp/hooks/useRfps';
import type { RFP } from '@/types';
import { API_BASE_URL } from '@/constants';

// ✅ 상대 경로는 같은 폴더 내에서만
import { RfpCard } from './RfpCard';
import { formatDate } from './utils';

// ❌ 나쁜 예
import { Button } from '../../../components/ui/button';  // ❌ 깊은 상대 경로
```

### 6.2 Import 순서

```typescript
// 1. React 및 Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 내부 컴포넌트/훅 (절대 경로)
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// 4. 내부 유틸/서비스
import { rfpService } from '@/features/rfp/services/rfp.service';
import { formatDate } from '@/lib/utils/date';

// 5. 타입
import type { RFP, Proposal } from '@/types';

// 6. 상대 경로 (같은 폴더 내)
import { RfpCard } from './RfpCard';

// 7. 스타일
import './styles.css';
```

### 6.3 tsconfig.json 경로 별칭

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  }
}
```

---

## 📚 체크리스트

### 새 Feature 추가 시
- [ ] `features/{feature-name}/` 폴더 생성
- [ ] `components/`, `hooks/`, `services/` 하위 폴더 생성
- [ ] 타입 정의 (`types/{feature-name}.types.ts`)
- [ ] API 함수 (`lib/api/{feature-name}.api.ts`)
- [ ] 서비스 클래스 (`services/{feature-name}.service.ts`)

### 새 컴포넌트 생성 시
- [ ] PascalCase 파일명
- [ ] Props 타입 정의
- [ ] 절대 경로 import
- [ ] Export 명시

### 새 API 추가 시
- [ ] API 라우트 (`app/api/{path}/route.ts`)
- [ ] API 함수 (`lib/api/{domain}.api.ts`)
- [ ] 타입 정의
- [ ] 에러 처리

---

**이 문서는 [CONVENTIONS.md](../../CONVENTIONS.md)의 상세 가이드입니다.**
