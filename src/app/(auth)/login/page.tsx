'use client'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        로그인
      </h2>
      <LoginForm />
    </div>
  )
}
