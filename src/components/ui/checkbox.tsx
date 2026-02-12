import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'w-4 h-4 rounded border-gray-700 bg-gray-900/50',
              'text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-gray-300 select-none">{label}</span>
          )}
        </label>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
