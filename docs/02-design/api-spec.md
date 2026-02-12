# API Specification - RFP Management System

> RESTful API 명세서

**버전**: v1
**Base URL**: `https://api.rfp-system.com/api/v1`
**작성일**: 2026-02-11

---

## 📋 목차

1. [개요](#1-개요)
2. [인증](#2-인증)
3. [공통 규칙](#3-공통-규칙)
4. [API 엔드포인트](#4-api-엔드포인트)
5. [에러 처리](#5-에러-처리)
6. [Rate Limiting](#6-rate-limiting)

---

## 1. 개요

### 1.1 API 설계 원칙

- ✅ **RESTful**: 리소스 기반 URL, HTTP 메서드 의미 준수
- ✅ **Stateless**: 각 요청은 독립적
- ✅ **JSON**: 모든 요청/응답은 JSON 형식
- ✅ **HTTPS**: 보안 통신 필수
- ✅ **Versioning**: URL 경로에 버전 포함 (`/api/v1`)

### 1.2 기술 스택

| 항목 | 기술 |
|------|------|
| **Runtime** | Node.js 20+ |
| **Framework** | Next.js 14 App Router (API Routes) |
| **Database** | PostgreSQL 15+ 또는 bkend.ai |
| **ORM** | Prisma 또는 bkend.ai SDK |
| **Authentication** | JWT (Access + Refresh Token) |
| **File Storage** | AWS S3 또는 Cloudinary |

---

## 2. 인증

### 2.1 JWT 기반 인증

**Access Token**:
- 유효 기간: 1시간
- Header: `Authorization: Bearer {access_token}`

**Refresh Token**:
- 유효 기간: 7일
- HTTP-only Cookie 또는 Secure Storage

### 2.2 인증 흐름

```
1. POST /auth/login
   → Response: { accessToken, refreshToken }

2. 모든 API 요청
   → Header: Authorization: Bearer {accessToken}

3. Access Token 만료 시
   → POST /auth/refresh
   → Body: { refreshToken }
   → Response: { accessToken, refreshToken }

4. Logout
   → POST /auth/logout
   → Refresh Token 무효화
```

### 2.3 권한 레벨

| Role | 권한 |
|------|------|
| **admin** | 모든 작업 가능 |
| **manager** | RFP/Proposal 승인, 사용자 관리 제외 |
| **writer** | RFP/Proposal 생성/수정 |
| **reviewer** | 읽기 + 검토 코멘트 |

---

## 3. 공통 규칙

### 3.1 요청 헤더

```http
Content-Type: application/json
Authorization: Bearer {access_token}
Accept: application/json
```

### 3.2 응답 형식

#### 성공 응답 (단일 리소스)

```json
{
  "data": {
    "id": "rfp-123",
    "title": "ERP 시스템 구축",
    "status": "analyzing",
    "createdAt": "2026-02-11T10:00:00Z"
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00Z",
    "requestId": "req-abc123"
  }
}
```

#### 성공 응답 (목록)

```json
{
  "data": [
    { "id": "rfp-1", "title": "..." },
    { "id": "rfp-2", "title": "..." }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00Z"
  }
}
```

#### 에러 응답

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00Z",
    "requestId": "req-abc123"
  }
}
```

### 3.3 쿼리 파라미터 규칙

#### 페이지네이션

```
?page=1           # 페이지 번호 (기본: 1)
?limit=20         # 페이지당 개수 (기본: 20, 최대: 100)
```

#### 필터링

```
?status=analyzing              # 단일 값
?status=analyzing,analyzed     # 다중 값 (OR)
?clientId=client-123          # 관계 필터
```

#### 정렬

```
?sort=createdAt               # 오름차순 (기본)
?sort=-createdAt              # 내림차순 (- 접두사)
?sort=status,-createdAt       # 다중 정렬
```

#### 검색

```
?search=ERP                   # 제목/설명 검색
?q=ERP                        # 전체 텍스트 검색
```

#### 필드 선택 (Sparse Fieldsets)

```
?fields=id,title,status       # 특정 필드만 반환
```

---

## 4. API 엔드포인트

### 4.1 인증 (Auth)

#### POST /auth/signup
회원가입

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "name": "홍길동",
  "role": "writer"
}
```

**Response: 201 Created**
```json
{
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "writer"
  },
  "tokens": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

#### POST /auth/login
로그인

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Response: 200 OK**
```json
{
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "writer"
    }
  },
  "tokens": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

#### POST /auth/refresh
토큰 갱신

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response: 200 OK**
```json
{
  "tokens": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

#### POST /auth/logout
로그아웃

**Response: 204 No Content**

---

### 4.2 고객사 (Clients)

#### GET /clients
고객사 목록 조회

**Query Parameters:**
- `page`, `limit` (페이지네이션)
- `sort` (정렬)
- `search` (검색)

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "client-1",
      "name": "ABC 제조",
      "businessNumber": "123-45-67890",
      "industry": "제조업",
      "contact": {
        "name": "김담당",
        "email": "contact@abc.com",
        "phone": "010-1234-5678"
      },
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /clients/:id
고객사 상세 조회

**Response: 200 OK**

#### POST /clients
고객사 생성

**Request Body:**
```json
{
  "name": "ABC 제조",
  "businessNumber": "123-45-67890",
  "industry": "제조업",
  "contact": {
    "name": "김담당",
    "email": "contact@abc.com",
    "phone": "010-1234-5678",
    "position": "부장"
  },
  "address": "서울시 강남구...",
  "website": "https://abc.com"
}
```

**Response: 201 Created**

#### PATCH /clients/:id
고객사 수정

**Request Body:** (부분 수정)
```json
{
  "contact": {
    "phone": "010-9999-9999"
  }
}
```

**Response: 200 OK**

#### DELETE /clients/:id
고객사 삭제

**Response: 204 No Content**

---

### 4.3 제안요청서 (RFPs)

#### GET /rfps
RFP 목록 조회

**Query Parameters:**
- `status` (received, analyzing, analyzed, rejected)
- `clientId`
- `assigneeId`
- `dueDateFrom`, `dueDateTo`
- `page`, `limit`, `sort`, `search`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "rfp-1",
      "title": "ERP 시스템 구축",
      "clientId": "client-1",
      "clientName": "ABC 제조",
      "status": "analyzing",
      "receivedDate": "2026-02-01",
      "dueDate": "2026-03-15",
      "estimatedBudget": 500000000,
      "assigneeId": "user-1",
      "assigneeName": "홍길동",
      "aiAnalysis": {
        "summary": "제조업 특화 ERP...",
        "keyRequirements": ["재고관리", "생산관리"],
        "estimatedEffort": 8
      },
      "createdAt": "2026-02-01T09:00:00Z",
      "updatedAt": "2026-02-10T15:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /rfps/:id
RFP 상세 조회

**Query Parameters:**
- `include` (requirements, proposal) - 연관 데이터 포함

**Response: 200 OK**

#### POST /rfps
RFP 생성

**Request Body:**
```json
{
  "title": "ERP 시스템 구축",
  "clientId": "client-1",
  "description": "전사 ERP 시스템 구축 요청...",
  "receivedDate": "2026-02-01",
  "dueDate": "2026-03-15",
  "estimatedBudget": 500000000,
  "estimatedDuration": 180,
  "attachments": [
    {
      "fileName": "rfp-document.pdf",
      "fileSize": 2048000,
      "url": "https://storage.../rfp-document.pdf"
    }
  ]
}
```

**Response: 201 Created**

#### PATCH /rfps/:id
RFP 수정

**Response: 200 OK**

#### DELETE /rfps/:id
RFP 삭제

**Response: 204 No Content**

#### POST /rfps/:id/analyze
RFP AI 분석 실행

**Request Body:**
```json
{
  "options": {
    "includeRiskAnalysis": true,
    "includeTechStack": true
  }
}
```

**Response: 200 OK**
```json
{
  "data": {
    "summary": "제조업 특화 ERP 구축 요청...",
    "keyRequirements": [
      "재고 관리 시스템",
      "생산 계획 관리",
      "회계 시스템 연동"
    ],
    "technicalStack": ["React", "Node.js", "PostgreSQL"],
    "riskLevel": "medium",
    "estimatedEffort": 8,
    "analyzedAt": "2026-02-11T10:00:00Z"
  }
}
```

#### PATCH /rfps/:id/status
RFP 상태 변경

**Request Body:**
```json
{
  "status": "analyzed",
  "reason": "분석 완료"
}
```

**Response: 200 OK**

#### PATCH /rfps/:id/assign
담당자 배정

**Request Body:**
```json
{
  "assigneeId": "user-123"
}
```

**Response: 200 OK**

---

### 4.4 요구사항 (Requirements)

#### GET /rfps/:rfpId/requirements
특정 RFP의 요구사항 목록

**Query Parameters:**
- `category` (functional, non-functional, technical, business)
- `priority` (must, should, could, wont)

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "req-1",
      "rfpId": "rfp-1",
      "category": "functional",
      "priority": "must",
      "title": "재고 관리 기능",
      "description": "실시간 재고 현황 조회 및 관리",
      "acceptanceCriteria": "재고 입출고 실시간 반영",
      "complexity": "medium",
      "estimatedHours": 40,
      "order": 1,
      "createdAt": "2026-02-01T10:00:00Z"
    }
  ]
}
```

#### POST /rfps/:rfpId/requirements
요구사항 생성

**Request Body:**
```json
{
  "category": "functional",
  "priority": "must",
  "title": "재고 관리 기능",
  "description": "실시간 재고 현황 조회 및 관리",
  "acceptanceCriteria": "재고 입출고 실시간 반영"
}
```

**Response: 201 Created**

#### PATCH /requirements/:id
요구사항 수정

**Response: 200 OK**

#### DELETE /requirements/:id
요구사항 삭제

**Response: 204 No Content**

---

### 4.5 제안서 (Proposals)

#### GET /proposals
제안서 목록 조회

**Query Parameters:**
- `status` (drafting, reviewing, approved, delivered, won, lost)
- `rfpId`
- `assigneeId`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "proposal-1",
      "rfpId": "rfp-1",
      "rfpTitle": "ERP 시스템 구축",
      "title": "ABC 제조 ERP 구축 제안서",
      "version": "1.0.0",
      "status": "drafting",
      "assigneeId": "user-1",
      "reviewerIds": ["user-2", "user-3"],
      "totalPrice": 480000000,
      "estimatedDuration": 180,
      "startDate": "2026-04-01",
      "endDate": "2026-09-30",
      "team": [
        {
          "name": "홍길동",
          "role": "PM",
          "allocation": 100,
          "duration": 180
        }
      ],
      "createdAt": "2026-02-05T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /proposals/:id
제안서 상세 조회

**Query Parameters:**
- `include` (sections, prototypes, rfp)

**Response: 200 OK**

#### POST /proposals
제안서 생성

**Request Body:**
```json
{
  "rfpId": "rfp-1",
  "title": "ABC 제조 ERP 구축 제안서",
  "executiveSummary": "본 제안서는...",
  "totalPrice": 480000000,
  "estimatedDuration": 180,
  "startDate": "2026-04-01",
  "team": [
    {
      "name": "홍길동",
      "role": "PM",
      "allocation": 100,
      "duration": 180
    }
  ]
}
```

**Response: 201 Created**

#### PATCH /proposals/:id
제안서 수정

**Response: 200 OK**

#### DELETE /proposals/:id
제안서 삭제

**Response: 204 No Content**

#### POST /proposals/:id/generate-sections
AI 섹션 자동 생성

**Request Body:**
```json
{
  "sections": ["requirement-analysis", "technical-approach", "timeline"]
}
```

**Response: 200 OK**
```json
{
  "data": {
    "generatedSections": [
      {
        "type": "requirement-analysis",
        "title": "요구사항 분석",
        "content": "## 요구사항 분석\n\n..."
      }
    ]
  }
}
```

#### PATCH /proposals/:id/status
제안서 상태 변경

**Request Body:**
```json
{
  "status": "reviewing"
}
```

**Response: 200 OK**

#### POST /proposals/:id/submit
제안서 제출 (고객사에게 전달)

**Response: 200 OK**

---

### 4.6 제안서 섹션 (Proposal Sections)

#### GET /proposals/:proposalId/sections
제안서 섹션 목록

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "section-1",
      "proposalId": "proposal-1",
      "type": "executive-summary",
      "title": "요약",
      "content": "## 요약\n\n본 제안서는...",
      "order": 1,
      "status": "approved",
      "isAIGenerated": true,
      "createdBy": "user-1",
      "createdAt": "2026-02-05T11:00:00Z"
    }
  ]
}
```

#### POST /proposals/:proposalId/sections
섹션 생성

**Request Body:**
```json
{
  "type": "technical-approach",
  "title": "기술적 접근",
  "content": "## 기술적 접근\n\n...",
  "order": 3
}
```

**Response: 201 Created**

#### PATCH /sections/:id
섹션 수정

**Response: 200 OK**

#### DELETE /sections/:id
섹션 삭제

**Response: 204 No Content**

---

### 4.7 UI 프로토타입 (UI Prototypes)

#### GET /proposals/:proposalId/prototypes
프로토타입 목록

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "proto-1",
      "proposalId": "proposal-1",
      "name": "재고 관리 대시보드",
      "type": "mockup",
      "description": "실시간 재고 현황 대시보드",
      "imageUrl": "https://storage.../proto-1.png",
      "figmaUrl": "https://figma.com/...",
      "status": "approved",
      "isAIGenerated": true,
      "order": 1,
      "createdAt": "2026-02-06T10:00:00Z"
    }
  ]
}
```

