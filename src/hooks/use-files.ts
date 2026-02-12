/**
 * File Hooks
 *
 * TanStack Query hooks for file operations
 */

import { useMutation } from '@tanstack/react-query'
import * as fileService from '@/services/file.service'

/**
 * 파일 업로드
 */
export function useUploadFile() {
  return useMutation({
    mutationFn: (params: { file: File; bucket: string; path?: string }) =>
      fileService.uploadFile(params),
  })
}

/**
 * 여러 파일 업로드
 */
export function useUploadFiles() {
  return useMutation({
    mutationFn: (params: { files: File[]; bucket: string; path?: string }) =>
      fileService.uploadFiles(params.files, params.bucket, params.path),
  })
}

/**
 * 파일 다운로드
 */
export function useDownloadFile() {
  return useMutation({
    mutationFn: (params: { bucket: string; path: string }) =>
      fileService.downloadFile(params),
  })
}

/**
 * 파일 삭제
 */
export function useDeleteFile() {
  return useMutation({
    mutationFn: (params: { bucket: string; path: string }) =>
      fileService.deleteFile(params.bucket, params.path),
  })
}

/**
 * 여러 파일 삭제
 */
export function useDeleteFiles() {
  return useMutation({
    mutationFn: (params: { bucket: string; paths: string[] }) =>
      fileService.deleteFiles(params.bucket, params.paths),
  })
}
