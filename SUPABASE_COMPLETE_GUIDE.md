# COMPLETE SUPABASE SCHEMA & FUNCTIONALITY GUIDE

## Overview
This is a **complete production-ready Supabase schema** that supports every functionality in your trading platform including:
- User management with referrals
- Balance control and transactions
- Admin approvals for all features
- Bots, Signals, Copy Trading, Funded Accounts
- KYC verification
- Page access control
- Credit card deposits and wallets
- Audit logging

---

## TABLE STRUCTURE

### 1. USER MANAGEMENT (`user_profiles`)
Stores all user data including referral information.

**Key Fields:**
- `email` (UNIQUE) - User email
- `password` (VARCHAR) - PLAIN TEXT, NOT HASHED (as requested)
- `full_name` - User's full name
- `phone_number` - Contact phone
- `country` - User's country
- `is_admin` - Boolean: true if admin
- `is_active` - Account active status
- `is_locked` - Account locked by admin
- `trade_mode` - NORMAL | PROFIT | LOSS
- `kyc_status` - NOT_SUBMITTED | PENDING | APPROVED | REJECTED

**REFERRAL FIELDS:**
- `referral_code` (UNIQUE) - Format: USER_XXXXXXXX (auto-generated) or ADMIN_MASTER (for admin)
- `referred_by` (UUID) - ID of user who referred this user
- `referral_earnings` - Total earnings from referrals
- `total_referrals` - Count of successful referrals

---

### 2. REFERRAL MANAGEMENT (`referral_records`)
Tracks every referral relationship between users.

**Fields:**
- `referrer_id` - Who is giving the referral
- `referred_user_id` - Who was referred
- `referred_user_email` - Email of referred user
- `referred_user_name` - Name of referred user
- `bonus_amount` - Amount credited ($25 default, adjustable)
- `status` - PENDING | COMPLETED | REJECTED
- `created_at` - When referral was started
- `completed_at` - When admin approved
- `rejected_reason` - Why rejected (optional)

**FLOW:**
1. User signs up with referral code
2. Referral record created with status = PENDING
3. Admin approves in Referral Management tab
4. Bonus added to referrer's balance
5. Status changed to COMPLETED

---

### 3. BALANCE MANAGEMENT
Two tables work together:

**`user_balances`** - Current balance state:
- `user_id` (UNIQUE) - Links to user
- `balance` - Current account balance
- `equity` - Account equity
- `margin` - Margin used
- `free_margin` - Available margin
- `leverage` - Trading leverage (default 100)

**`balance_adjustments`** - Audit trail of all balance changes:
- `user_id` - Which user
- `old_balance` - Previous balance
- `new_balance` - New balance after change
- `amount_changed` - Amount added/subtracted
- `reason` - Why changed (DEPOSIT, WITHDRAWAL, REFERRAL_BONUS, ADMIN_ADJUSTMENT, etc)
- `adjusted_by` - Which admin made the change
- `notes` - Additional notes

---

### 4. TRANSACTIONS (`transactions`)
Complete transaction record for every movement.

**Type Examples:**
- `DEPOSIT` - Money added to account
- `WITHDRAWAL` - Money removed
- `REFERRAL_BONUS` - From referral approval
- `BOT_PURCHASE` - Buying a bot
- `SIGNAL_PURCHASE` - Subscribing to signal
- `COPY_TRADE_PURCHASE` - Following trader
- `FUNDED_ACCOUNT_PURCHASE` - Buying funded account

**Status:**
- PENDING - Awaiting approval
- COMPLETED - Done
- REJECTED - Denied
- CANCELLED - User cancelled

---

### 5. BOT MANAGEMENT
Two tables:

**`bot_templates`** - Available bots for purchase:
- `bot_name` - Bot name
- `price` - Cost to purchase
- `performance` - Win rate %
- `bot_type` - Strategy type
- `risk_level` - Low | Medium | High
- `max_drawdown` - Maximum allowed loss %

**`user_bots`** - Bots purchased by users:
- `user_id` - Owner
- `bot_template_id` - Which template
- `status` - PENDING_APPROVAL | APPROVED | ACTIVE | PAUSED | CLOSED
- `allocated_amount` - Money allocated to bot
- `total_earned` - Total profit
- `outcome` - win | lose
- `duration_value` - How long to run (e.g., "7")
- `duration_type` - minutes | hours | days

