'use client'
// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { PasswordChangeForm } from '@/components/profile/password-change-form'

export default function ChangePasswordPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">비밀번호 변경</h1>
        <p className="text-gray-400 text-sm mt-1">
          현재 비밀번호를 입력하고 새 비밀번호로 변경할 수 있습니다
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <PasswordChangeForm />
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-400 mb-2">
          비밀번호 요구사항
        </h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• 최소 8자 이상</li>
          <li>• 대문자 1개 이상</li>
          <li>• 소문자 1개 이상</li>
          <li>• 숫자 1개 이상</li>
          <li>• 특수문자 1개 이상</li>
          <li>• 현재 비밀번호와 다른 비밀번호</li>
        </ul>
      </div>
    </div>
  )
}
