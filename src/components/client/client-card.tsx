/**
 * ClientCard Component
 *
 * 고객사 카드 컴포넌트
 */

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Client } from '@/types/client'

interface ClientCardProps {
  client: Client
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
}

export function ClientCard({ client, onEdit, onDelete, onSelect }: ClientCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {client.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {client.industry}
          </p>
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(client.id)}
            >
              수정
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(client.id)}
              className="text-red-600 hover:text-red-700"
            >
              삭제
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400 w-24">사업자번호:</span>
          <span className="text-gray-900 dark:text-gray-100">{client.businessNumber}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400 w-24">담당자:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {client.contactName} ({client.contactPosition})
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400 w-24">이메일:</span>
          <span className="text-gray-900 dark:text-gray-100">{client.contactEmail}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400 w-24">전화번호:</span>
          <span className="text-gray-900 dark:text-gray-100">{client.contactPhone}</span>
        </div>
        
        {client.website && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-24">웹사이트:</span>
            <a 
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {client.website}
            </a>
          </div>
        )}
      </div>

      {onSelect && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelect(client.id)}
            className="w-full"
          >
            선택
          </Button>
        </div>
      )}
    </Card>
  )
}
