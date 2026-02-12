/**
 * RFP Management System - Type Definitions
 * Phase 1 Schema에서 정의한 엔티티들의 TypeScript 타입
 */

// ===== Base Types =====

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== User =====

export type UserRole = 'admin' | 'manager' | 'writer' | 'reviewer';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  permissions?: string[];
  avatar?: string;
  phone?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
}

// ===== Client =====

export interface Client extends BaseEntity {
  name: string;
  businessNumber: string;
  industry: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  address?: string;
  website?: string;
  notes?: string;
}

// ===== RFP =====

export type RfpStatus = 'received' | 'analyzing' | 'analyzed' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: Date;
}

export interface RFP extends BaseEntity {
  title: string;
  clientId: string;
  client?: Client;
  status: RfpStatus;
  receivedDate: Date;
  dueDate: Date;
  estimatedBudget?: number;
  estimatedDuration?: number;
  description: string;
  attachments?: Attachment[];
  assigneeId?: string;
  aiAnalysis?: {
    summary: string;
    keyRequirements: string[];
    technicalStack: string[];
    riskLevel: RiskLevel;
    estimatedEffort: number; // 인월
  };
  analyzedAt?: Date;
}

// ===== Requirement =====

export type RequirementPriority = 'must' | 'should' | 'could' | 'wont';
export type RequirementCategory = 'functional' | 'non-functional' | 'technical' | 'business';

export interface Requirement extends BaseEntity {
  rfpId: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  title: string;
  description: string;
  acceptanceCriteria?: string;
  complexity?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  suggestedSolution?: string;
  order: number;
}

// ===== Proposal =====

export type ProposalStatus = 'drafting' | 'reviewing' | 'approved' | 'delivered' | 'won' | 'lost';

export interface TeamMember {
  name: string;
  role: string;
  allocation: number;
  duration: number;
}

export interface Proposal extends BaseEntity {
  rfpId: string;
  rfp?: RFP;
  title: string;
  status: ProposalStatus;
  version: string;
  assigneeId: string;
  reviewerIds?: string[];
  executiveSummary?: string;
  totalPrice?: number;
  estimatedDuration?: number;
  startDate?: Date;
  endDate?: Date;
  team?: TeamMember[];
  deliveredAt?: Date;
  resultDate?: Date;
  winProbability?: number;
  createdBy?: string;
}

// ===== ProposalSection =====

export type SectionType =
  | 'executive-summary'
  | 'company-intro'
  | 'requirement-analysis'
  | 'technical-approach'
  | 'ui-prototype'
  | 'timeline'
  | 'pricing'
  | 'team'
  | 'appendix';

export interface ProposalSection extends BaseEntity {
  proposalId: string;
  type: SectionType;
  order: number;
  title: string;
  content: string; // Markdown
  isAIGenerated: boolean;
  aiPrompt?: string;
  status?: 'draft' | 'review' | 'approved';
  createdBy?: string;
}

// ===== UIPrototype =====

export type PrototypeStatus = 'generating' | 'draft' | 'reviewing' | 'approved';
export type PrototypeType = 'wireframe' | 'mockup' | 'interactive';

export interface UIPrototype extends BaseEntity {
  proposalId: string;
  proposal?: Proposal;
  name: string;
  type: PrototypeType;
  order: number;
  status: PrototypeStatus;
  description?: string;
  imageUrl?: string;
  figmaUrl?: string;
  htmlCode?: string;
  isAIGenerated: boolean;
  aiPrompt?: string;
  generatedFrom?: string;
  createdBy: string;
}

// ===== Comment =====

export interface Comment extends BaseEntity {
  targetType: 'proposal' | 'ui-prototype' | 'section';
  targetId: string;
  content: string;
  type?: 'comment' | 'feedback' | 'approval' | 'rejection';
  authorId: string;
  author?: User;
  parentId?: string;
  isResolved?: boolean;
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// ===== Form Types =====

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  name: string;
  department?: string;
}

export interface RfpCreateForm {
  title: string;
  clientId: string;
  dueDate: string;
  estimatedBudget?: number;
  description: string;
}

export interface ProposalCreateForm {
  rfpId: string;
  title: string;
  totalCost: number;
  estimatedDuration: number;
}
