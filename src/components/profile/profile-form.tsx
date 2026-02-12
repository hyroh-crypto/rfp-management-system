'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  onSuccess?: () => void
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      position: user?.position || '',
      phone: user?.phone || '',
    },
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await updateProfile(data)

      if (result.error) {
        setError(result.error.message)
        return
      }

      // 성공
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/settings/profile')
      }
    } catch (err: any) {
      setError(err.message || '프로필 수정 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" required>
          이름
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="홍길동"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      {/* Department Field */}
      <div className="space-y-2">
        <Label htmlFor="department">부서</Label>
        <Input
          id="department"
          type="text"
          placeholder="개발팀"
          error={errors.department?.message}
          {...register('department')}
        />
      </div>

      {/* Position Field */}
      <div className="space-y-2">
        <Label htmlFor="position">직책</Label>
        <Input
          id="position"
          type="text"
          placeholder="팀장"
          error={errors.position?.message}
          {...register('position')}
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="010-1234-5678"
          error={errors.phone?.message}
          {...register('phone')}
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
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
}
