# auth-system Design Document

> **Feature**: Authentication System
> **Plan Reference**: [auth-system.plan.md](../../01-plan/features/auth-system.plan.md)
> **Status**: Design
> **Last Updated**: 2026-02-12

---

## 1. Architecture Design

### 1.1 Overall Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Client (Browser)                          │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Auth Pages                                              │  │
│  │  - LoginPage                                            │  │
│  │  - SignupPage                                           │  │
│  │  - ResetPasswordPage                                    │  │
│  │  - UpdatePasswordPage                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Auth Context & Hooks                                    │  │
│  │  - AuthProvider (React Context)                         │  │
│  │  - useAuth() → { user, login, logout, signup }          │  │
│  │  - useUser() → { user, loading, error }                 │  │
│  │  - useSession() → { session, refreshSession }           │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Auth Service Layer                                      │  │
│  │  - authService.login()                                  │  │
│  │  - authService.signup()                                 │  │
│  │  - authService.logout()                                 │  │
│  │  - authService.resetPassword()                          │  │
│  │  - authService.getCurrentUser()                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           ↓ HTTPS (JWT)
┌──────────────────────────────────────────────────────────────┐
│                Next.js Middleware                             │
│  - middleware.ts                                              │
│  - Route protection logic                                     │
│  - Token validation                                           │
│  - Role-based access control                                 │
│  - Redirect to /login if unauthorized                        │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                    Supabase Backend                           │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Supabase Auth                                           │  │
│  │  - User registration                                    │  │
│  │  - Email verification                                   │  │
│  │  - JWT token issuance                                   │  │
│  │  - Password hashing (bcrypt)                            │  │
│  │  - Session management                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                                     │  │
│  │  - auth.users (Supabase managed)                        │  │
│  │  - public.users (Custom profile)                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

#### Login Flow
```
User Input → LoginForm → authService.login()
  → Supabase Auth API → JWT Token
  → Store in Cookie/LocalStorage
  → Update AuthContext
  → Redirect to Dashboard
```

#### Session Check Flow
```
Page Load → Middleware → Check JWT Token
  → Valid? → Continue
  → Invalid? → Redirect to /login
  → Expired? → Try refresh → Success/Fail
```

#### Protected Route Flow
```
Navigate to /rfps → Middleware → Check auth
  → Authenticated? → Check role
    → Has permission? → Allow access
    → No permission? → 403 Forbidden
  → Not authenticated? → Redirect to /login
```

---

## 2. Component Structure

### 2.1 Directory Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # 로그인 페이지
│   │   ├── signup/
│   │   │   └── page.tsx              # 회원가입 페이지
│   │   ├── reset-password/
│   │   │   └── page.tsx              # 비밀번호 재설정 요청
│   │   ├── update-password/
│   │   │   └── page.tsx              # 비밀번호 변경
│   │   └── layout.tsx                # Auth 레이아웃
│   ├── (dashboard)/
│   │   └── profile/
│   │       ├── page.tsx              # 프로필 조회
│   │       └── edit/
│   │           └── page.tsx          # 프로필 수정
│   └── middleware.ts                 # Next.js Middleware
├── components/
│   └── auth/
│       ├── login-form.tsx            # 로그인 폼
│       ├── signup-form.tsx           # 회원가입 폼
│       ├── reset-password-form.tsx   # 비밀번호 재설정 폼
│       ├── update-password-form.tsx  # 비밀번호 변경 폼
│       ├── profile-form.tsx          # 프로필 수정 폼
│       └── auth-guard.tsx            # 권한 체크 HOC
├── providers/
│   └── auth-provider.tsx             # AuthContext Provider
├── hooks/
│   ├── useAuth.ts                    # 인증 Hook
│   ├── useUser.ts                    # 사용자 정보 Hook
│   └── useSession.ts                 # 세션 관리 Hook
├── services/
│   └── auth.service.ts               # 인증 서비스
├── lib/
│   ├── validations/
│   │   └── auth.ts                   # Zod 검증 스키마
│   └── auth/
│       ├── permissions.ts            # 권한 정의
│       └── roles.ts                  # 역할 정의
└── types/
    └── auth.ts                       # 인증 타입 정의
