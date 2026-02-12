// Requirement types for RFP Management System

export type RequirementCategory = 'functional' | 'non-functional' | 'technical' | 'business'
export type RequirementPriority = 'must' | 'should' | 'could' | 'wont' // MoSCoW
export type Complexity = 'low' | 'medium' | 'high'

export interface Requirement {
  id: string
  rfpId: string

  // Classification
  category: RequirementCategory
  priority: RequirementPriority

  // Content
  title: string
  description: string
  acceptanceCriteria?: string | null

  // AI Analysis
  complexity?: Complexity | null
  estimatedHours?: number | null
  suggestedSolution?: string | null

  // Order
  order: number

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface CreateRequirementData {
  rfpId: string
  category: RequirementCategory
  priority: RequirementPriority
  title: string
  description: string
  acceptanceCriteria?: string
  complexity?: Complexity
  estimatedHours?: number
}

export interface UpdateRequirementData {
  category?: RequirementCategory
  priority?: RequirementPriority
  title?: string
  description?: string
  acceptanceCriteria?: string
  complexity?: Complexity
  estimatedHours?: number
  suggestedSolution?: string
}

export interface ListRequirementsParams {
  rfpId: string
  category?: RequirementCategory
  priority?: RequirementPriority
}

export interface ReorderRequirementsData {
  requirementIds: string[] // 새로운 순서
}
