/**
 * RFP 목록 페이지
 */

'use client'

import { RfpList } from '@/components/rfp/rfp-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

export default function RFPsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RFP 관리
            </h1>
            <Link href="/rfps/new">
              <Button>+ 새 RFP 등록</Button>
            </Link>
          </div>
          <p className="text-gray-400">
            제안요청서를 등록하고 AI 분석을 통해 효율적으로 관리하세요
          </p>
        </div>

        {/* Filters (TODO) */}
        <div className="mb-6 flex gap-2">
          <Button variant="secondary" size="sm">
            전체
          </Button>
          <Button variant="ghost" size="sm">
            접수
          </Button>
          <Button variant="ghost" size="sm">
            분석 중
          </Button>
          <Button variant="ghost" size="sm">
            분석 완료
          </Button>
        </div>

        {/* RFP List */}
        <RfpList />
      </div>
    </div>
  )
}
