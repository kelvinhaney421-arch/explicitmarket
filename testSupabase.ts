import { supabase } from './src/lib/supabaseClient'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n')

  try {
    // Test 1: Check if we can reach the database
    console.log('✓ Supabase client initialized')
    console.log(`  URL: ${import.meta.env.VITE_SUPABASE_URL}`)
    
    // Test 2: Try to query user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, is_admin', { count: 'exact' })
      .limit(5)

    if (error) {
      console.error('❌ Query error:', error)
      return false
    }

    console.log('✓ Successfully queried user_profiles table')
    console.log(`  Total records: ${data?.length || 0}`)

    // Test 3: Check for admin user
    const { data: adminUser, error: adminError } = await supabase
      .from('user_profiles')
      .select('email, full_name, is_admin, referral_code')
      .eq('is_admin', true)
      .single()

    if (adminError) {
      console.error('❌ Admin check error:', adminError)
      return false
    }

    console.log('✓ Admin user found!')
    console.log(`  Email: ${adminUser?.email}`)
    console.log(`  Name: ${adminUser?.full_name}`)
    console.log(`  Referral Code: ${adminUser?.referral_code}`)

    // Test 4: Check referral_records table
    const { data: referrals, error: refError } = await supabase
      .from('referral_records')
      .select('*')
      .limit(1)

    if (refError) {
      console.error('❌ Referral check error:', refError)
      return false
    }

    console.log('✓ Referral system table exists')

    // Test 5: Check user_balances table
    const { data: balances, error: balError } = await supabase
      .from('user_balances')
      .select('*')
      .limit(1)

    if (balError) {
      console.error('❌ Balance check error:', balError)
      return false
    }

    console.log('✓ Balance system table exists')

    console.log('\n🎉 ALL TESTS PASSED! Supabase is fully functional!\n')
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    return false
  }
}

// Run tests
testSupabaseConnection().then(success => {
  if (!success) {
    process.exit(1)
  }
})
