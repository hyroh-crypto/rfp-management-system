'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator'

export function SignupForm() {
  const router = useRouter()
  const { signup } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      termsAccepted: false,
    },
  })

  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signup(data)

      if (result.error) {
        setError(result.error.message)
        return
      }

      // 회원가입 성공
      setSuccess(true)

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 성공 메시지
  if (success) {
    return (
      <div className="text-center space-y-4">
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
        <h3 className="text-xl font-semibold text-white">회원가입 완료!</h3>
        <p className="text-gray-400 text-sm">
          이메일로 발송된 인증 링크를 확인해주세요.
          <br />
          인증 후 로그인하실 수 있습니다.
        </p>
        <p className="text-gray-500 text-xs">곧 로그인 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" required>
          비밀번호
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Password Confirm Field */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm" required>
          비밀번호 확인
        </Label>
        <Input
          id="passwordConfirm"
          type="password"
          placeholder="••••••••"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
      </div>

      {/* Terms Checkbox */}
      <div className="pt-2">
        <Checkbox
          id="termsAccepted"
          label="이용약관 및 개인정보 처리방침에 동의합니다"
          error={errors.termsAccepted?.message}
          {...register('termsAccepted')}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? '가입 중...' : '가입하기'}
      </Button>

      {/* Login Link */}
      <div className="text-center pt-2">
        <span className="text-sm text-gray-400">이미 계정이 있으신가요? </span>
        <Link
          href="/auth/login"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          로그인
        </Link>
      </div>
    </form>
  )
}
