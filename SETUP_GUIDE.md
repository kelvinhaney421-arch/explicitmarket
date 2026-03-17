# QUICK SETUP GUIDE - FROM ZERO TO PRODUCTION

Follow these steps to get your Supabase backend fully operational.

---

## STEP 1: CREATE SUPABASE PROJECT

1. Go to **https://supabase.com**
2. Click "Sign Up" and create account
3. Click "New Project"
4. Fill in:
   - **Project Name:** exptrade-platform (or any name)
   - **Database Password:** Create strong password (save it!)
   - **Region:** Choose closest to you
5. Click "Create New Project"
6. Wait for project to initialize (2-3 minutes)

---

## STEP 2: GET CREDENTIALS

1. After project creates, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** - This is `VITE_SUPABASE_URL`
   - **anon public key** - This is `VITE_SUPABASE_ANON_KEY`

---

## STEP 3: SETUP ENVIRONMENT VARIABLES

Create file: `/workspaces/exptestt/.env.local`

```
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[paste-your-anon-key-here]
```

**Example:**
```
VITE_SUPABASE_URL=https://exptrade-xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## STEP 4: EXECUTE SCHEMA

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `/workspaces/exptestt/supabase_complete_schema_v2.sql`
4. Paste into SQL editor
5. Click **Run**
6. Wait for completion (should see "Success" message)

**What was created:**
- 14 tables (user_profiles, referral_records, transactions, etc.)
- 6 utility functions (approve_referral, adjust_user_balance, etc.)
- 2 views (user_dashboard_summary, admin_approvals_dashboard)
- 10+ triggers (auto-updates, logging)
- 50+ indexes (performance optimization)
- RLS policies (security)
- Admin user (email: admin@work.com, password: admin)

---

## STEP 5: VERIFY SCHEMA

Run these queries in SQL Editor to verify:

```sql
-- Check user_profiles table
SELECT COUNT(*) FROM user_profiles;
-- Should show: 1 (admin user)

-- Check admin user exists
SELECT email, is_admin, referral_code FROM user_profiles 
WHERE email = 'admin@work.com';
-- Should show: admin@work.com | true | ADMIN_MASTER

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';
-- Should list: approve_referral, adjust_user_balance, etc.
```

---

## STEP 6: INSTALL SUPABASE CLIENT

In terminal:
```bash
cd /workspaces/exptestt
npm install @supabase/supabase-js
```

---

## STEP 7: CREATE SUPABASE CLIENT FILE

Create: `/workspaces/exptestt/src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## STEP 8: UPDATE STORE - LOGIN FUNCTION

Update `/workspaces/exptestt/src/lib/store.tsx` login function:

```typescript
import { supabase } from './supabaseClient'

const login = async (email: string, password: string, signupData?: any) => {
  // ADMIN LOGIN
  if (email === 'admin@work.com' && password === 'admin') {
    const { data: adminUser } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    setUser(adminUser)
    return { success: true, isAdmin: true }
  }

  // REGULAR USER LOGIN
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single()

  if (error || !user) {
    return { success: false, error: 'Invalid credentials' }
  }

  setUser(user)
  return { success: true, isAdmin: false }
}
```

---

## STEP 9: UPDATE STORE - SIGNUP FUNCTION

Add referral creation:

```typescript
const handleSignup = async (email: string, password: string, fullName: string, 
                            phone: string, country: string, referralCode?: string) => {
  // Generate unique referral code
  const newReferralCode = `USER_${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  // Create user profile
  const { data: newUser, error: userError } = await supabase
    .from('user_profiles')
    .insert({
      email,
      password, // PLAIN TEXT
      full_name: fullName,
      phone_number: phone,
      country,
      referral_code: newReferralCode,
      referred_by: null
    })
    .select()
    .single()

  if (userError) {
    console.error('Signup error:', userError)
    return false
  }

  // If referral code provided, create referral record
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single()

    if (referrer) {
      await supabase
        .from('referral_records')
        .insert({
          referrer_id: referrer.id,
          referred_user_id: newUser.id,
          referred_user_email: email,
          referred_user_name: fullName,
          bonus_amount: 25,
          status: 'PENDING'
        })
    }
  }

  return true
}
```

---

## STEP 10: ADD ADMIN REFERRAL APPROVAL

Create function in your store:

```typescript
const approveReferral = async (referralId: string, adminId: string) => {
  const { data, error } = await supabase
    .rpc('approve_referral', {
      p_referral_id: referralId,
      p_admin_id: adminId
    })

  if (error) {
    console.error('Approval error:', error)
    return false
  }

  // Refresh data
  await fetchPendingReferrals()
  return true
}
```

---

## STEP 11: TEST CONNECTION

1. Go to your app at `http://localhost:5173`
2. Try to login with admin:
   - Email: `admin@work.com`
   - Password: `admin`
