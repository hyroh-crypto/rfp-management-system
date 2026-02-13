'use client'
// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 토큰 확인
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        )
        const accessToken = hashParams.get('access_token')

        if (accessToken) {
          // 세션 자동 설정을 기다림
          await new Promise(resolve => setTimeout(resolve, 500))

          // 사용자 정보 확인
          const user = await authService.getCurrentUser()

          if (user) {
            // 로그인 성공 - 대시보드로 이동
            router.push('/rfps')
            return
          }
        }

        // 토큰이 없거나 유효하지 않으면 로그인 페이지로
        router.push('/login')
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
      <p className="text-gray-400 text-sm">인증 중...</p>
    </div>
  )
}
