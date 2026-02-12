/**
 * Authentication Validation Schemas
 *
 * Zod 기반 폼 검증 스키마
 */

import { z } from 'zod'

// ============================================
// Validation Rules
// ============================================

/**
 * 이메일 검증 규칙
 */
const emailValidation = z
  .string()
  .min(1, '이메일을 입력해주세요')
  .email('올바른 이메일 형식이 아닙니다')

/**
 * 비밀번호 검증 규칙
 * - 최소 8자
 * - 대문자 1개 이상
 * - 소문자 1개 이상
 * - 숫자 1개 이상
 * - 특수문자 1개 이상
 */
const passwordValidation = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자를 최소 1개 포함해야 합니다')
  .regex(/[a-z]/, '소문자를 최소 1개 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 최소 1개 포함해야 합니다')
  .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다')

/**
 * 이름 검증 규칙
 */
const nameValidation = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(50, '이름은 최대 50자까지 입력 가능합니다')

// ============================================
// Auth Schemas
// ============================================

/**
 * 로그인 스키마
 */
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().default(false),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * 회원가입 스키마
 */
export const signupSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    name: nameValidation,
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, '이용약관에 동의해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * 비밀번호 재설정 요청 스키마
 */
export const resetPasswordSchema = z.object({
  email: emailValidation,
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

/**
 * 비밀번호 변경 스키마
 */
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: passwordValidation,
    newPasswordConfirm: z.string().min(1, '새 비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '새 비밀번호가 일치하지 않습니다',
    path: ['newPasswordConfirm'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
    path: ['newPassword'],
  })

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

/**
 * 프로필 수정 스키마
 */
export const updateProfileSchema = z.object({
  name: nameValidation,
  department: z
    .string()
    .max(100, '부서명은 최대 100자까지 입력 가능합니다')
    .optional()
    .nullable(),
  position: z
    .string()
    .max(100, '직책은 최대 100자까지 입력 가능합니다')
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^[0-9-+() ]*$/, '올바른 전화번호 형식이 아닙니다')
    .max(20, '전화번호는 최대 20자까지 입력 가능합니다')
    .optional()
    .nullable(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

// ============================================
// Password Strength Validation
// ============================================

/**
 * 비밀번호 강도 레벨
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

/**
 * 비밀번호 강도 계산
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return PasswordStrength.WEAK

  let score = 0

  // 길이 점수
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // 문자 종류 점수
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // 점수에 따른 강도 반환
  if (score <= 3) return PasswordStrength.WEAK
  if (score <= 5) return PasswordStrength.MEDIUM
  return PasswordStrength.STRONG
}

/**
 * 비밀번호 강도 메시지
 */
export const PASSWORD_STRENGTH_MESSAGES: Record<PasswordStrength, string> = {
  [PasswordStrength.WEAK]: '약함',
  [PasswordStrength.MEDIUM]: '보통',
  [PasswordStrength.STRONG]: '강함',
}

/**
 * 비밀번호 강도 색상
 */
export const PASSWORD_STRENGTH_COLORS: Record<PasswordStrength, string> = {
  [PasswordStrength.WEAK]: 'text-red-500',
  [PasswordStrength.MEDIUM]: 'text-yellow-500',
  [PasswordStrength.STRONG]: 'text-green-500',
}
