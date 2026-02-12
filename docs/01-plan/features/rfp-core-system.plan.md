# rfp-core-system Plan Document

> **Feature**: RFP Core System (제안요청서 핵심 시스템)
> **Priority**: P0 (Critical)
> **Estimated Duration**: 2-3 days
> **Dependencies**: auth-system, Supabase
> **Status**: Planning

---

## 1. Feature Overview

### 1.1 Purpose

RFP Management System의 핵심 기능으로, 제안요청서(RFP) 접수부터 요구사항 분석까지의 전체 프로세스를 관리하는 시스템입니다. 고객사 관리, RFP CRUD, 요구사항 분석, 파일 업로드, 댓글/협업 기능을 포함합니다.

### 1.2 Business Value

- **효율성**: RFP 접수부터 분석까지 통합 관리로 업무 시간 50% 단축
- **정확성**: 요구사항 체계적 관리로 누락 방지
- **협업**: 팀원 간 실시간 코멘트로 의사소통 개선
- **추적성**: RFP 진행 상태 실시간 모니터링
- **AI 활용**: 요구사항 자동 분석 및 위험도 평가

### 1.3 Scope

**In Scope:**
- **Client Management**: 고객사 CRUD (생성, 조회, 수정, 삭제)
- **RFP Management**: RFP CRUD, 검색, 필터링, 정렬
- **Requirement Management**: 요구사항 CRUD, 분류, 우선순위
- **File Upload**: RFP 문서 업로드 (PDF, DOCX, etc.)
- **Status Management**: RFP 진행 상태 관리 (received → analyzing → analyzed → rejected)
- **Comment System**: RFP/요구사항에 대한 댓글 및 답글
- **Search & Filter**: 고급 검색 및 필터링 기능

**Out of Scope (향후 확장):**
- AI 자동 분석 (Phase 2)
- 제안서 생성 (별도 feature)
- UI 프로토타입 관리 (별도 feature)
- 대시보드 통계 (별도 feature)
- 알림 시스템 (별도 feature)

---

## 2. Requirements

### 2.1 Functional Requirements

#### FR-1: Client Management (고객사 관리)
- **FR-1.1**: 고객사 등록 (회사명, 사업자번호, 업종, 담당자 정보)
- **FR-1.2**: 고객사 목록 조회 (페이지네이션, 검색)
- **FR-1.3**: 고객사 상세 정보 조회
- **FR-1.4**: 고객사 정보 수정
- **FR-1.5**: 고객사 삭제 (연결된 RFP 있으면 삭제 불가)
- **FR-1.6**: 고객사별 RFP 목록 조회

#### FR-2: RFP Management (제안요청서 관리)
- **FR-2.1**: RFP 등록
  - 제목, 고객사, 접수일, 마감일, 예상 예산, 설명 입력
  - 첨부파일 업로드 (다중 파일 지원)
  - 담당자 지정
- **FR-2.2**: RFP 목록 조회
  - 페이지네이션 (10/20/50개씩)
  - 정렬 (최신순, 마감일순, 상태순)
  - 필터링 (상태, 고객사, 담당자, 기간)
  - 검색 (제목, 설명)
- **FR-2.3**: RFP 상세 조회
  - 기본 정보
  - 첨부파일 다운로드
  - 요구사항 목록
  - 댓글 목록
- **FR-2.4**: RFP 수정
- **FR-2.5**: RFP 삭제 (Cascade: 연결된 요구사항, 댓글도 삭제)
- **FR-2.6**: RFP 상태 변경
  - received → analyzing (분석 시작)
  - analyzing → analyzed (분석 완료)
  - any → rejected (거절)

#### FR-3: Requirement Management (요구사항 관리)
- **FR-3.1**: 요구사항 추가
  - 카테고리 선택 (functional, non-functional, technical, business)
  - 우선순위 선택 (must, should, could, wont - MoSCoW)
  - 제목, 설명, 수용 기준 입력
- **FR-3.2**: 요구사항 목록 조회 (RFP별)
- **FR-3.3**: 요구사항 수정
- **FR-3.4**: 요구사항 삭제
- **FR-3.5**: 요구사항 순서 변경 (Drag & Drop)
- **FR-3.6**: 요구사항 복잡도/예상 시간 입력

