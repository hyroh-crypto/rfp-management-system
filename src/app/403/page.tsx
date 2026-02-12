'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function ForbiddenPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-12 h-12 text-red-400"
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

        {/* Error Code */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          403
        </h1>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">접근 권한 없음</h2>
          <p className="text-gray-400">
            이 페이지에 접근할 권한이 없습니다.
          </p>
          {user && (
            <p className="text-sm text-gray-500">
              현재 역할: <span className="text-blue-400">{user.role}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors"
          >
            ← 이전 페이지
          </button>
          <button
            onClick={() => router.push('/rfps')}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
          >
            대시보드로
          </button>
        </div>
      </div>
    </div>
  )
}
