# Copy Trade Templates System - Setup Guide

## Overview

The Copy Trade Templates system allows admins to create copy trading profiles that regular users can subscribe to. Each copy trade template represents a verified trader with their trading performance metrics and risk profile.

**Status: ✅ COMPLETE & SYNCED WITH SUPABASE**

All copy trade operations are now async and synchronized with Supabase database for persistent storage and cross-device sync.

---

## SQL Schema

### Table: `copy_trade_templates`

```sql
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
```

**Field Mapping** (TypeScript ↔ Database):
- `name` ↔ `name` (template identifier)
- `winRate` ↔ `win_rate` (INTEGER 0-100)
- `return` ↔ `total_return` (DECIMAL for cumulative %)
- `dailyReturn` ↔ `daily_return` (DECIMAL for daily %)
- `followers` ↔ `followers` (INTEGER count)
- `trades` ↔ `total_trades` (INTEGER count)
- `risk` ↔ `risk_level` (TEXT enum)
- `createdBy` ↔ `created_by` (TEXT user ID)

---

## Setup Instructions

### Step 1: Create Table in Supabase

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** → **New Query**
4. Copy and run the contents of **COPY_TRADE_TEMPLATES_SCHEMA.sql**
5. Verify table appears in **Tables** list

### Step 2: Verify in Admin Panel

1. Login as admin (`admin@work.com` / `admin`)
2. Navigate to **Admin Panel** → **Copy Trade Management**
3. Form should display fields:
   - Trader Name
   - Win Rate (%)
   - Total Return (%)
   - Daily Return (%)
   - Followers
   - Total Trades
   - Risk Level (dropdown)
   - Description (textarea)
4. Button shows "Create Copy Trade"

### Step 3: Test Create Operation

**Create Test Copy Trade:**
```
- Trader Name: John Smith
- Win Rate: 84%
- Total Return: 124%
- Daily Return: 9.2%
- Followers: 1205
- Total Trades: 324
- Risk Level: Medium
- Description: Detailed description of the trading strategy...
```

**Expected Result:**
- ✅ Success alert: "✅ Copy trade template created"
- ✅ Template appears in Admin Panel list
- ✅ Template appears in Supabase `copy_trade_templates` table
- ✅ Refreshing page still shows template (persistent)

---

## How It Works

### Data Flow Architecture

```
Admin Panel Form (CopyTradeManagementTab.tsx)
         ↓
    handleAddCopyTrade() [ASYNC]
         ↓
    addCopyTradeTemplate() [store.tsx - ASYNC]
         ↓
    supabase.from('copy_trade_templates').insert()
         ↓
    Supabase Database
         ↓
    Store State Updated (setCopyTradeTemplates)
         ↓
    Component Re-renders → User sees new template
```

### User vs Admin Visibility

**Regular Users:**
- See only copy trades where `is_active = true`
- Loaded from `copy_trade_templates` RLS policy (read permission)
- On login: `loadUserDataFromSupabase()` → Phase 12 filter

**Admins:**
- See ALL copy trades (active + inactive)
- Full CRUD permissions (Create, Read, Update, Delete)
- Can toggle `is_active` to publish/unpublish templates

### RLS Policies

**Policy 1: User Read Access**
```sql
SELECT is_active = true 
OR user is admin
```
- Regular users only see active copy trades
- Admins see everything

**Policy 2: Admin Full Access**
```sql
WHERE user_is_admin = true
```
- Only authenticated admins can INSERT, UPDATE, DELETE

---

## Store Functions Reference

### addCopyTradeTemplate()

**Signature:**
```typescript
const addCopyTradeTemplate = async (
  name: string,
  description: string,
  winRate: number,
  return_: number,
  followers: number,
  risk: 'Low' | 'Medium' | 'High',
  dailyReturn: number,
  trades: number
) => Promise<void>
```

**Operation:**
- INSERT new row to `copy_trade_templates` table
- Maps TypeScript fields to snake_case database columns
- Sets `created_by: user.id` and `is_active: true`
- Updates store state immediately
- Displays success alert to user

**Error Handling:**
- Catches Supabase API errors
- Logs error to console with 🔴 prefix
- Shows user alert with error message
- Does NOT update store if error occurs

**Example Usage:**
```typescript
await addCopyTradeTemplate(
  'John Smith',           // name
  'Strategy description', // description
  84,                     // winRate
  124,                    // return
  1205,                   // followers
  'Medium',              // risk
  9.2,                   // dailyReturn
  324                    // trades
);
```

### editCopyTradeTemplate()

