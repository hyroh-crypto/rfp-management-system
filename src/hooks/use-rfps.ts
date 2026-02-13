/**
 * RFP Hooks
 *
 * TanStack Query hooks for RFP data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as rfpService from '@/services/rfp.service'
import type { ListRfpsParams, RfpStatus } from '@/types/rfp'
import type { RfpFormData } from '@/lib/validations/rfp'

// Query Keys
export const rfpKeys = {
  all: ['rfps'] as const,
  lists: () => [...rfpKeys.all, 'list'] as const,
  list: (params?: ListRfpsParams) => [...rfpKeys.lists(), params] as const,
  details: () => [...rfpKeys.all, 'detail'] as const,
  detail: (id: string) => [...rfpKeys.details(), id] as const,
}

/**
 * RFP 목록 조회
 */
export function useRfps(params?: ListRfpsParams) {
  return useQuery({
    queryKey: rfpKeys.list(params),
    queryFn: () => rfpService.listRfps(params),
    retry: 1, // 1번만 재시도
    staleTime: 1000 * 60, // 1분간 캐시
    gcTime: 1000 * 60 * 5, // 5분간 메모리 유지
  })
}

/**
 * RFP 상세 조회 (요구사항, 댓글, 고객사 포함)
 */
export function useRfp(id: string) {
  return useQuery({
    queryKey: rfpKeys.detail(id),
    queryFn: () => rfpService.getRfpById(id),
    enabled: !!id,
  })
}

/**
 * RFP 생성
 */
export function useCreateRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RfpFormData) => rfpService.createRfp(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfpKeys.lists() })
    },
  })
}

/**
 * RFP 수정
 */
export function useUpdateRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RfpFormData }) =>
      rfpService.updateRfp(id, data as any),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfpKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: rfpKeys.lists() })
    },
  })
}

/**
 * RFP 상태 변경
 */
export function useUpdateRfpStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RfpStatus }) =>
      rfpService.updateRfpStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfpKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: rfpKeys.lists() })
    },
  })
}

/**
 * RFP 삭제
 */
export function useDeleteRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rfpService.deleteRfp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfpKeys.lists() })
    },
  })
}
