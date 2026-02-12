/**
 * ClientList Component
 *
 * 고객사 목록 컴포넌트
 */

'use client'

import { ClientCard } from './client-card'
import type { Client } from '@/types/client'

interface ClientListProps {
  clients: Client[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
  isLoading?: boolean
}

export function ClientList({ clients, onEdit, onDelete, onSelect, isLoading }: ClientListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">등록된 고객사가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