**Signature:**
```typescript
const editCopyTradeTemplate = async (
  copyTradeId: string,
  updates: Partial<CopyTradeTemplate>
) => Promise<void>
```

**Operation:**
- UPDATE existing copy trade in database
- Only sends modified fields to Supabase
- Transforms camelCase fields to snake_case for DB
- Updates store state immediately
- Displays success alert

**Supported Fields for Update:**
- `name` → `name`
- `description` → `description`
- `winRate` → `win_rate`
- `return` → `total_return`
- `dailyReturn` → `daily_return`
- `followers` → `followers`
- `trades` → `total_trades`
- `risk` → `risk_level`

**Example Usage:**
```typescript
await editCopyTradeTemplate('abc-123-def', {
  winRate: 85,
  followers: 1300
});
```

### deleteCopyTradeTemplate()

**Signature:**
```typescript
const deleteCopyTradeTemplate = async (
  copyTradeId: string
) => Promise<void>
```

**Operation:**
- DELETE copy trade from `copy_trade_templates` table
- Removes from store state
- Shows confirmation alert before delete
- Displays success alert after deletion

**Example Usage:**
```typescript
await deleteCopyTradeTemplate('abc-123-def');
```

---

## Data Loading Pipeline

### loadUserDataFromSupabase() - Phase 12

**When it runs:**
- On user login (before dashboard loads)
- On manual page refresh
- On component mount with valid auth session

**What it does:**
1. Queries `copy_trade_templates` table
2. **For regular users:** Filters `is_active = true` only
3. **For admins:** Loads ALL copy trades
4. Transforms database rows to TypeScript format:
   - `win_rate` → `winRate` (parsed as number)
   - `total_return` → `return` (parsed as number)
   - `daily_return` → `dailyReturn` (parsed as number)
   - `risk_level` → `risk` (kept as string)
   - Timestamps converted from ISO to milliseconds
5. Updates `store.copyTradeTemplates` state
6. Logs detailed console output for debugging

**Console Output:**
```
🟡 [LOAD] Phase 12: Loading copy trade templates...
✅ [LOAD] Loaded 5 copy trade templates (all for admin)
✅ [LOAD] Converted copy trade templates: [...]
✅ Data loading complete
```

---

## Testing Checklist

### 1. Create Copy Trade Template

- [ ] Login as admin
- [ ] Go to Admin Panel → Copy Trade Management
- [ ] Fill all form fields with test data
- [ ] Click "Create Copy Trade"
- [ ] See success alert: "✅ Copy trade template created"
- [ ] Template appears in Admin Panel list below form
- [ ] Verify in Supabase: Dashboard → Tables → copy_trade_templates → see new row

### 2. Verify Persistence

- [ ] Refresh page (F5 or Cmd+R)
- [ ] Copy trade still visible in Admin Panel
- [ ] Console shows: "[LOAD] Loaded X copy trade templates"

### 3. Edit Copy Trade Template

- [ ] Click Edit button (pencil icon) on any copy trade
- [ ] Form populates with current values
- [ ] Change one field (e.g., increase followers)
- [ ] Click "Update Copy Trade"
- [ ] See success alert: "✅ Copy trade template updated"
- [ ] Value updated in list display
- [ ] Verify in Supabase: row updated with new data

### 4. Toggle Active Status

- [ ] Admin sees all copy trades initially
- [ ] Verify `is_active = true` in all rows in Supabase
- [ ] Login as regular user (different account)
- [ ] Dashboard → Copy Trade Trading page should show active templates
- [ ] Should NOT see any marked inactive

### 5. Delete Copy Trade Template

- [ ] Admin clicks Delete button (trash icon)
- [ ] Confirmation dialog appears: "Are you sure..."
- [ ] Click OK to confirm
- [ ] See success alert: "✅ Copy trade template deleted"
- [ ] Template disappears from Admin Panel list
- [ ] Verify in Supabase: row no longer exists

### 6. Test as Regular User

- [ ] Logout if admin
- [ ] Login as regular user
- [ ] Navigate to trading features that show copy trades
- [ ] Should see ONLY active templates
- [ ] Should NOT see templates with `is_active = false`
- [ ] Click on a template (if subscribable) - should work

---

## Schema Comparison Matrix

