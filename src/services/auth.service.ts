/**
 * Authentication Service
 *
 * Supabase Auth 기반 인증 서비스
 */

import { supabase } from '@/lib/supabase'
import type {
  AuthUser,
  Session,
  SignupData,
  LoginData,
  ResetPasswordData,
  UpdatePasswordData,
  UpdateProfileData,
  AuthResponse,
  AuthError,
  AuthErrorCode,
} from '@/types/auth'
import {
  mapSupabaseUserToAuthUser,
  mapSupabaseSessionToSession,
} from '@/types/auth'

// ============================================
// Error Handling
// ============================================

/**
 * 에러 메시지 매핑
 */
const AUTH_ERROR_MESSAGES: Record<string, { code: AuthErrorCode; message: string }> = {
  'Invalid login credentials': {
    code: 'INVALID_CREDENTIALS' as AuthErrorCode,
    message: '이메일 또는 비밀번호가 올바르지 않습니다',
  },
  'Email not confirmed': {
    code: 'EMAIL_NOT_VERIFIED' as AuthErrorCode,
    message: '이메일 인증이 완료되지 않았습니다',
  },
  'User already registered': {
    code: 'EMAIL_ALREADY_EXISTS' as AuthErrorCode,
    message: '이미 사용 중인 이메일입니다',
  },
  'Password should be at least 6 characters': {
    code: 'WEAK_PASSWORD' as AuthErrorCode,
    message: '비밀번호는 최소 6자 이상이어야 합니다',
  },
  'Token has expired': {
    code: 'SESSION_EXPIRED' as AuthErrorCode,
    message: '세션이 만료되었습니다. 다시 로그인해주세요',
  },
}

/**
 * Supabase 에러를 AuthError로 변환
 */
function mapSupabaseError(error: unknown): AuthError {
  const errorObj = error as { message?: string }
  const errorMessage = errorObj.message || ''
  const mapped = AUTH_ERROR_MESSAGES[errorMessage]

  if (mapped) {
    return {
      code: mapped.code,
      message: mapped.message,
      details: error,
    }
  }

  // 네트워크 에러
  if (errorMessage?.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR' as AuthErrorCode,
      message: '네트워크 오류가 발생했습니다',
      details: error,
    }
  }

  // 기타 에러
  return {
    code: 'UNKNOWN_ERROR' as AuthErrorCode,
    message: errorMessage || '알 수 없는 오류가 발생했습니다',
    details: error,
  }
}

// ============================================
// Profile Management
// ============================================

/**
 * 사용자 프로필 데이터 타입
 */
interface UserProfile {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'writer' | 'reviewer'
  department: string | null
  position: string | null
  phone: string | null
  avatar: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 사용자 프로필 조회
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }

  return data as UserProfile
}

/**
 * 사용자 프로필 생성
 */
async function createUserProfile(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const { error } = await (supabase.from('users') as any).insert({
    id: userId,
    email,
    name,
    role: 'writer', // 기본 역할
    is_active: true,
  })

  if (error) {
    console.error('Failed to create user profile:', error)
    throw error
  }
}

// ============================================
// Auth Service
// ============================================

class AuthService {
  /**
   * 회원가입
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // 리다이렉트 URL 설정 (환경에 따라 다름)
      const siteUrl =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      // Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      })

      if (authError) {
        return {
          data: null,
          error: mapSupabaseError(authError),
        }
      }

      if (!authData.user) {
        return {
          data: null,
          error: {
            code: 'UNKNOWN_ERROR' as AuthErrorCode,
            message: '회원가입에 실패했습니다',
          },
        }
      }

      // 사용자 프로필 생성
      await createUserProfile(authData.user.id, data.email, data.name)

      // 프로필 조회
      const profile = await getUserProfile(authData.user.id)

      // AuthUser 반환
      const authUser = mapSupabaseUserToAuthUser(authData.user, profile)

      return {
        data: authUser,
        error: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: mapSupabaseError(error),
      }
    }
  }

  /**
   * 로그인
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

      if (authError) {
        return {
          data: null,
          error: mapSupabaseError(authError),
        }
      }

      if (!authData.user) {
        return {
          data: null,
          error: {
            code: 'UNKNOWN_ERROR' as AuthErrorCode,
            message: '로그인에 실패했습니다',
          },
        }
      }

      // 프로필 조회
      const profile = await getUserProfile(authData.user.id)

      // AuthUser 반환
      const authUser = mapSupabaseUserToAuthUser(authData.user, profile)

      return {
        data: authUser,
        error: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: mapSupabaseError(error),
      }
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  /**
   * 현재 사용자 조회
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      // 프로필 조회
      const profile = await getUserProfile(user.id)

      return mapSupabaseUserToAuthUser(user, profile)
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  /**
   * 현재 세션 조회
   */
  async getSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        return null
      }

      // 프로필 조회
      const profile = await getUserProfile(session.user.id)

      return mapSupabaseSessionToSession(session, profile)
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  /**
   * 세션 갱신
   */
  async refreshSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession()

      if (error || !session) {
        return null
      }

      // 프로필 조회
      const profile = await getUserProfile(session.user.id)

      return mapSupabaseSessionToSession(session, profile)
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    }
  }

  /**
   * 비밀번호 재설정 요청
   */
  async resetPassword(data: ResetPasswordData): Promise<AuthResponse<void>> {
    try {
      // 리다이렉트 URL 설정 (환경에 따라 다름)
      const siteUrl =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${siteUrl}/auth/update-password`,
      })

      if (error) {
        return {
          data: null,
          error: mapSupabaseError(error),
        }
      }

      return {
        data: null,
        error: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: mapSupabaseError(error),
      }
    }
  }

  /**
   * 비밀번호 변경
   */
  async updatePassword(data: UpdatePasswordData): Promise<AuthResponse<void>> {
    try {
      // 현재 비밀번호 검증 (재로그인)
      const user = await this.getCurrentUser()
      if (!user) {
        return {
          data: null,
          error: {
            code: 'SESSION_EXPIRED' as AuthErrorCode,
            message: '세션이 만료되었습니다',
          },
        }
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      })

      if (signInError) {
        return {
          data: null,
          error: {
            code: 'INVALID_CREDENTIALS' as AuthErrorCode,
            message: '현재 비밀번호가 올바르지 않습니다',
          },
        }
      }

      // 새 비밀번호로 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (updateError) {
        return {
          data: null,
          error: mapSupabaseError(updateError),
        }
      }

      return {
        data: null,
        error: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: mapSupabaseError(error),
      }
    }
  }

  /**
   * 프로필 수정
   */
  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const user = await this.getCurrentUser()
      if (!user) {
        return {
          data: null,
          error: {
            code: 'SESSION_EXPIRED' as AuthErrorCode,
            message: '세션이 만료되었습니다',
          },
        }
      }

      // 프로필 업데이트
      const { error: updateError } = await (supabase
        .from('users') as any)
        .update({
          name: data.name,
          department: data.department,
          position: data.position,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        return {
          data: null,
          error: mapSupabaseError(updateError),
        }
      }

      // 업데이트된 사용자 정보 조회
      const updatedUser = await this.getCurrentUser()

      return {
        data: updatedUser,
        error: null,
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: mapSupabaseError(error),
      }
    }
  }

  /**
   * Auth 상태 변경 리스너
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      if (supabaseSession) {
        const profile = await getUserProfile(supabaseSession.user.id)
        const session = mapSupabaseSessionToSession(supabaseSession, profile)
        callback(event, session)
      } else {
        callback(event, null)
      }
    })
  }
}

// Export singleton instance
export const authService = new AuthService()
