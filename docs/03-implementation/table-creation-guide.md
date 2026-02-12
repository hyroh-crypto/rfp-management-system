# 테이블 생성 가이드

> bkend.ai MCP를 통한 8개 테이블 생성 절차

## 현재 상태

- **프로젝트 ID**: `rfp_projectnea54bxdkxpz4ltp7xx9`
- **환경**: `dev`
- **MCP 상태**: OAuth 인증 필요

## 사전 준비

### 1. bkend MCP OAuth 인증

bkend MCP가 "Needs authentication" 상태이므로, 먼저 OAuth 인증을 완료해야 합니다.

```bash
# MCP 상태 확인
claude mcp list

# bkend가 "Needs authentication" 상태이면 첫 MCP 도구 호출 시 브라우저가 열림
```

OAuth 인증 절차:
1. Claude Code에서 bkend MCP 도구를 처음 호출하면 브라우저가 자동으로 열립니다
2. bkend.ai 콘솔(console.bkend.ai)에 로그인
3. Organization 선택
4. 권한 승인
5. 브라우저 창 닫기

### 2. 테이블 스키마 준비 완료

`C:\Users\frameout_AI\Gemini_code_test\scripts\create-tables.json` 파일에 8개 테이블의 상세 스키마가 정의되어 있습니다.

## 테이블 생성 순서

의존성을 고려하여 다음 순서로 테이블을 생성합니다:

### Phase 1: 독립 테이블 (의존성 없음)

1. **users** - 사용자 테이블
2. **clients** - 고객사 테이블

### Phase 2: users, clients 참조 테이블

3. **rfps** - 제안요청서 테이블 (clientId → clients, assigneeId → users)

### Phase 3: rfps 참조 테이블

4. **requirements** - 요구사항 테이블 (rfpId → rfps)
5. **proposals** - 제안서 테이블 (rfpId → rfps, assigneeId → users)

### Phase 4: proposals 참조 테이블

6. **proposal_sections** - 제안서 섹션 테이블 (proposalId → proposals)
7. **ui_prototypes** - UI 프로토타입 테이블 (proposalId → proposals)

### Phase 5: 다중 참조 테이블

8. **comments** - 코멘트 테이블 (authorId → users, targetId → proposals/ui_prototypes/sections)

## MCP 도구 사용 방법

### 테이블 생성 명령

bkend MCP의 `backend_table_create` 도구를 사용합니다:

```typescript
// 예시: users 테이블 생성
{
  "projectId": "rfp_projectnea54bxdkxpz4ltp7xx9",
  "environment": "dev",
  "tableName": "users",
  "description": "사용자 테이블 - 제안서 담당자 및 검토자",
  "fields": [...],
  "permissions": {...}
}
```

### Claude Code에서 실행

OAuth 인증이 완료된 후 다음과 같이 요청합니다:

```
"프로젝트 ID rfp_projectnea54bxdkxpz4ltp7xx9의 dev 환경에 users 테이블을 생성해주세요.
스키마는 scripts/create-tables.json 파일을 참조하세요."
```

## 각 테이블 상세 정보

### 1. users (Task #6)
- **목적**: 제안서 작성자, 검토자, 관리자 관리
- **핵심 필드**: email (unique), name, role, permissions
- **RBAC**: admin/user/self/guest
- **의존성**: 없음

### 2. clients (Task #7)
- **목적**: 고객사 정보 관리
- **핵심 필드**: name, businessNumber (unique), industry, contact
- **참조**: 없음
- **의존성**: 없음

### 3. rfps (Task #8)
- **목적**: 제안요청서 정보 및 AI 분석 결과
- **핵심 필드**: title, clientId, dueDate, status, aiAnalysis
- **참조**: clientId → clients, assigneeId → users
- **상태**: received | analyzing | analyzed | rejected

### 4. requirements (Task #9)
- **목적**: RFP별 요구사항 분석
- **핵심 필드**: rfpId, category, priority, complexity
- **참조**: rfpId → rfps
- **분류**: functional/non-functional/technical/business

### 5. proposals (Task #10)
- **목적**: 제안서 메인 정보
- **핵심 필드**: rfpId (unique), title, status, assigneeId, totalPrice
- **참조**: rfpId → rfps (1:1), assigneeId → users
- **상태**: drafting | reviewing | approved | delivered | won | lost

### 6. proposal_sections (Task #11)
- **목적**: 제안서 각 섹션 내용 (markdown)
- **핵심 필드**: proposalId, type, content, isAIGenerated
- **참조**: proposalId → proposals
- **타입**: executive-summary/company-intro/requirement-analysis/technical-approach 등

### 7. ui_prototypes (Task #12)
- **목적**: 제안서에 포함된 UI 프로토타입
- **핵심 필드**: proposalId, name, type, imageUrl, figmaUrl
- **참조**: proposalId → proposals
- **타입**: wireframe | mockup | interactive

