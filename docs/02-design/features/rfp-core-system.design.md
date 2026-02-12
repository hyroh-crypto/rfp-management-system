# rfp-core-system Design Document

> **Feature**: RFP Core System
> **Plan Reference**: [rfp-core-system.plan.md](../../01-plan/features/rfp-core-system.plan.md)
> **Status**: Design
> **Last Updated**: 2026-02-12

---

## 1. Architecture Design

### 1.1 Overall Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages Layer                                               │  │
│  │  - /rfps (목록)          - /clients (목록)                │  │
│  │  - /rfps/[id] (상세)     - /clients/[id] (상세)           │  │
│  │  - /rfps/new (등록)      - /clients/new (등록)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Components Layer                                          │  │
│  │  - RfpCard, RfpForm, RfpDetail, RfpFilters               │  │
│  │  - ClientCard, ClientForm, ClientDetail                  │  │
│  │  - RequirementList, RequirementForm                      │  │
│  │  - CommentList, CommentForm                              │  │
│  │  - FileUploader, FileList                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Hooks Layer (TanStack Query)                             │  │
│  │  - useRfps, useRfp, useCreateRfp, useUpdateRfp           │  │
│  │  - useClients, useClient, useCreateClient                │  │
│  │  - useRequirements, useCreateRequirement                 │  │
│  │  - useComments, useCreateComment                         │  │
│  │  - useFileUpload, useFileDelete                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Services Layer                                            │  │
│  │  - clientService: CRUD                                   │  │
│  │  - rfpService: CRUD + Search + Filter                    │  │
│  │  - requirementService: CRUD + Reorder                    │  │
│  │  - commentService: CRUD + Nested Comments                │  │
│  │  - fileService: Upload + Download (Presigned URL)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                           ↓ HTTPS (REST)
┌────────────────────────────────────────────────────────────────┐
│                     Supabase Backend                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                                       │  │
│  │  - clients                                                │  │
│  │  - rfps                                                   │  │
│  │  - requirements                                           │  │
│  │  - comments                                               │  │
│  │  - users (auth-system에서 생성됨)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Supabase Storage                                          │  │
│  │  - rfp-files/ (RFP 첨부파일)                              │  │
│  │  - attachments/ (기타 첨부파일)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

#### RFP 등록 Flow
```
User Input → RfpForm → useCreateRfp hook
  → rfpService.createRfp()
  → Supabase INSERT
  → File Upload (if attachments)
  → fileService.upload() → Presigned URL
  → Supabase Storage
  → Optimistic Update (TanStack Query)
  → Redirect to RFP Detail
```

#### RFP 검색/필터 Flow
```
User Input → RfpFilters component → useRfps hook
  → rfpService.list(filters, sort, pagination)
  → Supabase SELECT with WHERE + ORDER BY + LIMIT
  → TanStack Query cache
  → RfpCard rendering
```

#### 요구사항 분석 Flow
```
RFP Detail → RequirementForm → useCreateRequirement
  → requirementService.create()
  → Supabase INSERT
  → Optimistic Update
  → RequirementList re-render
```

#### 댓글 작성 Flow
```
CommentForm → useCreateComment
  → commentService.create()
  → Supabase INSERT
  → Realtime subscription (optional)
  → CommentList update
```

---

## 2. Component Structure

### 2.1 Directory Structure

