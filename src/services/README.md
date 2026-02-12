# API Services Layer

## 개요

Component → Service → Supabase Client 아키텍처를 따르는 서비스 레이어입니다.

## 구조

```
src/services/
├── base.service.ts              # 베이스 서비스 (공통 CRUD)
├── user.service.ts              # 사용자 서비스
├── client.service.ts            # 고객사 서비스
├── rfp.service.ts               # RFP 서비스
├── requirement.service.ts       # 요구사항 서비스
├── proposal.service.ts          # 제안서 서비스
├── proposal-section.service.ts  # 제안서 섹션 서비스
├── ui-prototype.service.ts      # UI 프로토타입 서비스
├── comment.service.ts           # 코멘트 서비스
└── index.ts                     # Export 통합
```

## 사용 방법

### 기본 사용

```typescript
import { rfpService } from '@/services'

// 목록 조회
const { data, count, hasMore } = await rfpService.list({
  limit: 20,
  offset: 0,
  orderBy: 'created_at',
  ascending: false,
})

// ID로 조회
const rfp = await rfpService.getById('uuid')

// 생성
const newRFP = await rfpService.create({
  title: 'New RFP',
  client_id: 'client-uuid',
  received_date: new Date().toISOString(),
  due_date: new Date().toISOString(),
  description: 'Description',
  status: 'received',
})

// 수정
const updated = await rfpService.update('uuid', {
  status: 'analyzing',
})

// 삭제
await rfpService.delete('uuid')
```

### 필터링

```typescript
// 상태별 조회
const analyzingRFPs = await rfpService.listByStatus('analyzing')

// 고객사별 조회
const clientRFPs = await rfpService.listByClient('client-uuid')

// 담당자별 조회
const myRFPs = await rfpService.listByAssignee('user-uuid')
```

### 커스텀 메서드

```typescript
// 마감일 임박 RFP (7일 이내)
const upcomingRFPs = await rfpService.listUpcoming()

// AI 분석 결과 저장
await rfpService.saveAnalysis('rfp-uuid', {
  summary: 'Analysis summary',
  keyRequirements: ['req1', 'req2'],
  riskLevel: 'medium',
})

// 제안서 제출
await proposalService.submit('proposal-uuid')

// 검토자 추가
await proposalService.addReviewer('proposal-uuid', 'reviewer-uuid')

// 코멘트 해결 처리
await commentService.resolve('comment-uuid')
```

## React Query 통합 예제

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rfpService } from '@/services'

export function useRFPList() {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: () => rfpService.list(),
  })
}

export function useRFP(id: string) {
  return useQuery({
    queryKey: ['rfps', id],
    queryFn: () => rfpService.getById(id),
    enabled: !!id,
  })
}

export function useCreateRFP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rfpService.create.bind(rfpService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] })
    },
  })
}
```

## 타입 안전성

모든 서비스는 Supabase Database 타입과 완전히 통합되어 있습니다:

```typescript
// 자동 타입 추론
const rfp = await rfpService.getById('uuid')
rfp.status // 'received' | 'analyzing' | 'analyzed' | 'rejected'

// Insert 타입 자동 검증
await rfpService.create({
  // TypeScript가 필수 필드와 타입을 검증
})
```

## 에러 처리

```typescript
try {
  const rfp = await rfpService.getById('uuid')
} catch (error) {
  // Supabase 에러 처리
  console.error('RFP 조회 실패:', error)
}
```

## 베스트 프랙티스

1. **컴포넌트에서 직접 Supabase 클라이언트 사용 금지**
   - ❌ `supabase.from('rfps').select()`
   - ✅ `rfpService.list()`

2. **React Query와 함께 사용**
   - 서버 상태 관리는 TanStack Query
   - 클라이언트 상태 관리는 Zustand

3. **에러 핸들링**
   - 서비스 레이어에서 throw
   - React Query의 error 상태로 처리

4. **타입 안전성 활용**
   - Database 타입을 최대한 활용
   - 런타임 에러 방지
