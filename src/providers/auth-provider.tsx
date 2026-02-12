'use client'

/**
 * Auth Provider
 *
 * 전역 인증 상태 관리 Context Provider
 */

import { createContext, useEffect, useState, useCallback } from 'react'
import { authService } from '@/services/auth.service'
import { hasPermission as checkPermission, Permission } from '@/lib/permissions'
import type {
  AuthUser,
  Session,
  SignupData,
  LoginData,
  ResetPasswordData,
  UpdatePasswordData,
  UpdateProfileData,
  AuthResponse,
  AuthContextValue,
} from '@/types/auth'

// ============================================
// Auth Context
// ============================================

export const AuthContext = createContext<AuthContextValue | null>(null)

// ============================================
// Auth Provider Props
// ============================================

interface AuthProviderProps {
  children: React.ReactNode
}

// ============================================
// Auth Provider Component
// ============================================

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ============================================
  // Session Initialization
  // ============================================

  /**
   * 초기 세션 로드
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await authService.getSession()

        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // ============================================
  // Auth State Change Listener
  // ============================================

  /**
   * Supabase Auth 상태 변경 감지
   */
  useEffect(() => {
    const { data: subscription } = authService.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event)

        if (newSession) {
          setSession(newSession)
          setUser(newSession.user)
        } else {
          setSession(null)
          setUser(null)
        }

        setIsLoading(false)
      }
    )

    return () => {
      subscription?.subscription?.unsubscribe()
    }
  }, [])

  // ============================================
  // Session Auto-Refresh
  // ============================================

  /**
   * 세션 자동 갱신 (만료 5분 전)
   */
  useEffect(() => {
    if (!session) return

    const expiresAt = session.expiresAt * 1000 // 밀리초로 변환
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now
    const refreshThreshold = 5 * 60 * 1000 // 5분

    // 만료까지 남은 시간이 5분 이하면 즉시 갱신
    if (timeUntilExpiry <= refreshThreshold) {
      refreshSession()
      return
    }

    // 만료 5분 전에 갱신하도록 타이머 설정
    const timeout = setTimeout(() => {
      refreshSession()
    }, timeUntilExpiry - refreshThreshold)

    return () => clearTimeout(timeout)
  }, [session])

  // ============================================
  // Auth Methods
  // ============================================

  /**
   * 회원가입
   */
  const signup = useCallback(
    async (data: SignupData): Promise<AuthResponse> => {
      setIsLoading(true)
      try {
        const result = await authService.signup(data)

        if (result.data) {
          // 회원가입 성공 시 자동 로그인은 이메일 인증 후
          // 현재는 사용자 정보만 업데이트
          setUser(result.data)
        }

        return result
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * 로그인
   */
  const login = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const result = await authService.login(data)

      if (result.data) {
        setUser(result.data)
        // 세션은 onAuthStateChange에서 자동 업데이트됨
      }

      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 로그아웃
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 비밀번호 재설정 요청
   */
  const resetPassword = useCallback(
    async (data: ResetPasswordData): Promise<AuthResponse<void>> => {
      return await authService.resetPassword(data)
    },
    []
  )

  /**
   * 비밀번호 변경
   */
  const updatePassword = useCallback(
    async (data: UpdatePasswordData): Promise<AuthResponse<void>> => {
      return await authService.updatePassword(data)
    },
    []
  )

  /**
   * 프로필 수정
   */
  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<AuthResponse> => {
      const result = await authService.updateProfile(data)

      if (result.data) {
        setUser(result.data)
      }

      return result
    },
    []
  )

  /**
   * 세션 갱신
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const newSession = await authService.refreshSession()

      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
      // 갱신 실패 시 로그아웃
      setUser(null)
      setSession(null)
    }
  }, [])

  /**
   * 사용자 역할 확인
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false
      return user.role === role
    },
    [user]
  )

  /**
   * 사용자 권한 확인
   */
  const hasPermissionCheck = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false
      return checkPermission(user.role, permission)
    },
    [user]
  )

  /**
   * 통합 접근 권한 확인
   */
  const checkAccess = useCallback(
    (requiredRoles?: string[], requiredPermissions?: Permission[]): boolean => {
      if (!user) return false

      // 역할 확인
      if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(user.role)) {
          return false
        }
      }

      // 권한 확인
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every((permission) =>
          checkPermission(user.role, permission)
        )
        if (!hasAllPermissions) {
          return false
        }
      }

      return true
    },
    [user]
  )

  // ============================================
  // Context Value
  // ============================================

  const value: AuthContextValue = {
    // State
    user,
    session,
    isLoading,
    isAuthenticated: !!user,

    // Methods
    signup,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
    hasRole,
    hasPermission: hasPermissionCheck,
    checkAccess,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