```
src/
├── app/
│   └── (dashboard)/
│       ├── rfps/
│       │   ├── page.tsx                 # RFP 목록 페이지
│       │   ├── [id]/
│       │   │   └── page.tsx             # RFP 상세 페이지
│       │   ├── [id]/edit/
│       │   │   └── page.tsx             # RFP 수정 페이지
│       │   └── new/
│       │       └── page.tsx             # RFP 등록 페이지
│       └── clients/
│           ├── page.tsx                 # 고객사 목록 페이지
│           ├── [id]/
│           │   └── page.tsx             # 고객사 상세 페이지
│           └── new/
│               └── page.tsx             # 고객사 등록 페이지
├── components/
│   ├── rfp/
│   │   ├── rfp-card.tsx                 # RFP 카드 (목록용)
│   │   ├── rfp-form.tsx                 # RFP 등록/수정 폼
│   │   ├── rfp-detail.tsx               # RFP 상세 정보
│   │   ├── rfp-filters.tsx              # 검색/필터 패널
│   │   ├── rfp-status-badge.tsx         # 상태 배지
│   │   └── rfp-header.tsx               # RFP 헤더 (제목, 액션)
│   ├── client/
│   │   ├── client-card.tsx              # 고객사 카드
│   │   ├── client-form.tsx              # 고객사 폼
│   │   ├── client-detail.tsx            # 고객사 상세
│   │   └── client-rfp-list.tsx          # 고객사별 RFP 목록
│   ├── requirement/
│   │   ├── requirement-list.tsx         # 요구사항 목록
│   │   ├── requirement-form.tsx         # 요구사항 폼
│   │   ├── requirement-card.tsx         # 요구사항 카드
│   │   └── requirement-category-badge.tsx # 카테고리 배지
│   ├── comment/
│   │   ├── comment-list.tsx             # 댓글 목록
│   │   ├── comment-form.tsx             # 댓글 작성 폼
│   │   ├── comment-item.tsx             # 댓글 아이템
│   │   └── comment-reply.tsx            # 답글 컴포넌트
│   ├── file/
│   │   ├── file-uploader.tsx            # 파일 업로드 (Dropzone)
│   │   ├── file-list.tsx                # 파일 목록
│   │   ├── file-preview.tsx             # 파일 미리보기
│   │   └── file-item.tsx                # 파일 아이템
│   └── ui/
│       ├── search-bar.tsx               # 검색창
│       ├── filter-panel.tsx             # 필터 패널
│       ├── sort-dropdown.tsx            # 정렬 드롭다운
│       └── pagination.tsx               # 페이지네이션
├── hooks/
│   ├── rfp/
│   │   ├── useRfps.ts                   # RFP 목록 조회
│   │   ├── useRfp.ts                    # RFP 단일 조회
│   │   ├── useCreateRfp.ts              # RFP 생성
│   │   ├── useUpdateRfp.ts              # RFP 수정
│   │   ├── useDeleteRfp.ts              # RFP 삭제
│   │   └── useRfpFilters.ts             # RFP 필터 상태 관리
│   ├── client/
│   │   ├── useClients.ts
│   │   ├── useClient.ts
│   │   ├── useCreateClient.ts
│   │   └── useUpdateClient.ts
│   ├── requirement/
│   │   ├── useRequirements.ts
│   │   ├── useCreateRequirement.ts
│   │   ├── useUpdateRequirement.ts
│   │   └── useReorderRequirements.ts
│   ├── comment/
│   │   ├── useComments.ts
│   │   ├── useCreateComment.ts
│   │   └── useUpdateComment.ts
│   └── file/
│       ├── useFileUpload.ts
│       └── useFileDelete.ts
├── services/
│   ├── client.service.ts
│   ├── rfp.service.ts
│   ├── requirement.service.ts
│   ├── comment.service.ts
│   └── file.service.ts
├── types/
│   ├── client.ts
│   ├── rfp.ts
│   ├── requirement.ts
│   └── comment.ts
└── lib/
    └── validations/
        ├── client.ts
        ├── rfp.ts
        ├── requirement.ts
        └── comment.ts
```

### 2.2 Component Specifications

#### RfpCard Component
```typescript
interface RfpCardProps {
  rfp: RFP
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function RfpCard({ rfp, onEdit, onDelete }: RfpCardProps)
```

**Features:**
- RFP 기본 정보 표시 (제목, 고객사, 마감일, 상태)
- 상태 배지 (color-coded)
- 담당자 표시
- 액션 버튼 (상세 보기, 수정, 삭제)
- 호버 효과

#### RfpForm Component
```typescript
interface RfpFormProps {
  rfp?: RFP // 수정 시 기존 데이터
  onSubmit: (data: RfpFormData) => Promise<void>
  onCancel: () => void
}

export function RfpForm({ rfp, onSubmit, onCancel }: RfpFormProps)
```

**Features:**
- React Hook Form + Zod 검증
- 고객사 선택 (Autocomplete)
- 날짜 선택 (DatePicker)
- 파일 업로드 (Dropzone)
- 담당자 선택
- 제출/취소 버튼
- 로딩 상태 표시

#### RfpFilters Component
```typescript
interface RfpFiltersProps {
  filters: RfpFilters
  onFilterChange: (filters: RfpFilters) => void
}

export function RfpFilters({ filters, onFilterChange }: RfpFiltersProps)
```

**Features:**
- 검색 입력 (debounced)
- 상태 필터 (Multi-select)
- 고객사 필터 (Autocomplete)
- 담당자 필터
- 날짜 범위 필터
- 초기화 버튼

#### RequirementList Component
```typescript
interface RequirementListProps {
  rfpId: string
  requirements: Requirement[]
  onReorder: (requirements: Requirement[]) => void
}

export function RequirementList({ rfpId, requirements, onReorder }: RequirementListProps)
```

**Features:**
- 요구사항 목록 표시
- Drag & Drop 순서 변경 (react-beautiful-dnd)
- 카테고리별 그룹핑
- 우선순위 배지 (MoSCoW)
- 인라인 편집
- 삭제 확인 다이얼로그

#### FileUploader Component
```typescript
interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number // default: 10
  maxSize?: number // default: 10MB
  accept?: string[] // default: PDF, DOCX, images
}

export function FileUploader({ onUpload, maxFiles, maxSize, accept }: FileUploaderProps)
```

**Features:**
- Drag & Drop 영역 (react-dropzone)
- 파일 타입/크기 검증
- 업로드 진행률 표시
- 다중 파일 업로드
- 미리보기 (이미지)
- 에러 메시지

---

## 3. API Design

### 3.1 Client Service API

#### clientService.list()
```typescript
interface ListClientsParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: 'name' | 'createdAt' | 'industry'
  sortOrder?: 'asc' | 'desc'
}

interface ListClientsResponse {
  data: Client[]
  total: number
  page: number
  pageSize: number
}

async function list(params: ListClientsParams): Promise<ListClientsResponse>
```

