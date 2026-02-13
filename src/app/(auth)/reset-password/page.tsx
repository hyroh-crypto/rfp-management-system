'use client'
// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await resetPassword(data)

      if (result.error) {
        setError(result.error.message)
        return
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || '비밀번호 재설정 요청 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 성공 메시지
  if (success) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          비밀번호 재설정
        </h2>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">이메일을 확인하세요</h3>
          <p className="text-gray-400 text-sm">
            비밀번호 재설정 링크가 이메일로 발송되었습니다.
            <br />
            이메일을 확인하여 비밀번호를 재설정해주세요.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-2 text-center">
        비밀번호 찾기
      </h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        가입하신 이메일 주소를 입력하세요
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" required>
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '전송 중...' : '재설정 링크 보내기'}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← 로그인으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  )
}
