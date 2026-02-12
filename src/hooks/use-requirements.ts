/**
 * Requirement Hooks
 *
 * TanStack Query hooks for requirement data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as requirementService from '@/services/requirement.service'
import type { ListRequirementsParams, ReorderRequirementsData } from '@/types/requirement'
import type { RequirementFormData } from '@/lib/validations/requirement'

// Query Keys
export const requirementKeys = {
  all: ['requirements'] as const,
  lists: () => [...requirementKeys.all, 'list'] as const,
  list: (params: ListRequirementsParams) => [...requirementKeys.lists(), params] as const,
  details: () => [...requirementKeys.all, 'detail'] as const,
  detail: (id: string) => [...requirementKeys.details(), id] as const,
}

/**
 * 요구사항 목록 조회
 */
export function useRequirements(params: ListRequirementsParams) {
  return useQuery({
    queryKey: requirementKeys.list(params),
    queryFn: () => requirementService.listRequirements(params),
    enabled: !!params.rfpId,
  })
}

/**
 * 요구사항 상세 조회
 */
export function useRequirement(id: string) {
  return useQuery({
    queryKey: requirementKeys.detail(id),
    queryFn: () => requirementService.getRequirementById(id),
    enabled: !!id,
  })
}

/**
 * 요구사항 생성
 */
export function useCreateRequirement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequirementFormData) => requirementService.createRequirement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: requirementKeys.list({ rfpId: variables.rfpId }) 
      })
    },
  })
}

/**
 * 요구사항 수정
 */
export function useUpdateRequirement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RequirementFormData }) =>
      requirementService.updateRequirement(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: requirementKeys.detail(result.id) })
      queryClient.invalidateQueries({ 
        queryKey: requirementKeys.list({ rfpId: result.rfpId }) 
      })
    },
  })
}

/**
 * 요구사항 삭제
 */
export function useDeleteRequirement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => requirementService.deleteRequirement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requirementKeys.lists() })
    },
  })
}

/**
 * 요구사항 순서 재배치
 */
export function useReorderRequirements() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReorderRequirementsData) => requirementService.reorderRequirements(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requirementKeys.lists() })
    },
  })
}