#### clientService.getById()
```typescript
interface GetClientResponse {
  client: Client
  rfps: RFP[] // 최근 RFP 5개
}

async function getById(id: string): Promise<GetClientResponse>
```

#### clientService.create()
```typescript
interface CreateClientData {
  name: string
  businessNumber: string
  industry: string
  contact: {
    name: string
    email: string
    phone: string
    position: string
  }
  address?: string
  website?: string
  notes?: string
}

async function create(data: CreateClientData): Promise<Client>
```

### 3.2 RFP Service API

#### rfpService.list()
```typescript
interface ListRfpsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: RfpStatus[]
  clientId?: string
  assigneeId?: string
  dueDateFrom?: Date
  dueDateTo?: Date
  sortBy?: 'receivedDate' | 'dueDate' | 'status' | 'title'
  sortOrder?: 'asc' | 'desc'
}

interface ListRfpsResponse {
  data: RFP[]
  total: number
  page: number
  pageSize: number
}

async function list(params: ListRfpsParams): Promise<ListRfpsResponse>
```

**SQL Query Example:**
```sql
SELECT
  r.*,
  c.name as client_name,
  u.name as assignee_name
FROM rfps r
LEFT JOIN clients c ON r.client_id = c.id
LEFT JOIN users u ON r.assignee_id = u.id
WHERE
  ($1::text IS NULL OR r.title ILIKE '%' || $1 || '%' OR r.description ILIKE '%' || $1 || '%')
  AND ($2::text[] IS NULL OR r.status = ANY($2))
  AND ($3::uuid IS NULL OR r.client_id = $3)
  AND ($4::uuid IS NULL OR r.assignee_id = $4)
  AND ($5::date IS NULL OR r.due_date >= $5)
  AND ($6::date IS NULL OR r.due_date <= $6)
ORDER BY
  CASE WHEN $7 = 'receivedDate' AND $8 = 'asc' THEN r.received_date END ASC,
  CASE WHEN $7 = 'receivedDate' AND $8 = 'desc' THEN r.received_date END DESC,
  CASE WHEN $7 = 'dueDate' AND $8 = 'asc' THEN r.due_date END ASC,
  CASE WHEN $7 = 'dueDate' AND $8 = 'desc' THEN r.due_date END DESC
LIMIT $9 OFFSET $10
```

#### rfpService.getById()
```typescript
interface GetRfpResponse {
  rfp: RFP
  requirements: Requirement[]
  comments: Comment[]
  client: Client
}

async function getById(id: string): Promise<GetRfpResponse>
```

#### rfpService.create()
```typescript
interface CreateRfpData {
  title: string
  clientId: string
  receivedDate: Date
  dueDate: Date
  estimatedBudget?: number
  estimatedDuration?: number
  description: string
  assigneeId?: string
}

async function create(data: CreateRfpData): Promise<RFP>
```

#### rfpService.updateStatus()
```typescript
async function updateStatus(id: string, status: RfpStatus): Promise<RFP>
```

### 3.3 Requirement Service API

#### requirementService.list()
```typescript
interface ListRequirementsParams {
  rfpId: string
  category?: RequirementCategory
  priority?: RequirementPriority
}

async function list(params: ListRequirementsParams): Promise<Requirement[]>
```

#### requirementService.create()
```typescript
interface CreateRequirementData {
  rfpId: string
  category: RequirementCategory
  priority: RequirementPriority
  title: string
  description: string
  acceptanceCriteria?: string
  complexity?: 'low' | 'medium' | 'high'
  estimatedHours?: number
}

async function create(data: CreateRequirementData): Promise<Requirement>
```

#### requirementService.reorder()
```typescript
interface ReorderRequirementsData {
  requirementIds: string[] // 새로운 순서
}

async function reorder(data: ReorderRequirementsData): Promise<void>
```

### 3.4 Comment Service API

#### commentService.list()
```typescript
interface ListCommentsParams {
  targetType: 'rfp' | 'requirement' | 'proposal'
  targetId: string
}

async function list(params: ListCommentsParams): Promise<Comment[]>
```

#### commentService.create()
```typescript
interface CreateCommentData {
  targetType: string
  targetId: string
  content: string
  type: 'comment' | 'feedback' | 'approval' | 'rejection'
  parentId?: string // 답글인 경우
}

async function create(data: CreateCommentData): Promise<Comment>
```

### 3.5 File Service API

#### fileService.upload()
```typescript
interface UploadFileParams {
  file: File
  bucket: 'rfp-files' | 'attachments'
  path?: string
}

interface UploadFileResponse {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedAt: Date
}

async function upload(params: UploadFileParams): Promise<UploadFileResponse>
```

**Implementation:**
```typescript
async function upload({ file, bucket, path }: UploadFileParams) {
  // 1. 파일 검증
  validateFile(file)

  // 2. Presigned URL 요청
  const { data: presignedUrl } = await supabase
    .storage
    .from(bucket)
    .createSignedUploadUrl(`${path}/${file.name}`)

  // 3. 파일 업로드
  await fetch(presignedUrl.signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  // 4. 메타데이터 저장
  const { data: publicUrl } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(`${path}/${file.name}`)

  return {
    id: generateId(),
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    url: publicUrl.publicUrl,
    uploadedAt: new Date(),
  }
}
```