#### FR-4: File Upload (파일 업로드)
- **FR-4.1**: 단일/다중 파일 업로드 (최대 10개)
- **FR-4.2**: 파일 타입 제한 (PDF, DOCX, XLSX, PPT, 이미지)
- **FR-4.3**: 파일 크기 제한 (개별 10MB, 총 50MB)
- **FR-4.4**: 업로드 진행률 표시
- **FR-4.5**: 파일 다운로드
- **FR-4.6**: 파일 삭제
- **FR-4.7**: 파일 미리보기 (이미지, PDF)

#### FR-5: Comment System (댓글 시스템)
- **FR-5.1**: 댓글 작성 (RFP, 요구사항에)
- **FR-5.2**: 댓글 수정/삭제 (작성자만)
- **FR-5.3**: 답글 작성 (대댓글)
- **FR-5.4**: 댓글 타입 (comment, feedback, approval, rejection)
- **FR-5.5**: 댓글 해결 상태 (isResolved)
- **FR-5.6**: 댓글 알림 (작성자, 담당자에게)

#### FR-6: Search & Filter (검색 및 필터)
- **FR-6.1**: 전체 텍스트 검색 (제목, 설명)
- **FR-6.2**: 복합 필터
  - 상태 (received, analyzing, analyzed, rejected)
  - 고객사
  - 담당자
  - 기간 (접수일, 마감일)
  - 예산 범위
- **FR-6.3**: 정렬
  - 최신순, 오래된순
  - 마감일 임박순
  - 예산 높은순/낮은순
- **FR-6.4**: 검색 결과 하이라이트

### 2.2 Non-Functional Requirements

#### NFR-1: Performance
- 목록 조회 응답 시간 < 300ms (100개 항목)
- 파일 업로드 속도 > 1MB/s
- 검색 응답 시간 < 500ms
- 페이지 렌더링 < 200ms

#### NFR-2: Scalability
- 최대 10,000개 RFP 저장
- 동시 사용자 100명 지원
- 파일 스토리지 100GB

#### NFR-3: Usability
- 직관적인 UI/UX (학습 시간 < 10분)
- 모바일 반응형 디자인
- 키보드 단축키 지원
- 다크 모드 지원

#### NFR-4: Reliability
- 데이터 무결성 보장 (Supabase ACID)
- 자동 백업 (Supabase 관리)
- 에러 복구 (자동 재시도)

#### NFR-5: Security
- 역할 기반 접근 제어 (RBAC)
- 파일 업로드 보안 (바이러스 스캔, 타입 검증)
- SQL Injection 방지
- XSS 방지

---

## 3. Technical Specifications

### 3.1 Technology Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Database | Supabase PostgreSQL | 관계형 DB, RLS, 실시간 |
| File Storage | Supabase Storage | 통합 스토리지, CDN, Presigned URL |
| Backend API | Next.js 15 Server Actions | 서버 컴포넌트, 타입 안전 |
| Frontend | Next.js 15 + TypeScript | SSR, CSR 하이브리드 |
| State Management | TanStack Query + Zustand | 서버 상태, 클라이언트 상태 분리 |
| Form Handling | React Hook Form + Zod | 타입 안전 폼 검증 |
| UI Components | Tailwind CSS + shadcn/ui | 재사용 컴포넌트, 커스터마이징 |

### 3.2 Architecture

```
┌───────────────────────────────────────────────────────┐
│  Client (Browser)                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Pages                                            │ │
│  │  - /rfps (목록)                                  │ │
│  │  - /rfps/[id] (상세)                             │ │
│  │  - /rfps/new (등록)                              │ │
│  │  - /clients (고객사 목록)                         │ │
│  │  - /clients/[id] (고객사 상세)                    │ │
│  └─────────────────────────────────────────────────┘ │
│                           ↓                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Components                                       │ │
│  │  - RfpCard, RfpForm, RfpDetail                  │ │
│  │  - ClientCard, ClientForm                       │ │
│  │  - RequirementList, RequirementForm             │ │
│  │  - CommentList, CommentForm                     │ │
│  │  - FileUploader, FileList                       │ │
│  └─────────────────────────────────────────────────┘ │
│                           ↓                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Hooks (TanStack Query)                           │ │
│  │  - useRfps, useRfp, useCreateRfp, useUpdateRfp  │ │
│  │  - useClients, useClient, useCreateClient       │ │
│  │  - useRequirements, useCreateRequirement        │ │
│  │  - useComments, useCreateComment                │ │
│  │  - useFileUpload                                │ │
│  └─────────────────────────────────────────────────┘ │
│                           ↓                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Services                                         │ │
│  │  - rfpService: CRUD + Search                    │ │
│  │  - clientService: CRUD                          │ │
│  │  - requirementService: CRUD + Reorder           │ │
│  │  - commentService: CRUD + Nested                │ │
│  │  - fileService: Upload + Download               │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
                           ↓ HTTP/REST
┌───────────────────────────────────────────────────────┐
│  Next.js Server (App Router)                          │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Server Actions                                   │ │
│  │  - createRfp, updateRfp, deleteRfp              │ │
│  │  - createClient, updateClient                   │ │
│  │  - uploadFile, deleteFile                       │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
                           ↓
┌───────────────────────────────────────────────────────┐
│  Supabase                                             │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ PostgreSQL       │  │ Storage          │          │
│  │  - clients       │  │  - rfp-files/    │          │
│  │  - rfps          │  │  - attachments/  │          │
│  │  - requirements  │  └──────────────────┘          │
│  │  - comments      │                                 │
│  └──────────────────┘                                 │
└───────────────────────────────────────────────────────┘
```

