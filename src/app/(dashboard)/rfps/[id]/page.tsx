'use client'

/**
 * RFP 상세 페이지
 */

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function RFPDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // TODO: Phase 5에서 구현 예정
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            🚧 준비 중
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            RFP 상세 페이지는 Phase 5에서 구현 예정입니다.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            ID: {id}
          </p>
          <Button onClick={() => router.push('/rfps')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
