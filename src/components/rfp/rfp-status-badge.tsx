/**
 * RFP Status Badge
 */

import { Badge } from '@/components/ui/badge'
import type { Database } from '@/lib/supabase'

type RFPStatus = Database['public']['Tables']['rfps']['Row']['status']

interface RfpStatusBadgeProps {
  status: RFPStatus
}

const statusConfig = {
  received: { label: '접수', variant: 'info' as const },
  analyzing: { label: '분석 중', variant: 'warning' as const },
  analyzed: { label: '분석 완료', variant: 'success' as const },
  rejected: { label: '거절', variant: 'danger' as const },
}

export function RfpStatusBadge({ status }: RfpStatusBadgeProps) {
  const config = statusConfig[status]
  
  return <Badge variant={config.variant}>{config.label}</Badge>
}
