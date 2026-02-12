# 제안요청서 관리 시스템 스키마

> RFP Management System Data Schema & Entity Relationships

## 엔티티 개요 (Entity Overview)

이 시스템에서 다루는 핵심 엔티티:

1. **Client** - 고객사
2. **RFP** - 제안요청서
3. **Requirement** - 요구사항
4. **Proposal** - 제안서
5. **ProposalSection** - 제안서 섹션
6. **UIPrototype** - UI 프로토타입
7. **User** - 사용자 (담당자, 검토자)
8. **Comment** - 코멘트/피드백

## 엔티티 관계도 (ER Diagram)

```
Client (고객사)
  ├─1:N─> RFP (제안요청서)

RFP (제안요청서)
  ├─1:1─> Proposal (제안서)
  ├─1:N─> Requirement (요구사항)
  └─N:1─> Client (고객사)

Proposal (제안서)
  ├─1:1─> RFP (제안요청서)
  ├─1:N─> ProposalSection (제안서 섹션)
  ├─1:N─> UIPrototype (UI 프로토타입)
  ├─1:N─> Comment (코멘트)
  ├─N:1─> User (담당자 - assignee)
  └─N:M─> User (검토자 - reviewers)

UIPrototype (UI 프로토타입)
  ├─N:1─> Proposal (제안서)
  └─1:N─> Comment (코멘트)
```

## 상세 스키마 정의 (Detailed Schema)

### 1. Client (고객사)

```typescript
interface Client {
  id: string;              // UUID
  name: string;            // 회사명
  businessNumber: string;  // 사업자등록번호
  industry: string;        // 업종
  contact: {
    name: string;          // 담당자 이름
    email: string;         // 이메일
    phone: string;         // 전화번호
    position: string;      // 직책
  };
  address?: string;        // 주소
  website?: string;        // 웹사이트
  notes?: string;          // 메모
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. RFP (제안요청서)

```typescript
interface RFP {
  id: string;              // UUID
  title: string;           // 제목
  clientId: string;        // Client.id 참조

  // 기본 정보
  receivedDate: Date;      // 접수일
  dueDate: Date;           // 제출 마감일
  estimatedBudget?: number; // 예상 예산
  estimatedDuration?: number; // 예상 기간 (일)

  // 내용
  description: string;     // 설명
  attachments?: Attachment[]; // 첨부파일

  // 상태
  status: 'received' | 'analyzing' | 'analyzed' | 'rejected';

  // AI 분석 결과
  aiAnalysis?: {
    summary: string;       // 요약
    keyRequirements: string[]; // 핵심 요구사항
    technicalStack: string[];  // 추천 기술 스택
    riskLevel: 'low' | 'medium' | 'high'; // 위험도
    estimatedEffort: number;   // 예상 공수 (인월)
  };

  // 메타데이터
  assigneeId?: string;     // User.id - 담당자
  createdAt: Date;
  updatedAt: Date;
  analyzedAt?: Date;       // 분석 완료 시각
}

interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;        // bytes
  fileType: string;        // MIME type
  url: string;             // 저장 경로/URL
  uploadedAt: Date;
}
```

### 3. Requirement (요구사항)

```typescript
interface Requirement {
  id: string;              // UUID
  rfpId: string;           // RFP.id 참조

  // 요구사항 분류
  category: 'functional' | 'non-functional' | 'technical' | 'business';
  priority: 'must' | 'should' | 'could' | 'wont'; // MoSCoW

  // 내용
  title: string;           // 요구사항 제목
  description: string;     // 상세 설명
  acceptanceCriteria?: string; // 수용 기준

  // AI 분석
  complexity: 'low' | 'medium' | 'high'; // 복잡도
  estimatedHours?: number; // 예상 소요 시간
  suggestedSolution?: string; // AI 제안 솔루션

