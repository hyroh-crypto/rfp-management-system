-- ============================================================================
-- RFP Management System - Test Data
-- ============================================================================
-- Supabase SQL Editor에서 실행하세요 (migration-fixed.sql 실행 후)
-- ============================================================================

-- 1. 테스트 고객사 생성
INSERT INTO clients (id, name, business_number, industry, contact_name, contact_email, contact_phone, contact_position, address, website, notes)
VALUES
  (gen_random_uuid(), '삼성전자', '123-45-67890', 'IT/전자', '김철수', 'kim@samsung.com', '02-1234-5678', '과장', '서울시 강남구', 'https://www.samsung.com', '우수 고객사'),
  (gen_random_uuid(), '네이버', '234-56-78901', 'IT/인터넷', '이영희', 'lee@naver.com', '02-2345-6789', '부장', '경기도 성남시', 'https://www.naver.com', 'VIP 고객'),
  (gen_random_uuid(), '카카오', '345-67-89012', 'IT/인터넷', '박민수', 'park@kakao.com', '02-3456-7890', '팀장', '경기도 판교', 'https://www.kakao.com', '신규 고객사')
ON CONFLICT (business_number) DO NOTHING;

-- 성공 메시지
SELECT '✅ 테스트 데이터 생성 완료!' AS message;
SELECT COUNT(*) AS "생성된 고객사 수" FROM clients;
