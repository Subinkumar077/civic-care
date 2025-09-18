// Test script to verify signup process
// Run this in browser console to test user registration

async function testSignupProcess() {
    console.log('🧪 Testing signup process...');
    
    // Test user data
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'testpass123',
        fullName: 'Test User',
        role: 'citizen',
        phone: '+919876543210'
    };
    
    try {
        // Import Supabase client
        const { supabase } = await import('./src/lib/supabase.js');
        
        console.log('📝 Attempting to sign up user:', testUser.email);
        
        // Attempt signup
        const { data, error } = await supabase.auth.signUp({
            email: testUser.email,
            password: testUser.password,
            options: {
                data: {
                    full_name: testUser.fullName,
                    role: testUser.role,
                    phone: testUser.phone
                }
            }
        });
        
        if (error) {
            console.error('❌ Signup failed:', error);
            return false;
        }
        
        console.log('✅ Signup successful:', data);
        
        if (data.user) {
            console.log('👤 User created with ID:', data.user.id);
            
            // Wait a moment for the trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if profile was created
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) {
                console.error('❌ Profile not found:', profileError);
                return false;
            }
            
            console.log('✅ User profile created:', profile);
            
            // Clean up - delete the test user (optional)
            console.log('🧹 Test completed successfully!');
            console.log('Note: Test user created. You may want to delete it from Supabase dashboard.');
            
            return true;
        }
        
    } catch (error) {
        console.error('💥 Test failed with error:', error);
        return false;
    }
}

// Also test the current auth state
async function checkAuthState() {
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (session?.user) {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            console.log('Current user profile:', profile);
        }
        
    } catch (error) {
        console.error('Auth state check failed:', error);
    }
}

// Run tests
console.log('🔍 Checking current auth state...');
checkAuthState();

console.log('🧪 Starting signup test...');
testSignupProcess();