# RFP Management System - Coding Conventions

> 제안요청서 관리 시스템 코딩 컨벤션

**버전**: 1.0.0
**작성일**: 2026-02-11
**적용 대상**: 모든 개발자 및 AI 코드 생성

---

## 📋 목차

1. [네이밍 규칙](#1-네이밍-규칙)
2. [코드 스타일](#2-코드-스타일)
3. [폴더 구조](#3-폴더-구조)
4. [파일 구성 규칙](#4-파일-구성-규칙)
5. [타입스크립트 규칙](#5-타입스크립트-규칙)
6. [React 컴포넌트 규칙](#6-react-컴포넌트-규칙)
7. [상태 관리 규칙](#7-상태-관리-규칙)
8. [API 클라이언트 규칙](#8-api-클라이언트-규칙)
9. [환경 변수 규칙](#9-환경-변수-규칙)
10. [에러 처리 규칙](#10-에러-처리-규칙)

---

## 1. 네이밍 규칙

### 1.1 기본 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| **컴포넌트** | PascalCase | `RfpList`, `ProposalCard`, `UserAvatar` |
| **함수/변수** | camelCase | `getRfpById`, `isApproved`, `totalPrice` |
| **상수** | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| **타입/인터페이스** | PascalCase | `User`, `RFP`, `ProposalStatus` |
| **Enum** | PascalCase | `RfpStatus`, `UserRole` |
| **파일명 (컴포넌트)** | PascalCase | `RfpList.tsx`, `ProposalCard.tsx` |
| **파일명 (유틸)** | kebab-case | `api-client.ts`, `date-utils.ts` |
| **폴더명** | kebab-case | `use-cases`, `api-client` |

### 1.2 도메인 특화 네이밍

#### RFP/Proposal 관련
```typescript
// ✅ 좋은 예
const rfpList = getRfpList();
const proposalStatus = getProposalStatus();
const uiPrototype = createUiPrototype();

// ❌ 나쁜 예
const rfps = getRFPS();  // 소문자 s 사용
const propStatus = getStatus();  // 축약 지양
const ui_proto = createProto();  // 스네이크 케이스
```

#### 상태(Status) 네이밍
```typescript
// RFP 상태
type RfpStatus = 'received' | 'analyzing' | 'analyzed' | 'rejected';

// Proposal 상태
type ProposalStatus = 'drafting' | 'reviewing' | 'approved' | 'delivered' | 'won' | 'lost';

// UI Prototype 상태
type PrototypeStatus = 'generating' | 'draft' | 'reviewing' | 'approved';
```

#### Boolean 네이밍
```typescript
// ✅ is/has/can 접두사 사용
const isApproved = proposal.status === 'approved';
const hasReviewers = proposal.reviewerIds.length > 0;
const canSubmit = isApproved && !isDelivered;

// ❌ 나쁜 예
const approved = proposal.status === 'approved';  // 동사형 지양
const reviewers = proposal.reviewerIds.length > 0;  // 명사형 혼동
```

### 1.3 함수 네이밍

#### CRUD 함수
```typescript
// ✅ 동사 + 명사 조합
getRfpById(id: string)
createProposal(data: CreateProposalDto)
updateProposalStatus(id: string, status: ProposalStatus)
deleteUiPrototype(id: string)
listRfps(filters: RfpFilters)

// ❌ 나쁜 예
rfpById(id: string)  // 동사 누락
newProposal(data)  // create 명시적 표현
changeStatus(id, status)  // update 사용
removePrototype(id)  // delete 일관성
```

#### 비즈니스 로직 함수
```typescript
// ✅ 의미 명확한 동사 사용
analyzeRfpRequirements(rfp: RFP)
generateProposalSections(requirements: Requirement[])
assignReviewer(proposalId: string, reviewerId: string)
approveProposal(proposalId: string, approverId: string)
deliverProposal(proposalId: string)

// ❌ 나쁜 예
analyze(rfp)  // 무엇을 분석하는지 불명확
generate(requirements)  // 무엇을 생성하는지 불명확
assign(p, r)  // 축약 지양
```

---

## 2. 코드 스타일

### 2.1 기본 스타일

```typescript
// Prettier 설정 기준
{
  "semi": true,              // 세미콜론 사용
  "singleQuote": true,       // 싱글 쿼트 사용
  "tabWidth": 2,             // 들여쓰기 2칸
  "trailingComma": "es5",    // 후행 쉼표
  "printWidth": 100,         // 한 줄 최대 길이 100
  "arrowParens": "always"    // 화살표 함수 괄호 항상 사용
}
```

### 2.2 Import 순서

```typescript
// 1. React 관련
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 2. 외부 라이브러리
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 내부 라이브러리 (절대 경로)
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// 4. 타입
import type { RFP, Proposal } from '@/types';

// 5. 상대 경로
import { RfpCard } from './RfpCard';
import './styles.css';
```

### 2.3 주석 규칙

```typescript
/**
 * RFP를 분석하여 AI 분석 결과를 생성합니다.
 *
 * @param rfpId - 분석할 RFP의 ID
 * @returns AI 분석 결과 객체
 * @throws {RfpNotFoundError} RFP를 찾을 수 없는 경우
 *
 * @example
 * const analysis = await analyzeRfp('rfp-123');
 * console.log(analysis.summary);
 */
async function analyzeRfp(rfpId: string): Promise<AIAnalysis> {
  // 구현...
}

// ✅ 복잡한 로직에만 주석 추가
// 요구사항 우선순위에 따라 정렬 (must > should > could > wont)
const sortedRequirements = requirements.sort((a, b) =>
  PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
);

// ❌ 자명한 코드에 불필요한 주석
// 사용자 이름 가져오기
const userName = user.name;  // 주석 불필요
```

---

## 3. 폴더 구조

```
rfp-management/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 그룹
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # 대시보드 그룹
│   │   │   ├── rfps/
│   │   │   ├── proposals/
│   │   │   └── clients/
│   │   ├── api/               # API 라우트
│   │   │   ├── rfps/
│   │   │   ├── proposals/
│   │   │   └── ai/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/            # 공용 컴포넌트
│   │   ├── ui/               # shadcn/ui 기본 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── dialog.tsx
│   │   └── shared/           # 공유 컴포넌트
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── features/             # 기능별 모듈 (도메인)
│   │   ├── rfp/
│   │   │   ├── components/  # RFP 전용 컴포넌트
│   │   │   │   ├── RfpList.tsx
│   │   │   │   ├── RfpCard.tsx
│   │   │   │   └── RfpAnalysisPanel.tsx
│   │   │   ├── hooks/       # RFP 전용 훅
│   │   │   │   ├── useRfps.ts
│   │   │   │   └── useRfpAnalysis.ts
│   │   │   └── services/    # RFP 비즈니스 로직
│   │   │       └── rfp.service.ts
│   │   │
│   │   ├── proposal/
│   │   │   ├── components/
│   │   │   │   ├── ProposalEditor.tsx
│   │   │   │   ├── ProposalSectionList.tsx
│   │   │   │   └── ProposalReviewPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProposals.ts
│   │   │   │   └── useProposalGeneration.ts
│   │   │   └── services/
│   │   │       └── proposal.service.ts
│   │   │
│   │   ├── prototype/
│   │   │   ├── components/
│   │   │   │   ├── PrototypeGallery.tsx
│   │   │   │   └── PrototypeGenerator.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePrototypeGeneration.ts
│   │   │   └── services/
│   │   │       └── prototype.service.ts
│   │   │
│   │   └── client/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── services/
│   │
│   ├── hooks/                # 전역 커스텀 훅
│   │   ├── use-toast.ts
│   │   ├── use-local-storage.ts
│   │   └── use-debounce.ts
│   │
│   ├── lib/                  # 유틸리티 & 설정
│   │   ├── api/             # API 클라이언트
│   │   │   ├── client.ts    # Axios/Fetch 설정
│   │   │   ├── rfp.api.ts
│   │   │   ├── proposal.api.ts
│   │   │   └── ai.api.ts
│   │   ├── utils/           # 유틸 함수
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   └── validation.ts
│   │   ├── db/              # 데이터베이스 (bkend.ai 또는 Prisma)
│   │   │   └── client.ts
│   │   └── ai/              # AI 관련 (OpenAI 등)
│   │       ├── openai.ts
│   │       └── prompts.ts
│   │
│   ├── types/               # 타입 정의
│   │   ├── index.ts         # 전체 export
│   │   ├── rfp.types.ts
│   │   ├── proposal.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/           # 상수
│   │   ├── index.ts
│   │   ├── status.ts        # 상태 상수
│   │   ├── routes.ts        # 라우트 경로
│   │   └── config.ts        # 설정 상수
│   │
│   └── styles/              # 글로벌 스타일
│       ├── globals.css
│       └── themes.css
│
├── public/                  # 정적 파일
│   ├── images/
│   └── icons/
│
├── docs/                    # 문서
│   ├── 01-plan/
│   ├── 02-design/
│   └── README.md
│
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 파일 구성 규칙

### 4.1 컴포넌트 파일

```typescript
// RfpCard.tsx
import { Card } from '@/components/ui/card';
import type { RFP } from '@/types';

// 1. Props 타입 정의
interface RfpCardProps {
  rfp: RFP;
  onSelect?: (id: string) => void;
}

// 2. 컴포넌트 정의
export function RfpCard({ rfp, onSelect }: RfpCardProps) {
  // 3. 로컬 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // 4. 이벤트 핸들러
  const handleClick = () => {
    onSelect?.(rfp.id);
  };

  // 5. JSX 반환
  return (
    <Card onClick={handleClick}>
      <h3>{rfp.title}</h3>
      {/* ... */}
    </Card>
  );
}
```

### 4.2 Service 파일

```typescript
// rfp.service.ts

// 1. Import
import { apiClient } from '@/lib/api/client';
import type { RFP, CreateRfpDto } from '@/types';

// 2. Service 클래스 또는 객체
export const rfpService = {
  // 3. CRUD 메서드
  async getById(id: string): Promise<RFP> {
    const response = await apiClient.get(`/rfps/${id}`);
    return response.data;
  },

  async create(data: CreateRfpDto): Promise<RFP> {
    const response = await apiClient.post('/rfps', data);
    return response.data;
  },

  // 4. 비즈니스 로직 메서드
  async analyze(id: string): Promise<AIAnalysis> {
    const response = await apiClient.post(`/rfps/${id}/analyze`);
    return response.data;
  },
};
```

---

## 5. 타입스크립트 규칙

### 5.1 타입 vs 인터페이스

```typescript
// ✅ 데이터 구조 (객체) = interface
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Union/Intersection = type
type RfpStatus = 'received' | 'analyzing' | 'analyzed' | 'rejected';
type ProposalWithClient = Proposal & { client: Client };

// ✅ 함수 타입 = type
type AnalyzeFunction = (rfp: RFP) => Promise<AIAnalysis>;
```

### 5.2 타입 안전성

```typescript
// ✅ any 사용 금지, unknown 사용
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

// ✅ 타입 가드 사용
function isRfp(data: unknown): data is RFP {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  );
}

// ✅ Non-null assertion 최소화
const rfp = getRfpById(id);
if (!rfp) throw new Error('RFP not found');
const title = rfp.title;  // ✅ 안전

// ❌ 나쁜 예
const title = getRfpById(id)!.title;  // ! 사용 지양
```

---

## 6. React 컴포넌트 규칙

### 6.1 컴포넌트 분리 기준

```typescript
// ✅ 50줄 이상 시 분리 고려
// ✅ 재사용 가능한 부분은 별도 컴포넌트로
// ✅ 비즈니스 로직은 커스텀 훅으로

// ProposalEditor.tsx
export function ProposalEditor({ proposalId }: Props) {
  const { proposal, updateProposal } = useProposal(proposalId);  // 훅으로 분리

  return (
    <div>
      <ProposalHeader proposal={proposal} />  {/* 컴포넌트 분리 */}
      <ProposalSectionList sections={proposal.sections} />
      <ProposalActions onSave={updateProposal} />
    </div>
  );
}
```

### 6.2 Props 패턴

```typescript
// ✅ 명시적 Props 타입
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
}

// ✅ 기본값은 destructuring에서
export function Button({
  variant = 'default',
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  // ...
}

// ✅ HTML 속성 확장
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

---

## 7. 상태 관리 규칙

### 7.1 서버 상태 vs 클라이언트 상태

```typescript
// ✅ 서버 상태 = React Query
const { data: rfps, isLoading } = useQuery({
  queryKey: ['rfps'],
  queryFn: rfpService.getList,
});

// ✅ 클라이언트 상태 = useState/Zustand
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 7.2 React Query 패턴

```typescript
// hooks/useRfps.ts
export function useRfps(filters?: RfpFilters) {
  return useQuery({
    queryKey: ['rfps', filters],
    queryFn: () => rfpService.getList(filters),
    staleTime: 1000 * 60 * 5,  // 5분
  });
}

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

---

## 8. API 클라이언트 규칙

### 8.1 API 클라이언트 구조

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직
    }
    return Promise.reject(error);
  }
);
```

---

## 9. 환경 변수 규칙

상세 내용은 `.env.example` 참조

---

## 10. 에러 처리 규칙

### 10.1 커스텀 에러 클래스

```typescript
// lib/errors.ts
export class RfpNotFoundError extends Error {
  constructor(rfpId: string) {
    super(`RFP not found: ${rfpId}`);
    this.name = 'RfpNotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
```

### 10.2 에러 처리 패턴

```typescript
// ✅ try-catch with 명확한 에러 타입
try {
  const rfp = await rfpService.getById(id);
} catch (error) {
  if (error instanceof RfpNotFoundError) {
    toast.error('제안요청서를 찾을 수 없습니다.');
  } else if (error instanceof UnauthorizedError) {
    router.push('/login');
  } else {
    toast.error('오류가 발생했습니다.');
  }
}
```

---

## 📚 참고 문서

- [Phase 1: Schema & Terminology](./docs/01-plan/README.md)
- [Phase 2: Naming Rules](./docs/01-plan/naming.md)
- [Phase 2: Structure Rules](./docs/01-plan/structure.md)

---

**이 문서는 AI 코드 생성 시에도 참조됩니다.**
**모든 코드는 이 컨벤션을 따라야 합니다.**
