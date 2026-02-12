// Comment validation schemas

import { z } from 'zod'

const commentTargetTypeSchema = z.enum(['rfp', 'requirement', 'proposal'])
const commentTypeSchema = z.enum(['comment', 'feedback', 'approval', 'rejection'])

export const commentSchema = z.object({
  targetType: commentTargetTypeSchema,
  targetId: z.string().uuid(),
  content: z.string()
    .min(1, '내용을 입력해주세요')
    .max(5000, '내용은 최대 5,000자까지 입력 가능합니다'),
  type: commentTypeSchema.default('comment'),
  parentId: z.string().uuid().optional(),
})

export type CommentFormData = z.infer<typeof commentSchema>

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, '내용을 입력해주세요')
    .max(5000, '내용은 최대 5,000자까지 입력 가능합니다')
    .optional(),
  type: commentTypeSchema.optional(),
  isResolved: z.boolean().optional(),
})

export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>
