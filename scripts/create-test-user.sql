-- 테스트 사용자 생성 SQL
-- Supabase SQL Editor에서 실행

-- 1. auth.users 테이블의 user id 확인 (Supabase Auth에서 생성한 사용자)
-- 예: 'abc123-...'

-- 2. public.users 테이블에 사용자 정보 추가
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  department,
  position,
  permissions,
  is_active
) VALUES (
  'YOUR_AUTH_USER_ID_HERE',  -- Supabase Auth에서 생성한 user id로 교체
  'test@example.com',
  '테스트 관리자',
  'admin',
  '기획팀',
  '팀장',
  ARRAY[
    'view_client', 'create_client', 'edit_client', 'delete_client',
    'view_rfp', 'create_rfp', 'edit_rfp', 'delete_rfp',
    'view_requirement', 'create_requirement', 'edit_requirement', 'delete_requirement',
    'view_proposal', 'create_proposal', 'edit_proposal', 'delete_proposal',
    'view_comment', 'create_comment', 'edit_comment', 'delete_comment',
    'manage_users'
  ],
  true
);

-- 3. 확인
SELECT * FROM public.users WHERE email = 'test@example.com';
