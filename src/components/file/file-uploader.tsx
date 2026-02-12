/**
 * FileUploader Component
 *
 * 파일 업로드 컴포넌트 (드래그 앤 드롭)
 */

'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number // MB
  accept?: string[]
  multiple?: boolean
}

export function FileUploader({ 
  onUpload, 
  maxFiles = 10,
  maxSize = 10, // 10MB
  accept = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
  multiple = true
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    if (files.length > maxFiles) {
      errors.push(`최대 ${maxFiles}개 파일까지 업로드 가능합니다.`)
      return { valid, errors }
    }

    files.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name}: 파일 크기가 ${maxSize}MB를 초과합니다.`)
        return
      }

      const isAccepted = accept.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''))
        }
        return file.type === type
      })

      if (!isAccepted) {
        errors.push(`${file.name}: 지원하지 않는 파일 형식입니다.`)
        return
      }

      valid.push(file)
    })

    return { valid, errors }
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const { valid, errors: validationErrors } = validateFiles(fileArray)

    setErrors(validationErrors)

    if (valid.length === 0) return

    setIsUploading(true)
    try {
      await onUpload(valid)
      setErrors([])
    } catch (error) {
      setErrors([`업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`])
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, maxFiles, maxSize, accept])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          파일을 여기에 드래그하거나 클릭하여 선택하세요
        </p>

        <input
          type="file"
          id="file-upload"
          multiple={multiple}
          accept={accept.join(',')}
          onChange={handleFileInput}
          disabled={isUploading}
          className="hidden"
        />

        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isUploading ? '업로드 중...' : '파일 선택'}
        </label>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          최대 {maxFiles}개, 파일당 최대 {maxSize}MB
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
