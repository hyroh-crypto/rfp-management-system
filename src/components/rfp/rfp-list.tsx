'use client'

/**
 * RFP List Component
 */

import { useRfps } from '@/hooks/use-rfps'
import { RfpCard } from './rfp-card'

export function RfpList() {
  const { data, isLoading, error } = useRfps()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">RFP 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-2">⚠️ 오류가 발생했습니다</p>
          <p className="text-gray-400 text-sm">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">📭 등록된 RFP가 없습니다</p>
          <p className="text-gray-500 text-sm">새로운 RFP를 등록해보세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((rfp) => (
        <RfpCard key={rfp.id} rfp={rfp as any} />
      ))}
    </div>
  )
}