```

### 2.2 Component Specifications

#### LoginForm Component
```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo = '/rfps' }: LoginFormProps)
```

**Features:**
- Email/Password input fields
- "Remember me" checkbox
- "Forgot password?" link
- Submit button with loading state
- Error message display
- Form validation (Zod)

#### SignupForm Component
```typescript
interface SignupFormProps {
  onSuccess?: (user: User) => void
}

export function SignupForm({ onSuccess }: SignupFormProps)
```

**Features:**
- Email, Password, Password Confirmation, Name fields
- Password strength indicator
- Terms & Conditions checkbox
- Submit button with loading state
- Error message display
- Form validation (Zod)

#### AuthGuard Component
```typescript
interface AuthGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredPermissions?: Permission[]
  fallback?: ReactNode
}

export function AuthGuard({
  children,
  requiredRole,
  requiredPermissions,
  fallback
}: AuthGuardProps)
```

**Features:**
- Check authentication status
- Check user role
- Check user permissions
- Show fallback or redirect if unauthorized

---

## 3. API Design

### 3.1 Authentication Service API

#### authService.signup()
```typescript
interface SignupData {
  email: string
  password: string
  name: string
}

interface SignupResponse {
  user: User | null
  session: Session | null
  error: Error | null
}

async function signup(data: SignupData): Promise<SignupResponse>
```

**Process:**
1. Validate input (Zod)
2. Call Supabase Auth signUp()
3. Create user profile in `users` table
4. Send verification email
5. Return user and session

#### authService.login()
```typescript
interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

interface LoginResponse {
  user: User | null
  session: Session | null
  error: Error | null
}

async function login(data: LoginData): Promise<LoginResponse>
```

**Process:**
1. Validate input (Zod)
2. Call Supabase Auth signInWithPassword()
3. Store session (cookie or localStorage based on rememberMe)
4. Fetch user profile from `users` table
5. Return user and session

#### authService.logout()
```typescript
interface LogoutResponse {
  error: Error | null
}

async function logout(): Promise<LogoutResponse>
```

**Process:**
1. Call Supabase Auth signOut()
2. Clear local session
3. Clear cookies
4. Redirect to /login

#### authService.getCurrentUser()
```typescript
interface GetCurrentUserResponse {
  user: User | null
  error: Error | null
}

async function getCurrentUser(): Promise<GetCurrentUserResponse>
```

**Process:**
1. Get session from Supabase
2. If session exists, fetch user profile
3. Return user with profile data

#### authService.resetPassword()
```typescript
interface ResetPasswordData {
  email: string
}

interface ResetPasswordResponse {
  error: Error | null
}

async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>
```

**Process:**
1. Validate email (Zod)
2. Call Supabase Auth resetPasswordForEmail()
3. Send reset link email
4. Return success/error

#### authService.updatePassword()
```typescript
interface UpdatePasswordData {
  password: string
}

interface UpdatePasswordResponse {
  error: Error | null
}

async function updatePassword(data: UpdatePasswordData): Promise<UpdatePasswordResponse>
```

**Process:**
1. Validate password (Zod)
2. Call Supabase Auth updateUser()
3. Update password
4. Return success/error

### 3.2 User Profile API

#### userService.getProfile()
```typescript
async function getProfile(userId: string): Promise<User>
```

#### userService.updateProfile()
```typescript
interface UpdateProfileData {
  name?: string
  department?: string
  position?: string
  phone?: string
  avatar?: string
}

async function updateProfile(userId: string, data: UpdateProfileData): Promise<User>
```

---

## 4. State Management

### 4.1 AuthContext Design

```typescript
interface AuthContextType {
  // State
  user: User | null
  session: Session | null
  loading: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>

