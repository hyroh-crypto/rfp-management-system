-- ============================================================================
-- RFP Management System - Supabase Migration Script
-- ============================================================================
-- 이 스크립트는 8개의 테이블을 생성합니다.
-- Supabase SQL Editor에서 실행하세요.
-- ============================================================================

-- UUID Extension 활성화 (Supabase는 기본적으로 활성화되어 있음)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. users 테이블 (사용자 테이블 - 제안서 담당자 및 검토자)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'writer', 'reviewer')),
  department TEXT,
  position TEXT,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 코멘트 추가
COMMENT ON TABLE users IS '사용자 테이블 - 제안서 담당자 및 검토자';
COMMENT ON COLUMN users.email IS '이메일 (로그인 ID)';
COMMENT ON COLUMN users.role IS '사용자 역할: admin, manager, writer, reviewer';
COMMENT ON COLUMN users.permissions IS '권한 목록 (JSON 배열)';

-- ============================================================================
-- 2. clients 테이블 (고객사 테이블)
-- ============================================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_number TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  contact JSONB NOT NULL,
  address TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_clients_business_number ON clients(business_number);
CREATE INDEX idx_clients_name ON clients(name);

-- 코멘트 추가
COMMENT ON TABLE clients IS '고객사 테이블';
COMMENT ON COLUMN clients.business_number IS '사업자등록번호';
COMMENT ON COLUMN clients.contact IS '담당자 정보 (name, email, phone, position)';

-- ============================================================================
-- 3. rfps 테이블 (제안요청서 테이블)
-- ============================================================================
CREATE TABLE rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  received_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  estimated_budget INTEGER,
  estimated_duration INTEGER,
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'analyzing', 'analyzed', 'rejected')),
  ai_analysis JSONB,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_rfps_client_id ON rfps(client_id);
CREATE INDEX idx_rfps_assignee_id ON rfps(assignee_id);
CREATE INDEX idx_rfps_status ON rfps(status);
CREATE INDEX idx_rfps_due_date ON rfps(due_date);

-- 코멘트 추가
COMMENT ON TABLE rfps IS '제안요청서(RFP) 테이블';
COMMENT ON COLUMN rfps.status IS '진행 상태: received, analyzing, analyzed, rejected';
COMMENT ON COLUMN rfps.ai_analysis IS 'AI 분석 결과 (JSON 객체)';

