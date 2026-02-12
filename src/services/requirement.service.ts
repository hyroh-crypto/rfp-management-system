/**
 * Requirement Service
 *
 * 요구사항 관련 비즈니스 로직 및 Supabase 연동
 */

import { supabase } from '@/lib/supabase'
import type { 
  Requirement, 
  CreateRequirementData, 
  UpdateRequirementData, 
  ListRequirementsParams,
  ReorderRequirementsData
} from '@/types/requirement'

/**
 * 요구사항 목록 조회
 */
export async function listRequirements(params: ListRequirementsParams) {
  const { rfpId, category, priority } = params

  let query = supabase
    .from('requirements')
    .select('*')
    .eq('rfp_id', rfpId)

  // 카테고리 필터
  if (category) {
    query = query.eq('category', category)
  }

  // 우선순위 필터
  if (priority) {
    query = query.eq('priority', priority)
  }

  // 순서대로 정렬
  query = query.order('order', { ascending: true })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch requirements: ${error.message}`)
  }

  return (data || []).map(transformRequirement)
}

/**
 * 요구사항 상세 조회
 */
export async function getRequirementById(id: string): Promise<Requirement> {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch requirement: ${error.message}`)
  }

  if (!data) {
    throw new Error('Requirement not found')
  }

  return transformRequirement(data)
}

/**
 * 요구사항 생성
 */
export async function createRequirement(requirementData: CreateRequirementData): Promise<Requirement> {
  // 현재 RFP의 마지막 order 값 조회
  const { data: maxOrderData } = await (supabase
    .from('requirements') as any)
    .select('order')
    .eq('rfp_id', requirementData.rfpId)
    .order('order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = maxOrderData ? maxOrderData.order + 1 : 0

  const { data, error } = await (supabase
    .from('requirements') as any)
    .insert({
      rfp_id: requirementData.rfpId,
      category: requirementData.category,
      priority: requirementData.priority,
      title: requirementData.title,
      description: requirementData.description,
      acceptance_criteria: requirementData.acceptanceCriteria || null,
      complexity: requirementData.complexity || null,
      estimated_hours: requirementData.estimatedHours || null,
      order: nextOrder,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create requirement: ${error.message}`)
  }

  return transformRequirement(data)
}

/**
 * 요구사항 수정
 */
export async function updateRequirement(id: string, requirementData: UpdateRequirementData): Promise<Requirement> {
  const updateData: Record<string, any> = {}

  if (requirementData.category !== undefined) updateData.category = requirementData.category
  if (requirementData.priority !== undefined) updateData.priority = requirementData.priority
  if (requirementData.title !== undefined) updateData.title = requirementData.title
  if (requirementData.description !== undefined) updateData.description = requirementData.description
  if (requirementData.acceptanceCriteria !== undefined) updateData.acceptance_criteria = requirementData.acceptanceCriteria
  if (requirementData.complexity !== undefined) updateData.complexity = requirementData.complexity
  if (requirementData.estimatedHours !== undefined) updateData.estimated_hours = requirementData.estimatedHours
  if (requirementData.suggestedSolution !== undefined) updateData.suggested_solution = requirementData.suggestedSolution

  const { data, error } = await (supabase
    .from('requirements') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update requirement: ${error.message}`)
  }

  return transformRequirement(data)
}

/**
 * 요구사항 삭제
 */
export async function deleteRequirement(id: string): Promise<void> {
  const { error } = await supabase
    .from('requirements')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete requirement: ${error.message}`)
  }
}

/**
 * 요구사항 순서 재배치
 */
export async function reorderRequirements(data: ReorderRequirementsData): Promise<void> {
  const { requirementIds } = data

  // 각 요구사항의 order 값을 배열 인덱스로 업데이트
  const updates = requirementIds.map((id, index) =>
    (supabase
      .from('requirements') as any)
      .update({ order: index })
      .eq('id', id)
  )

  const results = await Promise.all(updates)

  // 에러 체크
  const errors = results.filter(result => result.error)
  if (errors.length > 0) {
    throw new Error(`Failed to reorder requirements: ${errors[0].error?.message}`)
  }
}

/**
 * Database Row를 Requirement 타입으로 변환
 */
function transformRequirement(row: any): Requirement {
  return {
    id: row.id,
    rfpId: row.rfp_id,
    category: row.category,
    priority: row.priority,
    title: row.title,
    description: row.description,
    acceptanceCriteria: row.acceptance_criteria,
    complexity: row.complexity,
    estimatedHours: row.estimated_hours,
    suggestedSolution: row.suggested_solution,
    order: row.order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