  // Utilities
  hasRole: (role: UserRole) => boolean
  hasPermission: (permission: Permission) => boolean
  checkAccess: (requiredRole?: UserRole, requiredPermissions?: Permission[]) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
```

### 4.2 AuthProvider Implementation

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    authService.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session) {
          const { user } = await authService.getCurrentUser()
          setUser(user)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ... methods implementation

  return (
    <AuthContext.Provider value={{ user, session, loading, ... }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 5. Form Validation

### 5.1 Validation Schemas (Zod)

```typescript
// Login Schema
export const loginSchema = z.object({
  email: z.string()
    .email('올바른 이메일 형식이 아닙니다')
    .min(1, '이메일을 입력해주세요'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional(),
})

// Signup Schema
export const signupSchema = z.object({
  email: z.string()
    .email('올바른 이메일 형식이 아닙니다')
    .min(1, '이메일을 입력해주세요'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 최소 1개 포함해야 합니다')
    .regex(/[a-z]/, '소문자를 최소 1개 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 최소 1개 포함해야 합니다')
    .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다'),
  passwordConfirm: z.string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  name: z.string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 입력 가능합니다'),
  agreeTerms: z.boolean()
    .refine(val => val === true, '이용약관에 동의해주세요'),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
})

// Reset Password Schema
export const resetPasswordSchema = z.object({
  email: z.string()
    .email('올바른 이메일 형식이 아닙니다')
    .min(1, '이메일을 입력해주세요'),
})

// Update Password Schema
export const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 최소 1개 포함해야 합니다')
    .regex(/[a-z]/, '소문자를 최소 1개 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 최소 1개 포함해야 합니다')
    .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다'),
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
})

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 입력 가능합니다')
    .optional(),
  department: z.string()
    .max(100, '부서는 최대 100자까지 입력 가능합니다')
    .optional(),
  position: z.string()
    .max(100, '직책은 최대 100자까지 입력 가능합니다')
    .optional(),
  phone: z.string()
    .regex(/^[0-9-+() ]*$/, '올바른 전화번호 형식이 아닙니다')
    .optional(),
})
```

---

## 6. Middleware Design

### 6.1 Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes (accessible without authentication)
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/reset-password']

  if (publicRoutes.includes(pathname)) {
    // Redirect to dashboard if already logged in
    if (session && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      return NextResponse.redirect(new URL('/rfps', req.url))
    }
    return res
  }

  // Protected routes (require authentication)
  if (!session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  const { data: user } = await supabase
    .from('users')
    .select('role, permissions')
    .eq('id', session.user.id)
    .single()

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Check route permissions
  const routePermissions = getRoutePermissions(pathname)
  if (routePermissions && !hasAccess(user, routePermissions)) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 6.2 Permission Definitions

```typescript
// lib/auth/permissions.ts
export enum Permission {
  // RFP Permissions
  VIEW_RFPS = 'view_rfps',
  CREATE_RFP = 'create_rfp',
  EDIT_RFP = 'edit_rfp',
  DELETE_RFP = 'delete_rfp',
  ANALYZE_RFP = 'analyze_rfp',

  // Proposal Permissions
  VIEW_PROPOSALS = 'view_proposals',
  CREATE_PROPOSAL = 'create_proposal',
  EDIT_PROPOSAL = 'edit_proposal',
  DELETE_PROPOSAL = 'delete_proposal',
  SUBMIT_PROPOSAL = 'submit_proposal',
  APPROVE_PROPOSAL = 'approve_proposal',

