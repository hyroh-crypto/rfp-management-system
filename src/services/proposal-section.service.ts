/**
 * ProposalSection Service
 *
 * 제안서 섹션 관련 비즈니스 로직
 */

import { BaseService } from './base.service'
import type { Database } from '@/lib/supabase'

type ProposalSection = Database['public']['Tables']['proposal_sections']['Row']

export class ProposalSectionService extends BaseService<'proposal_sections'> {
  constructor() {
    super({ tableName: 'proposal_sections' })
  }

  /**
   * 제안서별 섹션 목록 조회
   */
  async listByProposal(proposalId: string) {
    return this.listBy({ proposal_id: proposalId }, { orderBy: 'order', ascending: true })
  }

  /**
   * 섹션 타입별 조회
   */
  async getByType(proposalId: string, type: ProposalSection['type']): Promise<ProposalSection | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('type', type)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data
  }

  /**
   * AI 생성 섹션 목록
   */
  async listAIGenerated(proposalId: string) {
    return this.listBy({ proposal_id: proposalId, is_ai_generated: true }, { orderBy: 'order', ascending: true })
  }

  /**
   * 섹션 승인
   */
  async approve(id: string) {
    return this.update(id, { status: 'approved' })
  }

  /**
   * 섹션 순서 변경
   */
  async reorder(id: string, newOrder: number) {
    return this.update(id, { order: newOrder })
  }
}

export const proposalSectionService = new ProposalSectionService()
