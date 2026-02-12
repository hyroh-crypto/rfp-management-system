-- RFP Core System Tables
-- Created: 2026-02-12
-- Tables: clients, rfps, requirements, comments

-- ============================================
-- 1. Clients Table (고객사)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  business_number VARCHAR(12) UNIQUE NOT NULL, -- 000-00-00000
  industry VARCHAR(100) NOT NULL,

  -- Contact Information
  contact_name VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_position VARCHAR(50) NOT NULL,

  -- Optional Fields
  address TEXT,
  website VARCHAR(500),
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for search and filtering
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- ============================================
-- 2. RFPs Table (제안요청서)
-- ============================================
CREATE TABLE IF NOT EXISTS rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,

  -- Dates
  received_date DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Budget and Duration
  estimated_budget BIGINT CHECK (estimated_budget >= 0),
  estimated_duration INTEGER CHECK (estimated_duration >= 1), -- days

  -- Content
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb, -- Array of {id, fileName, fileSize, fileType, url, uploadedAt}

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'analyzing', 'analyzed', 'rejected')),

  -- AI Analysis (optional)
  ai_analysis JSONB,

  -- Assignment
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_dates CHECK (due_date > received_date)
);

-- Indexes for performance
CREATE INDEX idx_rfps_client_id ON rfps(client_id);
CREATE INDEX idx_rfps_status ON rfps(status);
CREATE INDEX idx_rfps_due_date ON rfps(due_date);
CREATE INDEX idx_rfps_assignee_id ON rfps(assignee_id);
CREATE INDEX idx_rfps_received_date ON rfps(received_date DESC);
CREATE INDEX idx_rfps_title ON rfps USING gin(to_tsvector('english', title));
CREATE INDEX idx_rfps_description ON rfps USING gin(to_tsvector('english', description));

-- ============================================
-- 3. Requirements Table (요구사항)
-- ============================================
CREATE TABLE IF NOT EXISTS requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id UUID NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,

  -- Classification
  category VARCHAR(20) NOT NULL CHECK (category IN ('functional', 'non-functional', 'technical', 'business')),
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('must', 'should', 'could', 'wont')), -- MoSCoW

  -- Content
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  acceptance_criteria TEXT,

  -- AI Analysis
  complexity VARCHAR(10) CHECK (complexity IN ('low', 'medium', 'high')),
  estimated_hours INTEGER CHECK (estimated_hours >= 0 AND estimated_hours <= 1000),
  suggested_solution TEXT,

  -- Order
  "order" INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_requirements_rfp_id ON requirements(rfp_id);
CREATE INDEX idx_requirements_category ON requirements(category);
CREATE INDEX idx_requirements_priority ON requirements(priority);
CREATE INDEX idx_requirements_order ON requirements(rfp_id, "order");

-- ============================================
-- 4. Comments Table (댓글)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Target (polymorphic)
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('rfp', 'requirement', 'proposal')),
  target_id UUID NOT NULL,

  -- Content
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'comment' CHECK (type IN ('comment', 'feedback', 'approval', 'rejection')),

  -- Author
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Nested Comments (optional)
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Status
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Clients Policies
CREATE POLICY "Anyone can read clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin and manager can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "admin and manager can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Only admin can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- RFPs Policies
CREATE POLICY "Anyone can read rfps"
  ON rfps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin, manager, writer can insert rfps"
  ON rfps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager', 'writer')
    )
  );

CREATE POLICY "admin, manager, assignee can update rfps"
  ON rfps FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (
        role IN ('admin', 'manager')
        OR id = rfps.assignee_id
      )
    )
  );

CREATE POLICY "admin and manager can delete rfps"
  ON rfps FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Requirements Policies
CREATE POLICY "Anyone can read requirements"
  ON requirements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert requirements"
  ON requirements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update requirements"
  ON requirements FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "admin and manager can delete requirements"
  ON requirements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Comments Policies
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admin can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- Updated At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfps_updated_at
  BEFORE UPDATE ON rfps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at
  BEFORE UPDATE ON requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE clients IS 'Client companies that submit RFPs';
COMMENT ON TABLE rfps IS 'Request for Proposals from clients';
COMMENT ON TABLE requirements IS 'Requirements extracted from RFPs';
COMMENT ON TABLE comments IS 'Comments and feedback on RFPs, requirements, and proposals';