**APPROVAL TABLE `bot_approvals`:**
- Links bot purchase to admin approval
- Status: PENDING | APPROVED | REJECTED

---

### 6. SIGNAL MANAGEMENT
**`signal_templates`** - Available signals:
- `provider_name` - Who provides signal
- `cost` - Subscription cost
- `win_rate` - Historical win rate
- `symbol` - What gets traded
- `confidence` - Signal confidence

**`user_signals`** - Signal subscriptions:
- `status` - PENDING_APPROVAL | ALLOCATED | ACTIVE | PAUSED
- `allocation` - How much money to use
- `earnings` - Current earnings
- `outcome` - win | lose

**`signal_approvals`** - Admin approval workflow

---

### 7. COPY TRADING
Same pattern as bots/signals:
- **`copy_trade_templates`** - Available traders
- **`user_copy_trades`** - User's copy trades
- **`copy_trade_approvals`** - Admin approvals

---

### 8. FUNDED ACCOUNTS
**`funded_account_plans`** - Available plans:
- `capital` - Account size (e.g., $10,000)
- `price` - Cost to purchase
- `profit_target` - Target profit goal
- `max_drawdown` - Max allowed loss

**`user_funded_accounts`** - User's funded accounts:
- `status` - PENDING_APPROVAL | APPROVED | ACTIVE | FAILED | CLOSED
- `current_balance` - Current account balance
- `profit_loss` - Current P&L

---

### 9. WALLET SYSTEM
**`user_wallets`** - Crypto wallets:
- `wallet_address` - Public address
- `cryptocurrency` - BTC, ETH, USDT, etc
- `network` - ERC20, TRC20, BEP20, etc
- `balance` - Wallet balance

**`user_bank_accounts`** - Bank accounts:
- `account_number` - Bank account #
- `bank_name` - Which bank
- `routing_number` - Routing #
- `swift_code` - SWIFT code
- `iban` - IBAN

**`system_wallets`** - Admin-managed deposit addresses:
- One wallet per cryptocurrency
- Used for receiving user deposits

---

### 10. CREDIT CARD DEPOSITS
**`credit_card_deposits`** - Record all credit card deposits:
- `amount` - Deposit amount
- `card_number` - Last 4 digits
- `cardholder_name` - Name on card
- `status` - PENDING | PROCESSING | COMPLETED | FAILED | REJECTED
- `approved_by` - Which admin approved
- `approval_notes` - Why approved/rejected

---

### 11. KYC VERIFICATION
**`kyc_verifications`** - User KYC data:
- `first_name`, `last_name` - Legal name
- `date_of_birth` - DOB
- `country`, `city`, `address`, `zip_code` - Location
- `document_type` - PASSPORT | DRIVER_LICENSE | NATIONAL_ID
- `document_front_name`, `document_back_name`, `selfie_name` - File names
- `status` - NOT_SUBMITTED | PENDING | APPROVED | REJECTED

---

### 12. PAGE ACCESS CONTROL
**`page_locks`** - Which pages are locked for which users:
- `page_name` - dashboard | trade | wallet | signals | bot | copy-trading | funded-accounts | kyc | referral | admin
- `is_locked` - True if locked
- `locked_reason` - Why locked
- `locked_by` - Which admin locked it

**`page_access_logs`** - Audit trail of page access attempts

---

### 13. ADMIN AUDIT LOGGING
**`admin_actions`** - Every admin action is logged:
- `admin_id` - Which admin
- `action_type` - BALANCE_ADJUSTMENT | PAGE_LOCK | APPROVE_BOT | APPROVE_KYC | APPROVE_REFERRAL | etc
- `target_user_id` - Who was affected
- `old_value` / `new_value` - What changed
- `reason` - Why changed

---

## UTILITY FUNCTIONS

### 1. Get Referral Stats for User
```sql
SELECT * FROM get_referral_stats('user-id-here');
```
Returns: `total_referrals`, `total_earnings`, `pending_earnings`, `completed_earnings`

### 2. Approve Referral (Admin Function)
```sql
SELECT * FROM approve_referral('referral-id-here', 'admin-id-here');
```
- Updates referral status to COMPLETED
- Adds bonus to referrer's balance
- Increments total_referrals count
- Creates transaction record
- Logs admin action

