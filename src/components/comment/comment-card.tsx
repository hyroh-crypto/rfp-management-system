/**
 * CommentCard Component
 *
 * 댓글 카드 컴포넌트
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CommentWithAuthor } from '@/types/comment'

interface CommentCardProps {
  comment: CommentWithAuthor
  onReply?: (parentId: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onResolve?: (id: string) => void
  level?: number
}

const TYPE_LABELS = {
  comment: '댓글',
  feedback: '피드백',
  approval: '승인',
  rejection: '반려',
}

const TYPE_COLORS = {
  comment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  feedback: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  approval: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejection: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function CommentCard({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onResolve,
  level = 0 
}: CommentCardProps) {
  const paddingLeft = level > 0 ? `${level * 2}rem` : '0'

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4" style={{ marginLeft: paddingLeft }}>
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full rounded-full" />
          ) : (
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {comment.author.name.charAt(0)}
            </span>
          )}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.author.name}
            </span>
            <Badge className={TYPE_COLORS[comment.type]}>
              {TYPE_LABELS[comment.type]}
            </Badge>
            {comment.isResolved && (
              <Badge variant="default" className="bg-gray-100 dark:bg-gray-800">
                해결됨
              </Badge>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleString('ko-KR')}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* 액션 버튼 */}
          <div className="flex gap-2 mt-2">
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="text-xs"
              >
                답글
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(comment.id)}
                className="text-xs"
              >
                수정
              </Button>
            )}
            {onResolve && !comment.isResolved && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResolve(comment.id)}
                className="text-xs"
              >
                해결
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                삭제
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
