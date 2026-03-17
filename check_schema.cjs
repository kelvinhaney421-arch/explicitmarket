const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlfmhwbsqocrvylufnyt.supabase.co';
const supabaseAnonKey = 'sb_publishable_xfbsc_CFq8nN45MuGfvzng_1fu8TqBu';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('🔍 Checking user_profiles table schema...\n');
  
  try {
    // Get one row to see what columns exist
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columns in user_profiles:');
      console.log(Object.keys(data[0]).sort());
    } else {
      console.log('Table is empty, checking via information_schema...');
      // Try to get schema info via a direct query
      console.log('\nLikely columns (based on schema):');
      console.log('id, email, full_name, country, password, is_verified, is_admin, referral_code, referral_earnings, total_referrals, referred_by, created_at');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