  // Client Permissions
  VIEW_CLIENTS = 'view_clients',
  CREATE_CLIENT = 'create_client',
  EDIT_CLIENT = 'edit_client',
  DELETE_CLIENT = 'delete_client',

  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  CHANGE_USER_ROLE = 'change_user_role',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: Object.values(Permission), // All permissions
  manager: [
    Permission.VIEW_RFPS,
    Permission.CREATE_RFP,
    Permission.EDIT_RFP,
    Permission.DELETE_RFP,
    Permission.ANALYZE_RFP,
    Permission.VIEW_PROPOSALS,
    Permission.CREATE_PROPOSAL,
    Permission.EDIT_PROPOSAL,
    Permission.DELETE_PROPOSAL,
    Permission.SUBMIT_PROPOSAL,
    Permission.APPROVE_PROPOSAL,
    Permission.VIEW_CLIENTS,
    Permission.CREATE_CLIENT,
    Permission.EDIT_CLIENT,
    Permission.VIEW_USERS,
  ],
  writer: [
    Permission.VIEW_RFPS,
    Permission.VIEW_PROPOSALS,
    Permission.CREATE_PROPOSAL,
    Permission.EDIT_PROPOSAL,
    Permission.VIEW_CLIENTS,
  ],
  reviewer: [
    Permission.VIEW_RFPS,
    Permission.VIEW_PROPOSALS,
    Permission.APPROVE_PROPOSAL,
    Permission.VIEW_CLIENTS,
  ],
}
```

---

## 7. UI/UX Design

### 7.1 Login Page Wireframe

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [Logo/App Name]                    │
│                                                 │
│         RFP Management System                   │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  이메일                                    │ │
│  │  [____________________________________]   │ │
│  │                                           │ │
│  │  비밀번호                                  │ │
│  │  [____________________________________]   │ │
│  │                                           │ │
│  │  [✓] 로그인 상태 유지                      │ │
│  │                                           │ │
│  │         [    로그인    ]                  │ │
│  │                                           │ │
│  │  비밀번호를 잊으셨나요? [찾기]              │ │
│  │                                           │ │
│  │  ────────── 또는 ──────────               │ │
│  │                                           │ │
│  │         [   회원가입   ]                  │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7.2 Signup Page Wireframe

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              회원가입                            │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  이름 *                                    │ │
│  │  [____________________________________]   │ │
│  │                                           │ │
│  │  이메일 *                                  │ │
│  │  [____________________________________]   │ │
│  │                                           │ │
│  │  비밀번호 *                                │ │
│  │  [____________________________________]   │ │
│  │  ████░░░░ 강도: 중간                       │ │
│  │                                           │ │
│  │  비밀번호 확인 *                           │ │
│  │  [____________________________________]   │ │
│  │                                           │ │
│  │  [✓] 이용약관에 동의합니다                 │ │
│  │                                           │ │
│  │         [   가입하기   ]                  │ │
│  │                                           │ │
│  │  이미 계정이 있으신가요? [로그인]           │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 7.3 UI Components

#### PasswordStrengthIndicator
```typescript
interface PasswordStrengthIndicatorProps {
  password: string
}

// Shows: Weak (빨강), Medium (노랑), Strong (초록)
```

#### UserMenu (Header)
```typescript
interface UserMenuProps {
  user: User
}

