# auth-system Plan Document

> **Feature**: Authentication System
> **Priority**: P1 (Blocking)
> **Estimated Duration**: 3-4 days
> **Dependencies**: Supabase
> **Status**: Planning

---

## 1. Feature Overview

### 1.1 Purpose

RFP Management System의 인증 및 권한 관리 시스템을 구축하여 사용자 로그인, 회원가입, 세션 관리, 역할 기반 접근 제어(RBAC)를 제공합니다.

### 1.2 Business Value

- **보안**: 인가된 사용자만 시스템 접근 가능
- **추적성**: 모든 작업에 대한 사용자 식별 가능
- **권한 관리**: 역할별 접근 제어로 데이터 보안 강화
- **사용자 경험**: 간편한 로그인/회원가입 플로우

### 1.3 Scope

**In Scope:**
- 이메일/비밀번호 로그인
- 회원가입 (이메일 인증)
- 로그아웃
- 세션 관리 (JWT 토큰)
- 비밀번호 재설정
- 사용자 프로필 관리
- 역할 기반 접근 제어 (RBAC)
- 보호된 라우트 (Protected Routes)

**Out of Scope (향후 확장):**
- 소셜 로그인 (Google, GitHub 등)
- 2FA (Two-Factor Authentication)
- 싱글 사인온 (SSO)
- OAuth 2.0 제공자

---

## 2. Requirements

### 2.1 Functional Requirements

#### FR-1: 회원가입
- 사용자가 이메일, 비밀번호, 이름으로 회원가입 가능
- 이메일 중복 검증
- 비밀번호 강도 검증 (최소 8자, 대소문자, 숫자, 특수문자)
- 이메일 인증 링크 발송
- 인증 완료 후 자동 로그인

#### FR-2: 로그인
- 이메일/비밀번호로 로그인
- 로그인 성공 시 JWT 토큰 발급
- "로그인 상태 유지" 옵션
- 로그인 실패 시 명확한 에러 메시지

#### FR-3: 로그아웃
- 현재 세션 종료
- 토큰 무효화
- 로그인 페이지로 리다이렉트

#### FR-4: 세션 관리
- Access Token (1시간 유효)
- Refresh Token (7일 유효)
- 자동 토큰 갱신
- 세션 만료 시 로그인 페이지로 리다이렉트

#### FR-5: 비밀번호 재설정
- "비밀번호 찾기" 기능
- 이메일로 재설정 링크 발송
- 새 비밀번호 설정

#### FR-6: 사용자 프로필
- 프로필 정보 조회
- 프로필 수정 (이름, 부서, 직책, 전화번호)
- 비밀번호 변경

#### FR-7: 역할 기반 접근 제어 (RBAC)
- 역할: admin, manager, writer, reviewer
- 역할별 권한 매트릭스
- 페이지/기능별 접근 제어
- 권한 없을 시 403 Forbidden

### 2.2 Non-Functional Requirements

#### NFR-1: 보안
- 비밀번호 해싱 (bcrypt)
- HTTPS 통신
- CSRF 보호
- XSS 보호
- SQL Injection 방지
- Rate Limiting (로그인 시도 제한)

#### NFR-2: 성능
- 로그인 응답 시간 < 500ms
- 토큰 검증 < 50ms
- 세션 체크 오버헤드 최소화

#### NFR-3: 사용성
- 직관적인 로그인/회원가입 폼
- 명확한 에러 메시지
- 비밀번호 표시/숨김 토글
- "비밀번호 찾기" 쉬운 접근

#### NFR-4: 가용성
- 인증 서버 다운타임 < 0.1%
- Supabase Auth 고가용성 활용

---

## 3. Technical Specifications

### 3.1 Technology Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Auth Provider | Supabase Auth | BaaS, 관리형 인증, JWT 토큰 |
| Frontend | Next.js 15 + TypeScript | 서버 컴포넌트, 미들웨어 |
| State Management | React Context + Zustand | 전역 사용자 상태 |
| Form Validation | React Hook Form + Zod | 타입 안전 폼 검증 |
| HTTP Client | Supabase Client | Supabase Auth API |

### 3.2 Architecture

```
┌─────────────────────────────────────────┐
│  Client (Browser)                       │
│  ┌─────────────────────────────────┐   │
│  │ Login/Signup Pages              │   │
│  │ - Forms (React Hook Form)       │   │
│  │ - Validation (Zod)               │   │
│  └─────────────────────────────────┘   │
│             ↓                           │
│  ┌─────────────────────────────────┐   │
│  │ Auth Context Provider            │   │
│  │ - User state                     │   │
│  │ - Session management             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
             ↓ HTTP (JWT)
┌─────────────────────────────────────────┐
│  Next.js Middleware                     │
│  - Route protection                     │
│  - Token validation                     │
│  - Role-based access                    │
└─────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Supabase Auth                          │
│  - User management                      │
│  - JWT token issuance                   │
│  - Email verification                   │
│  - Password reset                       │
└─────────────────────────────────────────┘
```

### 3.3 Data Model

#### User (Supabase Auth)
```typescript
interface AuthUser {
  id: string // UUID
  email: string
  email_confirmed_at: Date | null
  created_at: Date
  last_sign_in_at: Date | null
}
```

