/**
 * Sample Data Seeding Script
 * Supabase에 테스트용 샘플 데이터를 추가합니다.
 */

import { supabase } from '../src/lib/supabase'

async function seedSampleData() {
  console.log('🌱 Starting sample data seeding...\n')

  try {
    // 0. 기존 데이터 삭제 (역순으로 삭제 - FK 제약 조건 때문)
    console.log('🗑️  Clearing existing data...')
    await supabase.from('requirements').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('rfps').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✅ Cleared existing data\n')

    // 1. Users 생성
    console.log('👤 Creating users...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@rfp-system.com',
          name: '김관리',
          role: 'admin',
          permissions: ['all'],
          is_active: true,
        },
        {
          email: 'manager@rfp-system.com',
          name: '박매니저',
          role: 'manager',
          permissions: ['manage_rfps', 'manage_proposals'],
          is_active: true,
        },
        {
          email: 'writer@rfp-system.com',
          name: '이작성',
          role: 'writer',
          permissions: ['write_proposals'],
          is_active: true,
        },
      ])
      .select()

    if (usersError) throw usersError
    console.log(`✅ Created ${users?.length} users\n`)

    // 2. Clients 생성
    console.log('🏢 Creating clients...')
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert([
        {
          name: '삼성전자',
          business_number: '124-81-00998',
          industry: '전자제품 제조',
          contact: {
            name: '김구매',
            email: 'procurement@samsung.com',
            phone: '02-1234-5678',
            position: '구매팀 부장',
          },
          address: '서울시 서초구 서초대로 74길 11',
          website: 'https://www.samsung.com',
        },
        {
          name: 'LG전자',
          business_number: '107-86-14071',
          industry: '전자제품 제조',
          contact: {
            name: '박조달',
            email: 'rfp@lge.com',
            phone: '02-2222-3333',
            position: '조달팀 과장',
          },
          address: '서울시 영등포구 여의대로 128',
          website: 'https://www.lge.com',
        },
        {
          name: '네이버',
          business_number: '220-81-62517',
          industry: 'IT 서비스',
          contact: {
            name: '최협력',
            email: 'partners@naver.com',
            phone: '031-7777-8888',
            position: '파트너십팀 팀장',
          },
          address: '경기도 성남시 분당구 정자일로 95',
          website: 'https://www.naver.com',
        },
        {
          name: '카카오',
          business_number: '120-88-02649',
          industry: 'IT 서비스',
          contact: {
            name: '정사업',
            email: 'business@kakao.com',
            phone: '031-5555-6666',
            position: '사업개발팀 차장',
          },
          address: '경기도 성남시 분당구 판교역로 235',
          website: 'https://www.kakaocorp.com',
        },
      ])
      .select()

    if (clientsError) throw clientsError
    console.log(`✅ Created ${clients?.length} clients\n`)

    // 3. RFPs 생성
    console.log('📄 Creating RFPs...')
    const today = new Date()
    const getDateOffset = (days: number) => {
      const date = new Date(today)
      date.setDate(date.getDate() + days)
      return date.toISOString()
    }

    const { data: rfps, error: rfpsError } = await supabase
      .from('rfps')
      .insert([
        {
          title: '차세대 스마트 홈 IoT 플랫폼 개발',
          description: '가전제품을 통합 제어하는 스마트 홈 IoT 플랫폼 구축 프로젝트입니다. AI 기반 사용자 패턴 분석 및 자동화 기능이 필요합니다.',
          client_id: clients![0].id,
          received_date: getDateOffset(-5),
          due_date: getDateOffset(25),
          estimated_budget: 500000000,
          estimated_duration: 180,
          status: 'received',
          assignee_id: users![1].id,
        },
        {
          title: 'AI 챗봇 고객센터 시스템 구축',
          description: 'LLM 기반 고객 상담 챗봇 시스템 개발. 기존 상담 데이터 학습 및 다국어 지원이 필요합니다.',
          client_id: clients![1].id,
          received_date: getDateOffset(-10),
          due_date: getDateOffset(20),
          estimated_budget: 300000000,
          estimated_duration: 120,
          status: 'analyzing',
          assignee_id: users![1].id,
          ai_analysis: {
            complexity: 'high',
            risk_level: 'medium',
            keywords: ['AI', 'NLP', 'Customer Service', 'Multilingual'],
            estimated_hours: 2400,
            recommended_team_size: 8,
          },
        },
        {
          title: '모바일 커머스 앱 리뉴얼',
          description: '기존 쇼핑 앱의 UI/UX 전면 개편 및 성능 최적화 프로젝트. React Native 기반 크로스 플랫폼 개발.',
          client_id: clients![2].id,
          received_date: getDateOffset(-15),
          due_date: getDateOffset(15),
          estimated_budget: 200000000,
          estimated_duration: 90,
          status: 'analyzed',
          assignee_id: users![2].id,
          ai_analysis: {
            complexity: 'medium',
            risk_level: 'low',
            keywords: ['Mobile', 'E-commerce', 'React Native', 'UI/UX'],
            estimated_hours: 1800,
            recommended_team_size: 5,
          },
        },
        {
          title: '블록체인 기반 디지털 자산 관리 시스템',
          description: 'NFT 및 가상자산 통합 관리 플랫폼 구축. 지갑 연동 및 스마트 컨트랙트 개발 포함.',
          client_id: clients![3].id,
          received_date: getDateOffset(-3),
          due_date: getDateOffset(5),
          estimated_budget: 800000000,
          estimated_duration: 240,
          status: 'received',
          assignee_id: users![0].id,
        },
        {
          title: '사내 ERP 시스템 클라우드 전환',
          description: '온프레미스 ERP를 AWS 클라우드 환경으로 마이그레이션. 데이터 무중단 이전 및 보안 강화 필요.',
          client_id: clients![0].id,
          received_date: getDateOffset(-20),
          due_date: getDateOffset(10),
          estimated_budget: 450000000,
          estimated_duration: 150,
          status: 'analyzing',
          assignee_id: users![1].id,
          ai_analysis: {
            complexity: 'high',
            risk_level: 'high',
            keywords: ['Cloud Migration', 'AWS', 'ERP', 'Security'],
            estimated_hours: 3000,
            recommended_team_size: 10,
          },
        },
        {
          title: '실시간 스트리밍 플랫폼 개발',
          description: '라이브 커머스 및 교육 콘텐츠용 실시간 스트리밍 플랫폼. WebRTC 기반 저지연 스트리밍 구현.',
          client_id: clients![2].id,
          received_date: getDateOffset(-7),
          due_date: getDateOffset(30),
          estimated_budget: 600000000,
          estimated_duration: 200,
          status: 'received',
          assignee_id: users![1].id,
        },
        {
          title: '헬스케어 데이터 분석 대시보드',
          description: '병원 및 의료기관의 환자 데이터를 실시간으로 분석하여 시각화하는 대시보드 개발.',
          client_id: clients![1].id,
          received_date: getDateOffset(-30),
          due_date: getDateOffset(-2),
          estimated_budget: 150000000,
          estimated_duration: 60,
          status: 'rejected',
          assignee_id: users![0].id,
        },
      ])
      .select()

    if (rfpsError) throw rfpsError
    console.log(`✅ Created ${rfps?.length} RFPs\n`)

    // 4. Requirements 생성 (일부 RFP에 대해서만)
    console.log('📋 Creating requirements...')
    const { data: requirements, error: requirementsError } = await supabase
      .from('requirements')
      .insert([
        {
          rfp_id: rfps![0].id,
          category: 'functional',
          title: '가전제품 자동 제어',
          description: '사용자의 생활 패턴을 학습하여 가전제품을 자동으로 제어하는 기능',
          priority: 'must',
          complexity: 'high',
        },
        {
          rfp_id: rfps![0].id,
          category: 'functional',
          title: '모바일 앱 제공',
          description: 'iOS/Android 네이티브 앱을 통한 원격 제어 기능',
          priority: 'must',
          complexity: 'high',
        },
        {
          rfp_id: rfps![0].id,
          category: 'technical',
          title: 'AWS IoT Core 연동',
          description: 'AWS IoT Core를 활용한 디바이스 관리 및 데이터 수집',
          priority: 'should',
          complexity: 'medium',
        },
        {
          rfp_id: rfps![1].id,
          category: 'functional',
          title: '자연어 처리',
          description: '고객 문의를 자연어로 이해하고 적절한 답변 제공',
          priority: 'must',
          complexity: 'high',
        },
        {
          rfp_id: rfps![1].id,
          category: 'non-functional',
          title: '다국어 지원',
          description: '한국어, 영어, 중국어, 일본어 4개 언어 지원',
          priority: 'should',
          complexity: 'medium',
        },
        {
          rfp_id: rfps![2].id,
          category: 'functional',
          title: '직관적인 상품 검색',
          description: '카테고리, 필터, 정렬 기능을 갖춘 고급 검색 UI',
          priority: 'must',
          complexity: 'medium',
        },
      ])
      .select()

    if (requirementsError) throw requirementsError
    console.log(`✅ Created ${requirements?.length} requirements\n`)

    // 완료 메시지
    console.log('─────────────────────────────────────')
    console.log('✨ Sample data seeding completed!')
    console.log('─────────────────────────────────────')
    console.log(`👤 Users: ${users?.length}`)
    console.log(`🏢 Clients: ${clients?.length}`)
    console.log(`📄 RFPs: ${rfps?.length}`)
    console.log(`📋 Requirements: ${requirements?.length}`)
    console.log('─────────────────────────────────────')
    console.log('\n🌐 Visit http://localhost:3000/rfps to see the data!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

// 실행
seedSampleData()
