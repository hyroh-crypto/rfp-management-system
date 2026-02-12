'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { updatePasswordSchema, type UpdatePasswordFormData } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator'

export function PasswordChangeForm() {
  const router = useRouter()
  const { updatePassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await updatePassword(data)

      if (result.error) {
        setError(result.error.message)
        return
      }

      // 성공
      setSuccess(true)
      reset()

      // 3초 후 프로필 페이지로 이동
      setTimeout(() => {
        router.push('/settings/profile')
      }, 3000)
    } catch (err: any) {
      setError(err.message || '비밀번호 변경 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 성공 메시지
  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">비밀번호 변경 완료!</h3>
        <p className="text-gray-400 text-sm">
          비밀번호가 성공적으로 변경되었습니다.
        </p>
        <p className="text-gray-500 text-xs">곧 프로필 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Current Password Field */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" required>
          현재 비밀번호
        </Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" required>
          새 비밀번호
        </Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <PasswordStrengthIndicator password={newPassword} />
      </div>

      {/* New Password Confirm Field */}
      <div className="space-y-2">
        <Label htmlFor="newPasswordConfirm" required>
          새 비밀번호 확인
        </Label>
        <Input
          id="newPasswordConfirm"
          type="password"
          placeholder="••••••••"
          error={errors.newPasswordConfirm?.message}
          {...register('newPasswordConfirm')}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </div>
    </form>
  )
}