### 3.3 Data Model

기존 `schema.md` 참조:
- **Client**: 고객사 (id, name, businessNumber, industry, contact, etc.)
- **RFP**: 제안요청서 (id, title, clientId, receivedDate, dueDate, status, attachments, etc.)
- **Requirement**: 요구사항 (id, rfpId, category, priority, title, description, complexity, etc.)
- **Comment**: 댓글 (id, targetType, targetId, content, authorId, parentId, isResolved, etc.)

### 3.4 API Design

#### Client API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | 고객사 목록 (페이지네이션, 검색) |
| GET | `/api/clients/[id]` | 고객사 상세 |
| POST | `/api/clients` | 고객사 등록 |
| PATCH | `/api/clients/[id]` | 고객사 수정 |
| DELETE | `/api/clients/[id]` | 고객사 삭제 |

#### RFP API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rfps` | RFP 목록 (필터, 정렬, 검색) |
| GET | `/api/rfps/[id]` | RFP 상세 (요구사항, 댓글 포함) |
| POST | `/api/rfps` | RFP 등록 |
| PATCH | `/api/rfps/[id]` | RFP 수정 |
| DELETE | `/api/rfps/[id]` | RFP 삭제 |
| PATCH | `/api/rfps/[id]/status` | RFP 상태 변경 |

#### Requirement API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rfps/[id]/requirements` | 요구사항 목록 |
| POST | `/api/rfps/[id]/requirements` | 요구사항 추가 |
| PATCH | `/api/requirements/[id]` | 요구사항 수정 |
| DELETE | `/api/requirements/[id]` | 요구사항 삭제 |
| PATCH | `/api/requirements/[id]/order` | 요구사항 순서 변경 |

#### Comment API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments?targetType=rfp&targetId=[id]` | 댓글 목록 |
| POST | `/api/comments` | 댓글 작성 |
| PATCH | `/api/comments/[id]` | 댓글 수정 |
| DELETE | `/api/comments/[id]` | 댓글 삭제 |

#### File API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | 파일 업로드 (Presigned URL) |
| GET | `/api/files/[id]` | 파일 다운로드 URL |
| DELETE | `/api/files/[id]` | 파일 삭제 |

---

## 4. User Stories

### US-1: RFP 접수
**As a** 담당자
**I want to** 고객사로부터 받은 RFP를 시스템에 등록
**So that** 팀원들과 공유하고 체계적으로 관리할 수 있다

**Acceptance Criteria:**
- 제목, 고객사, 접수일, 마감일, 예상 예산 입력 필드
- 설명 입력 (Markdown 지원)
- 첨부파일 다중 업로드 (드래그앤드롭)
- 담당자 지정 (자동 완성)
- 등록 완료 시 RFP 상세 페이지로 이동
- 등록 완료 알림 (담당자에게)

### US-2: RFP 목록 조회 및 검색
**As a** 팀원
**I want to** RFP 목록을 검색하고 필터링
**So that** 원하는 RFP를 빠르게 찾을 수 있다

**Acceptance Criteria:**
- 목록 표시 (카드형/테이블형 전환)
- 검색창 (제목, 설명 전체 텍스트 검색)
- 필터: 상태, 고객사, 담당자, 기간
- 정렬: 최신순, 마감일순
- 페이지네이션 (10/20/50개씩)
- 검색 결과 하이라이트

### US-3: 요구사항 분석
**As a** 담당자
**I want to** RFP의 요구사항을 체계적으로 정리
**So that** 제안서 작성 시 누락 없이 대응할 수 있다

