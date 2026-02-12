/**
 * Client Service
 *
 * 고객사 관련 비즈니스 로직 및 Supabase 연동
 */

import { supabase } from '@/lib/supabase'
import type { Client, CreateClientData, UpdateClientData, ListClientsParams } from '@/types/client'

/**
 * 고객사 목록 조회
 */
export async function listClients(params?: ListClientsParams) {
  const {
    page = 1,
    pageSize = 20,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params || {}

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })

  // 검색 필터
  if (search) {
    query = query.or(`name.ilike.%${search}%,contact_name.ilike.%${search}%,industry.ilike.%${search}%`)
  }

  // 정렬
  const sortColumn = sortBy === 'createdAt' ? 'created_at' : sortBy
  query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

  // 페이지네이션
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch clients: ${error.message}`)
  }

  return {
    data: (data || []).map(transformClient),
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}

/**
 * 고객사 상세 조회
 */
export async function getClientById(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch client: ${error.message}`)
  }

  if (!data) {
    throw new Error('Client not found')
  }

  return transformClient(data)
}

/**
 * 고객사 생성
 */
export async function createClient(clientData: CreateClientData): Promise<Client> {
  const { data, error } = await (supabase
    .from('clients') as any)
    .insert({
      name: clientData.name,
      business_number: clientData.businessNumber,
      industry: clientData.industry,
      contact_name: clientData.contactName,
      contact_email: clientData.contactEmail,
      contact_phone: clientData.contactPhone,
      contact_position: clientData.contactPosition,
      address: clientData.address || null,
      website: clientData.website || null,
      notes: clientData.notes || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create client: ${error.message}`)
  }

  return transformClient(data)
}

/**
 * 고객사 수정
 */
export async function updateClient(id: string, clientData: UpdateClientData): Promise<Client> {
  const updateData: Record<string, any> = {}

  if (clientData.name !== undefined) updateData.name = clientData.name
  if (clientData.businessNumber !== undefined) updateData.business_number = clientData.businessNumber
  if (clientData.industry !== undefined) updateData.industry = clientData.industry
  if (clientData.contactName !== undefined) updateData.contact_name = clientData.contactName
  if (clientData.contactEmail !== undefined) updateData.contact_email = clientData.contactEmail
  if (clientData.contactPhone !== undefined) updateData.contact_phone = clientData.contactPhone
  if (clientData.contactPosition !== undefined) updateData.contact_position = clientData.contactPosition
  if (clientData.address !== undefined) updateData.address = clientData.address
  if (clientData.website !== undefined) updateData.website = clientData.website
  if (clientData.notes !== undefined) updateData.notes = clientData.notes

  const { data, error } = await (supabase
    .from('clients') as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update client: ${error.message}`)
  }

  return transformClient(data)
}

/**
 * 고객사 삭제
 */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete client: ${error.message}`)
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
