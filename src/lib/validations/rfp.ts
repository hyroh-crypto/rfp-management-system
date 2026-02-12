/**
 * RFP Form Validation Schema
 */

import { z } from 'zod'

export const rfpFormSchema = z.object({
  title: z.string()
    .min(5, '제목은 최소 5자 이상이어야 합니다')
    .max(200, '제목은 최대 200자까지 입력 가능합니다'),

  description: z.string()
    .min(20, '설명은 최소 20자 이상이어야 합니다')
    .max(2000, '설명은 최대 2000자까지 입력 가능합니다'),

  client_id: z.string()
    .uuid('올바른 고객사를 선택해주세요'),

  received_date: z.string()
    .min(1, '접수일을 선택해주세요'),

  due_date: z.string()
    .min(1, '마감일을 선택해주세요'),

  estimated_budget: z.number()
    .int('정수만 입력 가능합니다')
    .positive('양수만 입력 가능합니다')
    .optional()
    .or(z.literal('')),

  estimated_duration: z.number()
    .int('정수만 입력 가능합니다')
    .positive('양수만 입력 가능합니다')
    .optional()
    .or(z.literal('')),

  assignee_id: z.string()
    .uuid('올바른 담당자를 선택해주세요')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  const receivedDate = new Date(data.received_date)
  const dueDate = new Date(data.due_date)
  return dueDate > receivedDate
}, {
  message: '마감일은 접수일 이후여야 합니다',
  path: ['due_date'],
})

export type RfpFormData = z.infer<typeof rfpFormSchema>