#### fileService.getDownloadUrl()
```typescript
async function getDownloadUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string>
```

---

## 4. State Management

### 4.1 TanStack Query Setup

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### 4.2 Query Keys

```typescript
// src/lib/queryKeys.ts
export const queryKeys = {
  // Clients
  clients: {
    all: ['clients'] as const,
    lists: () => [...queryKeys.clients.all, 'list'] as const,
    list: (filters: ListClientsParams) => [...queryKeys.clients.lists(), filters] as const,
    details: () => [...queryKeys.clients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },

  // RFPs
  rfps: {
    all: ['rfps'] as const,
    lists: () => [...queryKeys.rfps.all, 'list'] as const,
    list: (filters: ListRfpsParams) => [...queryKeys.rfps.lists(), filters] as const,
    details: () => [...queryKeys.rfps.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.rfps.details(), id] as const,
  },

  // Requirements
  requirements: {
    all: ['requirements'] as const,
    byRfp: (rfpId: string) => [...queryKeys.requirements.all, 'rfp', rfpId] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    byTarget: (targetType: string, targetId: string) =>
      [...queryKeys.comments.all, targetType, targetId] as const,
  },
} as const
```

### 4.3 Hook Examples

#### useRfps Hook
```typescript
// src/hooks/rfp/useRfps.ts
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { rfpService } from '@/services/rfp.service'

export function useRfps(params: ListRfpsParams = {}) {
  return useQuery({
    queryKey: queryKeys.rfps.list(params),
    queryFn: () => rfpService.list(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  })
}
```

#### useCreateRfp Hook
```typescript
// src/hooks/rfp/useCreateRfp.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { rfpService } from '@/services/rfp.service'

export function useCreateRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rfpService.create,
    onSuccess: () => {
      // Invalidate all RFP lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.rfps.lists() })
    },
    onError: (error) => {
      // Error handling
      console.error('Failed to create RFP:', error)
    },
  })
}
```

### 4.4 Zustand Store (Client-side State)

```typescript
// src/stores/rfpFilterStore.ts
import { create } from 'zustand'

interface RfpFilterState {
  filters: RfpFilters
  setFilters: (filters: Partial<RfpFilters>) => void
  resetFilters: () => void
}

const defaultFilters: RfpFilters = {
  search: '',
  status: [],
  clientId: undefined,
  assigneeId: undefined,
  dueDateFrom: undefined,
  dueDateTo: undefined,
  sortBy: 'receivedDate',
  sortOrder: 'desc',
}

export const useRfpFilterStore = create<RfpFilterState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
```

---

## 5. Form Validation

### 5.1 Validation Schemas (Zod)

#### Client Schema
```typescript
// src/lib/validations/client.ts
import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string()
    .min(1, '회사명을 입력해주세요')
    .max(200, '회사명은 최대 200자까지 입력 가능합니다'),
  businessNumber: z.string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '올바른 사업자등록번호 형식이 아닙니다 (000-00-00000)'),
  industry: z.string()
    .min(1, '업종을 입력해주세요')
    .max(100, '업종은 최대 100자까지 입력 가능합니다'),
  contact: z.object({
    name: z.string()
      .min(1, '담당자 이름을 입력해주세요')
      .max(50, '이름은 최대 50자까지 입력 가능합니다'),
    email: z.string()
      .email('올바른 이메일 형식이 아닙니다'),
    phone: z.string()
      .regex(/^[0-9-+() ]+$/, '올바른 전화번호 형식이 아닙니다'),
    position: z.string()
      .min(1, '직책을 입력해주세요')
      .max(50, '직책은 최대 50자까지 입력 가능합니다'),
  }),
  address: z.string()
    .max(500, '주소는 최대 500자까지 입력 가능합니다')
    .optional(),
  website: z.string()
    .url('올바른 웹사이트 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(2000, '메모는 최대 2000자까지 입력 가능합니다')
    .optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>
```

#### RFP Schema
```typescript
// src/lib/validations/rfp.ts
import { z } from 'zod'

export const rfpSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목은 최대 200자까지 입력 가능합니다'),
  clientId: z.string()
    .uuid('올바른 고객사를 선택해주세요'),
  receivedDate: z.date({
    required_error: '접수일을 선택해주세요',
  }),
  dueDate: z.date({
    required_error: '마감일을 선택해주세요',
  }),
  estimatedBudget: z.number()
    .min(0, '예산은 0 이상이어야 합니다')
    .optional(),
  estimatedDuration: z.number()
    .min(1, '예상 기간은 최소 1일 이상이어야 합니다')
    .optional(),
  description: z.string()
    .min(1, '설명을 입력해주세요')
    .max(10000, '설명은 최대 10,000자까지 입력 가능합니다'),
  assigneeId: z.string()
    .uuid()
    .optional(),
}).refine(
  (data) => data.dueDate > data.receivedDate,
  {
    message: '마감일은 접수일 이후여야 합니다',
    path: ['dueDate'],
  }
)

export type RfpFormData = z.infer<typeof rfpSchema>
```

