// Comment types for RFP Management System

export type CommentTargetType = 'rfp' | 'requirement' | 'proposal'
export type CommentType = 'comment' | 'feedback' | 'approval' | 'rejection'

export interface Comment {
  id: string

  // Target
  targetType: CommentTargetType
  targetId: string

  // Content
  content: string
  type: CommentType

  // Author
  authorId: string

  // Nested Comments
  parentId?: string | null

  // Status
  isResolved: boolean

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface CreateCommentData {
  targetType: CommentTargetType
  targetId: string
  content: string
  type?: CommentType
  parentId?: string
}

export interface UpdateCommentData {
  content?: string
  type?: CommentType
  isResolved?: boolean
}

export interface ListCommentsParams {
  targetType: CommentTargetType
  targetId: string
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string
    name: string
    avatar?: string
  }
}

export interface CommentWithReplies extends CommentWithAuthor {
  replies: CommentWithAuthor[]
}
