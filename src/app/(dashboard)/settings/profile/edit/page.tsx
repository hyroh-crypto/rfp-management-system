'use client'
// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfileEditPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">프로필 수정</h1>
        <p className="text-gray-400 text-sm mt-1">
          프로필 정보를 수정할 수 있습니다
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <ProfileForm />
      </div>
    </div>
  )
}
