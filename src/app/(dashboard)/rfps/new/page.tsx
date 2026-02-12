/**
 * RFP 등록 페이지
 */

'use client'

import Link from 'next/link'
import { RfpForm } from '@/components/rfp/rfp-form'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

export default function NewRFPPage() {
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
            <span className="text-gray-300">새 RFP 등록</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            새 RFP 등록
          </h1>
          <p className="text-gray-400">
            제안요청서 정보를 입력하고 AI 분석을 시작하세요
          </p>
        </div>

        {/* Form */}
        <RfpForm />
      </div>
    </div>
  )
}
