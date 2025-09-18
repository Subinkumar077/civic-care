// Quick signup test - Run this in browser console
// This will help us understand what's happening during signup

async function quickSignupTest() {
    console.log('🧪 Quick Signup Test Starting...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Test 1: Check if we can connect to Supabase
        console.log('1️⃣ Testing Supabase connection...');
        const { data: testConnection } = await supabase.from('user_profiles').select('count').limit(1);
        console.log('✅ Supabase connection works');
        
        // Test 2: Check current auth state
        console.log('2️⃣ Checking current auth state...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session ? 'Logged in' : 'Not logged in');
        
        // Test 3: Try a simple signup
        const testEmail = `quicktest-${Date.now()}@example.com`;
        const testPassword = 'testpass123';
        
        console.log('3️⃣ Testing signup with:', testEmail);
        
        const signupResult = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Quick Test User',
                    role: 'citizen',
                    phone: '+919876543210'
                }
            }
        });
        
        console.log('Signup result:', signupResult);
        
        if (signupResult.error) {
            console.error('❌ Signup failed:', signupResult.error.message);
            
            // Common error analysis
            if (signupResult.error.message.includes('Failed to fetch')) {
                console.log('💡 Issue: Network problem or Supabase project paused');
                console.log('🔧 Solution: Check Supabase dashboard, ensure project is active');
            } else if (signupResult.error.message.includes('Invalid email')) {
                console.log('💡 Issue: Email format validation failed');
            } else if (signupResult.error.message.includes('Password')) {
                console.log('💡 Issue: Password requirements not met');
            }
            
            return false;
        }
        
        if (signupResult.data?.user) {
            console.log('✅ Signup successful!');
            console.log('User ID:', signupResult.data.user.id);
            console.log('Email confirmed:', !!signupResult.data.user.email_confirmed_at);
            
            // Test 4: Check if profile gets created
            console.log('4️⃣ Waiting for profile creation...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', signupResult.data.user.id)
                .single();
            
            if (profileError) {
                console.error('❌ Profile not found:', profileError.message);
                console.log('💡 Issue: User profile trigger not working');
                console.log('🔧 Solution: Run the comprehensive-signup-fix.sql script');
                
                // Try to create profile manually
                console.log('🔧 Attempting manual profile creation...');
                const { error: manualProfileError } = await supabase
                    .from('user_profiles')
                    .insert([{
                        id: signupResult.data.user.id,
                        email: testEmail,
                        full_name: 'Quick Test User',
                        role: 'citizen',
                        phone: '+919876543210'
                    }]);
                
                if (manualProfileError) {
                    console.error('❌ Manual profile creation failed:', manualProfileError.message);
                } else {
                    console.log('✅ Manual profile creation successful');
                }
            } else {
                console.log('✅ Profile created automatically:', profile);
            }
            
            // Test 5: Try immediate login
            if (signupResult.data.user.email_confirmed_at) {
                console.log('5️⃣ Testing immediate login...');
                
                const loginResult = await supabase.auth.signInWithPassword({
                    email: testEmail,
                    password: testPassword
                });
                
                if (loginResult.error) {
                    console.error('❌ Immediate login failed:', loginResult.error.message);
                    console.log('💡 This explains why users see "Invalid email or password"');
                } else {
                    console.log('✅ Immediate login successful');
                }
            } else {
                console.log('📧 Email confirmation required - check Supabase auth settings');
            }
            
            return true;
        }
        
        console.error('❌ No user data returned from signup');
        return false;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        return false;
    }
}

// Also check Supabase configuration
function checkSupabaseConfig() {
    console.log('⚙️ Supabase Configuration Check:');
    console.log('1. Go to Supabase Dashboard → Authentication → Settings');
    console.log('2. Check "Enable email confirmations" setting');
    console.log('3. If enabled, users must confirm email before login');
    console.log('4. For testing, consider disabling email confirmations');
    console.log('5. Check if your project is paused (common cause of failures)');
}

// Run the test
console.log('🚀 Starting Quick Signup Test...');
checkSupabaseConfig();
quickSignupTest();