// Debug script to check signup issues
// Run this in browser console to diagnose the problem

async function debugSignupIssue() {
    console.log('🔍 Debugging signup issue...');
    
    try {
        // Import Supabase client
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check Supabase connection
        console.log('📡 Testing Supabase connection...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('user_profiles')
            .select('count')
            .limit(1);
        
        if (connectionError) {
            console.error('❌ Supabase connection failed:', connectionError);
            return;
        }
        
        console.log('✅ Supabase connection successful');
        
        // Check auth configuration
        console.log('🔐 Checking auth configuration...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        // Test signup with a unique email
        const testEmail = `test-debug-${Date.now()}@example.com`;
        const testPassword = 'testpass123';
        
        console.log('📝 Testing signup with:', testEmail);
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Debug Test User',
                    role: 'citizen',
                    phone: '+919876543210'
                }
            }
        });
        
        console.log('Signup result:', { signupData, signupError });
        
        if (signupError) {
            console.error('❌ Signup failed:', signupError);
            
            // Check common issues
            if (signupError.message.includes('Failed to fetch')) {
                console.log('💡 Possible issue: Supabase project is paused or network issue');
            } else if (signupError.message.includes('User already registered')) {
                console.log('💡 Possible issue: Email already exists');
            } else if (signupError.message.includes('Invalid email')) {
                console.log('💡 Possible issue: Email validation failed');
            } else if (signupError.message.includes('Password')) {
                console.log('💡 Possible issue: Password requirements not met');
            }
            
            return false;
        }
        
        if (signupData?.user) {
            console.log('✅ Signup successful!');
            console.log('User ID:', signupData.user.id);
            console.log('Email confirmed:', !!signupData.user.email_confirmed_at);
            
            // Wait for profile creation
            console.log('⏳ Waiting for profile creation...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if profile was created
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', signupData.user.id)
                .single();
            
            if (profileError) {
                console.error('❌ Profile not created:', profileError);
                console.log('💡 This might be why login fails - no profile exists');
            } else {
                console.log('✅ Profile created successfully:', profile);
            }
            
            // Test immediate login
            if (signupData.user.email_confirmed_at) {
                console.log('🔐 Testing immediate login...');
                
                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: testEmail,
                    password: testPassword
                });
                
                if (loginError) {
                    console.error('❌ Immediate login failed:', loginError);
                    console.log('💡 This explains the "Invalid email or password" error');
                } else {
                    console.log('✅ Immediate login successful:', loginData);
                }
            }
            
            return true;
        }
        
    } catch (error) {
        console.error('💥 Debug failed:', error);
        return false;
    }
}

// Check Supabase project settings
async function checkSupabaseSettings() {
    console.log('⚙️ Checking Supabase settings...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check if email confirmation is required
        console.log('📧 Email confirmation settings:');
        console.log('- Check your Supabase dashboard > Authentication > Settings');
        console.log('- Look for "Enable email confirmations"');
        console.log('- If enabled, users must confirm email before login');
        
        // Check RLS policies
        console.log('🔒 Checking RLS policies...');
        const { data: policies, error } = await supabase.rpc('get_policies_for_table', { table_name: 'user_profiles' });
        
        if (error) {
            console.log('Could not check policies (this is normal)');
        } else {
            console.log('RLS policies:', policies);
        }
        
    } catch (error) {
        console.error('Settings check failed:', error);
    }
}

// Run both checks
console.log('🚀 Starting comprehensive signup debug...');
checkSupabaseSettings();
debugSignupIssue();