/**
 * FileList Component
 *
 * 파일 목록 컴포넌트
 */

'use client'

import { Button } from '@/components/ui/button'
import type { Attachment } from '@/types/rfp'

interface FileListProps {
  files: Attachment[]
  onDownload?: (file: Attachment) => void
  onDelete?: (fileId: string) => void
}

export function FileList({ files, onDownload, onDelete }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        첨부된 파일이 없습니다.
      </div>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    return '📎'
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl">{getFileIcon(file.fileType)}</span>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(file)}
              >
                다운로드
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(file.id)}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