  // 메타데이터
  order: number;           // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Proposal (제안서)

```typescript
interface Proposal {
  id: string;              // UUID
  rfpId: string;           // RFP.id 참조 (1:1)

  // 기본 정보
  title: string;           // 제안서 제목
  version: string;         // 버전 (1.0.0)

  // 상태
  status: 'drafting' | 'reviewing' | 'approved' | 'delivered' | 'won' | 'lost';

  // 담당자
  assigneeId: string;      // User.id - 주 담당자
  reviewerIds: string[];   // User.id[] - 검토자 목록

  // 제안 내용
  executiveSummary?: string; // 요약
  totalPrice?: number;       // 총 견적 금액
  estimatedDuration?: number; // 예상 기간 (일)
  startDate?: Date;          // 시작 예정일
  endDate?: Date;            // 종료 예정일

  // 팀 구성
  team?: TeamMember[];

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;      // 제출 일시
  resultDate?: Date;       // 결과 확정 일시
  winProbability?: number; // 수주 확률 (0-100)
}

interface TeamMember {
  name: string;
  role: string;            // 역할 (PM, Developer, Designer...)
  allocation: number;      // 투입률 (0-100%)
  duration: number;        // 투입 기간 (일)
}
```

### 5. ProposalSection (제안서 섹션)

```typescript
interface ProposalSection {
  id: string;              // UUID
  proposalId: string;      // Proposal.id 참조

  // 섹션 정보
  type: 'executive-summary' | 'company-intro' | 'requirement-analysis' |
        'technical-approach' | 'ui-prototype' | 'timeline' |
        'pricing' | 'team' | 'appendix';
  title: string;           // 섹션 제목
  order: number;           // 정렬 순서

  // 내용
  content: string;         // Markdown 형식 콘텐츠

  // AI 생성 여부
  isAIGenerated: boolean;  // AI가 생성했는지
  aiPrompt?: string;       // AI에게 준 프롬프트

  // 상태
  status: 'draft' | 'review' | 'approved';

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;       // User.id
}
```

### 6. UIPrototype (UI 프로토타입)

```typescript
interface UIPrototype {
  id: string;              // UUID
  proposalId: string;      // Proposal.id 참조

  // 프로토타입 정보
  name: string;            // 화면명
  type: 'wireframe' | 'mockup' | 'interactive';
  order: number;           // 정렬 순서

  // 내용
  description?: string;    // 화면 설명
  imageUrl?: string;       // 이미지 URL (Figma, PNG 등)
  figmaUrl?: string;       // Figma 링크
  htmlCode?: string;       // HTML 코드 (interactive인 경우)

  // AI 생성 정보
  isAIGenerated: boolean;
  aiPrompt?: string;       // AI에게 준 프롬프트
  generatedFrom?: string;  // 어떤 요구사항에서 생성되었는지

  // 상태
  status: 'generating' | 'draft' | 'reviewing' | 'approved';

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;       // User.id
}
```

### 7. User (사용자)

```typescript
interface User {
  id: string;              // UUID
  email: string;           // 이메일 (로그인 ID)
  name: string;            // 이름

  // 역할
  role: 'admin' | 'manager' | 'writer' | 'reviewer';
  department?: string;     // 부서
  position?: string;       // 직책

  // 권한
  permissions: Permission[];

  // 프로필
  avatar?: string;         // 프로필 이미지 URL
  phone?: string;          // 전화번호

  // 상태
  isActive: boolean;       // 활성 상태

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

type Permission =
  | 'rfp:create'
  | 'rfp:read'
  | 'rfp:update'
  | 'rfp:delete'
  | 'proposal:create'
  | 'proposal:read'
  | 'proposal:update'
  | 'proposal:approve'
  | 'proposal:deliver'
  | 'client:manage'
  | 'user:manage';
```

### 8. Comment (코멘트)

```typescript
interface Comment {
  id: string;              // UUID

  // 연결 대상
  targetType: 'proposal' | 'ui-prototype' | 'section';
  targetId: string;        // Proposal.id, UIPrototype.id, ProposalSection.id

  // 내용
  content: string;         // 코멘트 내용
  type: 'comment' | 'feedback' | 'approval' | 'rejection';

  // 작성자
  authorId: string;        // User.id

  // 답글
  parentId?: string;       // Comment.id - 답글인 경우

  // 상태
  isResolved: boolean;     // 해결됨 여부

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
}
```

## 인덱스 전략 (Index Strategy)

성능 최적화를 위한 인덱스:

```sql
-- RFP
CREATE INDEX idx_rfp_client ON rfp(clientId);
CREATE INDEX idx_rfp_status ON rfp(status);
CREATE INDEX idx_rfp_due_date ON rfp(dueDate);
CREATE INDEX idx_rfp_assignee ON rfp(assigneeId);

-- Proposal
CREATE INDEX idx_proposal_rfp ON proposal(rfpId);
CREATE INDEX idx_proposal_status ON proposal(status);
CREATE INDEX idx_proposal_assignee ON proposal(assigneeId);

-- Requirement
CREATE INDEX idx_requirement_rfp ON requirement(rfpId);
CREATE INDEX idx_requirement_category ON requirement(category);
CREATE INDEX idx_requirement_priority ON requirement(priority);

-- UIPrototype
CREATE INDEX idx_ui_proposal ON ui_prototype(proposalId);
CREATE INDEX idx_ui_status ON ui_prototype(status);

-- Comment
CREATE INDEX idx_comment_target ON comment(targetType, targetId);
CREATE INDEX idx_comment_author ON comment(authorId);
```

## 데이터 검증 규칙 (Validation Rules)

### RFP
- `title`: 필수, 1-200자
- `dueDate`: 필수, 현재 시각 이후
- `estimatedBudget`: 선택, 0 이상

### Proposal
- `title`: 필수, 1-200자
- `version`: 필수, semantic versioning (1.0.0)
- `totalPrice`: 선택, 0 이상
- `winProbability`: 선택, 0-100

### User
- `email`: 필수, 이메일 형식, 중복 불가
- `role`: 필수, enum 값 중 하나

## 관계 제약 조건 (Relationship Constraints)

1. **RFP ↔ Proposal**: 1:1 관계
   - 하나의 RFP는 최대 하나의 Proposal을 가짐
   - Cascade Delete: RFP 삭제 시 Proposal도 삭제

2. **RFP → Requirement**: 1:N 관계
   - Cascade Delete: RFP 삭제 시 모든 Requirement 삭제

3. **Proposal → ProposalSection**: 1:N 관계
   - Cascade Delete: Proposal 삭제 시 모든 Section 삭제

4. **Proposal → UIPrototype**: 1:N 관계
   - Cascade Delete: Proposal 삭제 시 모든 Prototype 삭제

5. **Client → RFP**: 1:N 관계
   - Restrict Delete: Client 삭제 시 연결된 RFP가 있으면 삭제 불가

---

**버전**: 1.0.0
**작성일**: 2026-02-11
**최종 수정**: 2026-02-11
