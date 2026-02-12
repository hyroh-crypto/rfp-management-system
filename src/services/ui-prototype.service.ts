/**
 * UIPrototype Service
 *
 * UI 프로토타입 관련 비즈니스 로직
 */

import { BaseService } from './base.service'
import type { Database } from '@/lib/supabase'

type UIPrototype = Database['public']['Tables']['ui_prototypes']['Row']

export class UIPrototypeService extends BaseService<'ui_prototypes'> {
  constructor() {
    super({ tableName: 'ui_prototypes' })
  }

  /**
   * 제안서별 프로토타입 목록
   */
  async listByProposal(proposalId: string) {
    return this.listBy({ proposal_id: proposalId }, { orderBy: 'order', ascending: true })
  }

  /**
   * 타입별 프로토타입 조회
   */
  async listByType(proposalId: string, type: UIPrototype['type']) {
    return this.listBy({ proposal_id: proposalId, type }, { orderBy: 'order', ascending: true })
  }

  /**
   * AI 생성 프로토타입 목록
   */
  async listAIGenerated(proposalId: string) {
    return this.listBy({ proposal_id: proposalId, is_ai_generated: true }, { orderBy: 'order', ascending: true })
  }

  /**
   * 프로토타입 승인
   */
  async approve(id: string) {
    return this.update(id, { status: 'approved' })
  }

  /**
   * 프로토타입 순서 변경
   */
  async reorder(id: string, newOrder: number) {
    return this.update(id, { order: newOrder })
  }
}

export const uiPrototypeService = new UIPrototypeService()