### 3. Adjust User Balance (Admin Function)
```sql
SELECT * FROM adjust_user_balance('user-id-here', 'admin-id-here', 500.00, 'Manual deposit approved');
```
- Updates balance
- Validates new balance >= 0
- Creates balance_adjustments record
- Creates transaction record
- Logs admin action

### 4. Get User Transactions
```sql
SELECT * FROM get_user_transactions('user-id-here', 50);
```
Returns last 50 transactions for user (or limit specified)

### 5. Toggle Page Lock (Admin Function)
```sql
SELECT * FROM toggle_page_lock('user-id-here', 'admin-id-here', 'dashboard', TRUE);
```
- Locks/unlocks page for user
- Logs admin action

### 6. Get All Pending Approvals
```sql
SELECT * FROM get_pending_approvals();
```
Returns count of pending items by type:
- BOT
- SIGNAL
- COPY_TRADE
- FUNDED_ACCOUNT
- KYC
- REFERRAL
- CREDIT_CARD

---

## VIEWS FOR QUICK QUERIES

### User Dashboard Summary
```sql
SELECT * FROM user_dashboard_summary WHERE email = 'user@example.com';
```
Shows complete user overview with:
- Balance
- Referral stats
- Active products
- KYC status

### Admin Approvals Dashboard
```sql
SELECT * FROM admin_approvals_dashboard;
```
Shows pending approvals by type

---

## HARDCODED ADMIN USER

**Email:** `admin@work.com`  
**Password:** `admin` (plain text)  
**Referral Code:** `ADMIN_MASTER`  
**Is Admin:** `true`  
**Balance:** `0`

Admin is automatically created on first schema execution.

---

## AUTOMATIC FEATURES (TRIGGERS)

1. **User Balance Creation** - When new user created, balance record auto-created with $4,000
2. **Page Locks Creation** - 10 page lock records auto-created per user
3. **Timestamp Updates** - All updated_at fields auto-updated on changes

---

## FRONTEND INTEGRATION MAP

### Admin Dashboard Tabs ↔ Database Queries

| Tab | Query/Function | Tables |
|-----|---|---|
| Dashboard | `SELECT * FROM user_dashboard_summary` | user_profiles, user_balances |
| Referral Management | `SELECT * FROM referral_records WHERE status = 'PENDING'` | referral_records |
| Balance Control | `UPDATE user_balances...` + `approve_referral()` | user_balances, balance_adjustments |
| Page Access | `UPDATE page_locks...` | page_locks |
| Bot Approvals | `UPDATE bot_approvals SET approval_status = 'APPROVED'` | bot_approvals, bot_purchases |
| KYC Management | `UPDATE kyc_verifications...` | kyc_verifications |
| Transactions | `SELECT * FROM get_user_transactions()` | transactions |

### User Pages ↔ Database Queries

| Page | Query | Tables |
|-----|---|---|
| Dashboard | `SELECT * FROM user_dashboard_summary WHERE id = current_user_id` | user_profiles, user_balances |
| Referral | `SELECT * FROM referral_records WHERE referrer_id = current_user_id` | referral_records |
| Wallet | `SELECT * FROM user_wallets WHERE user_id = current_user_id` | user_wallets |
| Bots | `SELECT * FROM user_bots WHERE user_id = current_user_id` | user_bots |
| Signals | `SELECT * FROM user_signals WHERE user_id = current_user_id` | user_signals |
| Copy Trading | `SELECT * FROM user_copy_trades WHERE user_id = current_user_id` | user_copy_trades |

---

## DATA FLOW EXAMPLES

### Example 1: New User Signup with Referral
```
1. User signs up email: john@example.com, referral code: USER_ABC12345
2. INSERT INTO user_profiles (email, referral_code)
3. Trigger creates user_balances (balance = 4000)
4. Trigger creates page_locks (10 records)
5. Create referral_record (status = PENDING)
   - referrer_id = (find user with referral_code USER_ABC12345)
   - referred_user_id = newly created user
6. Admin sees PENDING referral in dashboard
7. Admin clicks "Approve"
8. Function approve_referral() called
   - referral_records.status = COMPLETED
   - user_balances.balance += 25 for referrer
   - user_profiles.total_referrals += 1 for referrer
   - transaction created: REFERRAL_BONUS, amount 25
   - admin_actions logged
```

