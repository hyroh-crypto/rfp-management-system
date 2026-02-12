# 제안요청서 관리 시스템 용어집

> RFP Management & Proposal Generation System Glossary

## 비즈니스 용어 (Business Terms)

| 한글 | 영문 | 정의 | 글로벌 표준 매핑 |
|------|------|------|-----------------|
| 제안요청서 | RFP | 고객사에서 요청하는 제안 요청 문서 | Request for Proposal |
| 요구사항 | Requirement | RFP에 포함된 기능/비기능 요구사항 | Requirement |
| 제안서 | Proposal | RFP에 대한 응답으로 작성하는 제안 문서 | Proposal Document |
| UI 프로토타입 | UI Prototype | 제안서에 포함되는 화면 시안 | Mockup, Wireframe |
| 고객사 | Client | 제안요청서를 보내는 회사 | Client Company |
| 담당자 | Assignee | 제안서 작성을 담당하는 사람 | Owner, Assignee |
| 검토자 | Reviewer | 제안서를 검토/승인하는 사람 | Reviewer, Approver |
| 접수 | Submission | RFP가 시스템에 등록되는 것 | Registration, Intake |
| 분석 | Analysis | 요구사항을 분석하는 단계 | Requirement Analysis |
| 작성 | Writing | 제안서를 작성하는 단계 | Drafting |
| 검토 | Review | 제안서를 검토하는 단계 | Review |
| 제출 | Delivery | 완성된 제안서를 고객사에 전달 | Submission, Delivery |

## 글로벌 표준 용어 (Global Standards)

| 용어 | 정의 | 참고 |
|------|------|------|
| RFP | Request for Proposal - 제안요청서 | 산업 표준 |
| RFQ | Request for Quotation - 견적요청서 | RFP의 간소화 버전 |
| RFI | Request for Information - 정보요청서 | RFP 이전 단계 |
| SoW | Statement of Work - 작업범위명세서 | 제안서에 포함 |
| UUID | Universal Unique Identifier | RFC 4122 |
| Markdown | 텍스트 마크업 언어 | 제안서 작성 포맷 |
| Figma | UI 디자인 도구 | 프로토타입 도구 |
| AI Generation | AI 기반 자동 생성 | 제안서/UI 자동 생성 |

## 상태(Status) 정의

### RFP 상태
- `received`: 접수됨 (시스템에 등록)
- `analyzing`: 분석 중 (요구사항 분석)
- `analyzed`: 분석 완료
- `rejected`: 거절됨 (제안하지 않기로 결정)

### 제안서 상태
- `drafting`: 작성 중
- `reviewing`: 검토 중
- `approved`: 승인됨
- `delivered`: 제출 완료
- `won`: 수주 성공
- `lost`: 수주 실패

### UI 프로토타입 상태
- `generating`: 생성 중
- `draft`: 초안
- `reviewing`: 검토 중
- `approved`: 승인됨

## 용어 사용 규칙

1. **코드에서는 영문 사용**: `RFP`, `Proposal`, `Requirement`
2. **UI/문서에서는 한글 사용**: 제안요청서, 제안서, 요구사항
3. **API 응답은 글로벌 표준 우선**: `request_for_proposal`, `proposal_document`
4. **상태값은 소문자 영문**: `received`, `drafting`, `approved`

## 약어 정의

| 약어 | 전체 이름 | 설명 |
|------|----------|------|
| RFP | Request for Proposal | 제안요청서 |
| RFQ | Request for Quotation | 견적요청서 |
| RFI | Request for Information | 정보요청서 |
| SoW | Statement of Work | 작업범위명세서 |
| PM | Project Manager | 프로젝트 관리자 |
| POC | Proof of Concept | 개념증명 |

## 도메인 특화 개념

### 제안서 섹션 구조
1. **Executive Summary**: 요약 (경영진용)
2. **Company Introduction**: 회사 소개
3. **Requirement Analysis**: 요구사항 분석
4. **Technical Approach**: 기술적 접근 방법
5. **UI/UX Prototype**: 화면 프로토타입
6. **Timeline**: 일정
7. **Pricing**: 견적
8. **Team**: 투입 인력

### 프로토타입 유형
- **Wireframe**: 와이어프레임 (저해상도 레이아웃)
- **Mockup**: 목업 (고해상도 디자인)
- **Interactive Prototype**: 인터랙티브 프로토타입 (클릭 가능)

---

**버전**: 1.0.0
**작성일**: 2026-02-11
**최종 수정**: 2026-02-11
