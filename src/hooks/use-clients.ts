/**
 * Client Hooks
 *
 * TanStack Query hooks for client data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as clientService from '@/services/client.service'
import type { ListClientsParams } from '@/types/client'
import type { ClientFormData } from '@/lib/validations/client'

// Query Keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params?: ListClientsParams) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
}

/**
 * 고객사 목록 조회
 */
export function useClients(params?: ListClientsParams) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientService.listClients(params),
  })
}

/**
 * 고객사 상세 조회
 */
export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
  })
}

/**
 * 고객사 생성
 */
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClientFormData) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * 고객사 수정
 */
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) =>
      clientService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * 고객사 삭제
 */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}