-- ============================================================================
-- 4. requirements 테이블 (요구사항 테이블)
-- ============================================================================
CREATE TABLE requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('functional', 'non-functional', 'technical', 'business')),
  priority TEXT NOT NULL CHECK (priority IN ('must', 'should', 'could', 'wont')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  acceptance_criteria TEXT,
  complexity TEXT NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  estimated_hours INTEGER,
  suggested_solution TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_requirements_rfp_id ON requirements(rfp_id);
CREATE INDEX idx_requirements_priority ON requirements(priority);
CREATE INDEX idx_requirements_order ON requirements("order");

-- 코멘트 추가
COMMENT ON TABLE requirements IS '요구사항 테이블 - RFP 요구사항 분석 결과';
COMMENT ON COLUMN requirements.category IS '요구사항 분류: functional, non-functional, technical, business';
COMMENT ON COLUMN requirements.priority IS '우선순위 (MoSCoW): must, should, could, wont';
COMMENT ON COLUMN requirements.complexity IS '복잡도: low, medium, high';

-- ============================================================================
-- 5. proposals 테이블 (제안서 테이블)
-- ============================================================================
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL UNIQUE REFERENCES rfps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'drafting' CHECK (status IN ('drafting', 'reviewing', 'approved', 'delivered', 'won', 'lost')),
  assignee_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reviewer_ids JSONB DEFAULT '[]'::jsonb,
  executive_summary TEXT,
  total_price INTEGER,
  estimated_duration INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  team JSONB DEFAULT '[]'::jsonb,
  delivered_at TIMESTAMPTZ,
  result_date TIMESTAMPTZ,
  win_probability INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_proposals_rfp_id ON proposals(rfp_id);
CREATE INDEX idx_proposals_assignee_id ON proposals(assignee_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- 코멘트 추가
COMMENT ON TABLE proposals IS '제안서 테이블';
COMMENT ON COLUMN proposals.rfp_id IS 'RFP ID (1:1 관계, UNIQUE)';
COMMENT ON COLUMN proposals.status IS '제안서 상태: drafting, reviewing, approved, delivered, won, lost';
COMMENT ON COLUMN proposals.reviewer_ids IS '검토자 ID 목록 (JSON 배열)';
COMMENT ON COLUMN proposals.team IS '팀 구성원 목록 (JSON 배열)';
COMMENT ON COLUMN proposals.win_probability IS '수주 확률 (0-100)';

-- ============================================================================
-- 6. proposal_sections 테이블 (제안서 섹션 테이블)
-- ============================================================================
CREATE TABLE proposal_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('executive-summary', 'company-intro', 'requirement-analysis', 'technical-approach', 'ui-prototype', 'timeline', 'pricing', 'team', 'appendix')),
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL DEFAULT '',
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  ai_prompt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_proposal_sections_proposal_id ON proposal_sections(proposal_id);
CREATE INDEX idx_proposal_sections_type ON proposal_sections(type);
CREATE INDEX idx_proposal_sections_order ON proposal_sections("order");

-- 코멘트 추가
COMMENT ON TABLE proposal_sections IS '제안서 섹션 테이블 - 제안서의 각 섹션별 내용';
COMMENT ON COLUMN proposal_sections.type IS '섹션 타입: executive-summary, company-intro, requirement-analysis, technical-approach, ui-prototype, timeline, pricing, team, appendix';
COMMENT ON COLUMN proposal_sections.content IS '마크다운 형식 콘텐츠';
COMMENT ON COLUMN proposal_sections.status IS '섹션 상태: draft, review, approved';

-- ============================================================================
-- 7. ui_prototypes 테이블 (UI 프로토타입 테이블)
-- ============================================================================
CREATE TABLE ui_prototypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wireframe', 'mockup', 'interactive')),
  "order" INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  figma_url TEXT,
  html_code TEXT,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  ai_prompt TEXT,
  generated_from TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('generating', 'draft', 'reviewing', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_ui_prototypes_proposal_id ON ui_prototypes(proposal_id);
CREATE INDEX idx_ui_prototypes_type ON ui_prototypes(type);
CREATE INDEX idx_ui_prototypes_status ON ui_prototypes(status);

-- 코멘트 추가
COMMENT ON TABLE ui_prototypes IS 'UI 프로토타입 테이블 - 제안서에 포함된 UI 설계';
COMMENT ON COLUMN ui_prototypes.type IS '프로토타입 타입: wireframe, mockup, interactive';
COMMENT ON COLUMN ui_prototypes.html_code IS 'HTML 코드 (interactive 타입일 때)';
COMMENT ON COLUMN ui_prototypes.status IS '프로토타입 상태: generating, draft, reviewing, approved';

-- ============================================================================
-- 8. comments 테이블 (코멘트/피드백 테이블)
-- ============================================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('proposal', 'ui-prototype', 'section')),
  target_id UUID NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'comment' CHECK (type IN ('comment', 'feedback', 'approval', 'rejection')),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- 코멘트 추가
COMMENT ON TABLE comments IS '코멘트/피드백 테이블 - 제안서, 프로토타입, 섹션에 대한 코멘트';
COMMENT ON COLUMN comments.target_type IS '코멘트 대상 타입: proposal, ui-prototype, section';
COMMENT ON COLUMN comments.type IS '코멘트 타입: comment, feedback, approval, rejection';
COMMENT ON COLUMN comments.parent_id IS '답글인 경우 부모 코멘트 ID (self-reference)';

-- ============================================================================
-- updated_at 자동 업데이트 트리거 함수
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfps_updated_at BEFORE UPDATE ON rfps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposal_sections_updated_at BEFORE UPDATE ON proposal_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ui_prototypes_updated_at BEFORE UPDATE ON ui_prototypes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 마이그레이션 완료!
-- ============================================================================
-- 다음 단계:
-- 1. Supabase 콘솔 → SQL Editor에서 이 스크립트 실행
-- 2. Table Editor에서 8개 테이블 생성 확인
-- 3. Row Level Security (RLS) 정책 설정 (선택사항)
-- 4. Next.js 프로젝트에서 Supabase Client 설정
-- ============================================================================