### 8. comments (Task #13)
- **목적**: 제안서/프로토타입/섹션에 대한 피드백
- **핵심 필드**: targetType, targetId, authorId, content, isResolved
- **참조**: authorId → users
- **대상**: proposal | ui-prototype | section

## 인덱스 생성 (성능 최적화)

테이블 생성 후, 자주 조회되는 필드에 대한 인덱스를 생성합니다:

### rfps 테이블
```typescript
backend_index_manage({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "rfps",
  action: "add",
  indexes: [
    { fields: ["clientId"], name: "idx_rfp_client" },
    { fields: ["status"], name: "idx_rfp_status" },
    { fields: ["dueDate"], name: "idx_rfp_due_date" },
    { fields: ["assigneeId"], name: "idx_rfp_assignee" }
  ]
})
```

### proposals 테이블
```typescript
backend_index_manage({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "proposals",
  action: "add",
  indexes: [
    { fields: ["rfpId"], name: "idx_proposal_rfp", unique: true },
    { fields: ["status"], name: "idx_proposal_status" },
    { fields: ["assigneeId"], name: "idx_proposal_assignee" }
  ]
})
```

### requirements 테이블
```typescript
backend_index_manage({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "requirements",
  action: "add",
  indexes: [
    { fields: ["rfpId"], name: "idx_requirement_rfp" },
    { fields: ["category"], name: "idx_requirement_category" },
    { fields: ["priority"], name: "idx_requirement_priority" }
  ]
})
```

### ui_prototypes 테이블
```typescript
backend_index_manage({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "ui_prototypes",
  action: "add",
  indexes: [
    { fields: ["proposalId"], name: "idx_ui_proposal" },
    { fields: ["status"], name: "idx_ui_status" }
  ]
})
```

### comments 테이블
```typescript
backend_index_manage({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "comments",
  action: "add",
  indexes: [
    { fields: ["targetType", "targetId"], name: "idx_comment_target" },
    { fields: ["authorId"], name: "idx_comment_author" }
  ]
})
```

## 검증 방법

### 1. 테이블 목록 조회
```typescript
backend_table_list({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev"
})
```

### 2. 특정 테이블 스키마 확인
```typescript
backend_table_get({
  projectId: "rfp_projectnea54bxdkxpz4ltp7xx9",
  environment: "dev",
  tableName: "users"
})
```

### 3. REST API로 테스트
```bash
# 환경 변수 설정
export BKEND_PROJECT_ID=rfp_projectnea54bxdkxpz4ltp7xx9
export BKEND_ENVIRONMENT=dev
export BKEND_TOKEN=<your_access_token>

# users 테이블 조회
curl -X GET "https://api.bkend.ai/v1/data/users" \
  -H "x-project-id: $BKEND_PROJECT_ID" \
  -H "x-environment: $BKEND_ENVIRONMENT" \
  -H "Authorization: Bearer $BKEND_TOKEN"
```

## Task 업데이트

각 테이블 생성이 완료되면 `docs/01-plan/tasks.md` 파일에서 해당 Task를 `completed`로 업데이트합니다:

```markdown
- [x] Task #6: users 테이블 생성
- [x] Task #7: clients 테이블 생성
- [x] Task #8: rfps 테이블 생성
- [x] Task #9: requirements 테이블 생성
- [x] Task #10: proposals 테이블 생성
- [x] Task #11: proposal_sections 테이블 생성
- [x] Task #12: ui_prototypes 테이블 생성
- [x] Task #13: comments 테이블 생성
```

## 트러블슈팅

### MCP 인증 실패
- 브라우저에서 console.bkend.ai에 로그인되어 있는지 확인
- Organization 선택 및 권한 승인 완료 확인
- `claude mcp list`로 bkend 연결 상태 확인

### 테이블 생성 실패
- 프로젝트 ID가 정확한지 확인
- 환경(dev/staging/prod)이 올바른지 확인
- 참조 테이블이 먼저 생성되었는지 확인 (의존성)

### Unique 제약 조건 오류
- `email`, `businessNumber`, `rfpId` 등 unique 필드 중복 확인
- 기존 데이터가 있다면 삭제 후 재생성

## 다음 단계

테이블 생성이 완료되면:

1. **Phase 2 진입**: 샘플 데이터 생성 (Task #14)
2. **API 클라이언트 구현**: `lib/bkend.ts` 작성
3. **인증 설정**: bkend.ai 이메일/소셜 로그인 구성
4. **프론트엔드 개발**: Next.js 페이지 구현

---

**작성일**: 2026-02-11
**최종 수정**: 2026-02-11
**담당자**: bkend-expert agent