#### POST /proposals/:proposalId/prototypes
프로토타입 생성

**Request Body:**
```json
{
  "name": "재고 관리 대시보드",
  "type": "mockup",
  "description": "실시간 재고 현황 대시보드",
  "imageUrl": "https://storage.../proto-1.png"
}
```

**Response: 201 Created**

#### POST /prototypes/generate
AI 프로토타입 생성

**Request Body:**
```json
{
  "requirementId": "req-1",
  "type": "wireframe",
  "prompt": "재고 관리 화면을 설계해주세요. 테이블, 검색, 필터 포함"
}
```

**Response: 200 OK**

#### PATCH /prototypes/:id
프로토타입 수정

**Response: 200 OK**

#### DELETE /prototypes/:id
프로토타입 삭제

**Response: 204 No Content**

---

### 4.8 코멘트 (Comments)

#### GET /comments
코멘트 목록

**Query Parameters:**
- `targetType` (proposal, ui-prototype, section)
- `targetId`

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "comment-1",
      "targetType": "proposal",
      "targetId": "proposal-1",
      "content": "예산 부분 재검토 필요",
      "type": "feedback",
      "authorId": "user-2",
      "authorName": "김검토",
      "isResolved": false,
      "createdAt": "2026-02-07T14:00:00Z"
    }
  ]
}
```

#### POST /comments
코멘트 생성

**Request Body:**
```json
{
  "targetType": "proposal",
  "targetId": "proposal-1",
  "content": "예산 부분 재검토 필요",
  "type": "feedback"
}
```

**Response: 201 Created**

#### PATCH /comments/:id
코멘트 수정

**Response: 200 OK**

#### DELETE /comments/:id
코멘트 삭제

**Response: 204 No Content**

#### PATCH /comments/:id/resolve
코멘트 해결 처리

**Response: 200 OK**

---

### 4.9 파일 업로드 (File Upload)

#### POST /upload
파일 업로드

**Request:** `multipart/form-data`
```
file: (binary)
type: "rfp-attachment" | "prototype-image" | "proposal-document"
```

**Response: 200 OK**
```json
{
  "data": {
    "id": "file-123",
    "fileName": "document.pdf",
    "fileSize": 2048000,
    "fileType": "application/pdf",
    "url": "https://storage.rfp-system.com/files/file-123.pdf",
    "uploadedAt": "2026-02-11T10:00:00Z"
  }
}
```

---

### 4.10 사용자 (Users)

#### GET /users
사용자 목록

**Query Parameters:**
- `role` (admin, manager, writer, reviewer)
- `isActive`

**Response: 200 OK**

#### GET /users/:id
사용자 상세

**Response: 200 OK**

#### GET /users/me
현재 사용자 정보

**Response: 200 OK**

#### PATCH /users/:id
사용자 수정

**Response: 200 OK**

#### PATCH /users/:id/role
역할 변경 (admin만)

**Response: 200 OK**

---

## 5. 에러 처리

### 5.1 에러 코드

| HTTP Status | Error Code | 설명 |
|-------------|------------|------|
| 400 | `VALIDATION_ERROR` | 요청 데이터 검증 실패 |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 401 | `TOKEN_EXPIRED` | 토큰 만료 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `CONFLICT` | 중복 또는 충돌 |
| 409 | `DUPLICATE_EMAIL` | 이메일 중복 |
| 422 | `UNPROCESSABLE_ENTITY` | 처리 불가능한 요청 |
| 429 | `RATE_LIMIT_EXCEEDED` | Rate Limit 초과 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |
| 503 | `SERVICE_UNAVAILABLE` | 서비스 이용 불가 |

### 5.2 에러 응답 예시

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid",
        "value": "invalid-email"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-02-11T10:00:00Z",
    "requestId": "req-abc123",
    "path": "/api/v1/auth/signup"
  }
}
```

