'use client'

/**
 * RFP Card Component
 */

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RfpStatusBadge } from './rfp-status-badge'
import type { Database } from '@/lib/supabase'
import Link from 'next/link'

type RFP = Database['public']['Tables']['rfps']['Row']

interface RfpCardProps {
  rfp: RFP
}

export function RfpCard({ rfp }: RfpCardProps) {
  const daysUntilDue = Math.ceil(
    (new Date(rfp.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card hover className="group">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
              {rfp.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {rfp.description}
            </p>
          </div>
          <RfpStatusBadge status={rfp.status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">접수일</p>
            <p className="text-white font-medium">
              {new Date(rfp.received_date).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div>
            <p className="text-gray-400">마감일</p>
            <p className={`font-medium ${daysUntilDue < 7 ? 'text-red-400' : 'text-white'}`}>
              {new Date(rfp.due_date).toLocaleDateString('ko-KR')}
              {daysUntilDue >= 0 && (
                <span className="text-xs ml-2">({daysUntilDue}일 남음)</span>
              )}
            </p>
          </div>
          {rfp.estimated_budget && (
            <div>
              <p className="text-gray-400">예상 예산</p>
              <p className="text-white font-medium">
                {rfp.estimated_budget.toLocaleString()}원
              </p>
            </div>
          )}
          {rfp.estimated_duration && (
            <div>
              <p className="text-gray-400">예상 기간</p>
              <p className="text-white font-medium">{rfp.estimated_duration}일</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-end gap-2 w-full">
          <Link href={`/rfps/${rfp.id}`}>
            <Button variant="secondary" size="sm">
              상세보기
            </Button>
          </Link>
          {rfp.status === 'received' && (
            <Button size="sm">분석 시작</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
