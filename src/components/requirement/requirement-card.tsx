/**
 * RequirementCard Component
 *
 * 요구사항 카드 컴포넌트
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Requirement } from '@/types/requirement'

interface RequirementCardProps {
  requirement: Requirement
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const CATEGORY_LABELS = {
  functional: '기능',
  'non-functional': '비기능',
  technical: '기술',
  business: '비즈니스',
}

const PRIORITY_LABELS = {
  must: 'Must',
  should: 'Should',
  could: 'Could',
  wont: "Won't",
}

const PRIORITY_COLORS = {
  must: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  should: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  could: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  wont: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

const COMPLEXITY_LABELS = {
  low: '낮음',
  medium: '중간',
  high: '높음',
}

const COMPLEXITY_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function RequirementCard({ requirement, onEdit, onDelete }: RequirementCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">{CATEGORY_LABELS[requirement.category]}</Badge>
            <Badge className={PRIORITY_COLORS[requirement.priority]}>
              {PRIORITY_LABELS[requirement.priority]}
            </Badge>
            {requirement.complexity && (
              <Badge className={COMPLEXITY_COLORS[requirement.complexity]}>
                {COMPLEXITY_LABELS[requirement.complexity]}
              </Badge>
            )}
          </div>
          
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {requirement.title}
          </h4>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {requirement.description}
          </p>

          {requirement.estimatedHours !== null && requirement.estimatedHours !== undefined && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              예상 시간: {requirement.estimatedHours}시간
            </p>
          )}
        </div>

        <div className="flex gap-1 ml-4">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(requirement.id)}
            >
              수정
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(requirement.id)}
              className="text-red-600 hover:text-red-700"
            >
              삭제
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