---

## 6. Rate Limiting

### 6.1 제한 정책

| Endpoint | 제한 | 기간 |
|----------|------|------|
| `/auth/login` | 5 requests | 15분 |
| `/auth/signup` | 3 requests | 1시간 |
| 일반 API | 100 requests | 15분 |
| AI 관련 API | 10 requests | 1분 |

### 6.2 응답 헤더

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1644577200
```

### 6.3 Rate Limit 초과 시

**Response: 429 Too Many Requests**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 120
  }
}
```

---

## 7. Zero Script QA 가이드

### 7.1 구조화된 로그 형식

모든 API는 다음 형식의 로그를 출력합니다:

```
[API] POST /api/v1/rfps
[INPUT] { "title": "ERP 시스템 구축", "clientId": "client-1", ... }
[PROCESS] 클라이언트 존재 확인 → 통과
[PROCESS] 제목 중복 검사 → 통과
[PROCESS] RFP 생성 → 성공
[PROCESS] 담당자 알림 발송 → 성공
[OUTPUT] { "id": "rfp-123", "title": "ERP 시스템 구축", "status": "received" }
[RESULT] ✅ Success (201 Created)
```

### 7.2 QA 체크리스트

API 구현 후 다음을 확인:

- [ ] **로그 출력**: 모든 API가 구조화된 로그 출력
- [ ] **상태 코드**: 올바른 HTTP 상태 코드 반환
- [ ] **응답 형식**: 일관된 JSON 응답 형식
- [ ] **에러 처리**: 명확한 에러 메시지
- [ ] **인증/인가**: 권한 검증
- [ ] **검증**: 입력 데이터 검증

### 7.3 Docker Logs 확인

```bash
# API 서버 로그 실시간 확인
docker logs -f rfp-api-server

# 특정 API만 필터링
docker logs rfp-api-server 2>&1 | grep "\[API\] POST /api/v1/rfps"
```

---

## 8. 다음 단계

### 8.1 구현 순서

```
1. Phase 4-1: 인증 API 구현
2. Phase 4-2: Client API 구현
3. Phase 4-3: RFP API 구현
4. Phase 4-4: Proposal API 구현
5. Phase 4-5: AI 통합 (분석, 생성)
6. Phase 4-6: Zero Script QA
```

### 8.2 Phase 5로 전환

API 구현 완료 후:
- Phase 5: Design System으로 이동
- UI 컴포넌트 라이브러리 구축
- API와 프론트엔드 통합

---

**이 문서는 구현 시 참조하는 API 계약서입니다.**
**모든 API는 이 명세를 따라야 합니다.**
