/**
 * RequirementList Component
 *
 * 요구사항 목록 (드래그 앤 드롭 지원)
 */

'use client'

import { RequirementCard } from './requirement-card'
import type { Requirement } from '@/types/requirement'

interface RequirementListProps {
  requirements: Requirement[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onReorder?: (requirements: Requirement[]) => void
  isLoading?: boolean
}

export function RequirementList({ 
  requirements, 
  onEdit, 
  onDelete, 
  isLoading 
}: RequirementListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (requirements.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">등록된 요구사항이 없습니다.</p>
      </div>
    )
  }

  // 카테고리별로 그룹핑
  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = []
    }
    acc[req.category].push(req)
    return acc
  }, {} as Record<string, Requirement[]>)

  const CATEGORY_LABELS = {
    functional: '기능 요구사항',
    'non-functional': '비기능 요구사항',
    technical: '기술 요구사항',
    business: '비즈니스 요구사항',
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedRequirements).map(([category, reqs]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            <span className="ml-2 text-sm text-gray-500">({reqs.length})</span>
          </h3>
          
          <div className="space-y-3">
            {reqs.map((requirement) => (
              <RequirementCard
                key={requirement.id}
                requirement={requirement}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
