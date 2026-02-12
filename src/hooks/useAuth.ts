'use client'

/**
 * useAuth Hook
 *
 * Auth Context를 사용하기 위한 커스텀 훅
 */

import { useContext } from 'react'
import { AuthContext } from '@/providers/auth-provider'
import type { AuthContextValue } from '@/types/auth'

/**
 * Auth Context 사용 훅
 *
 * @throws {Error} AuthProvider 외부에서 사용 시
 * @returns {AuthContextValue} Auth context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth()
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
