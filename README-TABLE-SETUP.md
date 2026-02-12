# RFP 관리 시스템 - 테이블 설정 가이드

## 빠른 시작

이 프로젝트는 bkend.ai BaaS를 백엔드로 사용합니다. 테이블 생성을 위해 bkend MCP OAuth 인증이 필요합니다.

### 1단계: bkend MCP 인증 확인

```bash
claude mcp list
```

**출력 확인:**
```
bkend: https://api.bkend.ai/mcp (HTTP) - ! Needs authentication
```

### 2단계: OAuth 인증 트리거

Claude Code에서 다음과 같이 요청하면 OAuth 인증이 시작됩니다:

```
"bkend 프로젝트 목록을 보여주세요"
```

또는:

```
"Show my bkend projects"
```

**인증 절차:**
1. 브라우저가 자동으로 열림 (https://console.bkend.ai)
2. bkend.ai 계정으로 로그인
3. Organization 선택
4. 권한 승인 (MCP 도구 사용 권한)
5. 브라우저 창 닫기
6. Claude Code로 돌아와서 계속 진행

### 3단계: 테이블 생성 자동화

OAuth 인증 완료 후, Claude Code에서 다음과 같이 요청합니다:

```
"scripts/create-tables.json 파일의 스키마를 참조하여,
프로젝트 ID rfp_projectnea54bxdkxpz4ltp7xx9의 dev 환경에
8개 테이블을 순서대로 생성해주세요:

1. users
2. clients
3. rfps
4. requirements
5. proposals
6. proposal_sections
7. ui_prototypes
8. comments

각 테이블 생성 완료 시 docs/01-plan/tasks.md의 해당 Task를 체크해주세요."
```

## 프로젝트 정보

- **프로젝트 ID**: `rfp_projectnea54bxdkxpz4ltp7xx9`
- **환경**: `dev`
- **테이블 수**: 8개
- **스키마 파일**: `scripts/create-tables.json`
- **상세 가이드**: `docs/03-implementation/table-creation-guide.md`

## 테이블 구조 개요

```
users (사용자)
  └─1:N─> rfps (담당자)
  └─1:N─> proposals (담당자)
  └─1:N─> comments (작성자)

clients (고객사)
  └─1:N─> rfps

rfps (제안요청서)
  ├─1:1─> proposals
  └─1:N─> requirements

proposals (제안서)
  ├─1:N─> proposal_sections
  ├─1:N─> ui_prototypes
  └─1:N─> comments

comments (피드백)
  └─참조: proposals, ui_prototypes, sections
```

## 생성 순서 (의존성 고려)

### Phase 1: 독립 테이블
1. `users` - 사용자
2. `clients` - 고객사

### Phase 2: 1차 참조 테이블
3. `rfps` - 제안요청서 (→ clients, users)

### Phase 3: 2차 참조 테이블
4. `requirements` - 요구사항 (→ rfps)
5. `proposals` - 제안서 (→ rfps, users)

### Phase 4: 3차 참조 테이블
6. `proposal_sections` - 섹션 (→ proposals)
7. `ui_prototypes` - 프로토타입 (→ proposals)

### Phase 5: 다중 참조 테이블
8. `comments` - 코멘트 (→ users, proposals 등)

## 검증 방법

### MCP 도구로 확인
```
"프로젝트 rfp_projectnea54bxdkxpz4ltp7xx9의 dev 환경에 생성된 테이블 목록을 보여주세요"
```

### bkend 콘솔에서 확인
1. https://console.bkend.ai 접속
2. 프로젝트 `rfp_projectnea54bxdkxpz4ltp7xx9` 선택
3. 환경 `dev` 선택
4. Database 섹션에서 테이블 목록 확인

## 트러블슈팅

### "Needs authentication" 오류
- **원인**: OAuth 인증이 완료되지 않음
- **해결**: "Show my bkend projects" 요청하여 OAuth 플로우 시작

### "Project not found" 오류
- **원인**: 프로젝트 ID가 잘못되었거나 권한 없음
- **해결**: console.bkend.ai에서 프로젝트 ID 확인

### "Table already exists" 오류
- **원인**: 동일한 이름의 테이블이 이미 존재
- **해결**: 콘솔에서 기존 테이블 삭제 후 재생성

### "Referenced table not found" 오류
- **원인**: 참조하는 테이블이 아직 생성되지 않음
- **해결**: 의존성 순서대로 생성 (위 생성 순서 참조)

## 다음 단계

테이블 생성 완료 후:

1. **샘플 데이터 생성** (Task #14)
   - 테스트용 users, clients, rfps 데이터 생성

2. **프론트엔드 설정**
   - `.env.local` 파일에 프로젝트 정보 추가
   - `lib/bkend.ts` API 클라이언트 구현

3. **개발 시작**
   - Phase 1: RFP 등록/조회 페이지
   - Phase 2: AI 분석 기능
   - Phase 3: 제안서 생성/편집

## 참고 문서

- **상세 가이드**: `docs/03-implementation/table-creation-guide.md`
- **스키마 정의**: `docs/01-plan/schema.md`
- **Task 목록**: `docs/01-plan/tasks.md`
- **API 스펙**: `docs/02-design/api-spec.md`

---

**필요 지원:**
bkend MCP OAuth 인증이나 테이블 생성에 문제가 있으면 언제든지 문의하세요!
