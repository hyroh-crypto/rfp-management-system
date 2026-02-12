/**
 * LoadingState Component
 *
 * 로딩 상태 표시 컴포넌트
 */

'use client'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingState({ message = '로딩 중...', fullScreen = false }: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="py-12">
      {content}
    </div>
  )
}
