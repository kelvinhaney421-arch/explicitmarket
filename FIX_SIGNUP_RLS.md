# 🔧 Fix: Supabase RLS Blocking Signup

## Problem
When you try to signup, Supabase returns a **400 error** because Row Level Security (RLS) policies are blocking anonymous inserts to the tables.

## Solution - 3 Steps

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com/
2. Login to your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Run the RLS Fix Script
Copy this SQL and paste it into the SQL Editor:

```sql
-- Disable RLS to allow public signup
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances DISABLE ROW LEVEL SECURITY;
ALTER TABLE referral_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'user_balances', 'referral_records', 'transactions');
```

### Step 3: Click **Run**
- You should see output like:
```
schemaname | tablename         | rowsecurity
------------|------------------|------------
public     | user_profiles     | false
public     | user_balances     | false
public     | referral_records  | false
public     | transactions      | false
```

All should be **false** (meaning RLS is disabled ✅)

## ✅ After This

Try signing up again:
1. Go to http://localhost:5173 (or your dev URL)
2. Click "Sign Up"
3. Fill in the details (email, name, phone, country, password)
4. Click "Create Account"
5. **You should now successfully signup!** ✨

The user AND their balance will be written to Supabase!

## Verify It Worked

Run this in your terminal:
```bash
node /workspaces/exptestt/test_signup_db.cjs
```

You should see your new user in the database! 🎉

---

## 🚀 Future: Production RLS Policies

For production, you should NOT disable RLS. Instead, implement proper authentication:

1. **Use Supabase Auth** (email/password signup with JWT tokens)
2. **Set RLS policies** that validate JWT claims
3. **Allow users to only see their own data**

Example production RLS policy:
```sql
CREATE POLICY "Users can only read their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile during signup"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id AND is_admin = false);
```

But for now, disabled RLS works fine with the hybrid Zustand + Supabase approach.
