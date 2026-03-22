# Bot Templates Database Setup Guide

## Overview
Bot templates are now managed in Supabase and synced across the app. Admins create bots, users purchase and use them.

## Database Setup

### Step 1: Create the Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Bot Templates Table
CREATE TABLE IF NOT EXISTS bot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  performance DECIMAL(5, 2) NOT NULL,
  win_rate DECIMAL(5, 2) NOT NULL,
  trades INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('Low', 'Medium', 'High')),
  max_drawdown DECIMAL(5, 2) NOT NULL,
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE SET NULL
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
```

## How It Works

### Admin Creates Bot
1. **Admin Panel** → **Bot Management**
2. Fill in form:
   - **Bot Name**: e.g., "Scalper Pro V2"
   - **Description**: Strategy details
   - **Bot Type**: "AI Trading", "Manual", etc.
   - **Price ($)**: e.g., 149.99
   - **Risk Level**: Low / Medium / High
   - **Performance (%)**: e.g., 45
   - **Win Rate (%)**: e.g., 72
   - **Total Trades**: e.g., 156
   - **Max Drawdown (%)**: e.g., 8
3. Click **Create Bot**
4. Bot is saved to `bot_templates` table
5. Toggle **Active/Inactive** to show/hide from users

### User Finds Bot
1. **Marketplace** or **Bot Store**
2. See all **active** bots from database
3. Click to purchase
4. Bot added to their portfolio

## Database Schema

```
bot_templates {
  id: UUID                         (Primary Key)
  name: TEXT                       (e.g., "Scalper Pro V2")
  description: TEXT                (Strategy details)
  price: DECIMAL                   (e.g., 149.99)
  performance: DECIMAL             (e.g., 45.00)
  win_rate: DECIMAL                (e.g., 72.00)
  trades: INTEGER                  (e.g., 156)
  type: TEXT                       (e.g., "AI Trading")
  risk: TEXT                       (Low, Medium, High)
  max_drawdown: DECIMAL            (e.g., 8.00)
  created_by: UUID                 (Admin user ID)
  is_active: BOOLEAN               (true = visible to users)
  created_at: TIMESTAMP WITH TZ    (Auto)
  updated_at: TIMESTAMP WITH TZ    (Auto)
}
```

## Store Functions

### Add Bot
```typescript
await addBotTemplate(
  name: string,
  description: string,
  price: number,
  performance: number,
  winRate: number,
  trades: number,
  type: string,
  risk: 'Low' | 'Medium' | 'High',
  maxDrawdown: number
)
```

### Edit Bot
```typescript
await editBotTemplate(botId: string, updates: Partial<BotTemplate>)
```

### Delete Bot
```typescript
await deleteBotTemplate(botId: string)
```

## Data Flow

```
Admin creates/edits bot in UI
    ↓
Function calls Supabase API
    ↓
Data saved to bot_templates table
    ↓
Store state updates
    ↓
Admin page refreshes
    ↓
Regular users see active bots
```

## What Users See

✅ Only **active** bots (`is_active = true`)
✅ All fields: name, description, price, performance, winRate, risk, etc.
✅ Can filter by type, risk level, performance
✅ Can purchase and activate bots

What users DON'T see:
❌ Inactive bots
❌ Deleted bots
❌ Bot management tools (admin only)

## Testing Checklist

- [ ] Create `bot_templates` table with SQL above
- [ ] Admin logs in
- [ ] Admin goes to **Bot Management**
- [ ] Admin adds a new bot with all fields
- [ ] Check Supabase → `bot_templates` table has the bot
- [ ] Bot shows in admin panel
- [ ] Admin edits bot
- [ ] Changes saved to database
- [ ] Admin deactivates bot
- [ ] User no longer sees bot in marketplace
- [ ] Admin deletes bot
- [ ] Bot is gone from Supabase
- [ ] Regular user logs in
- [ ] User sees active bots in marketplace
- [ ] User can purchase bot

## Troubleshooting

### Admin Can't Add Bots
✓ Check if `bot_templates` table exists
✓ Verify RLS policies allow admin access
✓ Check Network tab in DevTools for API errors
✓ Check browser console for error messages

### Bots Revert After Refresh
✓ Check Supabase connection
✓ Verify env variables are correct
✓ Check console for SQL errors

### Users Don't See Bots
✓ Check if bots exist in Supabase
✓ Verify `is_active = true` for the bots
✓ Clear browser cache and refresh page
✓ Check browser console for errors

## Notes

- All bot operations are **async** and sync with Supabase in real-time
- Bots are created by admin with `created_by = admin_user_id`
- Active bots automatically appear in user marketplace
- Deactivate instead of delete to hide bots without losing data
- All timestamps are UTC
