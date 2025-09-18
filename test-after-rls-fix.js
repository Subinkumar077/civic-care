// Test script to verify issue submission works after RLS fix
// Run this in browser console after running clean-rls-fix.sql

async function testAfterRLSFix() {
    console.log('🧪 Testing Issue Submission After RLS Fix...');
    
    try {
        // Check authentication
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ Please log in first');
            return false;
        }
        
        console.log('✅ User authenticated:', session.user.email);
        
        // Test 1: Check if we can read issues (public access)
        console.log('1️⃣ Testing public read access...');
        const { data: publicIssues, error: publicError } = await supabase
            .from('civic_issues')
            .select('id, title, status')
            .limit(5);
        
        if (publicError) {
            console.error('❌ Public read access failed:', publicError);
            return false;
        }
        
        console.log('✅ Public read access works, found issues:', publicIssues?.length || 0);
        
        // Test 2: Check if we can create an issue (authenticated access)
        console.log('2️⃣ Testing issue creation...');
        
        const testIssueData = {
            title: 'RLS Fix Test Issue - ' + Date.now(),
            description: 'This is a test issue created after running the RLS fix to verify that issue submission works properly.',
            category: 'infrastructure',
            priority: 'medium',
            status: 'submitted',
            address: 'Test Address After RLS Fix',
            reporter_id: session.user.id,
            reporter_name: 'Test User',
            reporter_email: session.user.email,
            reporter_phone: '+919876543210',
            created_at: new Date().toISOString()
        };
        
        const { data: newIssue, error: createError } = await supabase
            .from('civic_issues')
            .insert([testIssueData])
            .select()
            .single();
        
        if (createError) {
            console.error('❌ Issue creation failed:', createError);
            
            if (createError.message.includes('permission denied')) {
                console.log('💡 Still have permission issues - check RLS policies');
            } else if (createError.message.includes('violates check constraint')) {
                console.log('💡 Data validation issue - check required fields');
            }
            
            return false;
        }
        
        console.log('✅ Issue creation successful:', newIssue.id);
        
        // Test 3: Test the robust service
        console.log('3️⃣ Testing robust submission service...');
        
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        const serviceTestData = {
            title: 'Robust Service Test After RLS Fix',
            description: 'This is a test of the robust issue submission service after applying the RLS fix.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Robust Service Test Location',
                coordinates: {
                    lat: 28.6139,
                    lng: 77.2090
                }
            },
            images: [],
            contactInfo: {
                name: 'Test User',
                email: session.user.email,
                phone: '+919876543210'
            }
        };
        
        const serviceResult = await civicIssueService.createIssue(serviceTestData);
        
        if (!serviceResult.success) {
            console.error('❌ Robust service failed:', serviceResult.error);
            return false;
        }
        
        console.log('✅ Robust service works:', serviceResult.data.id);
        
        // Test 4: Verify we can read the created issues
        console.log('4️⃣ Testing if created issues are readable...');
        
        const { data: verifyIssues, error: verifyError } = await supabase
            .from('civic_issues')
            .select('*')
            .in('id', [newIssue.id, serviceResult.data.id]);
        
        if (verifyError) {
            console.error('❌ Could not verify created issues:', verifyError);
        } else {
            console.log('✅ Created issues are readable:', verifyIssues.length);
        }
        
        // Test 5: Test notifications (if configured)
        console.log('5️⃣ Testing notifications...');
        
        try {
            const { notificationService } = await import('./src/services/notificationService.js');
            
            // Check if Twilio is configured
            const twilioConfigured = !!(
                import.meta.env.VITE_TWILIO_ACCOUNT_SID &&
                import.meta.env.VITE_TWILIO_AUTH_TOKEN &&
                import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER
            );
            
            if (twilioConfigured) {
                const notificationResult = await notificationService.sendIssueNotifications(
                    serviceResult.data, 
                    'created'
                );
                
                console.log('📱 Notification test result:', notificationResult);
                
                if (notificationResult.user?.success) {
                    console.log('✅ WhatsApp notification sent successfully');
                } else {
                    console.warn('⚠️ WhatsApp notification failed:', notificationResult.user?.error);
                }
            } else {
                console.log('ℹ️ Twilio not configured - skipping notification test');
            }
        } catch (notificationError) {
            console.warn('⚠️ Notification test failed:', notificationError.message);
        }
        
        console.log('🎉 All tests passed! Issue submission should work properly now.');
        console.log('💡 You can now test the UI by submitting a report through the form.');
        
        return true;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        return false;
    }
}

// Quick environment check
function quickEnvCheck() {
    console.log('🔧 Quick Environment Check...');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase environment variables missing');
        return false;
    }
    
    console.log('✅ Supabase environment variables configured');
    
    const twilioVars = [
        'VITE_TWILIO_ACCOUNT_SID',
        'VITE_TWILIO_AUTH_TOKEN',
        'VITE_TWILIO_WHATSAPP_NUMBER'
    ];
    
    const twilioConfigured = twilioVars.every(varName => !!import.meta.env[varName]);
    
    if (twilioConfigured) {
        console.log('✅ Twilio WhatsApp variables configured');
    } else {
        console.log('⚠️ Twilio WhatsApp variables not fully configured (notifications may not work)');
    }
    
    return true;
}

// Run the test
console.log('🚀 Starting Post-RLS-Fix Test...');
quickEnvCheck();
testAfterRLSFix();