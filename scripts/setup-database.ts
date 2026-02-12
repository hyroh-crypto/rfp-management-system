/**
 * Setup Database Script
 *
 * Supabase에 테이블과 RLS 정책 생성
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // SQL 파일 읽기
    const sqlPath = join(__dirname, 'create-rfp-tables.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    console.log('📄 SQL 파일 로드 완료')
    console.log(`📊 파일 크기: ${(sql.length / 1024).toFixed(2)} KB\n`)

    // SQL을 개별 명령문으로 분리 (세미콜론 기준)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`🔧 총 ${statements.length}개의 SQL 명령문 실행 중...\n`)

    // 각 명령문 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // 주석 라인 건너뛰기
      if (statement.startsWith('--') || statement.startsWith('COMMENT')) {
        continue
      }

      try {
        console.log(`[${i + 1}/${statements.length}] 실행 중...`)
        
        // Supabase에서는 RPC를 통해 SQL 실행
        // 하지만 anon key로는 DDL을 실행할 수 없으므로
        // 사용자에게 Supabase Dashboard에서 실행하도록 안내
        
      } catch (error: any) {
        console.error(`❌ 명령문 ${i + 1} 실행 실패:`, error.message)
      }
    }

    console.log('\n⚠️  주의: Supabase ANON KEY로는 DDL 명령을 실행할 수 없습니다.')
    console.log('📌 다음 방법으로 테이블을 생성하세요:\n')
    console.log('1. Supabase Dashboard 방문:')
    console.log(`   https://supabase.com/dashboard/project/tqkwnbcydlheutkbzeah/editor\n`)
    console.log('2. SQL Editor 열기')
    console.log('3. scripts/create-rfp-tables.sql 파일 내용 복사')
    console.log('4. SQL Editor에 붙여넣기 후 실행\n')
    
    console.log('또는 Supabase CLI 사용:')
    console.log('   npx supabase db push\n')

  } catch (error: any) {
    console.error('❌ 데이터베이스 설정 실패:', error.message)
    process.exit(1)
  }
}

// 연결 테스트
async function testConnection() {
  console.log('🔌 Supabase 연결 테스트 중...\n')
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('⚠️  users 테이블이 없거나 접근 권한이 없습니다.')
      console.log('   에러:', error.message, '\n')
    } else {
      console.log('✅ Supabase 연결 성공!\n')
    }
  } catch (error: any) {
    console.log('⚠️  연결 테스트 중 오류:', error.message, '\n')
  }
}

async function main() {
  await testConnection()
  await setupDatabase()
}

main()