| Feature | Copy Trades | Bots | Signals | Wallets |
|---------|-------------|------|---------|---------|
| **Table** | `copy_trade_templates` | `bot_templates` | `signal_templates` | `system_wallets` |
| **Primary Fields** | trader_name, win_rate, total_return | type, performance %, risk | symbol, confidence | address, network |
| **Performance Metric** | win_rate, daily_return | performance %, win_rate | win_rate, avg_return | min_deposit |
| **Social Metric** | followers | N/A | followers | N/A |
| **Risk Field** | risk_level | max_drawdown | N/A | N/A |
| **Cost Field** | N/A | price | cost | N/A |
| **RLS Pattern** | Identical | Identical | Identical | Identical |
| **Load Phase** | Phase 12 | Phase 10 | Phase 11 | Phase 9 |
| **created_by Type** | TEXT | TEXT | TEXT | N/A (admin-only) |
| **is_active Pattern** | true (hide via RLS) | true (hide via RLS) | true (hide via RLS) | true (hide via RLS) |

---

## Async Operation Flow

### Component → Store → Database

**CopyTradeManagementTab.tsx**
```typescript
// User clicks "Create Copy Trade"
const handleAddCopyTrade = async (e) => {
  e.preventDefault();
  // Validate form
  // Call async store function with await
  await addCopyTradeTemplate(...fields);
  // Reset form after async operation completes
  resetCopyTradeForm();
};
```

**store.tsx**
```typescript
// Async store function
const addCopyTradeTemplate = async (...params) => {
  // Prepare data (camelCase → snake_case)
  // Call Supabase API
  const { data, error } = await supabase
    .from('copy_trade_templates')
    .insert([{ ...snakeCaseData }])
    .select();
  
  // Handle error
  if (error) { console.error(); alert(); return; }
  
  // Transform response (snake_case → camelCase)
  const converted = { ...transform_data };
  
  // Update store state
  setCopyTradeTemplates((prev) => [...prev, converted]);
  
  // User notification
  alert('✅ Copy trade template created');
};
```

---

## Database Validation

### Verify Table Creation

```bash
# Check table exists in Supabase
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'copy_trade_templates';
```

### Check RLS is Enabled

```bash
# In Supabase Dashboard → Tables → copy_trade_templates
# Should show: Row Level Security: ON
```

### Inspect Data

```bash
# In Supabase SQL Editor
SELECT id, name, trader_name, win_rate, total_return, 
       risk_level, is_active, created_by 
FROM copy_trade_templates;
```

---

## Troubleshooting

### Issue: "Error: Table not found"

**Cause:** COPY_TRADE_TEMPLATES_SCHEMA.sql not executed in Supabase

**Solution:**
1. Supabase Dashboard → SQL Editor
2. Create New Query
3. Copy entire COPY_TRADE_TEMPLATES_SCHEMA.sql content
4. Click Run
5. Wait for "Query Complete"

### Issue: "Error: permission denied for copy_trade_templates"

**Cause:** RLS policies not created or auth user not recognized as admin

**Solution:**
1. Check `user_profiles` table has `is_admin = true` for admin account
2. Verify RLS policies exist on `copy_trade_templates`
3. Check `auth.uid()` equals admin's user ID in `user_profiles`

### Issue: Template created in admin panel but doesn't persist on refresh

**Cause:** Store state not syncing from Supabase on load

**Solution:**
1. Check console for error messages during Phase 12 load
2. Verify `copy_trade_templates` records exist in Supabase
3. Check if `loadUserDataFromSupabase` is being called on login
4. Clear browser cache and refresh

### Issue: Regular users seeing inactive templates

**Cause:** RLS policy not filtering correctly

**Solution:**
1. Supabase Dashboard → Tables → copy_trade_templates → Policies
2. Edit "Users can view" policy
3. Ensure condition is: `is_active = true OR is_admin = true`
4. Test with fresh login from incognito window

---

## Next Steps

1. ✅ Execute COPY_TRADE_TEMPLATES_SCHEMA.sql in Supabase
2. ✅ Create test copy trade in Admin Panel
3. ✅ Verify table created and data written to Supabase
4. ✅ Test persistence (refresh page, still visible)
5. ✅ Test as regular user (see only active)
6. ✅ Complete testing checklist above
7. ✅ Deploy changes to production

---

## Integration with Other Systems

This copy trade template system follows the exact same pattern as:
- **Bot Templates** (BOT_TEMPLATES_SETUP_GUIDE.md)
- **Signal Templates** (SIGNAL_TEMPLATES_SETUP_GUIDE.md)
- **System Wallets** (SYSTEM_WALLETS_SETUP_GUIDE.md)

All four systems work together to provide complete admin management infrastructure backed by Supabase.

---

**Last Updated:** March 2026
**System Status:** ✅ Production Ready
**Sync Status:** ✅ Full Async Supabase Integration
