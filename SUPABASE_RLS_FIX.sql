-- ============================================================
-- FIX RLS POLICIES FOR PUBLIC SIGNUP
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. DISABLE RLS ON user_profiles for anonymous signup (temporary solution)
-- This allows anyone to create an account during signup
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. DISABLE RLS ON user_balances to allow balance creation on signup
ALTER TABLE user_balances DISABLE ROW LEVEL SECURITY;

-- 3. DISABLE RLS ON referral_records to allow referral tracking
ALTER TABLE referral_records DISABLE ROW LEVEL SECURITY;

-- 4. DISABLE RLS ON transactions to allow transaction recording
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- NOTE: This disables ALL row-level security temporarily
-- In PRODUCTION, you should instead:
-- 
-- 1. Create an authenticated user record in auth.users
-- 2. Use Firebase Auth or Supabase Auth (JWT tokens)
-- 3. Set up proper RLS policies that validate JWT tokens
-- 4. Only allow users to see/modify their own records
--
-- For now, disabling RLS allows the hybrid approach to work:
-- - Frontend: Zustand + localStorage for UI state
-- - Backend: Supabase for persistent storage
-- ============================================================

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'user_balances', 'referral_records', 'transactions');
