/**
 * Proposal Service
 *
 * 제안서 관련 비즈니스 로직
 */

import { BaseService } from './base.service'
import type { Database } from '@/lib/supabase'

type Proposal = Database['public']['Tables']['proposals']['Row']

export class ProposalService extends BaseService<'proposals'> {
  constructor() {
    super({ tableName: 'proposals' })
  }

  /**
   * RFP ID로 제안서 조회 (1:1 관계)
   */
  async getByRFP(rfpId: string): Promise<Proposal | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('rfp_id', rfpId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data
  }

  /**
   * 상태별 제안서 목록
   */
  async listByStatus(status: Proposal['status']) {
    return this.listBy({ status }, { orderBy: 'updated_at', ascending: false })
  }

  /**
   * 담당자별 제안서 목록
   */
  async listByAssignee(assigneeId: string) {
    return this.listBy({ assignee_id: assigneeId }, { orderBy: 'updated_at', ascending: false })
  }

  /**
   * 제안서 상태 업데이트
   */
  async updateStatus(id: string, status: Proposal['status']) {
    const updates: Partial<Database['public']['Tables']['proposals']['Update']> = { status }

    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString()
    } else if (status === 'won' || status === 'lost') {
      updates.result_date = new Date().toISOString()
    }

    return this.update(id, updates)
  }

  /**
   * 검토자 추가
   */
  async addReviewer(id: string, reviewerId: string) {
    const proposal = await this.getById(id)
    const reviewerIds = [...(proposal.reviewer_ids || []), reviewerId]

    return this.update(id, { reviewer_ids: reviewerIds })
  }

  /**
   * 제안서 제출
   */
  async submit(id: string) {
    return this.updateStatus(id, 'delivered')
  }
}

export const proposalService = new ProposalService()
