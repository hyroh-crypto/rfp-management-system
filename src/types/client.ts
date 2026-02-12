// Client types for RFP Management System

export interface Client {
  id: string
  name: string
  businessNumber: string
  industry: string

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone: string
  contactPosition: string

  // Optional Fields
  address?: string | null
  website?: string | null
  notes?: string | null

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface ClientContact {
  name: string
  email: string
  phone: string
  position: string
}

export interface CreateClientData {
  name: string
  businessNumber: string
  industry: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactPosition: string
  address?: string
  website?: string
  notes?: string
}

export interface UpdateClientData {
  name?: string
  businessNumber?: string
  industry?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  contactPosition?: string
  address?: string
  website?: string
  notes?: string
}

export interface ListClientsParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: 'name' | 'createdAt' | 'industry'
  sortOrder?: 'asc' | 'desc'
}

export interface ListClientsResponse {
  data: Client[]
  total: number
  page: number
  pageSize: number
}

export interface GetClientResponse {
  client: Client
  rfps: Array<{
    id: string
    title: string
    status: string
    receivedDate: string
    dueDate: string
  }>
}
