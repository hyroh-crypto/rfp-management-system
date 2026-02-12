/**
 * Comment Service
 *
 * 댓글/피드백 관련 비즈니스 로직 및 Supabase 연동
 */

import { supabase } from '@/lib/supabase'
import type { 
  Comment, 
  CommentWithAuthor,
  CommentWithReplies,
  CreateCommentData, 
  UpdateCommentData, 
  ListCommentsParams 
} from '@/types/comment'

/**
 * 댓글 목록 조회 (중첩 구조 포함)
 */
export async function listComments(params: ListCommentsParams): Promise<CommentWithReplies[]> {
  const { targetType, targetId } = params

  const { data, error } = await supabase
    .from('comments')
    .select('*, users(id, name, avatar)')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }

  const comments = (data || []).map(transformCommentWithAuthor)

  // 최상위 댓글과 답글 분리
  const topLevelComments = comments.filter(c => !c.parentId)
  const replies = comments.filter(c => c.parentId)

  // 최상위 댓글에 답글 매핑
  return topLevelComments.map(comment => ({
    ...comment,
    replies: replies.filter(r => r.parentId === comment.id),
  }))
}

/**
 * 댓글 상세 조회
 */
export async function getCommentById(id: string): Promise<CommentWithAuthor> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(id, name, avatar)')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch comment: ${error.message}`)
  }

  if (!data) {
    throw new Error('Comment not found')
  }

  return transformCommentWithAuthor(data)
}

/**
 * 댓글 생성
 */
export async function createComment(commentData: CreateCommentData): Promise<CommentWithAuthor> {
  // 현재 사용자 ID 가져오기 (인증된 사용자)
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await (supabase
    .from('comments') as any)
    .insert({
      target_type: commentData.targetType,
      target_id: commentData.targetId,
      content: commentData.content,
      type: commentData.type || 'comment',
      author_id: user.id,
      parent_id: commentData.parentId || null,
      is_resolved: false,
    })
    .select('*, users(id, name, avatar)')
    .single()

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`)
  }

  return transformCommentWithAuthor(data)
}

/**
 * 댓글 수정
 */
export async function updateComment(id: string, commentData: UpdateCommentData): Promise<CommentWithAuthor> {
  const updateData: Record<string, any> = {}

  if (commentData.content !== undefined) updateData.content = commentData.content
  if (commentData.type !== undefined) updateData.type = commentData.type
  if (commentData.isResolved !== undefined) updateData.is_resolved = commentData.isResolved

  const { data, error } = await (supabase
    .from('comments') as any)
    .update(updateData)
    .eq('id', id)
    .select('*, users(id, name, avatar)')
    .single()

  if (error) {
    throw new Error(`Failed to update comment: ${error.message}`)
  }

  return transformCommentWithAuthor(data)
}

/**
 * 댓글 삭제
 */
export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`)
  }
}

/**
 * 댓글 해결 상태 토글
 */
export async function toggleCommentResolved(id: string): Promise<CommentWithAuthor> {
  // 현재 상태 조회
  const { data: currentData, error: fetchError } = await (supabase
    .from('comments') as any)
    .select('is_resolved')
    .eq('id', id)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch comment: ${fetchError.message}`)
  }

  // 상태 반전
  const { data, error } = await (supabase
    .from('comments') as any)
    .update({ is_resolved: !currentData.is_resolved })
    .eq('id', id)
    .select('*, users(id, name, avatar)')
    .single()

  if (error) {
    throw new Error(`Failed to toggle comment resolved: ${error.message}`)
  }

  return transformCommentWithAuthor(data)
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
 * Database Row를 CommentWithAuthor 타입으로 변환
 */
function transformCommentWithAuthor(row: any): CommentWithAuthor {
  return {
    ...transformComment(row),
    author: {
      id: row.users.id,
      name: row.users.name,
      avatar: row.users.avatar || undefined,
    },
  }
}
