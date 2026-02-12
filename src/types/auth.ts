/**
 * Authentication Types
 *
 * Supabase Auth 기반 인증 타입 정의
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'
import type { Permission } from '@/lib/permissions'

// ============================================
// User & Session Types
// ============================================

/**
 * 확장된 사용자 타입
 * Supabase Auth User + 커스텀 프로필 정보
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'writer' | 'reviewer'
  department: string | null
  position: string | null
  phone: string | null
  avatar: string | null
  emailVerified: boolean
  createdAt: Date
  lastSignInAt: Date | null
}

/**
 * 세션 정보
 */
export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: AuthUser
}

// ============================================
// Auth Form Data Types
// ============================================

/**
 * 회원가입 데이터
 */
export interface SignupData {
  email: string
  password: string
  passwordConfirm: string
  name: string
  termsAccepted: boolean
}

/**
 * 로그인 데이터
 */
export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * 비밀번호 재설정 요청 데이터
 */
export interface ResetPasswordData {
  email: string
}

/**
 * 비밀번호 변경 데이터
 */
export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

/**
 * 프로필 수정 데이터
 */
export interface UpdateProfileData {
  name: string
  department?: string | null
  position?: string | null
  phone?: string | null
}

// ============================================
// Auth Response Types
// ============================================

/**
 * 인증 응답 타입
 */
export interface AuthResponse<T = AuthUser> {
  data: T | null
  error: AuthError | null
}

/**
 * 인증 에러 타입
 */
export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: unknown
}

/**
 * 인증 에러 코드
 */
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

// ============================================
// Auth Context Types
// ============================================

/**
 * AuthContext 상태
 */
export interface AuthContextState {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * AuthContext 메서드
 */
export interface AuthContextMethods {
  signup: (data: SignupData) => Promise<AuthResponse>
  login: (data: LoginData) => Promise<AuthResponse>
  logout: () => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<AuthResponse<void>>
  updatePassword: (data: UpdatePasswordData) => Promise<AuthResponse<void>>
  updateProfile: (data: UpdateProfileData) => Promise<AuthResponse>
  refreshSession: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: Permission) => boolean
  checkAccess: (requiredRoles?: string[], requiredPermissions?: Permission[]) => boolean
}

/**
 * AuthContext 전체 타입
 */
export interface AuthContextValue extends AuthContextState, AuthContextMethods {}

// ============================================
// Utility Types
// ============================================

/**
 * 사용자 프로필 데이터 타입
 */
export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'writer' | 'reviewer'
  department?: string | null
  position?: string | null
  phone?: string | null
  avatar?: string | null
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Supabase User를 AuthUser로 변환
 */
export function mapSupabaseUserToAuthUser(
  supabaseUser: SupabaseUser,
  profile?: UserProfile | null
): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || '',
    role: profile?.role || 'writer',
    department: profile?.department || null,
    position: profile?.position || null,
    phone: profile?.phone || null,
    avatar: profile?.avatar || null,
    emailVerified: !!supabaseUser.email_confirmed_at,
    createdAt: new Date(supabaseUser.created_at),
    lastSignInAt: supabaseUser.last_sign_in_at
      ? new Date(supabaseUser.last_sign_in_at)
      : null,
  }
}

/**
 * Supabase Session을 Session으로 변환
 */
export function mapSupabaseSessionToSession(
  supabaseSession: SupabaseSession,
  profile?: UserProfile | null
): Session {
  return {
    accessToken: supabaseSession.access_token,
    refreshToken: supabaseSession.refresh_token,
    expiresAt: supabaseSession.expires_at || 0,
    user: mapSupabaseUserToAuthUser(supabaseSession.user, profile),
  }
}
