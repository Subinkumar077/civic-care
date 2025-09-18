// Comprehensive test for robust issue submission
// Run this in browser console after logging in

async function testRobustSubmission() {
    console.log('🧪 Testing Robust Issue Submission...');
    
    try {
        // Step 1: Check authentication
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ Please log in first');
            return false;
        }
        
        console.log('✅ User authenticated:', session.user.email);
        
        // Step 2: Check user profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.warn('⚠️ User profile issue:', profileError.message);
        } else {
            console.log('✅ User profile found:', {
                name: profile.full_name,
                email: profile.email,
                phone: profile.phone || 'NOT SET'
            });
        }
        
        // Step 3: Test database permissions
        console.log('🔒 Testing database permissions...');
        
        const testData = {
            title: 'Test Robust Submission',
            description: 'This is a comprehensive test of the robust issue submission system.',
            category: 'infrastructure',
            priority: 'medium',
            status: 'submitted',
            address: 'Test Address for Robust Submission',
            reporter_id: session.user.id,
            reporter_name: profile?.full_name || 'Test User',
            reporter_email: profile?.email || session.user.email,
            reporter_phone: profile?.phone || '+919876543210',
            created_at: new Date().toISOString()
        };
        
        const { data: testIssue, error: testError } = await supabase
            .from('civic_issues')
            .insert([testData])
            .select()
            .single();
        
        if (testError) {
            console.error('❌ Database permission test failed:', testError);
            
            if (testError.message.includes('permission denied')) {
                console.log('💡 Fix: Run fix-issue-creation-rls.sql in Supabase');
            }
            
            return false;
        }
        
        console.log('✅ Database permissions OK, test issue created:', testIssue.id);
        
        // Step 4: Test the robust service
        console.log('🚀 Testing robust submission service...');
        
        const testFormData = {
            title: 'Robust Service Test Issue',
            description: 'This is a test of the robust issue submission service with comprehensive error handling and WhatsApp notifications.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Robust Test Location, Test City',
                coordinates: {
                    lat: 28.6139,
                    lng: 77.2090
                }
            },
            images: [],
            contactInfo: {
                name: profile?.full_name || 'Test User',
                email: profile?.email || session.user.email,
                phone: profile?.phone || '+919876543210'
            }
        };
        
        // Import the service
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        const serviceResult = await civicIssueService.createIssue(testFormData);
        
        if (!serviceResult.success) {
            console.error('❌ Robust service test failed:', serviceResult.error);
            return false;
        }
        
        console.log('✅ Robust service test passed:', serviceResult.data.id);
        
        // Step 5: Test notifications
        console.log('📱 Testing WhatsApp notifications...');
        
        const { notificationService } = await import('./src/services/notificationService.js');
        
        const notificationResult = await notificationService.sendIssueNotifications(
            serviceResult.data, 
            'created'
        );
        
        console.log('📨 Notification test result:', notificationResult);
        
        if (notificationResult.user?.success) {
            console.log('✅ User WhatsApp notification test passed');
        } else {
            console.warn('⚠️ User notification test failed:', notificationResult.user?.error);
        }
        
        // Step 6: Test reports listing
        console.log('📋 Testing reports listing...');
        
        const { data: allIssues, error: listError } = await supabase
            .from('civic_issues')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (listError) {
            console.error('❌ Reports listing test failed:', listError);
        } else {
            console.log('✅ Reports listing test passed, found issues:', allIssues.length);
        }
        
        console.log('🎉 All tests completed successfully!');
        console.log('💡 You can now test the UI by submitting a report through the form');
        
        return true;
        
    } catch (error) {
        console.error('💥 Test suite failed:', error);
        return false;
    }
}

// Test environment variables
function testEnvironmentConfig() {
    console.log('🔧 Testing Environment Configuration...');
    
    const requiredVars = [
        'VITE_TWILIO_ACCOUNT_SID',
        'VITE_TWILIO_AUTH_TOKEN',
        'VITE_TWILIO_WHATSAPP_NUMBER',
        'VITE_ADMIN_PHONE_NUMBER'
    ];
    
    const config = {};
    const missing = [];
    
    requiredVars.forEach(varName => {
        const value = import.meta.env[varName];
        if (!value) {
            missing.push(varName);
        } else {
            config[varName] = varName.includes('TOKEN') ? '***SET***' : value;
        }
    });
    
    console.table(config);
    
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:');
        missing.forEach(varName => console.log(`   - ${varName}`));
        console.log('💡 Add these to your .env file and restart the server');
        return false;
    }
    
    console.log('✅ All environment variables are configured');
    return true;
}

// Run comprehensive test
console.log('🚀 Starting Comprehensive Robust Submission Test...');
testEnvironmentConfig();
testRobustSubmission();