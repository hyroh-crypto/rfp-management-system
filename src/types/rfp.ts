// RFP types for RFP Management System

export type RfpStatus = 'received' | 'analyzing' | 'analyzed' | 'rejected'

export interface RFP {
  id: string
  title: string
  clientId: string

  // Dates
  receivedDate: string
  dueDate: string

  // Budget and Duration
  estimatedBudget?: number | null
  estimatedDuration?: number | null

  // Content
  description: string
  attachments: Attachment[]

  // Status
  status: RfpStatus

  // AI Analysis
  aiAnalysis?: AIAnalysis | null

  // Assignment
  assigneeId?: string | null

  // Metadata
  createdAt: string
  updatedAt: string
  analyzedAt?: string | null
}

export interface Attachment {
  id: string
  fileName: string
  fileSize: number // bytes
  fileType: string // MIME type
  url: string
  uploadedAt: string
}

export interface AIAnalysis {
  summary: string
  keyRequirements: string[]
  technicalStack: string[]
  riskLevel: 'low' | 'medium' | 'high'
  estimatedEffort: number // person-months
}

export interface CreateRfpData {
  title: string
  clientId: string
  receivedDate: Date | string
  dueDate: Date | string
  estimatedBudget?: number
  estimatedDuration?: number
  description: string
  assigneeId?: string
}

export interface UpdateRfpData {
  title?: string
  clientId?: string
  receivedDate?: Date | string
  dueDate?: Date | string
  estimatedBudget?: number
  estimatedDuration?: number
  description?: string
  assigneeId?: string
  status?: RfpStatus
}

export interface ListRfpsParams {
  page?: number
  pageSize?: number
  search?: string
  status?: RfpStatus[]
  clientId?: string
  assigneeId?: string
  dueDateFrom?: Date | string
  dueDateTo?: Date | string
  sortBy?: 'receivedDate' | 'dueDate' | 'status' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface ListRfpsResponse {
  data: RFP[]
  total: number
  page: number
  pageSize: number
}

export interface GetRfpResponse {
  rfp: RFP
  requirements: Array<{
    id: string
    category: string
    priority: string
    title: string
    complexity?: string
  }>
  comments: Array<{
    id: string
    content: string
    type: string
    authorId: string
    createdAt: string
  }>
  client: {
    id: string
    name: string
  }
}
