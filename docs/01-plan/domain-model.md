# 제안요청서 관리 시스템 도메인 모델

> RFP Management System Domain Model & Business Flow

## 전체 도메인 모델 (Domain Model)

```
┌─────────────────────────────────────────────────────────────────┐
│                    RFP Management System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Client     │ 고객사
│  (고객사)     │
├──────────────┤
│ • name       │
│ • contact    │
│ • industry   │
└──────┬───────┘
       │ 1:N (하나의 고객사가 여러 RFP 발송)
       ▼
┌──────────────┐
│     RFP      │ 제안요청서
│ (제안요청서)   │
├──────────────┤
│ • title      │
│ • dueDate    │────────┐
│ • status     │        │ 1:1 (하나의 RFP는 하나의 제안서)
│ • aiAnalysis │        ▼
└──────┬───────┘   ┌──────────────┐
       │           │   Proposal   │ 제안서
       │ 1:N       │   (제안서)    │
       │           ├──────────────┤
       ▼           │ • title      │
┌──────────────┐   │ • status     │
│ Requirement  │   │ • totalPrice │
│  (요구사항)    │   │ • team       │
├──────────────┤   └──────┬───────┘
│ • category   │          │
│ • priority   │          │ 1:N
│ • complexity │          ├────────────────────┬─────────────────┐
└──────────────┘          ▼                    ▼                 ▼
                   ┌──────────────┐    ┌──────────────┐  ┌──────────────┐
                   │ProposalSection│   │ UIPrototype  │  │   Comment    │
                   │ (제안서 섹션)  │    │(UI 프로토타입)│  │  (코멘트)     │
                   ├──────────────┤    ├──────────────┤  ├──────────────┤
                   │ • type       │    │ • type       │  │ • content    │
                   │ • content    │    │ • imageUrl   │  │ • type       │
                   │ • order      │    │ • figmaUrl   │  │ • isResolved │
                   └──────────────┘    └──────────────┘  └──────────────┘

┌──────────────┐
│     User     │ 사용자
│   (사용자)    │
├──────────────┤
│ • email      │
│ • role       │───┐
│ • permissions│   │ N:M (담당자, 검토자)
└──────────────┘   │
                   └──> Proposal (assignee, reviewers)
```

## 비즈니스 프로세스 흐름 (Business Process Flow)

```
[1. 접수] ──> [2. 분석] ──> [3. 제안서 작성] ──> [4. 검토] ──> [5. 제출] ──> [6. 결과]

1. RFP 접수 (Submission)
   ┌─────────────────┐
   │ 고객사로부터     │
   │ RFP 수신       │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 시스템 등록      │
   │ status: received│
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 담당자 배정      │
   │ assigneeId 설정 │
   └─────────────────┘

2. 요구사항 분석 (Analysis)
   ┌─────────────────┐
   │ AI 자동 분석    │
   │ • 요약 생성     │
   │ • 요구사항 추출 │
   │ • 기술스택 추천 │
   │ • 위험도 평가   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 담당자 검토     │
   │ • 요구사항 정제 │
   │ • 우선순위 설정 │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 분석 완료       │
   │ status: analyzed│
   └─────────────────┘

3. 제안서 작성 (Drafting)
   ┌─────────────────┐
   │ Proposal 생성   │
   │ status: drafting│
   └────────┬────────┘
            │
            ├──> [AI 섹션 생성]
            │    • Executive Summary
            │    • Requirement Analysis
            │    • Technical Approach
            │
            ├──> [UI 프로토타입 생성]
            │    • AI로 화면 자동 생성
            │    • Figma 연동
            │
            └──> [일정/견적 작성]
                 • Timeline
                 • Pricing
                 • Team

4. 검토 (Review)
   ┌─────────────────┐
   │ 검토자 지정     │
   │ reviewerIds 설정│
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 검토 진행       │
   │ • Comment 작성  │
   │ • 피드백 반영   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 승인            │
   │ status: approved│
   └─────────────────┘

5. 제출 (Delivery)
   ┌─────────────────┐
   │ 최종 검토       │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ 고객사 제출     │
   │ status: delivered│
   │ deliveredAt 기록│
   └─────────────────┘

6. 결과 (Result)
   ┌─────────────────┐
   │ 수주 결과 확정  │
   │ status: won/lost│
   │ resultDate 기록 │
   └─────────────────┘
```

