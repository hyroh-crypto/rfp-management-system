'use client'

/**
 * RFP Form Component
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { rfpFormSchema, type RfpFormData } from '@/lib/validations/rfp'
import { useCreateRfp } from '@/hooks/use-rfps'
import { useClients } from '@/hooks/use-clients'
// TODO: useUsers hook 구현 필요
// import { useUsers } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export function RfpForm() {
  const router = useRouter()
  const createRFP = useCreateRfp()
  const { data: clientsData } = useClients()
  // const { data: usersData } = useUsers() // TODO: 구현 필요
  const usersData: any[] = [] // 임시

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RfpFormData>({
    resolver: zodResolver(rfpFormSchema),
    defaultValues: {
      received_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: RfpFormData) => {
    try {
      // 빈 문자열을 undefined로 변환
      const payload = {
        title: data.title,
        description: data.description,
        client_id: data.client_id,
        received_date: data.received_date,
        due_date: data.due_date,
        estimated_budget: data.estimated_budget === '' ? undefined : Number(data.estimated_budget),
        estimated_duration: data.estimated_duration === '' ? undefined : Number(data.estimated_duration),
        assignee_id: data.assignee_id === '' ? undefined : data.assignee_id,
        attachments: null,
        ai_analysis: null,
        analyzed_at: null,
        status: 'received' as const,
      }

      await createRFP.mutateAsync(payload)
      router.push('/rfps')
    } catch (error) {
      console.error('Failed to create RFP:', error)
      alert('RFP 등록 중 오류가 발생했습니다.')
    }
  }

  const clients = clientsData?.data || []
  const users = usersData || []

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">기본 정보</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                제목 <span className="text-red-400">*</span>
              </label>
              <Input
                {...register('title')}
                placeholder="예: 차세대 스마트 홈 IoT 플랫폼 개발"
                error={errors.title?.message}
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                설명 <span className="text-red-400">*</span>
              </label>
              <Textarea
                {...register('description')}
                placeholder="RFP에 대한 상세 설명을 입력하세요..."
                rows={6}
                error={errors.description?.message}
              />
            </div>

            {/* 고객사 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                고객사 <span className="text-red-400">*</span>
              </label>
              <Select {...register('client_id')} error={errors.client_id?.message}>
                <option value="">고객사를 선택하세요</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 일정 정보 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">일정 정보</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 접수일 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  접수일 <span className="text-red-400">*</span>
                </label>
                <Input
                  type="date"
                  {...register('received_date')}
                  error={errors.received_date?.message}
                />
              </div>

              {/* 마감일 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  마감일 <span className="text-red-400">*</span>
                </label>
                <Input
                  type="date"
                  {...register('due_date')}
                  error={errors.due_date?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 예산 및 기간 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">예산 및 기간</h3>
            <p className="text-sm text-gray-400">선택 사항입니다</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 예상 예산 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  예상 예산 (원)
                </label>
                <Input
                  type="number"
                  {...register('estimated_budget', {
                    setValueAs: (v) => (v === '' ? '' : parseInt(v, 10)),
                  })}
                  placeholder="예: 500000000"
                  error={errors.estimated_budget?.message}
                />
              </div>

              {/* 예상 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  예상 기간 (일)
                </label>
                <Input
                  type="number"
                  {...register('estimated_duration', {
                    setValueAs: (v) => (v === '' ? '' : parseInt(v, 10)),
                  })}
                  placeholder="예: 180"
                  error={errors.estimated_duration?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 담당자 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">담당자</h3>
            <p className="text-sm text-gray-400">선택 사항입니다</p>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                담당자
              </label>
              <Select {...register('assignee_id')} error={errors.assignee_id?.message}>
                <option value="">담당자를 선택하세요</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 버튼 */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : 'RFP 등록'}
          </Button>
        </div>
      </div>
    </form>
  )
}
