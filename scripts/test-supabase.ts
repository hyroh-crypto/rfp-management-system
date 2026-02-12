/**
 * Supabase Connection Test
 *
 * 8개 테이블 연결 및 기본 쿼리 테스트
 */

import { supabase } from '../src/lib/supabase'

async function testConnection() {
  console.log('🧪 Supabase 연결 테스트 시작...\n')

  const tables = [
    'users',
    'clients',
    'rfps',
    'requirements',
    'proposals',
    'proposal_sections',
    'ui_prototypes',
    'comments',
  ]

  let successCount = 0
  let failCount = 0

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      console.log(`✅ ${table.padEnd(20)} - 연결 성공 (${count || 0}개 레코드)`)
      successCount++
    } catch (error: any) {
      console.error(`❌ ${table.padEnd(20)} - 연결 실패:`, error.message)
      failCount++
    }
  }

  console.log(`\n────────────────────────────────────────`)
  console.log(`📊 테스트 결과: ${successCount}/${tables.length} 성공`)
  
  if (failCount === 0) {
    console.log(`\n🎉 모든 테이블 연결 성공!`)
    console.log(`\nSupabase 프로젝트: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  } else {
    console.log(`\n⚠️ ${failCount}개 테이블 연결 실패`)
    process.exit(1)
  }
}

testConnection()
