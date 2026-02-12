# 네이밍 규칙 (Naming Conventions)

> RFP Management System 네이밍 규칙 상세 가이드

**버전**: 1.0.0
**작성일**: 2026-02-11

---

## 📋 목차

1. [기본 규칙](#1-기본-규칙)
2. [도메인 특화 네이밍](#2-도메인-특화-네이밍)
3. [함수 네이밍](#3-함수-네이밍)
4. [컴포넌트 네이밍](#4-컴포넌트-네이밍)
5. [파일 네이밍](#5-파일-네이밍)
6. [상수 네이밍](#6-상수-네이밍)

---

## 1. 기본 규칙

### 1.1 케이스 규칙 요약

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `RfpList`, `ProposalCard` |
| 함수/변수 | camelCase | `getRfpById`, `isApproved` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 타입/인터페이스 | PascalCase | `User`, `RfpStatus` |
| 파일 (컴포넌트) | PascalCase | `RfpCard.tsx` |
| 파일 (유틸) | kebab-case | `api-client.ts` |
| 폴더 | kebab-case | `use-cases/` |

### 1.2 약어 사용 규칙

```typescript
// ✅ 일반적으로 인정되는 약어
RFP    // Request for Proposal (업계 표준)
API    // Application Programming Interface
UI     // User Interface
DB     // Database
ID     // Identifier

// ✅ 약어 케이스 규칙
const rfpId = 'rfp-123';           // ✅ camelCase에서는 소문자
const RfpCard = () => { };         // ✅ PascalCase에서는 첫 글자만 대문자
const API_BASE_URL = '...';        // ✅ 상수에서는 전체 대문자

// ❌ 피해야 할 약어
const prop = proposal;             // ❌ prop은 React props와 혼동
const req = requirement;           // ❌ req는 HTTP request와 혼동
const proto = prototype;           // ❌ 비표준 약어
```

---

## 2. 도메인 특화 네이밍

### 2.1 RFP 관련

```typescript
// ✅ 엔티티명
const rfp: RFP = { ... };
const rfpList: RFP[] = [];
const rfpCount = rfps.length;

// ✅ 함수명
getRfpById(id: string)
createRfp(data: CreateRfpDto)
updateRfpStatus(id: string, status: RfpStatus)
deleteRfp(id: string)
listRfps(filters?: RfpFilters)
analyzeRfp(rfpId: string)

// ✅ 컴포넌트명
<RfpList />
<RfpCard />
<RfpAnalysisPanel />
<RfpStatusBadge />
<RfpFilters />

// ❌ 나쁜 예
const rfps = { ... };              // ❌ 복수형은 배열에만
const RFPS = [];                   // ❌ 전체 대문자 지양
getRFP(id)                         // ❌ 약어 케이스 불일치
<RFPCard />                        // ❌ PascalCase에서 약어 전체 대문자
```

### 2.2 Proposal 관련

```typescript
// ✅ 엔티티명
const proposal: Proposal = { ... };
const proposals: Proposal[] = [];
const proposalSections: ProposalSection[] = [];

// ✅ 함수명
getProposalById(id: string)
createProposal(data: CreateProposalDto)
updateProposalContent(id: string, content: string)
approveProposal(proposalId: string, approverId: string)
deliverProposal(proposalId: string)
generateProposalSections(requirements: Requirement[])

// ✅ 컴포넌트명
<ProposalEditor />
<ProposalSectionList />
<ProposalReviewPanel />
<ProposalStatusBadge />
<ProposalTeamBuilder />

// ❌ 나쁜 예
const prop = { ... };              // ❌ prop은 React props와 혼동
newProposal()                      // ❌ create 명시
changeProposal()                   // ❌ update 명시
```

### 2.3 UI Prototype 관련

```typescript
// ✅ 엔티티명
const uiPrototype: UIPrototype = { ... };
const prototypes: UIPrototype[] = [];

// ✅ 함수명
getPrototypeById(id: string)
createPrototype(data: CreatePrototypeDto)
generatePrototype(requirements: Requirement[])
updatePrototypeImage(id: string, imageUrl: string)

// ✅ 컴포넌트명
<PrototypeGallery />
<PrototypeCard />
<PrototypeGenerator />
<PrototypePreview />

// ❌ 나쁜 예
const ui_proto = { ... };          // ❌ 스네이크 케이스
const UIProto = { ... };           // ❌ 비표준 약어
<UIProtoCard />                    // ❌ 비표준 약어
```

### 2.4 Requirement 관련

```typescript
// ✅ 엔티티명
const requirement: Requirement = { ... };
const requirements: Requirement[] = [];

// ✅ 함수명
getRequirementById(id: string)
createRequirement(data: CreateRequirementDto)
categorizeRequirements(requirements: Requirement[])
prioritizeRequirements(requirements: Requirement[])

// ✅ 컴포넌트명
<RequirementList />
<RequirementCard />
<RequirementCategoryBadge />
<RequirementPrioritySelector />

// ❌ 나쁜 예
const req = { ... };               // ❌ HTTP request와 혼동
const reqs = [];                   // ❌ 비표준 약어
```

### 2.5 Client 관련

```typescript
// ✅ 엔티티명
const client: Client = { ... };
const clients: Client[] = [];

// ✅ 함수명
getClientById(id: string)
createClient(data: CreateClientDto)
updateClientInfo(id: string, data: UpdateClientDto)
listClientRfps(clientId: string)

// ✅ 컴포넌트명
<ClientList />
<ClientCard />
<ClientSelector />
<ClientContactInfo />

// ❌ 나쁜 예
const customer = { ... };          // ❌ 용어 통일 (glossary에서 Client로 정의)
const company = { ... };           // ❌ 용어 통일
```

---

## 3. 함수 네이밍

### 3.1 CRUD 함수

```typescript
// ✅ 기본 패턴: 동사 + 명사 + By{기준}?

// Create
createRfp(data: CreateRfpDto): Promise<RFP>
createProposal(rfpId: string, data: CreateProposalDto): Promise<Proposal>

// Read (단건)
getRfpById(id: string): Promise<RFP>
getProposalById(id: string): Promise<Proposal>
getUserByEmail(email: string): Promise<User>

// Read (목록)
listRfps(filters?: RfpFilters): Promise<RFP[]>
listProposals(filters?: ProposalFilters): Promise<Proposal[]>
searchClients(query: string): Promise<Client[]>

// Update
updateRfp(id: string, data: UpdateRfpDto): Promise<RFP>
updateRfpStatus(id: string, status: RfpStatus): Promise<RFP>
updateProposalContent(id: string, content: string): Promise<Proposal>

// Delete
deleteRfp(id: string): Promise<void>
deleteProposal(id: string): Promise<void>

// ❌ 나쁜 예
rfp(id)                            // ❌ 동사 누락
newRfp(data)                       // ❌ create 명시
fetchRfp(id)                       // ❌ get 통일
allRfps()                          // ❌ list 명시
changeStatus(id, status)           // ❌ update 명시
removeRfp(id)                      // ❌ delete 통일
```

### 3.2 비즈니스 로직 함수

```typescript
// ✅ 의미 명확한 동사 사용

// 분석
analyzeRfp(rfp: RFP): Promise<AIAnalysis>
analyzeRequirements(requirements: Requirement[]): RequirementAnalysis

// 생성
generateProposalSections(requirements: Requirement[]): Promise<ProposalSection[]>
generateUiPrototype(requirement: Requirement): Promise<UIPrototype>

// 할당
assignRfpToUser(rfpId: string, userId: string): Promise<void>
assignReviewer(proposalId: string, reviewerId: string): Promise<void>

// 승인/거절
approveProposal(proposalId: string, approverId: string): Promise<void>
rejectRfp(rfpId: string, reason: string): Promise<void>

// 제출
deliverProposal(proposalId: string): Promise<void>
submitForReview(proposalId: string): Promise<void>

// 계산
calculateTotalPrice(items: PriceItem[]): number
estimateProjectDuration(requirements: Requirement[]): number

// 검증
validateProposalContent(content: string): ValidationResult
checkDeadline(rfp: RFP): boolean

// ❌ 나쁜 예
analyze(rfp)                       // ❌ 무엇을 분석하는지 불명확
generate(requirements)             // ❌ 무엇을 생성하는지 불명확
assign(p, u)                       // ❌ 축약 지양
approve(id)                        // ❌ 무엇을 승인하는지 불명확
```

### 3.3 Boolean 함수

```typescript
// ✅ is/has/can/should 접두사

// is: 상태 확인
isApproved(proposal: Proposal): boolean
isExpired(rfp: RFP): boolean
isAnalyzing(rfp: RFP): boolean

// has: 소유 확인
hasReviewers(proposal: Proposal): boolean
hasAttachments(rfp: RFP): boolean
hasAiAnalysis(rfp: RFP): boolean

// can: 권한/가능성 확인
canApprove(user: User, proposal: Proposal): boolean
canSubmit(proposal: Proposal): boolean
canEdit(user: User, rfp: RFP): boolean

// should: 조건 확인
shouldNotifyReviewers(proposal: Proposal): boolean
shouldRegeneratePrototype(prototype: UIPrototype): boolean

// ❌ 나쁜 예
approved(proposal)                 // ❌ is 접두사 누락
reviewers(proposal)                // ❌ has 접두사 누락
editable(user, rfp)                // ❌ can 접두사 누락
```

### 3.4 이벤트 핸들러

```typescript
// ✅ handle{이벤트명} 패턴

// 클릭
const handleSubmitClick = () => { ... };
const handleCancelClick = () => { ... };
const handleRfpClick = (rfpId: string) => { ... };

// 변경
const handleStatusChange = (status: RfpStatus) => { ... };
const handleContentChange = (content: string) => { ... };

// 제출
const handleFormSubmit = (data: FormData) => { ... };
const handleProposalSubmit = () => { ... };

// ❌ 나쁜 예
const onClick = () => { ... };     // ❌ handle 접두사 누락
const onStatusChange = () => { ... };  // ❌ handle 사용 (on은 Props에서)
const submit = () => { ... };      // ❌ handle 접두사 누락
```

---

## 4. 컴포넌트 네이밍

### 4.1 컴포넌트 타입별

```typescript
// ✅ 페이지 컴포넌트
<RfpListPage />
<ProposalEditorPage />
<ClientDetailPage />

// ✅ 레이아웃 컴포넌트
<DashboardLayout />
<AuthLayout />
<ProposalEditorLayout />

// ✅ 목록 컴포넌트
<RfpList />
<ProposalList />
<RequirementList />

// ✅ 카드 컴포넌트
<RfpCard />
<ProposalCard />
<ClientCard />

// ✅ 폼 컴포넌트
<RfpForm />
<ProposalSectionForm />
<ClientForm />

// ✅ 모달/다이얼로그
<RfpDetailModal />
<ConfirmDeleteDialog />
<ReviewCommentDialog />

// ✅ 패널/사이드바
<RfpAnalysisPanel />
<ProposalReviewPanel />
<RequirementFilterSidebar />
```

### 4.2 UI 컴포넌트

```typescript
// ✅ 기본 UI (shadcn/ui 스타일)
<Button />
<Input />
<Card />
<Dialog />
<Badge />
<Select />

// ✅ 상태 표시 컴포넌트
<LoadingSpinner />
<ErrorBoundary />
<EmptyState />

// ✅ 배지/라벨
<RfpStatusBadge />
<ProposalStatusBadge />
<PriorityLabel />
```

---

## 5. 파일 네이밍

### 5.1 파일 타입별

```typescript
// ✅ 컴포넌트 파일 (PascalCase)
RfpList.tsx
ProposalCard.tsx
UserAvatar.tsx

// ✅ 유틸리티 파일 (kebab-case)
date-utils.ts
format-utils.ts
validation-utils.ts

// ✅ API 파일 (kebab-case)
api-client.ts
rfp-api.ts
proposal-api.ts

// ✅ 훅 파일 (kebab-case)
use-rfps.ts
use-proposal.ts
use-toast.ts

// ✅ 서비스 파일 (kebab-case)
rfp-service.ts
proposal-service.ts
ai-service.ts

// ✅ 타입 파일 (kebab-case)
rfp-types.ts
proposal-types.ts
api-types.ts

// ❌ 나쁜 예
rfp_list.tsx                       // ❌ 스네이크 케이스
rfpList.tsx                        // ❌ camelCase (PascalCase 사용)
RfpAPI.ts                          // ❌ 유틸은 kebab-case
```

### 5.2 폴더 네이밍

```typescript
// ✅ 모든 폴더는 kebab-case
src/
├── components/
├── features/
│   ├── rfp/
│   ├── proposal/
│   └── ui-prototype/              // ✅ 하이픈 사용
├── hooks/
├── lib/
│   ├── api-client/                // ✅ 하이픈 사용
│   └── utils/
└── types/

// ❌ 나쁜 예
src/
├── Components/                    // ❌ PascalCase
├── ui_prototype/                  // ❌ 스네이크 케이스
└── apiClient/                     // ❌ camelCase
```

---

## 6. 상수 네이밍

### 6.1 상수 타입별

```typescript
// ✅ API 관련
const API_BASE_URL = 'https://api.example.com';
const API_TIMEOUT = 10000;
const API_RETRY_COUNT = 3;

// ✅ 상태 관련
const RFP_STATUS = {
  RECEIVED: 'received',
  ANALYZING: 'analyzing',
  ANALYZED: 'analyzed',
  REJECTED: 'rejected',
} as const;

const PROPOSAL_STATUS = {
  DRAFTING: 'drafting',
  REVIEWING: 'reviewing',
  APPROVED: 'approved',
  DELIVERED: 'delivered',
  WON: 'won',
  LOST: 'lost',
} as const;

// ✅ 제한 관련
const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB
const MAX_PROPOSAL_SECTIONS = 20;
const MIN_PASSWORD_LENGTH = 8;

// ✅ 우선순위
const PRIORITY_ORDER = {
  must: 1,
  should: 2,
  could: 3,
  wont: 4,
} as const;

// ✅ 라우트
const ROUTES = {
  HOME: '/',
  RFP_LIST: '/rfps',
  RFP_DETAIL: '/rfps/:id',
  PROPOSAL_EDITOR: '/proposals/:id/edit',
} as const;

// ❌ 나쁜 예
const apiBaseUrl = '...';          // ❌ UPPER_SNAKE_CASE 사용
const RfpStatus = { ... };         // ❌ PascalCase는 타입에만
const MAX_file_size = 10;          // ❌ 케이스 혼용
```

---

## 📚 체크리스트

### 코드 작성 시
- [ ] 컴포넌트는 PascalCase
- [ ] 함수/변수는 camelCase
- [ ] 상수는 UPPER_SNAKE_CASE
- [ ] Boolean은 is/has/can 접두사
- [ ] 이벤트 핸들러는 handle 접두사
- [ ] 약어는 케이스 규칙 따름 (RFP → Rfp in PascalCase/camelCase)

### 파일 생성 시
- [ ] 컴포넌트 파일은 PascalCase.tsx
- [ ] 유틸/API/훅 파일은 kebab-case.ts
- [ ] 폴더는 kebab-case
- [ ] 타입 파일은 {domain}-types.ts

### 용어 사용 시
- [ ] glossary.md에 정의된 용어 사용
- [ ] RFP, Proposal, Requirement 등 일관성 유지
- [ ] 약어 최소화 (표준 약어 제외)

---

**이 문서는 [CONVENTIONS.md](../../CONVENTIONS.md)의 상세 가이드입니다.**
