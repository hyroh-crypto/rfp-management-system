/**
 * User Service
 *
 * 사용자 관련 비즈니스 로직
 */

import { BaseService } from './base.service'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

export class UserService extends BaseService<'users'> {
  constructor() {
    super({ tableName: 'users' })
  }

  /**
   * 이메일로 사용자 조회
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data
  }

  /**
   * 역할별 사용자 목록 조회
   */
  async listByRole(role: User['role']) {
    return this.listBy({ role }, { orderBy: 'name', ascending: true })
  }

  /**
   * 활성 사용자 목록 조회
   */
  async listActive() {
    return this.listBy({ is_active: true }, { orderBy: 'name', ascending: true })
  }

  /**
   * 사용자 비활성화
   */
  async deactivate(id: string): Promise<User> {
    return this.update(id, { is_active: false })
  }

  /**
   * 사용자 활성화
   */
  async activate(id: string): Promise<User> {
    return this.update(id, { is_active: true })
  }

  /**
   * 마지막 로그인 시각 업데이트
   */
  async updateLastLogin(id: string): Promise<User> {
    return this.update(id, { last_login_at: new Date().toISOString() })
  }
}

// 싱글톤 인스턴스 export
export const userService = new UserService()
