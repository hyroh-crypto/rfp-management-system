'use client'

/**
 * RFP 수정 페이지
 */

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRfp } from '@/hooks/use-rfps'
import { RfpEditForm } from '@/components/rfp/rfp-edit-form'

export default function EditRFPPage() {
  const params = useParams()
  const id = params.id as string
  const { data, isLoading, error } = useRfp(id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">RFP 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">⚠️ RFP를 찾을 수 없습니다</p>
          <Link href="/rfps">
            <button className="text-blue-400 hover:underline">목록으로 돌아가기</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/rfps" className="hover:text-blue-400 transition-colors">
              RFP 관리
            </Link>
            <span>/</span>
            <Link href={`/rfps/${id}`} className="hover:text-blue-400 transition-colors">
              {data.rfp.title}
            </Link>
            <span>/</span>
            <span className="text-gray-300">수정</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            RFP 수정
          </h1>
          <p className="text-gray-400">
            제안요청서 정보를 수정하세요
          </p>
        </div>

        {/* Form */}
        <RfpEditForm rfp={data.rfp as any} />
      </div>
    </div>
  )
}
