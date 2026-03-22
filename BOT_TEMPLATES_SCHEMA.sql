-- Bot Templates Table (Admin manages, users can purchase)
-- Single source of truth for available bots
CREATE TABLE IF NOT EXISTS bot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  performance DECIMAL(5, 2) NOT NULL,
  win_rate DECIMAL(5, 2) NOT NULL,
  trades INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL, -- "AI Trading", "Manual", etc.
  risk TEXT NOT NULL CHECK (risk IN ('Low', 'Medium', 'High')),
  max_drawdown DECIMAL(5, 2) NOT NULL,
  created_by TEXT, -- User ID (string, not UUID)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE bot_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view active bots
CREATE POLICY "Users can view active bot templates"
  ON bot_templates FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage all bots
CREATE POLICY "Admins can manage bot templates"
  ON bot_templates FOR ALL
  USING (
    auth.uid()::text = 'admin-1' OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bot_templates_active ON bot_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_bot_templates_type ON bot_templates(type);
CREATE INDEX IF NOT EXISTS idx_bot_templates_created_by ON bot_templates(created_by);
