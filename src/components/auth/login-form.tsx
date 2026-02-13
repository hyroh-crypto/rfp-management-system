'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await login(data)

      if (result.error) {
        setError(result.error.message)
        return
      }

      // 로그인 성공 - 대시보드로 이동
      router.push('/rfps')
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다')
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
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          id="rememberMe"
          label="로그인 상태 유지"
          {...register('rememberMe')}
        />
        <Link
          href="/reset-password"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          비밀번호 찾기
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-900 text-gray-400">또는</span>
        </div>
      </div>

      {/* Signup Link */}
      <div className="text-center">
        <span className="text-sm text-gray-400">계정이 없으신가요? </span>
        <Link
          href="/signup"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          회원가입
        </Link>
      </div>
    </form>
  )
}
