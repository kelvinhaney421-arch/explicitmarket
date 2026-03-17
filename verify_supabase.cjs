const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlfmhwbsqocrvylufnyt.supabase.co';
const supabaseAnonKey = 'sb_publishable_xfbsc_CFq8nN45MuGfvzng_1fu8TqBu';

console.log('Creating Supabase client...');
console.log('URL:', supabaseUrl);

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Client created successfully');
  console.log('\nAttempting to query user_profiles table...');
  
  // Simpler query
  supabase
    .from('user_profiles')
    .select('count(*)', { count: 'exact' })
    .then(response => {
      if (response.error) {
        console.log('❌ Query error:', response.error.message);
      } else {
        console.log('✅ Successfully connected to user_profiles table');
        console.log('Response:', response);
      }
      process.exit(0);
    })
    .catch(err => {
      console.log('❌ Error:', err.message);
      process.exit(1);
    });
    
  // Timeout after 10 seconds
  setTimeout(() => {
    console.log('⏲️ Request timed out');
    process.exit(1);
  }, 10000);
} catch (error) {
  console.log('❌ Error:', error.message);
  process.exit(1);
}
