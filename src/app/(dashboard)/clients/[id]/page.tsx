/**
 * Client Detail Page
 *
 * 고객사 상세 페이지
 */

'use client'

import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // TODO: TanStack Query로 교체 (Phase 5) - 현재 미구현
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🚧 준비 중
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          고객사 상세 페이지는 Phase 5에서 구현 예정입니다.
        </p>
        <p className="text-sm text-gray-400">
          ID: {id}
        </p>
        <Button onClick={() => router.push('/clients')} className="mt-4">
          목록으로 돌아가기
        </Button>
      </div>
    </div>
  )
}