**Acceptance Criteria:**
- 요구사항 추가 폼 (카테고리, 우선순위, 제목, 설명)
- 요구사항 목록 (카테고리별 그룹핑)
- 요구사항 편집/삭제
- 드래그앤드롭으로 순서 변경
- MoSCoW 우선순위 표시 (색상 구분)
- 복잡도 및 예상 시간 입력

### US-4: 팀 협업 (댓글)
**As a** 팀원
**I want to** RFP에 대한 의견을 댓글로 공유
**So that** 팀원들과 효율적으로 소통할 수 있다

**Acceptance Criteria:**
- 댓글 작성 폼 (Markdown 지원)
- 댓글 목록 (최신순/오래된순)
- 답글 작성 (대댓글)
- 댓글 타입 선택 (comment, feedback, approval, rejection)
- 댓글 해결 상태 토글 (isResolved)
- 댓글 알림 (실시간)
- 댓글 수정/삭제 (작성자만)

### US-5: 고객사 관리
**As a** 관리자
**I want to** 고객사 정보를 체계적으로 관리
**So that** RFP 접수 시 빠르게 선택하고 히스토리를 추적할 수 있다

**Acceptance Criteria:**
- 고객사 등록 폼 (회사명, 사업자번호, 업종, 담당자 정보)
- 고객사 목록 (검색, 정렬)
- 고객사 상세 페이지 (기본 정보 + RFP 히스토리)
- 고객사 정보 수정
- 고객사 삭제 (연결된 RFP 있으면 경고)

---

## 5. Implementation Plan

### 5.1 Phase Breakdown

#### Phase 1: Database & Types (0.5일)
1. Supabase 테이블 생성 (clients, rfps, requirements, comments)
2. RLS 정책 설정
3. TypeScript 타입 정의 (src/types/)
4. Zod 검증 스키마 (src/lib/validations/)

#### Phase 2: Services Layer (1일)
5. clientService: CRUD
6. rfpService: CRUD + Search + Filter
7. requirementService: CRUD + Reorder
8. commentService: CRUD + Nested
9. fileService: Upload + Download (Presigned URL)

#### Phase 3: UI Components (1일)
10. Client 컴포넌트 (ClientCard, ClientForm, ClientDetail)
11. RFP 컴포넌트 (RfpCard, RfpForm, RfpDetail, RfpFilters)
12. Requirement 컴포넌트 (RequirementList, RequirementForm, RequirementCard)
13. Comment 컴포넌트 (CommentList, CommentForm, CommentItem)
14. File 컴포넌트 (FileUploader, FileList, FilePreview)
15. 공통 컴포넌트 (SearchBar, FilterPanel, SortDropdown, Pagination)

#### Phase 4: Pages (0.5일)
16. `/clients` - 고객사 목록
17. `/clients/[id]` - 고객사 상세
18. `/clients/new` - 고객사 등록
19. `/rfps` - RFP 목록
20. `/rfps/[id]` - RFP 상세
21. `/rfps/new` - RFP 등록
22. `/rfps/[id]/edit` - RFP 수정

#### Phase 5: Integration (0.5일)
23. TanStack Query hooks (useRfps, useClients, etc.)
24. Search & Filter 통합
25. File Upload 통합
26. Comment 실시간 업데이트
27. 에러 처리 및 로딩 상태

#### Phase 6: Testing & Polish (0.5일)
28. E2E 테스트 (주요 플로우)
29. 반응형 디자인 검증
30. 접근성 검증 (a11y)
31. 성능 최적화 (이미지 lazy load, 가상 스크롤)
32. 문서화

