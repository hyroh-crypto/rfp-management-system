# Authentication System Guide

> RFP Management System의 인증 시스템 사용 가이드

## 📋 개요

Supabase Auth 기반의 인증 시스템으로, 이메일/비밀번호 인증, 세션 관리, 역할 기반 접근 제어(RBAC)를 제공합니다.

## 🔑 주요 기능

### 1. 인증 (Authentication)

- **회원가입**: 이메일/비밀번호로 가입, 이메일 인증 필수
- **로그인**: 이메일/비밀번호 인증, "로그인 상태 유지" 옵션
- **로그아웃**: 세션 종료 및 토큰 무효화
- **비밀번호 재설정**: 이메일로 재설정 링크 발송
- **비밀번호 변경**: 로그인 상태에서 비밀번호 변경

### 2. 세션 관리

- **Access Token**: 1시간 유효
- **Refresh Token**: 7일 유효
- **자동 갱신**: 만료 5분 전 자동 갱신
- **세션 감지**: onAuthStateChange 리스너로 실시간 감지

### 3. 권한 관리 (RBAC)

**역할 (Roles):**
- `admin`: 시스템 관리자 (모든 권한)
- `manager`: 매니저 (RFP, 제안서, 고객사 관리)
- `writer`: 작성자 (제안서 작성)
- `reviewer`: 검토자 (제안서 검토 및 승인)

**권한 (Permissions):**
- RFP: view, create, edit, delete, analyze
- Proposal: view, create, edit, delete, submit, approve
- Client: view, create, edit, delete
- Prototype: view, create, edit, delete
- User: view, create, edit, delete, change_role

## 🚀 사용 방법

### 1. 인증 훅 사용

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 2. 사용자 정보 훅

```tsx
import { useUser, useUserRole, useUserPermission } from '@/hooks/useUser'
import { Permission } from '@/lib/permissions'

function UserInfo() {
  const { user, isAuthenticated } = useUser()
  const isAdmin = useUserRole('admin')
  const canDelete = useUserPermission(Permission.DELETE_RFP)

  return (
    <div>
      <p>{user?.name}</p>
      {isAdmin && <AdminPanel />}
      {canDelete && <DeleteButton />}
    </div>
  )
}
```

### 3. 라우트 보호 (AuthGuard)

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'
import { Permission } from '@/lib/permissions'

// 로그인 필요
function ProtectedPage() {
  return (
    <AuthGuard>
      <ProtectedContent />
    </AuthGuard>
  )
}

// 특정 역할만 접근
function AdminPage() {
  return (
    <AuthGuard allowedRoles={['admin', 'manager']}>
      <AdminContent />
    </AuthGuard>
  )
}

// 특정 권한 필요
function DeleteAction() {
  return (
    <AuthGuard requiredPermissions={[Permission.DELETE_RFP]}>
      <DeleteButton />
    </AuthGuard>
  )
}
```

### 4. HOC 패턴

```tsx
import { withAuth } from '@/components/auth/auth-guard'

const ProtectedPage = withAuth(MyPage, {
  allowedRoles: ['admin', 'manager']
})

export default ProtectedPage
```

## 📁 파일 구조

```
src/
├── app/
│   ├── (auth)/                    # 인증 페이지
│   │   ├── layout.tsx             # Auth 레이아웃
│   │   ├── login/page.tsx         # 로그인
│   │   ├── signup/page.tsx        # 회원가입
│   │   ├── reset-password/page.tsx # 비밀번호 재설정
│   │   ├── update-password/page.tsx # 비밀번호 변경
│   │   └── callback/page.tsx      # Auth 콜백
│   └── (dashboard)/
│       └── settings/profile/      # 프로필 관리
├── components/
│   ├── auth/
│   │   ├── auth-guard.tsx         # AuthGuard HOC
│   │   ├── login-form.tsx         # 로그인 폼
│   │   └── signup-form.tsx        # 회원가입 폼
│   └── profile/
│       ├── profile-form.tsx       # 프로필 수정 폼
│       └── password-change-form.tsx # 비밀번호 변경 폼
├── hooks/
│   ├── useAuth.ts                 # 인증 훅
│   ├── useUser.ts                 # 사용자 훅
│   └── useSession.ts              # 세션 훅
├── lib/
│   ├── permissions.ts             # 권한 정의
│   └── validations/auth.ts        # 폼 검증
├── providers/
│   └── auth-provider.tsx          # Auth Context Provider
├── services/
│   └── auth.service.ts            # Auth 서비스
├── types/
│   └── auth.ts                    # Auth 타입 정의
└── middleware.ts                  # Next.js Middleware (라우트 보호)
```

## 🔒 보안

### 비밀번호 정책

- 최소 8자 이상
- 대문자 1개 이상
- 소문자 1개 이상
- 숫자 1개 이상
- 특수문자 1개 이상

### 보안 조치

- **HTTPS**: Supabase 강제 적용
- **Password Hashing**: bcrypt (Supabase 관리)
- **JWT Tokens**: 1시간 유효 (자동 갱신)
- **CSRF Protection**: SameSite cookies
- **XSS Protection**: React auto-escaping
- **SQL Injection**: Supabase parameterized queries
- **Rate Limiting**: Supabase 내장 기능

## 📝 Middleware 라우트 보호

Next.js Middleware가 자동으로 보호합니다:

```typescript
// 보호된 라우트
['/rfps', '/proposals', '/clients', '/prototypes', '/settings']

// 공개 라우트
['/auth/login', '/auth/signup', '/auth/reset-password']

// 역할별 접근 제어
admin: 모든 경로
manager: /rfps, /proposals, /clients, /prototypes, /settings
writer: /rfps, /proposals, /clients
reviewer: /rfps, /proposals
```

## 🧪 테스트

### 회원가입 플로우

1. `/auth/signup` 접속
2. 이메일, 비밀번호, 이름 입력
3. 이용약관 동의
4. 가입 버튼 클릭
5. 이메일 확인 및 인증 링크 클릭
6. 로그인 페이지로 이동

### 로그인 플로우

1. `/auth/login` 접속
2. 이메일, 비밀번호 입력
3. 로그인 버튼 클릭
4. 대시보드(`/rfps`)로 리다이렉트

### 프로필 관리

1. Header의 사용자 메뉴 클릭
2. "프로필" 선택
3. `/settings/profile`에서 정보 확인
4. "프로필 수정" 버튼 클릭
5. 정보 수정 후 저장

## 🐛 트러블슈팅

### 로그인이 안 돼요

- 이메일 인증을 완료했는지 확인
- 비밀번호가 올바른지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 세션이 자꾸 만료돼요

- "로그인 상태 유지" 옵션 체크
- Refresh Token이 7일 이내인지 확인
- 브라우저 쿠키 설정 확인

### 권한 오류가 나요

- 현재 역할 확인 (프로필 페이지)
- 필요한 권한이 있는지 확인
- 관리자에게 역할 변경 요청

## 📚 참고 자료

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