// Dropdown menu:
// - 프로필
// - 설정
// - ─────────
// - 로그아웃
```

---

## 8. Security Design

### 8.1 Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| Transport | HTTPS | Supabase enforced |
| Password | Hashing | bcrypt (Supabase managed) |
| Session | JWT | Supabase Auth (1h access, 7d refresh) |
| CSRF | Token | SameSite cookies |
| XSS | Sanitization | React auto-escaping |
| SQL Injection | Parameterized queries | Supabase client |
| Rate Limiting | Login attempts | Supabase built-in |

### 8.2 Token Storage Strategy

**Access Token:**
- Storage: httpOnly cookie (preferred) or sessionStorage
- Lifetime: 1 hour
- Auto-refresh: 5 minutes before expiry

**Refresh Token:**
- Storage: httpOnly cookie
- Lifetime: 7 days
- Usage: Renew access token

**Remember Me:**
- If checked: Store refresh token in persistent cookie (7 days)
- If unchecked: Store refresh token in session cookie (browser close)

---

## 9. Error Handling

### 9.1 Error Types

```typescript
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AuthError extends Error {
  code: AuthErrorCode
  details?: any

  constructor(code: AuthErrorCode, message: string, details?: any) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.details = details
  }
}
```

### 9.2 Error Messages (Korean)

```typescript
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: '이메일 인증이 완료되지 않았습니다',
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: '이미 사용 중인 이메일입니다',
  [AuthErrorCode.WEAK_PASSWORD]: '비밀번호가 보안 요구사항을 충족하지 않습니다',
  [AuthErrorCode.SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요',
  [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: '이 작업을 수행할 권한이 없습니다',
  [AuthErrorCode.NETWORK_ERROR]: '네트워크 오류가 발생했습니다',
  [AuthErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다',
}
```

---

## 10. Implementation Order

### Phase 1: Foundation (Day 1)
1. ✅ Supabase Auth configuration
2. ✅ Create auth types (`src/types/auth.ts`)
3. ✅ Create validation schemas (`src/lib/validations/auth.ts`)
4. ✅ Create auth service (`src/services/auth.service.ts`)
5. ✅ Test auth service with simple script

### Phase 2: Context & Hooks (Day 1-2)
6. ✅ Create AuthProvider (`src/providers/auth-provider.tsx`)
7. ✅ Create useAuth hook (`src/hooks/useAuth.ts`)
8. ✅ Create useUser hook (`src/hooks/useUser.ts`)
9. ✅ Create useSession hook (`src/hooks/useSession.ts`)
10. ✅ Wrap app with AuthProvider in `app/layout.tsx`

### Phase 3: Auth Pages (Day 2)
11. ✅ Create auth layout (`src/app/(auth)/layout.tsx`)
12. ✅ Create LoginForm component
13. ✅ Create Login page (`src/app/(auth)/login/page.tsx`)
14. ✅ Create SignupForm component
15. ✅ Create Signup page (`src/app/(auth)/signup/page.tsx`)
16. ✅ Create Reset Password page
17. ✅ Create Update Password page

### Phase 4: Middleware (Day 3)
18. ✅ Create middleware.ts for route protection
19. ✅ Implement role-based access control
20. ✅ Create permission definitions
21. ✅ Create AuthGuard HOC
22. ✅ Test protected routes

### Phase 5: Profile (Day 3)
23. ✅ Create Profile page
24. ✅ Create Profile edit page
25. ✅ Create ProfileForm component
26. ✅ Implement password change

### Phase 6: Integration (Day 4)
27. ✅ Update Header with user menu
28. ✅ Add logout button
29. ✅ Redirect logic refinement
30. ✅ Error handling refinement
31. ✅ E2E testing
32. ✅ Documentation

---

## 11. Testing Strategy

### 11.1 Unit Tests
- authService methods
- Form validation schemas
- Permission check functions
- Role check functions

### 11.2 Integration Tests
- Login flow (email → login → dashboard)
- Signup flow (email → verify → login)
- Password reset flow
- Session refresh

### 11.3 E2E Tests
- Complete user journey (signup → verify → login → protected route → logout)
- Role-based access (admin vs writer)
- Session expiry handling

---

## 12. Dependencies

### 12.1 Required Packages

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.95.3",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "react-hook-form": "^7.71.1",
    "@hookform/resolvers": "^5.2.2",
    "zod": "^4.3.6"
  }
}
```

### 12.2 Environment Variables

```bash
# Already in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tqkwnbcydlheutkbzeah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Site URL for email redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 13. Acceptance Criteria

### 13.1 Functional
- [x] 사용자가 이메일/비밀번호로 회원가입 가능
- [x] 이메일 인증 후 로그인 가능
- [x] 로그인/로그아웃 정상 동작
- [x] 비밀번호 재설정 가능
- [x] 세션 자동 갱신
- [x] 역할별 페이지 접근 제어
- [x] 프로필 조회/수정 가능

### 13.2 Quality
- [x] TypeScript strict mode
- [x] Zod validation for all forms
- [x] Error handling for all API calls
- [x] Loading states for all async operations
- [x] Accessibility (WCAG 2.1 AA)
- [x] Mobile responsive design

### 13.3 Security
- [x] HTTPS only
- [x] Password hashing (bcrypt)
- [x] JWT token validation
- [x] CSRF protection
- [x] XSS protection
- [x] Rate limiting on login

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial design document | Claude |