## 핵심 비즈니스 규칙 (Business Rules)

### RFP 규칙
1. **접수 마감일**: `dueDate`는 항상 현재 시각 이후여야 함
2. **상태 전환**: `received` → `analyzing` → `analyzed` (또는 `rejected`)
3. **담당자 필수**: `analyzing` 상태 이전에 `assigneeId` 설정 필요

### Proposal 규칙
1. **RFP 1:1 관계**: 하나의 RFP는 최대 하나의 Proposal만 가능
2. **상태 전환**: `drafting` → `reviewing` → `approved` → `delivered` → `won`/`lost`
3. **검토자**: `reviewing` 상태로 전환 시 최소 1명의 검토자 필요
4. **승인 조건**: 모든 검토자가 승인해야 `approved`로 전환 가능

### UIPrototype 규칙
1. **순서**: `order` 필드로 화면 순서 관리
2. **타입별 필수 필드**:
   - `wireframe`: `description` 필수
   - `mockup`: `imageUrl` 또는 `figmaUrl` 필수
   - `interactive`: `htmlCode` 필수
3. **승인 프로세스**: Prototype은 개별적으로 승인 가능

### Comment 규칙
1. **타입별 의미**:
   - `comment`: 일반 코멘트
   - `feedback`: 수정 요청
   - `approval`: 승인
   - `rejection`: 거절
2. **해결**: `feedback`은 `isResolved = true`로 표시 필요

## 권한 매트릭스 (Permission Matrix)

| Role | RFP 생성 | RFP 분석 | 제안서 작성 | 제안서 검토 | 제안서 승인 | 제안서 제출 | 고객사 관리 | 사용자 관리 |
|------|---------|---------|-----------|-----------|-----------|-----------|-----------|-----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Writer** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Reviewer** | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

## AI 자동화 포인트 (AI Automation Points)

### 1. RFP 분석 (AI Analysis)
```typescript
// AI가 자동으로 수행
aiAnalysis: {
  summary: "고객사의 ERP 시스템 구축 요청...",
  keyRequirements: [
    "재고 관리 기능",
    "회계 연동",
    "모바일 앱"
  ],
  technicalStack: ["React", "Node.js", "PostgreSQL"],
  riskLevel: "medium",
  estimatedEffort: 6  // 6인월
}
```

### 2. 제안서 자동 생성 (Proposal Generation)
- **Executive Summary**: RFP 분석 결과 기반 자동 생성
- **Requirement Analysis**: 요구사항 자동 분석 및 대응 방안 작성
- **Technical Approach**: 추천 기술 스택 기반 아키텍처 제안

### 3. UI 프로토타입 자동 생성 (UI Prototype Generation)
```typescript
// AI 프롬프트 예시
aiPrompt: `
ERP 시스템의 재고 관리 화면을 설계해주세요.
- 재고 목록 테이블 (검색, 필터, 정렬 기능)
- 재고 추가/수정 모달
- 재고 현황 대시보드 (차트)
`
```

### 4. 일정 및 견적 자동 산출
- 요구사항 복잡도 기반 자동 공수 산정
- 팀 구성 제안
- 마일스톤 자동 생성

## 확장 고려사항 (Future Considerations)

### 버전 관리
```typescript
// Proposal Version History
interface ProposalVersion {
  id: string;
  proposalId: string;
  version: string;        // 1.0.0, 1.1.0, 2.0.0
  changes: string;        // 변경 사항
  createdBy: string;
  createdAt: Date;
}
```

### 템플릿 시스템
```typescript
// Proposal Template
interface ProposalTemplate {
  id: string;
  name: string;
  industry: string;       // 업종별 템플릿
  sections: SectionTemplate[];
  isDefault: boolean;
}
```

### 협업 기능
```typescript
// Real-time Collaboration
interface CollaborationSession {
  proposalId: string;
  activeUsers: User[];
  lastActivity: Date;
}
```

---

**버전**: 1.0.0
**작성일**: 2026-02-11
**최종 수정**: 2026-02-11
