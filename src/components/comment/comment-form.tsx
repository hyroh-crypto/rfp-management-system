/**
 * CommentForm Component
 *
 * 댓글 생성/수정 폼
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { commentSchema, type CommentFormData } from '@/lib/validations/comment'
import type { Comment, CommentTargetType } from '@/types/comment'

interface CommentFormProps {
  comment?: Comment
  targetType: CommentTargetType
  targetId: string
  parentId?: string
  onSubmit: (data: CommentFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function CommentForm({ 
  comment, 
  targetType,
  targetId,
  parentId,
  onSubmit, 
  onCancel,
  isLoading 
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema) as any,
    defaultValues: comment ? {
      targetType: comment.targetType,
      targetId: comment.targetId,
      content: comment.content,
      type: comment.type,
      parentId: comment.parentId || undefined,
    } : {
      targetType,
      targetId,
      type: 'comment',
      parentId,
    },
  })

  const handleFormSubmit = async (data: CommentFormData) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isFormLoading = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="type">유형</Label>
        <select
          id="type"
          {...register('type')}
          disabled={isFormLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="comment">댓글</option>
          <option value="feedback">피드백</option>
          <option value="approval">승인</option>
          <option value="rejection">반려</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="content">내용 *</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder={parentId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
          rows={4}
          disabled={isFormLoading}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isFormLoading}
          >
            취소
          </Button>
        )}
        <Button type="submit" disabled={isFormLoading}>
          {isFormLoading ? '등록 중...' : comment ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  )
}