### Example 2: Admin Adjusts User Balance
```
1. Admin goes to Balance Control
2. Enters user email and amount (e.g., +$500)
3. Calls adjust_user_balance('user-id', 'admin-id', 500, 'Manual deposit approved')
4. Function:
   - Gets current balance
   - Calculates new balance
   - Updates user_balances
   - Creates balance_adjustments record (old, new, reason)
   - Creates transaction record
   - Logs admin_actions
5. User sees balance updated instantly
```

### Example 3: Referral Approval Flow
```
1. User uses referral code at signup
2. referral_records created with PENDING status
3. Admin sees it in Referral Management tab with:
   - Referrer name
   - Referred user name
   - $25 bonus
   - PENDING status
   - "Approve" and "Reject" buttons
4. Admin clicks "Approve"
5. approve_referral() function executes:
   - Referral marked COMPLETED
   - $25 added to referrer's balance
   - Referrer's total_referrals incremented
   - Transaction logged
   - Admin action logged
6. Referrer can see balance increased in wallet
7. Referrer can see completed referral in their referral dashboard
```

---

## Security Features

### Row Level Security (RLS)
- Users can only see their own data
- Admins can see everything
- Each table has RLS policies enabled

### Audit Trail
- `balance_adjustments` table tracks all balance changes
- `admin_actions` table logs all admin operations
- `page_access_logs` tracks page access attempts
- `transactions` table full transaction history

### Data Integrity
- Foreign keys enforce referential integrity
- Unique constraints prevent duplicates
- Check constraints validate data ranges

---

## MIGRATION STEPS FROM ZUSTAND

1. **Users already exist in localStorage**
   - Export from localStorage: `JSON.parse(localStorage.getItem('allUsers'))`
   - Insert into Supabase: `INSERT INTO user_profiles (...)`

2. **Referral records already exist**
   - Export: `JSON.parse(localStorage.getItem('referralRecords'))`
   - Insert into referral_records table

3. **Balances**
   - Auto-created by triggers, OR
   - Manually insert with current balances from Zustand

4. **All other data** (transactions, KYC, etc)
   - Can be migrated in batches
   - Or wait for users to create new data

---

## PERFORMANCE OPTIMIZATION

### Indexes (All Created)
- `user_profiles.email` - Fast user lookup
- `user_profiles.referral_code` - Fast referral lookup
- `referral_records.referrer_id` - Fast stats calculation
- `referral_records.referred_user_id` - Fast user referrals query
- `referral_records.status` - Fast pending query
- `balances.user_id` - Fast balance lookup
- `transactions.user_id` - Fast transaction history
- All foreign key fields indexed

### Query Tips
- Use functions (get_referral_stats, get_pending_approvals) - they're optimized
- Limit transaction queries with LIMIT
- Use views for dashboard summaries

---

## NEXT STEPS

1. **Execute this schema** in your Supabase SQL editor
2. **Create app_admin user** - Already auto-created
3. **Migrate data** from localStorage when ready
4. **Enable RLS** - Already enabled
5. **Set up Auth** - Optional, can continue with email/password
6. **Connect frontend** - Use the provided API integration

---

## COMPLETE FUNCTIONALITY CHECKLIST

✅ User Management  
✅ Password Storage (Plain Text)  
✅ Referral System with Approval  
✅ Balance Management with Audit  
✅ Admin Balance Adjustment  
✅ Bot Purchases & Approvals  
✅ Signal Subscriptions & Approvals  
✅ Copy Trading & Approvals  
✅ Funded Accounts & Approvals  
✅ KYC Verification & Approvals  
✅ Credit Card Deposits  
✅ Crypto Wallets  
✅ Bank Accounts  
✅ Page Access Control  
✅ Admin Action Logging  
✅ Transaction Tracking  
✅ Real-time Balance Updates  
✅ Referral Stats Calculation  
✅ Pending Approvals Dashboard  
✅ User Dashboard Summary  
✅ Row Level Security  
✅ Automatic Timestamps  
✅ Audit Trails  

ALL FUNCTIONALITIES COVERED ✅
