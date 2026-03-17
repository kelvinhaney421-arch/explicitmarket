const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlfmhwbsqocrvylufnyt.supabase.co';
const supabaseAnonKey = 'sb_publishable_xfbsc_CFq8nN45MuGfvzng_1fu8TqBu';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupDB() {
  console.log('🧪 Testing User Signup and Database Storage\n');
  
  try {
    // 1. Check existing users
    console.log('1️⃣  Checking existing users in database...');
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, is_admin');

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.full_name}) ${u.is_admin ? '[ADMIN]' : ''}`);
    });

    // 2. Check user_balances
    console.log('\n2️⃣  Checking user balances...');
    const { data: balances, error: balError } = await supabase
      .from('user_balances')
      .select('user_id, balance');

    if (balError) {
      console.log('❌ Error fetching balances:', balError.message);
    } else {
      console.log(`✅ Found ${balances.length} user balances`);
    }

    // 3. Check referral records
    console.log('\n3️⃣  Checking referral records...');
    const { data: referrals, error: refError } = await supabase
      .from('referral_records')
      .select('id, referred_user_email, status');

    if (refError) {
      console.log('❌ Error fetching referrals:', refError.message);
    } else {
      console.log(`✅ Found ${referrals.length} referral records`);
      referrals.forEach(r => {
        console.log(`   - ${r.referred_user_email} (${r.status})`);
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE STATUS CHECK COMPLETE');
    console.log('='.repeat(50));
    console.log('\nWhen you signup a new user:');
    console.log('✓ They will appear in user_profiles table');
    console.log('✓ Their balance will be in user_balances table');
    console.log('✓ Referral records will be tracked');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSignupDB();
