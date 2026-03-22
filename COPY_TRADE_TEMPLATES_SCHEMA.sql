-- Copy Trade Templates Table for Admin Management
-- This table stores copy trade templates created by admins that users can subscribe to

DROP TABLE IF EXISTS copy_trade_templates CASCADE;

CREATE TABLE copy_trade_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trader_name TEXT NOT NULL,
  win_rate DECIMAL(5,2) NOT NULL,
  total_return DECIMAL(10,2) NOT NULL,
  daily_return DECIMAL(10,2) NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  total_trades INTEGER NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  created_by TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE copy_trade_templates ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only see active copy trade templates
CREATE POLICY "Users can view active copy trade templates"
  ON copy_trade_templates
  FOR SELECT
  USING (
    is_active = true
    OR (
      SELECT is_admin FROM user_profiles 
      WHERE auth.uid() = user_profiles.id
    ) = true
  );

-- Policy 2: Only admins can manage copy trade templates
CREATE POLICY "Admins can manage copy trade templates"
  ON copy_trade_templates
  FOR ALL
  USING (
    (
      SELECT is_admin FROM user_profiles 
      WHERE auth.uid() = user_profiles.id
    ) = true
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_copy_trade_templates_is_active 
  ON copy_trade_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_copy_trade_templates_risk_level 
  ON copy_trade_templates(risk_level);

CREATE INDEX IF NOT EXISTS idx_copy_trade_templates_created_by 
  ON copy_trade_templates(created_by);

-- Insert example data (optional)
INSERT INTO copy_trade_templates (name, description, trader_name, win_rate, total_return, daily_return, followers, total_trades, risk_level, created_by, is_active)
VALUES (
  'John Smith Strategy',
  'Detailed description of the trading strategy, track record, and approach...',
  'John Smith',
  84.0,
  124.0,
  9.2,
  1205,
  324,
  'Medium',
  'admin-1',
  true
);
