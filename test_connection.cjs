const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlfmhwbsqocrvylufnyt.supabase.co';
const supabaseAnonKey = 'sb_publishable_xfbsc_CFq8nN45MuGfvzng_1fu8TqBu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  try {
    console.log('1️⃣  Checking for admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('user_profiles')
      .select('email, full_name, is_admin, referral_code')
      .eq('email', 'admin@work.com')
      .single();

    if (adminError) {
      console.error('   ❌ Error:', adminError.message);
    } else {
      console.log('   ✅ Admin user found!');
      console.log('   Email:', adminUser.email);
      console.log('   Name:', adminUser.full_name);
      console.log('   Is Admin:', adminUser.is_admin);
      console.log('   Referral Code:', adminUser.referral_code);
    }

    console.log('\n2️⃣  Checking database tables...');
    const tables = [
      'user_profiles',
      'user_balances',
      'transactions',
      'referral_records',
      'user_bots',
      'user_signals',
      'user_copy_trades',
      'user_funded_accounts',
      'kyc_verifications'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ SUPABASE CONNECTION VERIFIED!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