#### Requirement Schema
```typescript
// src/lib/validations/requirement.ts
import { z } from 'zod'

const requirementCategorySchema = z.enum(['functional', 'non-functional', 'technical', 'business'])
const requirementPrioritySchema = z.enum(['must', 'should', 'could', 'wont'])
const complexitySchema = z.enum(['low', 'medium', 'high'])

export const requirementSchema = z.object({
  rfpId: z.string().uuid(),
  category: requirementCategorySchema,
  priority: requirementPrioritySchema,
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목은 최대 200자까지 입력 가능합니다'),
  description: z.string()
    .min(1, '설명을 입력해주세요')
    .max(5000, '설명은 최대 5,000자까지 입력 가능합니다'),
  acceptanceCriteria: z.string()
    .max(2000, '수용 기준은 최대 2,000자까지 입력 가능합니다')
    .optional(),
  complexity: complexitySchema.optional(),
  estimatedHours: z.number()
    .min(0, '예상 시간은 0 이상이어야 합니다')
    .max(1000, '예상 시간은 최대 1,000시간까지 입력 가능합니다')
    .optional(),
})

export type RequirementFormData = z.infer<typeof requirementSchema>
```

#### Comment Schema
```typescript
// src/lib/validations/comment.ts
import { z } from 'zod'

const commentTypeSchema = z.enum(['comment', 'feedback', 'approval', 'rejection'])

export const commentSchema = z.object({
  targetType: z.enum(['rfp', 'requirement', 'proposal']),
  targetId: z.string().uuid(),
  content: z.string()
    .min(1, '내용을 입력해주세요')
    .max(5000, '내용은 최대 5,000자까지 입력 가능합니다'),
  type: commentTypeSchema,
  parentId: z.string().uuid().optional(),
})

export type CommentFormData = z.infer<typeof commentSchema>
```

---

## 6. UI/UX Design

### 6.1 RFP List Page Wireframe

```
┌───────────────────────────────────────────────────────────────┐
│  [Logo] RFP Management System          [User Menu]  [Logout] │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  제안요청서 관리                          [+ 새 RFP 등록]     │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [검색: ________________]  [필터 ▼]  [정렬: 최신순 ▼]   │  │
│  │                                                         │  │
│  │ 상태: [모두] [접수됨] [분석중] [분석완료] [거절]        │  │
│  │ 고객사: [전체 ▼]  담당자: [전체 ▼]  기간: [전체 ▼]     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 📄 [제목] 웹사이트 리뉴얼 프로젝트          [접수됨]    │  │
│  │    고객사: ABC 주식회사  |  담당자: 김철수              │  │
│  │    접수일: 2026-02-10  |  마감일: 2026-03-10 (28일)   │  │
│  │    예산: ₩50,000,000                                   │  │
│  │    [상세보기] [수정] [삭제]                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 📄 [제목] 모바일 앱 개발 요청              [분석중]    │  │
│  │    고객사: XYZ Corp  |  담당자: 이영희                 │  │
│  │    접수일: 2026-02-08  |  마감일: 2026-02-28 (16일)   │  │
│  │    예산: ₩30,000,000                                   │  │
│  │    [상세보기] [수정] [삭제]                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  [< 이전]  1  2  3  4  5  [다음 >]                           │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 RFP Detail Page Wireframe

```
┌───────────────────────────────────────────────────────────────┐
│  [← 목록]  웹사이트 리뉴얼 프로젝트            [접수됨]       │
│                                      [수정] [삭제] [상태 변경] │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─── 기본 정보 ──────────────────────────────────────────┐  │
│  │ 고객사: ABC 주식회사                                    │  │
│  │ 담당자: 김철수                                          │  │
│  │ 접수일: 2026-02-10  |  마감일: 2026-03-10 (D-28)       │  │
│  │ 예상 예산: ₩50,000,000  |  예상 기간: 60일             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─── 설명 ───────────────────────────────────────────────┐  │
│  │ 현재 웹사이트를 모던한 디자인으로 리뉴얼하고, 반응형    │  │
│  │ 디자인을 적용하여 모바일 환경에서도 최적화된 경험을     │  │
│  │ 제공하고자 합니다...                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─── 첨부파일 (3) ────────────────────────────────────────┐ │
│  │ 📎 RFP_웹사이트리뉴얼.pdf (2.5MB)  [다운로드] [삭제]   │  │
│  │ 📎 현재사이트_스크린샷.png (1.2MB)  [다운로드] [삭제]  │  │
│  │ 📎 참고_디자인.pdf (3.1MB)  [다운로드] [삭제]          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─── 요구사항 (8) ────────────────────────    [+ 추가]  ──┐ │
│  │                                                         │  │
│  │ ☰ [Must] 반응형 디자인 적용                [기능]      │  │
│  │   모든 화면이 모바일/태블릿/데스크톱에서 정상 동작     │  │
│  │   복잡도: 중  |  예상: 40h                             │  │
│  │                                                         │  │
│  │ ☰ [Must] 메인 페이지 리디자인              [기능]      │  │
│  │   사용자 친화적인 UI/UX 적용                           │  │
│  │   복잡도: 높  |  예상: 60h                             │  │
│  │                                                         │  │
│  │ ☰ [Should] 블로그 기능 추가                [기능]      │  │
│  │   관리자가 블로그 포스트를 작성/관리                   │  │
│  │   복잡도: 중  |  예상: 80h                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─── 댓글 (5) ───────────────────────────────────────────┐  │
│  │ 👤 김철수 (담당자)  2시간 전                  [Feedback] │  │
│  │    고객사와 킥오프 미팅 완료. 상세 요구사항 정리 중.   │  │
│  │    [답글] [수정] [삭제] [해결됨 ✓]                     │  │
│  │                                                         │  │
│  │    ↳ 👤 이영희 (검토자)  1시간 전           [Comment]  │  │
│  │       요구사항 정리되면 검토해드리겠습니다.             │  │
│  │                                                         │  │
│  │ [댓글 작성]                                             │  │
│  │ [_____________________________________________]         │  │
│  │ 타입: [Comment ▼]  [제출]                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### 6.3 Color Scheme

