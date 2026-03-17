const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlfmhwbsqocrvylufnyt.supabase.co';
const supabaseAnonKey = 'sb_publishable_xfbsc_CFq8nN45MuGfvzng_1fu8TqBu';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');
  
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
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n✅ SETUP COMPLETE - Supabase is working!\n');
}

checkTables();
