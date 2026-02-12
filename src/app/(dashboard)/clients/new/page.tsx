/**
 * Client Create Page
 *
 * 고객사 생성 페이지
 */

'use client'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ClientForm } from '@/components/client/client-form'
import type { ClientFormData } from '@/lib/validations/client'

export default function ClientCreatePage() {
  const router = useRouter()

  const handleSubmit = async (data: ClientFormData) => {
    try {
      // TODO: 서비스 연동 (Phase 5)
      console.log('Create client:', data)
      
      // 성공 시 목록으로 이동
      router.push('/clients')
    } catch (error) {
      console.error('Failed to create client:', error)
      throw error
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          고객사 등록
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          새로운 고객사 정보를 등록합니다
        </p>
      </div>

      {/* 폼 */}
      <Card className="p-6">
        <ClientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}
