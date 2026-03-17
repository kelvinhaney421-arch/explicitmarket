# SUPABASE API INTEGRATION - FUNCTION EXAMPLES

This file shows how to integrate the Supabase schema with your React frontend store.

## 1. SETUP - supabaseClient.ts

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**.env.local:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anonkey-here
```

---

## 2. USER MANAGEMENT

### Signup with Referral Code
```typescript
async function signup(email: string, password: string, fullName: string, 
                      phone: string, country: string, referralCode?: string) {
  // 1. Create user in user_profiles
  const { data: newUser, error: userError } = await supabase
    .from('user_profiles')
    .insert({
      email,
      password, // PLAIN TEXT
      full_name: fullName,
      phone_number: phone,
      country,
      referral_code: `USER_${nanoid(8).toUpperCase()}`, // Generate unique code
      referred_by: null
    })
    .select()
    .single()

  if (userError) throw userError

  // 2. Find referrer if referral code provided
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single()

    if (referrer) {
      // 3. Create referral record (PENDING approval)
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

  return newUser
}
```

### Login
```typescript
async function login(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .eq('password', password) // Direct password match (plain text)
    .single()

  if (error || !user) throw new Error('Invalid credentials')
  
  return user
}
```

### Update User Profile
```typescript
async function updateProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## 3. REFERRAL MANAGEMENT (ADMIN)

### Get All Pending Referrals
```typescript
async function getPendingReferrals() {
  const { data, error } = await supabase
    .from('referral_records')
    .select(`
      id,
      referrer_id,
      referred_user_id,
      referred_user_name,
      referred_user_email,
      bonus_amount,
      status,
      created_at
    `)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

### Approve Referral (Admin)
```typescript
async function approveReferral(referralId: string, adminId: string) {
  // Call the Supabase function
  const { data, error } = await supabase
    .rpc('approve_referral', {
      p_referral_id: referralId,
      p_admin_id: adminId
    })

  if (error) throw error
  return data
}
```

### Get Referral Stats for User
```typescript
async function getReferralStats(userId: string) {
  const { data, error } = await supabase
    .rpc('get_referral_stats', {
      p_user_id: userId
    })

  if (error) throw error
  return data[0] // Returns object with total_referrals, total_earnings, pending_earnings
}
```

### Get User's Referrals
```typescript
async function getMyReferrals(userId: string) {
  const { data, error } = await supabase
    .from('referral_records')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

---

## 4. BALANCE MANAGEMENT (ADMIN)

### Adjust User Balance
```typescript
async function adjustBalance(userId: string, adminId: string, amount: number, reason: string) {
  const { data, error } = await supabase
    .rpc('adjust_user_balance', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_amount: amount,
      p_reason: reason
    })

  if (error) throw error
  return data // { success: boolean, new_balance: number, message: string }
}
```

### Get User Balance
```typescript
async function getUserBalance(userId: string) {
  const { data, error } = await supabase
    .from('user_balances')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}
```

### Get Balance History
```typescript
async function getBalanceHistory(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('balance_adjustments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
```

---

## 5. BOT MANAGEMENT

### Get Available Bots
```typescript
async function getAvailableBots() {
  const { data, error } = await supabase
    .from('bot_templates')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data
}
```

### Purchase Bot
```typescript
async function purchaseBot(userId: string, botTemplateId: string, 
                           durationValue: string, durationType: 'minutes' | 'hours' | 'days',
                           outcome: 'win' | 'lose') {
  const { data: bot, error: botError } = await supabase
    .from('bot_templates')
    .select('price, bot_name')
    .eq('id', botTemplateId)
    .single()

  if (botError) throw botError

  // Deduct from user balance
  const { error: balError } = await supabase
    .from('user_balances')
    .update({ balance: supabase.raw(`balance - ${bot.price}`) })
    .eq('user_id', userId)

  if (balError) throw balError

  // Create purchase record
  const { data: purchase, error: purchaseError } = await supabase
    .from('user_bots')
    .insert({
      user_id: userId,
      bot_template_id: botTemplateId,
      bot_name: bot.bot_name,
      status: 'PENDING_APPROVAL',
      outcome,
      duration_value: durationValue,
      duration_type: durationType
    })
    .select()
    .single()

  if (purchaseError) throw purchaseError

  // Create transaction
  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      transaction_type: 'BOT_PURCHASE',
      amount: bot.price,
      status: 'COMPLETED',
      description: `Purchased bot: ${bot.bot_name}`
    })

  return purchase
}
```

### Approve Bot Purchase (Admin)
```typescript
async function approveBotPurchase(botId: string, adminId: string) {
  const { data, error } = await supabase
    .from('bot_approvals')
    .insert({
      bot_purchase_id: botId,
      admin_id: adminId,
      approval_status: 'APPROVED'
    }, { onConflict: 'bot_purchase_id' }) // Update if exists
    .select()
    .single()

  if (error) throw error

  // Update bot status
  await supabase
    .from('user_bots')
    .update({ status: 'APPROVED' })
    .eq('id', botId)

  return data
}
```

### Get User's Bots
```typescript
async function getUserBots(userId: string) {
  const { data, error } = await supabase
    .from('user_bots')
    .select(`
      *,
      bot_templates(bot_name, price, performance, win_rate)
    `)
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })

  if (error) throw error
  return data
}
```

---

## 6. SIGNAL MANAGEMENT

### Get Available Signals
```typescript
async function getAvailableSignals() {
  const { data, error } = await supabase
    .from('signal_templates')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data
}
```

### Subscribe to Signal
```typescript
async function subscribeSignal(userId: string, signalTemplateId: string,
                               allocation: number, durationValue: string, 
                               durationType: 'minutes' | 'hours' | 'days',
                               outcome: 'win' | 'lose') {
  const { data: template, error: templateError } = await supabase
    .from('signal_templates')
    .select('provider_name, cost')
    .eq('id', signalTemplateId)
    .single()

  if (templateError) throw templateError

  // Deduct cost first
  const { error: balError } = await supabase
    .from('user_balances')
    .update({ balance: supabase.raw(`balance - ${template.cost}`) })
    .eq('user_id', userId)

  if (balError) throw balError

  // Create subscription
  const { data: subscription, error: subError } = await supabase
    .from('user_signals')
    .insert({
      user_id: userId,
      signal_template_id: signalTemplateId,
      provider_name: template.provider_name,
      status: 'PENDING_APPROVAL',
      allocation,
      outcome,
      duration_value: durationValue,
      duration_type: durationType
    })
    .select()
    .single()

  if (subError) throw subError

  return subscription
}
```

### Approve Signal (Admin)
```typescript
async function approveSignal(signalId: string, adminId: string) {
  return await supabase
    .from('signal_approvals')
    .insert({
      signal_subscription_id: signalId,
      admin_id: adminId,
      approval_status: 'APPROVED'
    }, { onConflict: 'signal_subscription_id' })
    .select()
    .single()
}
```

---

## 7. TRANSACTIONS

### Get User Transactions
```typescript
async function getUserTransactions(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .rpc('get_user_transactions', {
      p_user_id: userId,
      p_limit: limit
    })

  if (error) throw error
  return data
}
```

### Create Deposit Transaction
```typescript
async function createDeposit(userId: string, amount: number, method: string) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      transaction_type: 'DEPOSIT',
      amount,
      method, // bank_transfer, credit_card, crypto, etc
      status: 'PENDING', // Requires approval
      requires_approval: true
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Approve Transaction (Admin)
```typescript
async function approveTransaction(transactionId: string, adminId: string) {
  // Update transaction
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .update({ status: 'COMPLETED', approved_by: adminId })
    .eq('id', transactionId)
    .select()
    .single()

  if (txError) throw txError

  // Add balance
  await supabase
    .from('user_balances')
    .update({ balance: supabase.raw(`balance + ${tx.amount}`) })
    .eq('user_id', tx.user_id)

  return tx
}
```

---

## 8. KYC MANAGEMENT

### Submit KYC
```typescript
async function submitKYC(userId: string, kycData: {
  firstName: string
  lastName: string
  dateOfBirth: string
  country: string
  state: string
  city: string
  zipCode: string
  address: string
  documentType: 'PASSPORT' | 'DRIVER_LICENSE' | 'NATIONAL_ID'
  documentFrontName: string
  documentBackName: string
  selfieName: string
}) {
  const { data, error } = await supabase
    .from('kyc_verifications')
    .upsert({
      user_id: userId,
      first_name: kycData.firstName,
      last_name: kycData.lastName,
      date_of_birth: kycData.dateOfBirth,
      country: kycData.country,
      state: kycData.state,
      city: kycData.city,
      zip_code: kycData.zipCode,
      address: kycData.address,
      document_type: kycData.documentType,
      document_front_name: kycData.documentFrontName,
      document_back_name: kycData.documentBackName,
      selfie_name: kycData.selfieName,
      status: 'PENDING',
      submitted_at: new Date()
    }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Approve KYC (Admin)
```typescript
async function approveKYC(userId: string, adminId: string) {
  const { data, error } = await supabase
    .from('kyc_verifications')
    .update({ 
      status: 'APPROVED',
      reviewed_by: adminId,
      reviewed_at: new Date()
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error

  // Update user profile
  await supabase
    .from('user_profiles')
    .update({ kyc_status: 'APPROVED' })
    .eq('id', userId)

  return data
}
```

---

## 9. PAGE ACCESS CONTROL (ADMIN)

### Lock Page for User
```typescript
async function lockUserPage(userId: string, adminId: string, pageName: string) {
  const { data, error } = await supabase
    .rpc('toggle_page_lock', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_page_name: pageName,
      p_lock: true
    })

  if (error) throw error
  return data
}
```

### Unlock Page for User
```typescript
async function unlockUserPage(userId: string, adminId: string, pageName: string) {
  const { data, error } = await supabase
    .rpc('toggle_page_lock', {
      p_user_id: userId,
      p_admin_id: adminId,
      p_page_name: pageName,
      p_lock: false
    })

  if (error) throw error
  return data
}
```

### Get Page Lock Status
```typescript
async function getPageLocks(userId: string) {
  const { data, error } = await supabase
    .from('page_locks')
    .select('page_name, is_locked')
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

---

## 10. ADMIN DASHBOARD

### Get All Users
```typescript
async function getAllUsers() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user_balances(balance),
      referral_records(status)
    `)
    .eq('is_admin', false)

  if (error) throw error
  return data
}
```

### Get Dashboard Summary
```typescript
async function getDashboardSummary() {
  const { data, error } = await supabase
    .from('user_dashboard_summary')
    .select('*')

  if (error) throw error
  return data
}
```

### Get Pending Approvals Count
```typescript
async function getPendingApprovalsCount() {
  const { data, error } = await supabase
    .rpc('get_pending_approvals')

  if (error) throw error
  
  // Convert to object
  return data.reduce((acc, item) => {
    acc[item.type] = item.count
    return acc
  }, {})
}
```

---

## 11. REAL-TIME SUBSCRIPTIONS

### Listen to User Balance Changes
```typescript
function subscribeToBalance(userId: string, callback: (balance: number) => void) {
  return supabase
    .from('user_balances')
    .on('UPDATE', payload => {
      if (payload.new.user_id === userId) {
        callback(payload.new.balance)
      }
    }, { event: 'UPDATE', schema: 'public', table: 'user_balances', filter: `user_id=eq.${userId}` })
    .subscribe()
}
```

### Listen to Referral Updates
```typescript
function subscribeToReferrals(adminId: string, callback: (referrals: any[]) => void) {
  return supabase
    .from('referral_records')
    .on('*', () => {
      // Re-fetch when any referral changes
      getPendingReferrals().then(callback)
    }, { event: '*', schema: 'public', table: 'referral_records' })
    .subscribe()
}
```

---

## INTEGRATION CHECKLIST

- [ ] Create supabaseClient.ts
- [ ] Add environment variables (.env.local)
- [ ] Update store.tsx login function to query Supabase
- [ ] Update signup to create user + referral record
- [ ] Update balance queries to use Supabase
- [ ] Update admin functions to use RPC functions
- [ ] Add real-time subscriptions to relevant pages
- [ ] Test all flows end-to-end
- [ ] Enable RLS policies
- [ ] Set up backups in Supabase dashboard

All functions are ready to copy-paste into your frontend! ✅
