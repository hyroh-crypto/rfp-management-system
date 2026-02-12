// Client validation schemas

import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string()
    .min(1, '회사명을 입력해주세요')
    .max(200, '회사명은 최대 200자까지 입력 가능합니다'),
  businessNumber: z.string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '올바른 사업자등록번호 형식이 아닙니다 (000-00-00000)'),
  industry: z.string()
    .min(1, '업종을 입력해주세요')
    .max(100, '업종은 최대 100자까지 입력 가능합니다'),
  contactName: z.string()
    .min(1, '담당자 이름을 입력해주세요')
    .max(50, '이름은 최대 50자까지 입력 가능합니다'),
  contactEmail: z.string()
    .email('올바른 이메일 형식이 아닙니다'),
  contactPhone: z.string()
    .regex(/^[0-9-+() ]+$/, '올바른 전화번호 형식이 아닙니다'),
  contactPosition: z.string()
    .min(1, '직책을 입력해주세요')
    .max(50, '직책은 최대 50자까지 입력 가능합니다'),
  address: z.string()
    .max(500, '주소는 최대 500자까지 입력 가능합니다')
    .optional(),
  website: z.string()
    .url('올바른 웹사이트 URL 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(2000, '메모는 최대 2,000자까지 입력 가능합니다')
    .optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>

export const updateClientSchema = clientSchema.partial()
export type UpdateClientFormData = z.infer<typeof updateClientSchema>
