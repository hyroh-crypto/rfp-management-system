/**
 * RFP Service
 *
 * RFP 관련 비즈니스 로직 및 Supabase 연동
 */

import { supabase } from '@/lib/supabase'
import type { RFP, CreateRfpData, UpdateRfpData, ListRfpsParams, RfpStatus } from '@/types/rfp'
import type { Requirement } from '@/types/requirement'
import type { Comment } from '@/types/comment'
import type { Client } from '@/types/client'

/**
 * RFP 목록 조회 (검색 및 필터링)
 */
export async function listRfps(params?: ListRfpsParams) {
  const {
    page = 1,
    pageSize = 20,
    search,
    status,
    clientId,
    assigneeId,
    dueDateFrom,
    dueDateTo,
    sortBy = 'receivedDate',
    sortOrder = 'desc',
  } = params || {}

  let query = supabase
    .from('rfps')
    .select('*, clients(id, name)', { count: 'exact' })

  // 검색 필터
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // 상태 필터
  if (status && status.length > 0) {
    query = query.in('status', status)
  }

  // 고객사 필터
  if (clientId) {
    query = query.eq('client_id', clientId)
  }

  // 담당자 필터
  if (assigneeId) {
    query = query.eq('assignee_id', assigneeId)
  }

  // 마감일 범위 필터
  if (dueDateFrom) {
    query = query.gte('due_date', dueDateFrom)
  }
  if (dueDateTo) {
    query = query.lte('due_date', dueDateTo)
  }

  // 정렬
  const sortColumn = sortBy === 'receivedDate' ? 'received_date' : 'due_date'
  query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

  // 페이지네이션
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Supabase RFP query error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to fetch RFPs: ${error.message}`)
  }

  console.log(`✅ RFPs fetched successfully: ${(data || []).length} items`)

  return {
    data: (data || []).map(transformRfp),
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}

/**
 * RFP 상세 조회 (관련 데이터 포함)
 */
export async function getRfpById(id: string) {
  // RFP 기본 정보 및 고객사 정보
  const { data: rfpData, error: rfpError } = await (supabase
    .from('rfps') as any)
    .select('*, clients(*)')
    .eq('id', id)
    .single()

  if (rfpError) {
    throw new Error(`Failed to fetch RFP: ${rfpError.message}`)
  }

  if (!rfpData) {
    throw new Error('RFP not found')
  }

  // 요구사항 목록
  const { data: requirements, error: reqError } = await (supabase
    .from('requirements') as any)
    .select('*')
    .eq('rfp_id', id)
    .order('order', { ascending: true })

  if (reqError) {
    throw new Error(`Failed to fetch requirements: ${reqError.message}`)
  }

  // 댓글 목록
  const { data: comments, error: commentError } = await (supabase
    .from('comments') as any)
    .select('*, users(id, name, avatar)')
    .eq('target_type', 'rfp')
    .eq('target_id', id)
    .order('created_at', { ascending: true })

  if (commentError) {
    throw new Error(`Failed to fetch comments: ${commentError.message}`)
  }

  return {
    rfp: transformRfp(rfpData),
    requirements: (requirements || []).map(transformRequirement),
    comments: (comments || []).map(transformComment),
    client: transformClient(rfpData.clients),
  }
}

/**
 * RFP 생성
 */
export async function createRfp(rfpData: CreateRfpData): Promise<RFP> {
  const { data, error } = await (supabase
    .from('rfps') as any)
    .insert({
      title: rfpData.title,
      client_id: rfpData.clientId,
      received_date: rfpData.receivedDate,
      due_date: rfpData.dueDate,
      estimated_budget: rfpData.estimatedBudget || null,
      estimated_duration: rfpData.estimatedDuration || null,
      description: rfpData.description,
      status: 'received',
      assignee_id: rfpData.assigneeId || null,
      attachments: [],
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create RFP: ${error.message}`)
  }

  return transformRfp(data)
}

/**
 * RFP 수정
 */
export async function updateRfp(id: string, rfpData: UpdateRfpData): Promise<RFP> {
  const updateData: Record<string, any> = {}

  if (rfpData.title !== undefined) updateData.title = rfpData.title
  if (rfpData.clientId !== undefined) updateData.client_id = rfpData.clientId
  if (rfpData.receivedDate !== undefined) updateData.received_date = rfpData.receivedDate
  if (rfpData.dueDate !== undefined) updateData.due_date = rfpData.dueDate
  if (rfpData.estimatedBudget !== undefined) updateData.estimated_budget = rfpData.estimatedBudget
  if (rfpData.estimatedDuration !== undefined) updateData.estimated_duration = rfpData.estimatedDuration
  if (rfpData.description !== undefined) updateData.description = rfpData.description
  if (rfpData.assigneeId !== undefined) updateData.assignee_id = rfpData.assigneeId
  // attachments는 UpdateRfpData 타입에 없음
  // if (rfpData.attachments !== undefined) updateData.attachments = rfpData.attachments

  const { data, error } = await (supabase
    .from('rfps') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update RFP: ${error.message}`)
  }

  return transformRfp(data)
}

/**
 * RFP 상태 변경
 */
export async function updateRfpStatus(id: string, status: RfpStatus): Promise<RFP> {
  const updateData: Record<string, any> = { status }

  // 'analyzed' 상태로 변경 시 analyzed_at 기록
  if (status === 'analyzed') {
    updateData.analyzed_at = new Date().toISOString()
  }

  const { data, error } = await (supabase
    .from('rfps') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update RFP status: ${error.message}`)
  }

  return transformRfp(data)
}

/**
 * RFP 삭제
 */
export async function deleteRfp(id: string): Promise<void> {
  const { error } = await supabase
    .from('rfps')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete RFP: ${error.message}`)
  }
}

/**
 * Database Row를 RFP 타입으로 변환
 */
function transformRfp(row: any): RFP {
  return {
    id: row.id,
    title: row.title,
    clientId: row.client_id,
    receivedDate: row.received_date,
    dueDate: row.due_date,
    estimatedBudget: row.estimated_budget,
    estimatedDuration: row.estimated_duration,
    description: row.description,
    attachments: row.attachments || [],
    status: row.status,
    aiAnalysis: row.ai_analysis,
    assigneeId: row.assignee_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    analyzedAt: row.analyzed_at,
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

/**
 * Database Row를 Comment 타입으로 변환
 */
function transformComment(row: any): Comment {
  return {
    id: row.id,
    targetType: row.target_type,
    targetId: row.target_id,
    content: row.content,
    type: row.type,
    authorId: row.author_id,
    parentId: row.parent_id,
    isResolved: row.is_resolved,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Database Row를 Client 타입으로 변환
 */
function transformClient(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    businessNumber: row.business_number,
    industry: row.industry,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactPosition: row.contact_position,
    address: row.address,
    website: row.website,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
