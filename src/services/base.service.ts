/**
 * Base Service
 *
 * 모든 서비스의 공통 CRUD 로직을 제공하는 베이스 클래스
 * Generic 타입을 활용하여 타입 안전성 보장
 */

import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

export interface BaseServiceConfig<T extends TableName> {
  tableName: T
}

export interface ListOptions {
  limit?: number
  offset?: number
  orderBy?: string
  ascending?: boolean
}

export interface FilterOptions {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * BaseService 클래스
 *
 * @example
 * ```ts
 * class UserService extends BaseService<'users'> {
 *   constructor() {
 *     super({ tableName: 'users' })
 *   }
 * }
 * ```
 */
export class BaseService<T extends TableName> {
  protected tableName: T
  protected table: any

  constructor(config: BaseServiceConfig<T>) {
    this.tableName = config.tableName
    this.table = supabase.from(this.tableName)
  }

  /**
   * 전체 목록 조회
   */
  async list(options: ListOptions = {}) {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'created_at',
      ascending = false,
    } = options

    const query = this.table
      .select('*')
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Tables[T]['Row'][],
      count: count || 0,
      hasMore: count ? count > offset + limit : false,
    }
  }

  /**
   * 필터링된 목록 조회
   */
  async listBy(filters: FilterOptions, options: ListOptions = {}) {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'created_at',
      ascending = false,
    } = options

    let query = this.table.select('*', { count: 'exact' })

    // 필터 적용
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    query = query
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Tables[T]['Row'][],
      count: count || 0,
      hasMore: count ? count > offset + limit : false,
    }
  }

  /**
   * ID로 단일 항목 조회
   */
  async getById(id: string) {
    const { data, error } = await this.table
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data as Tables[T]['Row']
  }

  /**
   * 새 항목 생성
   */
  async create(input: Tables[T]['Insert']) {
    const { data, error } = await this.table
      .insert(input)
      .select()
      .single()

    if (error) throw error

    return data as Tables[T]['Row']
  }

  /**
   * 여러 항목 일괄 생성
   */
  async createMany(inputs: Tables[T]['Insert'][]) {
    const { data, error } = await this.table
      .insert(inputs)
      .select()

    if (error) throw error

    return data as Tables[T]['Row'][]
  }

  /**
   * 항목 수정
   */
  async update(id: string, input: Tables[T]['Update']) {
    const { data, error } = await this.table
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return data as Tables[T]['Row']
  }

  /**
   * 항목 삭제
   */
  async delete(id: string) {
    const { error } = await this.table
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  }

  /**
   * 개수 조회
   */
  async count(filters?: FilterOptions) {
    let query = this.table.select('*', { count: 'exact', head: true })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    const { count, error } = await query

    if (error) throw error

    return count || 0
  }

  /**
   * 존재 여부 확인
   */
  async exists(id: string) {
    const { data, error } = await this.table
      .select('id')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return !!data
  }
}
