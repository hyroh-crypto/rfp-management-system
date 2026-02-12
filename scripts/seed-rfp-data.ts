/**
 * Seed RFP Test Data
 *
 * 테스트용 샘플 데이터 생성
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedData() {
  console.log('🌱 시작: 테스트 데이터 생성...\n')

  try {
    // 1. 고객사 생성
    console.log('1️⃣  고객사 생성 중...')
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .insert([
        {
          name: '(주)테크노베이션',
          business_number: '123-45-67890',
          industry: 'IT 서비스',
          contact: {
            name: '김철수',
            email: 'kim@technovation.com',
            phone: '02-1234-5678',
            position: '부장',
          },
          address: '서울특별시 강남구 테헤란로 123',
          website: 'https://technovation.com',
          notes: '주요 고객사',
        },
        {
          name: '디지털솔루션(주)',
          business_number: '987-65-43210',
          industry: '소프트웨어 개발',
          contact: {
            name: '이영희',
            email: 'lee@digitalsolution.kr',
            phone: '031-5678-9012',
            position: '차장',
          },
          address: '경기도 성남시 분당구 판교로 456',
        },
      ])
      .select()

    if (clientError) throw clientError
    console.log(`   ✅ ${clients?.length || 0}개 고객사 생성 완료\n`)

    // 2. RFP 생성
    if (clients && clients.length > 0) {
      console.log('2️⃣  RFP 생성 중...')
      const { data: rfps, error: rfpError } = await supabase
        .from('rfps')
        .insert([
          {
            title: 'ERP 시스템 구축 제안요청',
            client_id: clients[0].id,
            received_date: '2026-02-10',
            due_date: '2026-03-10',
            estimated_budget: 50000000,
            estimated_duration: 90,
            description: '기업 전사 자원관리 시스템 구축을 위한 제안요청서입니다.',
            status: 'received',
          },
          {
            title: '모바일 앱 개발 프로젝트',
            client_id: clients[1].id,
            received_date: '2026-02-12',
            due_date: '2026-02-25',
            estimated_budget: 30000000,
            estimated_duration: 60,
            description: 'iOS/Android 크로스플랫폼 모바일 앱 개발',
            status: 'analyzing',
          },
        ])
        .select()

      if (rfpError) throw rfpError
      console.log(`   ✅ ${rfps?.length || 0}개 RFP 생성 완료\n`)

      // 3. 요구사항 생성
      if (rfps && rfps.length > 0) {
        console.log('3️⃣  요구사항 생성 중...')
        const { data: requirements, error: reqError } = await supabase
          .from('requirements')
          .insert([
            {
              rfp_id: rfps[0].id,
              category: 'functional',
              priority: 'must',
              title: '사용자 인증 시스템',
              description: '이메일/비밀번호 기반 로그인 및 권한 관리',
              complexity: 'medium',
              estimated_hours: 40,
              order: 0,
            },
            {
              rfp_id: rfps[0].id,
              category: 'functional',
              priority: 'should',
              title: '재고 관리 기능',
              description: '실시간 재고 현황 조회 및 관리',
              complexity: 'high',
              estimated_hours: 80,
              order: 1,
            },
            {
              rfp_id: rfps[1].id,
              category: 'technical',
              priority: 'must',
              title: 'React Native 기반 개발',
              description: 'iOS/Android 동시 지원',
              complexity: 'medium',
              estimated_hours: 120,
              order: 0,
            },
          ])
          .select()

        if (reqError) throw reqError
        console.log(`   ✅ ${requirements?.length || 0}개 요구사항 생성 완료\n`)
      }
    }

    console.log('🎉 테스트 데이터 생성 완료!')
    console.log('\n📊 생성된 데이터:')
    console.log(`   - 고객사: ${clients?.length || 0}개`)
    console.log(`   - RFP: 2개`)
    console.log(`   - 요구사항: 3개\n`)

  } catch (error: any) {
    console.error('❌ 데이터 생성 실패:', error.message)
    process.exit(1)
  }
}

seedData()
