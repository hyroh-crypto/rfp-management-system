/**
 * Clients List Page
 *
 * 고객사 목록 페이지
 */

'use client'
// 동적 페이지로 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ClientList } from '@/components/client/client-list'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { LoadingState } from '@/components/common/loading-state'
import { EmptyState } from '@/components/common/empty-state'
import { useClients, useDeleteClient } from '@/hooks/use-clients'
import type { Client } from '@/types/client'

export default function ClientsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // TanStack Query로 데이터 조회
  const { data, isLoading, error } = useClients({ page: currentPage, search })
  const deleteClient = useDeleteClient()

  const clients = data?.data || []
  const totalPages = data?.pagination.totalPages || 1

  const handleCreate = () => {
    router.push('/clients/new')
  }

  const handleEdit = (id: string) => {
    router.push(`/clients/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await deleteClient.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete client:', error)
      alert('고객사 삭제에 실패했습니다')
    }
  }

  const handleViewDetail = (id: string) => {
    router.push(`/clients/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            고객사 관리
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            고객사 정보를 관리합니다
          </p>
        </div>
        
        <Button onClick={handleCreate}>
          + 고객사 등록
        </Button>
      </div>

      {/* 검색 */}
      <div className="max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="고객사명, 업종으로 검색..."
        />
      </div>

      {/* 목록 */}
      {isLoading ? (
        <LoadingState message="고객사 목록을 불러오는 중..." />
      ) : error ? (
        <EmptyState
          title="오류가 발생했습니다"
          description={(error as Error).message}
        />
      ) : clients.length === 0 ? (
        <EmptyState
          title="등록된 고객사가 없습니다"
          description="새 고객사를 등록하여 시작하세요"
          action={{
            label: '고객사 등록',
            onClick: handleCreate,
          }}
        />
      ) : (
        <>
          <ClientList
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleViewDetail}
          />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