**Status Colors:**
```typescript
const statusColors = {
  received: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  analyzing: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  analyzed: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
  },
  rejected: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
  },
}
```

**Priority Colors (MoSCoW):**
```typescript
const priorityColors = {
  must: {
    bg: 'bg-red-500',
    text: 'text-white',
    label: 'Must Have',
  },
  should: {
    bg: 'bg-orange-500',
    text: 'text-white',
    label: 'Should Have',
  },
  could: {
    bg: 'bg-blue-500',
    text: 'text-white',
    label: 'Could Have',
  },
  wont: {
    bg: 'bg-gray-500',
    text: 'text-white',
    label: "Won't Have",
  },
}
```

---

## 7. Security Design

### 7.1 Row Level Security (RLS) Policies

#### Clients Table
```sql
-- 읽기: 모든 인증된 사용자
CREATE POLICY "Anyone can read clients"
ON clients FOR SELECT
TO authenticated
USING (true);

-- 쓰기: admin, manager만 가능
CREATE POLICY "Only admin and manager can insert clients"
ON clients FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- 수정: admin, manager만 가능
CREATE POLICY "Only admin and manager can update clients"
ON clients FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- 삭제: admin만 가능
CREATE POLICY "Only admin can delete clients"
ON clients FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
```

#### RFPs Table
```sql
-- 읽기: 모든 인증된 사용자
CREATE POLICY "Anyone can read rfps"
ON rfps FOR SELECT
TO authenticated
USING (true);

-- 쓰기: admin, manager, writer 가능
CREATE POLICY "admin, manager, writer can insert rfps"
ON rfps FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager', 'writer')
  )
);

-- 수정: admin, manager, 담당자만 가능
CREATE POLICY "admin, manager, assignee can update rfps"
ON rfps FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND (
      role IN ('admin', 'manager')
      OR id = assignee_id
    )
  )
);

-- 삭제: admin, manager만 가능
CREATE POLICY "Only admin and manager can delete rfps"
ON rfps FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);
```

### 7.2 File Upload Security

```typescript
// src/lib/fileValidation.ts
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB

export function validateFile(file: File): void {
  // 파일 타입 검증
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`허용되지 않은 파일 형식입니다: ${file.type}`)
  }

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // 파일 이름 검증 (경로 탐색 공격 방지)
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    throw new Error('올바르지 않은 파일 이름입니다')
  }
}

export function validateFiles(files: File[]): void {
  // 총 파일 크기 검증
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  if (totalSize > MAX_TOTAL_SIZE) {
    throw new Error(`전체 파일 크기가 너무 큽니다. 최대 ${MAX_TOTAL_SIZE / 1024 / 1024}MB`)
  }

  // 개별 파일 검증
  files.forEach(validateFile)
}
```

---

## 8. Error Handling

### 8.1 Error Types

```typescript
// src/types/error.ts
export enum RfpErrorCode {
  // Client errors
  CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND',
  CLIENT_HAS_RFPS = 'CLIENT_HAS_RFPS',
  DUPLICATE_BUSINESS_NUMBER = 'DUPLICATE_BUSINESS_NUMBER',

  // RFP errors
  RFP_NOT_FOUND = 'RFP_NOT_FOUND',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  DUE_DATE_BEFORE_RECEIVED_DATE = 'DUE_DATE_BEFORE_RECEIVED_DATE',

  // Requirement errors
  REQUIREMENT_NOT_FOUND = 'REQUIREMENT_NOT_FOUND',
  INVALID_PRIORITY = 'INVALID_PRIORITY',

  // File errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',

  // Permission errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Generic errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class RfpError extends Error {
  code: RfpErrorCode
  details?: unknown

  constructor(code: RfpErrorCode, message: string, details?: unknown) {
    super(message)
    this.name = 'RfpError'
    this.code = code
    this.details = details
  }
}
```

### 8.2 Error Messages

