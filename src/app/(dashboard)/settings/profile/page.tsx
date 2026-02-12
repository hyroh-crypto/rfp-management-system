'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS } from '@/lib/permissions'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">사용자 정보를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">프로필</h1>
          <p className="text-gray-400 text-sm mt-1">
            내 프로필 정보를 확인하고 수정할 수 있습니다
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/settings/profile/edit">
            <Button variant="primary" size="sm">
              프로필 수정
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <span className="text-blue-400 text-xs font-medium">
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <label className="text-sm text-gray-400">부서</label>
            <p className="text-white mt-1">
              {user.department || <span className="text-gray-500">미설정</span>}
            </p>
          </div>

          {/* Position */}
          <div>
            <label className="text-sm text-gray-400">직책</label>
            <p className="text-white mt-1">
              {user.position || <span className="text-gray-500">미설정</span>}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-400">전화번호</label>
            <p className="text-white mt-1">
              {user.phone || <span className="text-gray-500">미설정</span>}
            </p>
          </div>

          {/* Email Verified */}
          <div>
            <label className="text-sm text-gray-400">이메일 인증</label>
            <p className="text-white mt-1">
              {user.emailVerified ? (
                <span className="text-green-400">인증 완료</span>
              ) : (
                <span className="text-yellow-400">인증 필요</span>
              )}
            </p>
          </div>

          {/* Created At */}
          <div>
            <label className="text-sm text-gray-400">가입일</label>
            <p className="text-white mt-1">
              {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Last Sign In */}
          <div>
            <label className="text-sm text-gray-400">마지막 로그인</label>
            <p className="text-white mt-1">
              {user.lastSignInAt ? (
                new Date(user.lastSignInAt).toLocaleString('ko-KR')
              ) : (
                <span className="text-gray-500">정보 없음</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">보안</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">비밀번호</p>
            <p className="text-gray-400 text-sm">
              마지막 변경: 알 수 없음
            </p>
          </div>
          <Link href="/settings/profile/change-password">
            <Button variant="secondary" size="sm">
              비밀번호 변경
            </Button>
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-red-400">위험 영역</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">로그아웃</p>
            <p className="text-gray-400 text-sm">
              현재 세션에서 로그아웃합니다
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              if (confirm('로그아웃하시겠습니까?')) {
                await logout()
              }
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  )
}
