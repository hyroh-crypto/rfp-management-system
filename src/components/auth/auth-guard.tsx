'use client'

/**
 * AuthGuard HOC (Higher-Order Component)
 *
 * 컴포넌트 레벨 인증 및 권한 보호
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Permission, hasAnyPermission } from '@/lib/permissions'

// ============================================
// AuthGuard Props
// ============================================

interface AuthGuardProps {
  children: React.ReactNode
  /**
   * 접근 가능한 역할 목록
   */
  allowedRoles?: string[]
  /**
   * 필요한 권한 목록 (하나라도 만족하면 접근 가능)
   */
  requiredPermissions?: Permission[]
  /**
   * 인증되지 않은 경우 리다이렉트 경로
   */
  redirectTo?: string
  /**
   * 권한이 없는 경우 보여줄 컴포넌트
   */
  fallback?: React.ReactNode
}

// ============================================
// AuthGuard Component
// ============================================

/**
 * 인증 및 권한 확인 가드 컴포넌트
 *
 * @example
 * ```tsx
 * // 로그인 필요
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 *
 * // 특정 역할만 접근 가능
 * <AuthGuard allowedRoles={['admin', 'manager']}>
 *   <AdminContent />
 * </AuthGuard>
 *
 * // 특정 권한 필요
 * <AuthGuard requiredPermissions={[Permission.DELETE_RFP]}>
 *   <DeleteButton />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  allowedRoles,
  requiredPermissions,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    // 로딩 중에는 체크하지 않음
    if (isLoading) return

    // 인증되지 않은 경우 리다이렉트
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  // 로딩 중
  if (isLoading) {
    return <LoadingSpinner />
  }

  // 인증되지 않음
  if (!isAuthenticated) {
    return null
  }

  // 역할 확인
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return fallback || <AccessDenied />
  }

  // 권한 확인
  if (requiredPermissions && requiredPermissions.length > 0 && user) {
    const hasRequiredPermission = hasAnyPermission(user.role, requiredPermissions)

    if (!hasRequiredPermission) {
      return fallback || <AccessDenied />
    }
  }

  return <>{children}</>
}

// ============================================
// Loading Spinner
// ============================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">로딩 중...</p>
      </div>
    </div>
  )
}

// ============================================
// Access Denied
// ============================================

function AccessDenied() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">접근 권한 없음</h2>
        <p className="text-gray-400 text-sm">
          이 페이지에 접근할 권한이 없습니다.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
        >
          ← 이전 페이지로
        </button>
      </div>
    </div>
  )
}

// ============================================
// HOC Wrapper
// ============================================

/**
 * withAuth HOC - 컴포넌트를 AuthGuard로 감싸는 HOC
 *
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MyPage, {
 *   allowedRoles: ['admin', 'manager']
 * })
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
