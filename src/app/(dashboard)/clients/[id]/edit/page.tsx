/**
 * Client Edit Page
 *
 * 고객사 수정 페이지
 */

'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ClientForm } from '@/components/client/client-form'
import { LoadingState } from '@/components/common/loading-state'
import type { ClientFormData } from '@/lib/validations/client'
import type { Client } from '@/types/client'

export default function ClientEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // TODO: TanStack Query로 교체 (Phase 5) - 현재 미구현
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🚧 준비 중
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          고객사 수정 기능은 Phase 5에서 구현 예정입니다.
        </p>
        <p className="text-sm text-gray-400">
          ID: {id}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← 뒤로 가기
        </button>
      </div>
    </div>
  )
}
