/**
 * Comment Hooks
 *
 * TanStack Query hooks for comment data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as commentService from '@/services/comment.service'
import type { ListCommentsParams } from '@/types/comment'
import type { CommentFormData, UpdateCommentFormData } from '@/lib/validations/comment'

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (params: ListCommentsParams) => [...commentKeys.lists(), params] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
}

/**
 * 댓글 목록 조회
 */
export function useComments(params: ListCommentsParams) {
  return useQuery({
    queryKey: commentKeys.list(params),
    queryFn: () => commentService.listComments(params),
    enabled: !!params.targetId,
  })
}

/**
 * 댓글 상세 조회
 */
export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => commentService.getCommentById(id),
    enabled: !!id,
  })
}

/**
 * 댓글 생성
 */
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CommentFormData) => commentService.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list({ 
          targetType: variables.targetType, 
          targetId: variables.targetId 
        }) 
      })
    },
  })
}

/**
 * 댓글 수정
 */
export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentFormData }) =>
      commentService.updateComment(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(result.id) })
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list({ 
          targetType: result.targetType, 
          targetId: result.targetId 
        }) 
      })
    },
  })
}

/**
 * 댓글 삭제
 */
export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() })
    },
  })
}

/**
 * 댓글 해결 상태 토글
 */
export function useToggleCommentResolved() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => commentService.toggleCommentResolved(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(result.id) })
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list({ 
          targetType: result.targetType, 
          targetId: result.targetId 
        }) 
      })
    },
  })
}
