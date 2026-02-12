'use client'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        회원가입
      </h2>
      <SignupForm />
    </div>
  )
}
