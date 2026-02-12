/**
 * RequirementForm Component
 *
 * 요구사항 생성/수정 폼
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { requirementSchema, type RequirementFormData } from '@/lib/validations/requirement'
import type { Requirement } from '@/types/requirement'

interface RequirementFormProps {
  requirement?: Requirement
  rfpId: string
  onSubmit: (data: RequirementFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function RequirementForm({ 
  requirement, 
  rfpId,
  onSubmit, 
  onCancel, 
  isLoading 
}: RequirementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: requirement ? {
      rfpId: requirement.rfpId,
      category: requirement.category,
      priority: requirement.priority,
      title: requirement.title,
      description: requirement.description,
      acceptanceCriteria: requirement.acceptanceCriteria || '',
      complexity: requirement.complexity || undefined,
      estimatedHours: requirement.estimatedHours || undefined,
    } : {
      rfpId,
      category: 'functional',
      priority: 'must',
    },
  })

  const handleFormSubmit = async (data: RequirementFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isFormLoading = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">카테고리 *</Label>
          <select
            id="category"
            {...register('category')}
            disabled={isFormLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="functional">기능</option>
            <option value="non-functional">비기능</option>
            <option value="technical">기술</option>
            <option value="business">비즈니스</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="priority">우선순위 *</Label>
          <select
            id="priority"
            {...register('priority')}
            disabled={isFormLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="must">Must (필수)</option>
            <option value="should">Should (중요)</option>
            <option value="could">Could (선택)</option>
            <option value="wont">Won't (제외)</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="요구사항 제목"
          disabled={isFormLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">설명 *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="요구사항에 대한 상세 설명"
          rows={4}
          disabled={isFormLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="acceptanceCriteria">수용 기준</Label>
        <Textarea
          id="acceptanceCriteria"
          {...register('acceptanceCriteria')}
          placeholder="요구사항 완료 기준"
          rows={3}
          disabled={isFormLoading}
        />
        {errors.acceptanceCriteria && (
          <p className="mt-1 text-sm text-red-600">{errors.acceptanceCriteria.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="complexity">복잡도</Label>
          <select
            id="complexity"
            {...register('complexity')}
            disabled={isFormLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">선택 안 함</option>
            <option value="low">낮음</option>
            <option value="medium">중간</option>
            <option value="high">높음</option>
          </select>
          {errors.complexity && (
            <p className="mt-1 text-sm text-red-600">{errors.complexity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="estimatedHours">예상 시간 (시간)</Label>
          <Input
            id="estimatedHours"
            type="number"
            {...register('estimatedHours', { valueAsNumber: true })}
            placeholder="0"
            min="0"
            max="1000"
            disabled={isFormLoading}
          />
          {errors.estimatedHours && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isFormLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isFormLoading}>
          {isFormLoading ? '저장 중...' : requirement ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  )
}
