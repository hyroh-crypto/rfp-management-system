'use client'

/**
 * useSession Hook
 *
 * 세션 정보만 필요할 때 사용하는 간소화된 훅
 */

import { useAuth } from './useAuth'
import type { Session } from '@/types/auth'

/**
 * 현재 세션 정보 반환
 *
 * @returns {Object} 세션 정보와 관련 메서드
 * @returns {Session | null} session - 현재 세션 (없으면 null)
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {Function} refreshSession - 세션 갱신 메서드
 *
 * @example
 * ```tsx
 * function SessionInfo() {
 *   const { session, refreshSession, isLoading } = useSession()
 *
 *   if (isLoading) return <Spinner />
 *   if (!session) return <p>No active session</p>
 *
 *   const expiresAt = new Date(session.expiresAt * 1000)
 *
 *   return (
 *     <div>
 *       <p>Session expires at: {expiresAt.toLocaleString()}</p>
 *       <button onClick={refreshSession}>Refresh Session</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSession() {
  const { session, isLoading, refreshSession } = useAuth()

  return {
    session,
    isLoading,
    refreshSession,
  }
}

/**
 * 세션 만료 시간 확인 훅
 *
 * @returns {Object} 세션 만료 관련 정보
 * @returns {Date | null} expiresAt - 만료 시간
 * @returns {number | null} timeRemaining - 남은 시간 (초)
 * @returns {boolean} isExpiringSoon - 5분 이내 만료 여부
 *
 * @example
 * ```tsx
 * function SessionWarning() {
 *   const { expiresAt, timeRemaining, isExpiringSoon } = useSessionExpiry()
 *
 *   if (!isExpiringSoon) return null
 *
 *   return (
 *     <div className="warning">
 *       Session will expire in {Math.floor(timeRemaining / 60)} minutes
 *     </div>
 *   )
 * }
 * ```
 */
export function useSessionExpiry() {
  const { session } = useSession()

  if (!session) {
    return {
      expiresAt: null,
      timeRemaining: null,
      isExpiringSoon: false,
    }
  }

  const expiresAt = new Date(session.expiresAt * 1000)
  const now = new Date()
  const timeRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
  const isExpiringSoon = timeRemaining <= 5 * 60 // 5분 이내

  return {
    expiresAt,
    timeRemaining,
    isExpiringSoon,
  }
}

/**
 * 세션 유효성 확인 훅
 *
 * @returns {boolean} 세션이 유효한지 여부
 *
 * @example
 * ```tsx
 * function ProtectedContent() {
 *   const isValidSession = useSessionValid()
 *
 *   if (!isValidSession) {
 *     return <SessionExpiredMessage />
 *   }
 *
 *   return <Content />
 * }
 * ```
 */
export function useSessionValid(): boolean {
  const { session } = useSession()

  if (!session) {
    return false
  }

  const now = Date.now()
  const expiresAt = session.expiresAt * 1000

  return now < expiresAt
}