3. You should successfully login and see dashboard

**If login fails:**
- Check `.env.local` has correct URL and key
- Verify schema was executed successfully
- Check browser console for errors

---

## STEP 12: TEST SIGNUP WITH REFERRAL

1. Logout from admin
2. Click "Sign Up"
3. Fill in form
4. In referral code field, enter: `ADMIN_MASTER` (admin's referral code)
5. Submit signup
6. Login with credentials you just created
7. Go to wallet - you should see custom balance

---

## STEP 13: TEST ADMIN REFERRAL APPROVAL

1. Login as admin
2. Go to **Referral Management** tab
3. You should see the referral you just created with status "PENDING"
4. Click **"Approve"** button
5. You should see success message
6. Refresh or check: admin's balance should have +$25
7. Referral status should change to "COMPLETED"

---

## STEP 14: ENABLE EMAIL AUTHENTICATION (OPTIONAL)

If you want to use Supabase Auth instead of plain email/password:

1. In Supabase, go to **Authentication** → **Providers**
2. Enable "Email"
3. Update your signup to use:

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password
})
```

---

## STEP 15: SETUP BACKUPS

In Supabase dashboard:
1. Go to **Settings** → **Backups**
2. Click **Enable Point-in-Time Recovery**
3. This creates automatic backups every 24 hours

---

## VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] Admin can login (admin@work.com / admin)
- [ ] New users can signup
- [ ] Referral code field works on signup
- [ ] When using ADMIN_MASTER referral code, referral record created
- [ ] Admin sees pending referral in Referral Management tab
- [ ] Admin can approve referral
- [ ] Admin gets +$25 balance after approval
- [ ] New user can see their balance
- [ ] Referral status changes to COMPLETED
- [ ] Admin action logged in database

---

## TROUBLESHOOTING

### "Missing Supabase environment variables"
**Fix:** Check `.env.local` has both URL and KEY filled in

### "Invalid credentials" on login
**Fix:** Verify admin user created - run this in SQL Editor:
```sql
SELECT * FROM user_profiles WHERE email = 'admin@work.com';
```
If empty, execute schema again.

### Referral not approving
**Fix:** Check referral exists:
```sql
SELECT * FROM referral_records LIMIT 10;
```

### Balance not updating
**Fix:** Check user_balances table:
```sql
SELECT * FROM user_balances WHERE user_id = '[user-id-here]';
```

---

## NEXT STEPS

1. **Migrate existing data** (if you have users in localStorage)
2. **Connect all pages** to Supabase queries
3. **Enable real-time subscriptions** for live balance updates
4. **Set up auth workflows** (password reset, email verification)
5. **Configure advanced features** (2FA, session management)

---

## PRODUCTION CONSIDERATIONS

Before going live:

- [ ] Enable RLS (Row Level Security) - Already enabled ✅
- [ ] Set up API rate limiting
- [ ] Enable audit logging
- [ ] Configure backups
- [ ] Test disaster recovery
- [ ] Set up monitoring/alerts
- [ ] Review security policies
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS
- [ ] Set up staging environment

---

## SUPPORT RESOURCES

- **Supabase Docs:** https://supabase.com/docs
- **SQL Editor Guide:** https://supabase.com/docs/guides/database/connecting-to-postgres
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **Real-time:** https://supabase.com/docs/guides/realtime

---

## SCHEMA FILES REFERENCE

- **Main Schema:** `supabase_complete_schema_v2.sql` (3000+ lines, all features)
- **Documentation:** `SUPABASE_COMPLETE_GUIDE.md` (table structure, flow examples)
- **API Examples:** `SUPABASE_API_INTEGRATION.md` (TypeScript code snippets)
- **This File:** Setup checklist and verification steps

ALL DONE! Your backend is ready! 🚀
