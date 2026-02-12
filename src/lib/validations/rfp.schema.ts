/**
 * RFP Input Validation Schemas
 *
 * 서버 사이드 입력 검증용 Zod 스키마
 */

import { z } from 'zod'

// ============================================
// Client Schema
// ============================================

export const CreateClientSchema = z.object({
  name: z.string().min(1, '고객사명은 필수입니다').max(100, '고객사명은 100자 이하여야 합니다'),
  business_number: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, '올바른 사업자등록번호 형식이 아닙니다')
    .optional(),
  industry: z.string().max(50).optional(),
  contact: z
    .object({
      name: z.string().min(1).max(50),
      email: z.string().email('올바른 이메일 형식이 아닙니다'),
      phone: z.string().regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다').optional(),
      position: z.string().max(50).optional(),
    })
    .optional(),
  address: z.string().max(200).optional(),
  website: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  notes: z.string().max(1000).optional(),
})

export const UpdateClientSchema = CreateClientSchema.partial()

// ============================================
// RFP Schema
// ============================================

export const CreateRfpSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이하여야 합니다'),
  client_id: z.string().uuid('올바른 고객사 ID가 아닙니다'),
  received_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  estimated_budget: z.number().min(0, '예산은 0 이상이어야 합니다').optional(),
  estimated_duration: z.number().min(0, '기간은 0 이상이어야 합니다').optional(),
  description: z.string().max(5000, '설명은 5000자 이하여야 합니다').optional(),
  status: z.enum(['received', 'analyzing', 'proposal_writing', 'submitted', 'won', 'lost']).optional(),
})

export const UpdateRfpSchema = CreateRfpSchema.partial()

export const UpdateRfpStatusSchema = z.object({
  status: z.enum(['received', 'analyzing', 'proposal_writing', 'submitted', 'won', 'lost']),
})

// ============================================
// Requirement Schema
// ============================================

export const CreateRequirementSchema = z.object({
  rfp_id: z.string().uuid(),
  category: z.enum(['functional', 'technical', 'business', 'constraint']),
  priority: z.enum(['must', 'should', 'could', 'wont']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  complexity: z.enum(['low', 'medium', 'high']).optional(),
  estimated_hours: z.number().min(0).optional(),
  order: z.number().min(0).optional(),
})

export const UpdateRequirementSchema = CreateRequirementSchema.partial()

export const ReorderRequirementsSchema = z.object({
  requirements: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().min(0),
    })
  ),
})

// ============================================
// Comment Schema
// ============================================

export const CreateCommentSchema = z.object({
  rfp_id: z.string().uuid(),
  content: z.string().min(1, '내용은 필수입니다').max(2000, '댓글은 2000자 이하여야 합니다'),
  parent_id: z.string().uuid().optional(),
})

export const UpdateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

// ============================================
// File Upload Schema
// ============================================

export const FileUploadSchema = z.object({
  rfp_id: z.string().uuid(),
  file_name: z.string().min(1).max(255),
  file_size: z.number().min(1).max(10 * 1024 * 1024), // 10MB 제한
  file_type: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i, '올바른 MIME 타입이 아닙니다'),
})

// ============================================
// Type Exports
// ============================================

export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>
export type CreateRfpInput = z.infer<typeof CreateRfpSchema>
export type UpdateRfpInput = z.infer<typeof UpdateRfpSchema>
export type UpdateRfpStatusInput = z.infer<typeof UpdateRfpStatusSchema>
export type CreateRequirementInput = z.infer<typeof CreateRequirementSchema>
export type UpdateRequirementInput = z.infer<typeof UpdateRequirementSchema>
export type ReorderRequirementsInput = z.infer<typeof ReorderRequirementsSchema>
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>
export type FileUploadInput = z.infer<typeof FileUploadSchema>
