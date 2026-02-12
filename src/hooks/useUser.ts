'use client'

/**
 * useUser Hook
 *
 * 현재 사용자 정보만 필요할 때 사용하는 간소화된 훅
 */

import { useAuth } from './useAuth'
import type { AuthUser } from '@/types/auth'
import { hasPermission, Permission } from '@/lib/permissions'

/**
 * 현재 사용자 정보 반환
 *
 * @returns {Object} 사용자 정보와 인증 상태
 * @returns {AuthUser | null} user - 현재 사용자 (로그인하지 않은 경우 null)
 * @returns {boolean} isAuthenticated - 인증 여부
 * @returns {boolean} isLoading - 로딩 상태
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, isAuthenticated, isLoading } = useUser()
 *
 *   if (isLoading) return <Spinner />
 *   if (!isAuthenticated) return <LoginPrompt />
 *
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <p>{user.email}</p>
 *       <p>Role: {user.role}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useUser() {
  const { user, isAuthenticated, isLoading } = useAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}

/**
 * 사용자 역할 확인 훅
 *
 * @param {string | string[]} allowedRoles - 허용된 역할 목록
 * @returns {boolean} 사용자가 허용된 역할 중 하나를 가지고 있는지 여부
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const hasPermission = useUserRole(['admin', 'manager'])
 *
 *   if (!hasPermission) {
 *     return <Forbidden />
 *   }
 *
 *   return <AdminContent />
 * }
 * ```
 */
export function useUserRole(
  allowedRoles: string | string[]
): boolean {
  const { user, isAuthenticated } = useUser()

  if (!isAuthenticated || !user) {
    return false
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  return roles.includes(user.role)
}

/**
 * 사용자 권한 확인 훅
 *
 * @param {Permission} permission - 확인할 권한
 * @returns {boolean} 사용자가 해당 권한을 가지고 있는지 여부
 *
 * @example
 * ```tsx
 * import { Permission } from '@/lib/permissions'
 *
 * function DeleteButton() {
 *   const canDelete = useUserPermission(Permission.DELETE_RFP)
 *
 *   if (!canDelete) {
 *     return null
 *   }
 *
 *   return <button>Delete</button>
 * }
 * ```
 */
export function useUserPermission(permission: Permission): boolean {
  const { user, isAuthenticated } = useUser()

  if (!isAuthenticated || !user) {
    return false
  }

  return hasPermission(user.role, permission)
}
