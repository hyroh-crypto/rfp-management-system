import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  calculatePasswordStrength,
  PasswordStrength,
  PASSWORD_STRENGTH_MESSAGES,
  PASSWORD_STRENGTH_COLORS,
} from '@/lib/validations/auth'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  )

  if (!password) return null

  const strengthValue =
    strength === PasswordStrength.WEAK
      ? 33
      : strength === PasswordStrength.MEDIUM
      ? 66
      : 100

  const barColor =
    strength === PasswordStrength.WEAK
      ? 'bg-red-500'
      : strength === PasswordStrength.MEDIUM
      ? 'bg-yellow-500'
      : 'bg-green-500'

  return (
    <div className="mt-2 space-y-1">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', barColor)}
          style={{ width: `${strengthValue}%` }}
        />
      </div>

      {/* Strength Label */}
      <p className={cn('text-xs', PASSWORD_STRENGTH_COLORS[strength])}>
        강도: {PASSWORD_STRENGTH_MESSAGES[strength]}
      </p>
    </div>
  )
}
