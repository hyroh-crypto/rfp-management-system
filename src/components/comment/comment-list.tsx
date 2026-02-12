/**
 * CommentList Component
 *
 * 댓글 목록 (중첩 구조)
 */

'use client'

import { CommentCard } from './comment-card'
import type { CommentWithReplies } from '@/types/comment'

interface CommentListProps {
  comments: CommentWithReplies[]
  onReply?: (parentId: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onResolve?: (id: string) => void
  isLoading?: boolean
}

export function CommentList({ 
  comments, 
  onReply, 
  onEdit, 
  onDelete, 
  onResolve,
  isLoading 
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">등록된 댓글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id}>
          {/* 최상위 댓글 */}
          <CommentCard
            comment={comment}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onResolve={onResolve}
            level={0}
          />

          {/* 답글들 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  level={1}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
