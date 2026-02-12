/**
 * ClientForm Component
 *
 * 고객사 생성/수정 폼
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { clientSchema, type ClientFormData } from '@/lib/validations/client'
import type { Client } from '@/types/client'

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      name: client.name,
      businessNumber: client.businessNumber,
      industry: client.industry,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      contactPosition: client.contactPosition,
      address: client.address || '',
      website: client.website || '',
      notes: client.notes || '',
    } : undefined,
  })

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isFormLoading = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">기본 정보</h3>
        
        <div>
          <Label htmlFor="name">회사명 *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="(주)예시회사"
            disabled={isFormLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessNumber">사업자등록번호 *</Label>
          <Input
            id="businessNumber"
            {...register('businessNumber')}
            placeholder="000-00-00000"
            disabled={isFormLoading}
          />
          {errors.businessNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.businessNumber.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="industry">업종 *</Label>
          <Input
            id="industry"
            {...register('industry')}
            placeholder="IT 서비스업"
            disabled={isFormLoading}
          />
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>
      </div>

      {/* 담당자 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">담당자 정보</h3>
        
        <div>
          <Label htmlFor="contactName">담당자 이름 *</Label>
          <Input
            id="contactName"
            {...register('contactName')}
            placeholder="홍길동"
            disabled={isFormLoading}
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactPosition">직책 *</Label>
          <Input
            id="contactPosition"
            {...register('contactPosition')}
            placeholder="부장"
            disabled={isFormLoading}
          />
          {errors.contactPosition && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPosition.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactEmail">이메일 *</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register('contactEmail')}
            placeholder="contact@example.com"
            disabled={isFormLoading}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactPhone">전화번호 *</Label>
          <Input
            id="contactPhone"
            {...register('contactPhone')}
            placeholder="010-1234-5678"
            disabled={isFormLoading}
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
          )}
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">추가 정보</h3>
        
        <div>
          <Label htmlFor="address">주소</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="서울특별시 강남구..."
            disabled={isFormLoading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website">웹사이트</Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="https://example.com"
            disabled={isFormLoading}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">메모</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="추가 메모사항..."
            rows={4}
            disabled={isFormLoading}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
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
          {isFormLoading ? '저장 중...' : client ? '수정' : '생성'}
        </Button>
      </div>
    </form>
  )
}
