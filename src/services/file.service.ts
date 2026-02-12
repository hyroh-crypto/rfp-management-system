/**
 * File Service
 *
 * 파일 업로드/다운로드 관련 비즈니스 로직 및 Supabase Storage 연동
 */

import { supabase } from '@/lib/supabase'

export interface UploadFileParams {
  file: File
  bucket: string
  path?: string
}

export interface UploadFileResponse {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedAt: string
}

export interface DownloadFileParams {
  bucket: string
  path: string
}

/**
 * 파일 업로드 (Presigned URL 사용)
 */
export async function uploadFile(params: UploadFileParams): Promise<UploadFileResponse> {
  const { file, bucket, path = '' } = params

  // 1. 파일 검증
  validateFile(file)

  // 2. 파일명 생성 (타임스탬프 + 원본 파일명)
  const timestamp = Date.now()
  const sanitizedFileName = sanitizeFileName(file.name)
  const fileName = `${timestamp}_${sanitizedFileName}`
  const fullPath = path ? `${path}/${fileName}` : fileName

  // 3. Presigned Upload URL 생성
  const { data: presignedData, error: presignedError } = await supabase
    .storage
    .from(bucket)
    .createSignedUploadUrl(fullPath)

  if (presignedError) {
    throw new Error(`Failed to create presigned upload URL: ${presignedError.message}`)
  }

  // 4. Presigned URL로 파일 업로드
  const uploadResponse = await fetch(presignedData.signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
  }

  // 5. Public URL 생성
  const { data: publicUrlData } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(fullPath)

  return {
    id: presignedData.path,
    fileName: sanitizedFileName,
    fileSize: file.size,
    fileType: file.type,
    url: publicUrlData.publicUrl,
    uploadedAt: new Date().toISOString(),
  }
}

/**
 * 여러 파일 일괄 업로드
 */
export async function uploadFiles(
  files: File[],
  bucket: string,
  path?: string
): Promise<UploadFileResponse[]> {
  const uploadPromises = files.map(file =>
    uploadFile({ file, bucket, path })
  )

  return Promise.all(uploadPromises)
}

/**
 * 파일 다운로드 (Presigned URL 사용)
 */
export async function downloadFile(params: DownloadFileParams): Promise<string> {
  const { bucket, path } = params

  // Presigned Download URL 생성 (1시간 유효)
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, 3600)

  if (error) {
    throw new Error(`Failed to create download URL: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to generate download URL')
  }

  return data.signedUrl
}

/**
 * 파일 삭제
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase
    .storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * 여러 파일 일괄 삭제
 */
export async function deleteFiles(bucket: string, paths: string[]): Promise<void> {
  const { error } = await supabase
    .storage
    .from(bucket)
    .remove(paths)

  if (error) {
    throw new Error(`Failed to delete files: ${error.message}`)
  }
}

/**
 * 파일 검증
 */
function validateFile(file: File): void {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 10MB limit: ${file.name}`)
  }

  // 파일 타입 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`)
  }
}

/**
 * 파일명 안전하게 변환
 */
function sanitizeFileName(fileName: string): string {
  // 특수문자 제거 및 공백을 언더스코어로 변환
  return fileName
    .replace(/[^a-zA-Z0-9가-힣._-]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 파일 확장자 추출
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}
