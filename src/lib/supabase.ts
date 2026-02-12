/**
 * Supabase Client
 *
 * Next.js 15 App Router와 함께 사용하는 Supabase 클라이언트
 * - Client Components: createBrowserClient 사용
 * - Server Components: createServerClient 사용 (쿠키 기반 인증)
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 빌드 타임에는 빈 문자열로 초기화 (런타임에만 실제 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

/**
 * 브라우저용 Supabase 클라이언트
 * Client Components에서 사용
 */
export function createClient() {
  // 런타임에 환경 변수 체크
  if (typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }
    return createSupabaseClient<Database>(url, key)
  }
  // 빌드 타임에는 더미 클라이언트 반환
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Supabase 클라이언트 싱글톤 (클라이언트 컴포넌트용)
 *
 * @example
 * ```tsx
 * import { supabase } from '@/lib/supabase'
 *
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 * ```
 */
export const supabase = createClient()

/**
 * 타입 헬퍼: Database 타입 추론
 *
 * Supabase CLI로 타입 생성 후 사용:
 * ```bash
 * npx supabase gen types typescript --project-id tqkwnbcydlheutkbzeah > src/types/database.types.ts
 * ```
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'writer' | 'reviewer'
          department: string | null
          position: string | null
          permissions: string[]
          avatar: string | null
          phone: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      clients: {
        Row: {
          id: string
          name: string
          business_number: string
          industry: string
          contact_name: string
          contact_email: string
          contact_phone: string
          contact_position: string
          address: string | null
          website: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      rfps: {
        Row: {
          id: string
          title: string
          client_id: string
          received_date: string
          due_date: string
          estimated_budget: number | null
          estimated_duration: number | null
          description: string
          attachments: Array<{
            id: string
            fileName: string
            fileSize: number
            fileType: string
            url: string
            uploadedAt: string
          }> | null
          status: 'received' | 'analyzing' | 'analyzed' | 'rejected'
          ai_analysis: {
            summary: string
            keyRequirements: string[]
            technicalStack: string[]
            riskLevel: 'low' | 'medium' | 'high'
            estimatedEffort: number
          } | null
          assignee_id: string | null
          analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['rfps']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['rfps']['Insert']>
      }
      requirements: {
        Row: {
          id: string
          rfp_id: string
          category: 'functional' | 'non-functional' | 'technical' | 'business'
          priority: 'must' | 'should' | 'could' | 'wont'
          title: string
          description: string
          acceptance_criteria: string | null
          complexity: 'low' | 'medium' | 'high'
          estimated_hours: number | null
          suggested_solution: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['requirements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['requirements']['Insert']>
      }
      proposals: {
        Row: {
          id: string
          rfp_id: string
          title: string
          version: string
          status: 'drafting' | 'reviewing' | 'approved' | 'delivered' | 'won' | 'lost'
          assignee_id: string
          reviewer_ids: string[]
          executive_summary: string | null
          total_price: number | null
          estimated_duration: number | null
          start_date: string | null
          end_date: string | null
          team: Array<{
            name: string
            role: string
            allocation: number
            duration: number
          }> | null
          delivered_at: string | null
          result_date: string | null
          win_probability: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['proposals']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['proposals']['Insert']>
      }
      proposal_sections: {
        Row: {
          id: string
          proposal_id: string
          type: 'executive-summary' | 'company-intro' | 'requirement-analysis' | 'technical-approach' | 'ui-prototype' | 'timeline' | 'pricing' | 'team' | 'appendix'
          title: string
          order: number
          content: string
          is_ai_generated: boolean
          ai_prompt: string | null
          status: 'draft' | 'review' | 'approved'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['proposal_sections']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['proposal_sections']['Insert']>
      }
      ui_prototypes: {
        Row: {
          id: string
          proposal_id: string
          name: string
          type: 'wireframe' | 'mockup' | 'interactive'
          order: number
          description: string | null
          image_url: string | null
          figma_url: string | null
          html_code: string | null
          is_ai_generated: boolean
          ai_prompt: string | null
          generated_from: string | null
          status: 'generating' | 'draft' | 'reviewing' | 'approved'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ui_prototypes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ui_prototypes']['Insert']>
      }
      comments: {
        Row: {
          id: string
          target_type: 'rfp' | 'requirement' | 'proposal'
          target_id: string
          content: string
          type: 'comment' | 'feedback' | 'approval' | 'rejection'
          author_id: string
          parent_id: string | null
          is_resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
    }
  }
}