#### User Profile (Custom Table)
```typescript
interface UserProfile {
  id: string // FK to auth.users.id
  email: string
  name: string
  role: 'admin' | 'manager' | 'writer' | 'reviewer'
  department: string | null
  position: string | null
  phone: string | null
  avatar: string | null
  permissions: string[] // ['manage_rfps', 'write_proposals', etc.]
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### 3.4 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/refresh` | 토큰 갱신 |
| POST | `/auth/reset-password` | 비밀번호 재설정 요청 |
| POST | `/auth/update-password` | 비밀번호 변경 |
| GET | `/auth/me` | 현재 사용자 정보 |
| PATCH | `/auth/profile` | 프로필 수정 |

---

## 4. User Stories

### US-1: 회원가입
**As a** 새로운 사용자
**I want to** 이메일과 비밀번호로 회원가입
**So that** 시스템을 사용할 수 있다

**Acceptance Criteria:**
- 이메일, 비밀번호, 이름 입력 필드
- 비밀번호 확인 필드
- 이메일 형식 검증
- 비밀번호 강도 검증
- 이메일 중복 체크
- 회원가입 성공 시 이메일 인증 안내
- 이메일 인증 후 자동 로그인

### US-2: 로그인
**As a** 등록된 사용자
**I want to** 이메일과 비밀번호로 로그인
**So that** 시스템에 접근할 수 있다

**Acceptance Criteria:**
- 이메일, 비밀번호 입력 필드
- "로그인 상태 유지" 체크박스
- "비밀번호 찾기" 링크
- 로그인 실패 시 에러 메시지
- 로그인 성공 시 대시보드로 이동

### US-3: 역할 기반 접근
**As a** 로그인한 사용자
**I want to** 내 역할에 따라 기능에 접근
**So that** 권한 범위 내에서만 작업할 수 있다

**Acceptance Criteria:**
- 역할별 접근 가능 페이지 제한
- 권한 없는 페이지 접근 시 403 에러
- 역할별 버튼/메뉴 표시/숨김

---

## 5. Implementation Plan

### 5.1 Phase Breakdown

#### Phase 1: Supabase Auth 설정 (0.5일)
- Supabase 프로젝트에서 Auth 활성화
- 이메일 템플릿 설정
- Redirect URL 설정
- RLS 정책 설정

#### Phase 2: Auth Context & Hooks (1일)
- AuthContext Provider 생성
- useAuth hook
- useUser hook
- Session management logic

#### Phase 3: Auth Pages (1일)
- Login page (`/(auth)/login`)
- Signup page (`/(auth)/signup`)
- Password reset request page
- Password reset confirmation page

#### Phase 4: Middleware & Protection (0.5일)
- Next.js Middleware for route protection
- Role-based access control
- Redirect logic

#### Phase 5: Profile Management (0.5일)
- Profile view page
- Profile edit page
- Password change form

#### Phase 6: Integration & Testing (0.5일)
- Existing pages integration
- Header user menu
- Logout functionality
- E2E testing

### 5.2 Dependencies

**External:**
- Supabase Auth 활성화
- 이메일 발송 설정 (Supabase 제공)

**Internal:**
- User table (이미 존재)
- Header/Sidebar component (구현 필요)

### 5.3 Milestones

| Milestone | Deliverables | Target Date |
|-----------|-------------|-------------|
| M1: Auth Setup | Supabase Auth 설정 완료 | Day 1 |
| M2: Core Auth | Login/Signup 페이지 완료 | Day 2 |
| M3: Protection | Middleware, RBAC 완료 | Day 3 |
| M4: Profile | Profile 관리 완료 | Day 3.5 |
| M5: Integration | 전체 통합 및 테스트 완료 | Day 4 |

---

## 6. Risks & Mitigation

### Risk 1: Supabase Auth 이해 부족
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: Supabase Auth 문서 숙독, 예제 코드 참고

### Risk 2: Token 관리 복잡도
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Supabase Client 자동 토큰 관리 활용

### Risk 3: RBAC 로직 복잡도
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: 간단한 역할 체크 함수, HOC 패턴

### Risk 4: 이메일 발송 실패
- **Impact**: High
- **Probability**: Low
- **Mitigation**: Supabase 관리형 이메일 사용, 테스트 환경 검증

---

## 7. Success Criteria

### 7.1 Functional Criteria
- ✅ 회원가입 플로우 정상 동작
- ✅ 로그인/로그아웃 정상 동작
- ✅ 세션 유지 및 자동 갱신
- ✅ 비밀번호 재설정 정상 동작
- ✅ 역할별 접근 제어 정상 동작
- ✅ 프로필 수정 정상 동작

### 7.2 Quality Criteria
- ✅ 타입 안전성 (TypeScript strict mode)
- ✅ `any` 타입 사용 없음
- ✅ 폼 검증 (Zod schema)
- ✅ 에러 처리 (모든 API 호출)
- ✅ Loading 상태 표시
- ✅ 접근성 (a11y) 준수

### 7.3 Performance Criteria
- ✅ 로그인 응답 < 500ms
- ✅ 토큰 검증 < 50ms
- ✅ 페이지 로드 시 세션 체크 < 100ms

---

## 8. Out of Scope (Future Enhancements)

- 소셜 로그인 (Google, GitHub, etc.)
- 2FA (Two-Factor Authentication)
- 비밀번호 없는 로그인 (Magic Link)
- IP 기반 접근 제어
- 로그인 히스토리 추적
- 동시 세션 제한
- 디바이스 관리

---

## 9. References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- OWASP Authentication Cheat Sheet

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial plan document | Claude |
