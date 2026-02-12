// Requirement validation schemas

import { z } from 'zod'

const requirementCategorySchema = z.enum(['functional', 'non-functional', 'technical', 'business'])
const requirementPrioritySchema = z.enum(['must', 'should', 'could', 'wont'])
const complexitySchema = z.enum(['low', 'medium', 'high'])

export const requirementSchema = z.object({
  rfpId: z.string().uuid(),
  category: requirementCategorySchema,
  priority: requirementPrioritySchema,
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목은 최대 200자까지 입력 가능합니다'),
  description: z.string()
    .min(1, '설명을 입력해주세요')
    .max(5000, '설명은 최대 5,000자까지 입력 가능합니다'),
  acceptanceCriteria: z.string()
    .max(2000, '수용 기준은 최대 2,000자까지 입력 가능합니다')
    .optional(),
  complexity: complexitySchema.optional(),
  estimatedHours: z.number()
    .min(0, '예상 시간은 0 이상이어야 합니다')
    .max(1000, '예상 시간은 최대 1,000시간까지 입력 가능합니다')
    .optional(),
})

export type RequirementFormData = z.infer<typeof requirementSchema>

export const updateRequirementSchema = requirementSchema.partial().omit({ rfpId: true })
export type UpdateRequirementFormData = z.infer<typeof updateRequirementSchema>

export const reorderRequirementsSchema = z.object({
  requirementIds: z.array(z.string().uuid()),
})

export type ReorderRequirementsFormData = z.infer<typeof reorderRequirementsSchema>
