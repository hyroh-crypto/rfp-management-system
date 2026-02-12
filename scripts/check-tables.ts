import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('🔍 테이블 확인 중...\n')

  // Clients 테이블 확인
  console.log('1. Clients 테이블:')
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .limit(1)

  if (clientError) {
    console.log('   ❌ 에러:', clientError.message)
  } else {
    console.log('   ✅ 테이블 존재')
    console.log('   컬럼:', clients && clients.length > 0 ? Object.keys(clients[0]).join(', ') : '데이터 없음')
  }

  // RFPs 테이블 확인
  console.log('\n2. RFPs 테이블:')
  const { data: rfps, error: rfpError } = await supabase
    .from('rfps')
    .select('*')
    .limit(1)

  if (rfpError) {
    console.log('   ❌ 에러:', rfpError.message)
  } else {
    console.log('   ✅ 테이블 존재')
    console.log('   컬럼:', rfps && rfps.length > 0 ? Object.keys(rfps[0]).join(', ') : '데이터 없음')
  }

  // Requirements 테이블 확인
  console.log('\n3. Requirements 테이블:')
  const { data: reqs, error: reqError } = await supabase
    .from('requirements')
    .select('*')
    .limit(1)

  if (reqError) {
    console.log('   ❌ 에러:', reqError.message)
  } else {
    console.log('   ✅ 테이블 존재')
    console.log('   컬럼:', reqs && reqs.length > 0 ? Object.keys(reqs[0]).join(', ') : '데이터 없음')
  }

  // Comments 테이블 확인
  console.log('\n4. Comments 테이블:')
  const { data: comments, error: commentError } = await supabase
    .from('comments')
    .select('*')
    .limit(1)

  if (commentError) {
    console.log('   ❌ 에러:', commentError.message)
  } else {
    console.log('   ✅ 테이블 존재')
    console.log('   컬럼:', comments && comments.length > 0 ? Object.keys(comments[0]).join(', ') : '데이터 없음')
  }
}

checkTables()