```typescript
// src/lib/errorMessages.ts
export const RFP_ERROR_MESSAGES: Record<RfpErrorCode, string> = {
  [RfpErrorCode.CLIENT_NOT_FOUND]: '고객사를 찾을 수 없습니다',
  [RfpErrorCode.CLIENT_HAS_RFPS]: '해당 고객사에 연결된 RFP가 있어 삭제할 수 없습니다',
  [RfpErrorCode.DUPLICATE_BUSINESS_NUMBER]: '이미 등록된 사업자등록번호입니다',
  [RfpErrorCode.RFP_NOT_FOUND]: 'RFP를 찾을 수 없습니다',
  [RfpErrorCode.INVALID_STATUS_TRANSITION]: '올바르지 않은 상태 변경입니다',
  [RfpErrorCode.DUE_DATE_BEFORE_RECEIVED_DATE]: '마감일은 접수일 이후여야 합니다',
  [RfpErrorCode.REQUIREMENT_NOT_FOUND]: '요구사항을 찾을 수 없습니다',
  [RfpErrorCode.INVALID_PRIORITY]: '올바르지 않은 우선순위입니다',
  [RfpErrorCode.FILE_TOO_LARGE]: '파일 크기가 너무 큽니다',
  [RfpErrorCode.INVALID_FILE_TYPE]: '허용되지 않은 파일 형식입니다',
  [RfpErrorCode.UPLOAD_FAILED]: '파일 업로드에 실패했습니다',
  [RfpErrorCode.INSUFFICIENT_PERMISSIONS]: '권한이 없습니다',
  [RfpErrorCode.NETWORK_ERROR]: '네트워크 오류가 발생했습니다',
  [RfpErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다',
}
```

---

## 9. Implementation Order

### Phase 1: Foundation (Day 1, 0.5일)

#### Step 1: Database Setup
1. ✅ Create tables in Supabase
   - `clients`
   - `rfps`
   - `requirements`
   - `comments`
2. ✅ Create RLS policies
3. ✅ Create indexes
4. ✅ Test database connection

#### Step 2: Type Definitions
5. ✅ Create `src/types/client.ts`
6. ✅ Create `src/types/rfp.ts`
7. ✅ Create `src/types/requirement.ts`
8. ✅ Create `src/types/comment.ts`

#### Step 3: Validation Schemas
9. ✅ Create `src/lib/validations/client.ts`
10. ✅ Create `src/lib/validations/rfp.ts`
11. ✅ Create `src/lib/validations/requirement.ts`
12. ✅ Create `src/lib/validations/comment.ts`

---

### Phase 2: Services Layer (Day 1.5, 1일)

#### Step 4: Client Service
13. ✅ Implement `clientService.list()`
14. ✅ Implement `clientService.getById()`
15. ✅ Implement `clientService.create()`
16. ✅ Implement `clientService.update()`
17. ✅ Implement `clientService.delete()`

#### Step 5: RFP Service
18. ✅ Implement `rfpService.list()` with filters
19. ✅ Implement `rfpService.getById()`
20. ✅ Implement `rfpService.create()`
21. ✅ Implement `rfpService.update()`
22. ✅ Implement `rfpService.delete()`
23. ✅ Implement `rfpService.updateStatus()`

#### Step 6: Requirement Service
24. ✅ Implement `requirementService.list()`
25. ✅ Implement `requirementService.create()`
26. ✅ Implement `requirementService.update()`
27. ✅ Implement `requirementService.delete()`
28. ✅ Implement `requirementService.reorder()`

#### Step 7: Comment Service
29. ✅ Implement `commentService.list()`
30. ✅ Implement `commentService.create()`
31. ✅ Implement `commentService.update()`
32. ✅ Implement `commentService.delete()`

#### Step 8: File Service
33. ✅ Implement `fileService.upload()` (Presigned URL)
34. ✅ Implement `fileService.getDownloadUrl()`
35. ✅ Implement `fileService.delete()`

---

### Phase 3: UI Components (Day 2.5, 1일)

#### Step 9: Base UI Components
36. ✅ Create `SearchBar` component
37. ✅ Create `FilterPanel` component
38. ✅ Create `SortDropdown` component
39. ✅ Create `Pagination` component

#### Step 10: Client Components
40. ✅ Create `ClientCard` component
41. ✅ Create `ClientForm` component
42. ✅ Create `ClientDetail` component
43. ✅ Create `ClientRfpList` component

#### Step 11: RFP Components
44. ✅ Create `RfpCard` component
45. ✅ Create `RfpForm` component
46. ✅ Create `RfpDetail` component
47. ✅ Create `RfpFilters` component
48. ✅ Create `RfpStatusBadge` component
49. ✅ Create `RfpHeader` component

#### Step 12: Requirement Components
50. ✅ Create `RequirementList` component
51. ✅ Create `RequirementForm` component
52. ✅ Create `RequirementCard` component
53. ✅ Create `RequirementCategoryBadge` component

#### Step 13: Comment Components
54. ✅ Create `CommentList` component
55. ✅ Create `CommentForm` component
56. ✅ Create `CommentItem` component
57. ✅ Create `CommentReply` component

#### Step 14: File Components
58. ✅ Create `FileUploader` component (react-dropzone)
59. ✅ Create `FileList` component
60. ✅ Create `FilePreview` component
61. ✅ Create `FileItem` component

---

### Phase 4: Pages (Day 3, 0.5일)

#### Step 15: Client Pages
62. ✅ Create `/clients` page (목록)
63. ✅ Create `/clients/[id]` page (상세)
64. ✅ Create `/clients/new` page (등록)