### 5.2 File Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── rfps/
│   │   │   ├── page.tsx              # RFP 목록
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # RFP 상세
│   │   │   ├── [id]/edit/
│   │   │   │   └── page.tsx          # RFP 수정
│   │   │   └── new/
│   │   │       └── page.tsx          # RFP 등록
│   │   └── clients/
│   │       ├── page.tsx              # 고객사 목록
│   │       ├── [id]/
│   │       │   └── page.tsx          # 고객사 상세
│   │       └── new/
│   │           └── page.tsx          # 고객사 등록
├── components/
│   ├── rfp/
│   │   ├── rfp-card.tsx
│   │   ├── rfp-form.tsx
│   │   ├── rfp-detail.tsx
│   │   ├── rfp-filters.tsx
│   │   └── rfp-status-badge.tsx
│   ├── client/
│   │   ├── client-card.tsx
│   │   ├── client-form.tsx
│   │   └── client-detail.tsx
│   ├── requirement/
│   │   ├── requirement-list.tsx
│   │   ├── requirement-form.tsx
│   │   └── requirement-card.tsx
│   ├── comment/
│   │   ├── comment-list.tsx
│   │   ├── comment-form.tsx
│   │   └── comment-item.tsx
│   └── file/
│       ├── file-uploader.tsx
│       ├── file-list.tsx
│       └── file-preview.tsx
├── hooks/
│   ├── useRfps.ts
│   ├── useRfp.ts
│   ├── useClients.ts
│   ├── useRequirements.ts
│   ├── useComments.ts
│   └── useFileUpload.ts
├── services/
│   ├── rfp.service.ts
│   ├── client.service.ts
│   ├── requirement.service.ts
│   ├── comment.service.ts
│   └── file.service.ts
├── types/
│   ├── rfp.ts
│   ├── client.ts
│   ├── requirement.ts
│   └── comment.ts
└── lib/
    └── validations/
        ├── rfp.ts
        ├── client.ts
        ├── requirement.ts
        └── comment.ts
```

### 5.3 Dependencies

**External:**
- Supabase PostgreSQL + Storage
- TanStack Query v5
- React Hook Form + Zod
- shadcn/ui components
- date-fns (날짜 처리)
- react-dropzone (파일 업로드)

**Internal:**
- auth-system (완료됨)

### 5.4 Milestones

| Milestone | Deliverables | Target Date |
|-----------|-------------|-------------|
| M1: Foundation | 테이블, 타입, 서비스 완료 | Day 1.5 |
| M2: Components | UI 컴포넌트 완료 | Day 2.5 |
| M3: Pages | 페이지 완료, 기본 CRUD | Day 3 |
| M4: Integration | 검색, 필터, 파일, 댓글 통합 | Day 3.5 |
| M5: Testing | 테스트, 문서화 완료 | Day 4 |

---

## 6. Risks & Mitigation

### Risk 1: 파일 업로드 성능
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Presigned URL 사용, 청크 업로드, 진행률 표시

### Risk 2: 복잡한 검색/필터 쿼리
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: Supabase 인덱스 최적화, 쿼리 캐싱

### Risk 3: 실시간 댓글 동기화
- **Impact**: Low
- **Probability**: Low
- **Mitigation**: TanStack Query 자동 리페치, Optimistic Update

### Risk 4: 대용량 RFP 목록
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: 가상 스크롤, 페이지네이션, lazy loading

---

## 7. Success Criteria

### 7.1 Functional Criteria
- ✅ 고객사 CRUD 정상 동작
- ✅ RFP CRUD 정상 동작
- ✅ 요구사항 관리 정상 동작
- ✅ 파일 업로드/다운로드 정상 동작
- ✅ 댓글 작성/답글 정상 동작
- ✅ 검색/필터링 정상 동작

### 7.2 Quality Criteria
- ✅ TypeScript strict mode
- ✅ `any` 타입 사용 최소화 (<5%)
- ✅ 폼 검증 (Zod schema)
- ✅ 에러 처리 (모든 API 호출)
- ✅ Loading 상태 표시
- ✅ 빈 상태 처리 (Empty State)

### 7.3 Performance Criteria
- ✅ 목록 조회 < 300ms
- ✅ 파일 업로드 > 1MB/s
- ✅ 검색 응답 < 500ms
- ✅ 페이지 렌더링 < 200ms

### 7.4 UX Criteria
- ✅ 모바일 반응형
- ✅ 다크 모드
- ✅ 키보드 내비게이션
- ✅ 접근성 (WCAG 2.1 AA)

---

## 8. Out of Scope (Future Enhancements)

- **AI 자동 분석**: RFP 요구사항 자동 추출 및 분석 (GPT-4)
- **제안서 자동 생성**: AI 기반 제안서 초안 작성
- **UI 프로토타입 생성**: Figma 통합, AI 화면 생성
- **대시보드**: RFP 통계, 차트, 분석
- **알림 시스템**: 이메일, Slack 알림
- **템플릿 관리**: RFP/제안서 템플릿
- **워크플로우 자동화**: 상태 변경 시 자동 작업
- **버전 관리**: RFP 변경 이력 추적

---

## 9. References

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [react-dropzone](https://react-dropzone.js.org/)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial plan document | Claude |