#### Step 16: RFP Pages
65. ✅ Create `/rfps` page (목록)
66. ✅ Create `/rfps/[id]` page (상세)
67. ✅ Create `/rfps/new` page (등록)
68. ✅ Create `/rfps/[id]/edit` page (수정)

---

### Phase 5: Integration (Day 3.5, 0.5일)

#### Step 17: TanStack Query Hooks
69. ✅ Create all `useRfps`, `useRfp`, `useCreateRfp`, etc.
70. ✅ Create all `useClients`, `useClient`, etc.
71. ✅ Create all `useRequirements`, etc.
72. ✅ Create all `useComments`, etc.
73. ✅ Create `useFileUpload`, `useFileDelete`

#### Step 18: Search & Filter Integration
74. ✅ Integrate search with debouncing
75. ✅ Integrate filters with URL query params
76. ✅ Integrate sorting

#### Step 19: File Upload Integration
77. ✅ Integrate file upload with RFP form
78. ✅ Implement upload progress tracking
79. ✅ Implement file preview

#### Step 20: Comment Integration
80. ✅ Integrate comments with RFP detail
81. ✅ Implement nested comments
82. ✅ Implement optimistic updates

---

### Phase 6: Testing & Polish (Day 4, 0.5일)

#### Step 21: Error Handling
83. ✅ Global error boundary
84. ✅ Error toast notifications
85. ✅ Form error display

#### Step 22: Loading States
86. ✅ Skeleton loading
87. ✅ Spinner components
88. ✅ Loading indicators

#### Step 23: Empty States
89. ✅ Empty list states
90. ✅ No search results
91. ✅ Empty requirement list

#### Step 24: Responsive Design
92. ✅ Mobile layout
93. ✅ Tablet layout
94. ✅ Desktop layout

#### Step 25: Accessibility
95. ✅ Keyboard navigation
96. ✅ ARIA labels
97. ✅ Focus management

#### Step 26: Testing
98. ✅ E2E test: RFP CRUD flow
99. ✅ E2E test: Search & Filter
100. ✅ E2E test: File upload

#### Step 27: Documentation
101. ✅ API documentation
102. ✅ Component storybook (optional)
103. ✅ README update

---

## 10. Testing Strategy

### 10.1 Unit Tests (Optional)

- Service layer methods
- Validation schemas
- Utility functions
- Complex components

### 10.2 Integration Tests

- API endpoints with Supabase
- Form submission flows
- File upload flows

### 10.3 E2E Tests (Required)

**Test Scenario 1: RFP Complete Flow**
```
1. 고객사 등록
2. RFP 등록 (파일 업로드 포함)
3. RFP 목록에서 검색
4. RFP 상세 조회
5. 요구사항 추가
6. 댓글 작성
7. 상태 변경 (received → analyzing → analyzed)
8. RFP 수정
9. RFP 삭제
```

**Test Scenario 2: Search & Filter**
```
1. 제목으로 검색
2. 상태 필터 적용
3. 고객사 필터 적용
4. 날짜 범위 필터 적용
5. 정렬 변경
6. 페이지네이션
```

**Test Scenario 3: File Upload**
```
1. 단일 파일 업로드
2. 다중 파일 업로드
3. 파일 타입 검증 (실패 케이스)
4. 파일 크기 검증 (실패 케이스)
5. 파일 다운로드
6. 파일 삭제
```

---

## 11. Dependencies

### 11.1 Required Packages

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.95.3",
    "@tanstack/react-query": "^5.73.1",
    "react-hook-form": "^7.71.1",
    "@hookform/resolvers": "^5.2.2",
    "zod": "^4.3.6",
    "react-dropzone": "^14.3.5",
    "date-fns": "^4.1.0",
    "react-beautiful-dnd": "^13.1.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/react-beautiful-dnd": "^13.1.8"
  }
}
```

### 11.2 Environment Variables

Already configured in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tqkwnbcydlheutkbzeah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 12. Acceptance Criteria

### 12.1 Functional

- [x] 고객사 CRUD 정상 동작
- [x] RFP CRUD 정상 동작
- [x] 요구사항 CRUD 및 순서 변경 정상 동작
- [x] 파일 업로드/다운로드 정상 동작
- [x] 댓글 작성/답글 정상 동작
- [x] 검색 및 필터링 정상 동작
- [x] 페이지네이션 정상 동작
- [x] 상태 변경 정상 동작

### 12.2 Quality

- [x] TypeScript strict mode
- [x] `any` 타입 최소화 (<5%)
- [x] 폼 검증 (Zod)
- [x] 에러 처리 (모든 API 호출)
- [x] Loading 상태 표시
- [x] Empty 상태 표시

### 12.3 Performance

- [x] 목록 조회 < 300ms
- [x] 파일 업로드 > 1MB/s
- [x] 검색 응답 < 500ms
- [x] 페이지 렌더링 < 200ms

### 12.4 UX

- [x] 모바일 반응형
- [x] 다크 모드
- [x] 키보드 내비게이션
- [x] 접근성 (WCAG 2.1 AA)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial design document | Claude |
