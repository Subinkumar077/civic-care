// Simple, bulletproof issue submission test
// Run this in browser console after logging in

async function simpleIssueSubmissionTest() {
    console.log('🧪 Simple Issue Submission Test...');
    
    try {
        // Get Supabase client
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            console.error('❌ Please log in first');
            return false;
        }
        
        console.log('✅ User authenticated:', session.user.email);
        
        // Get user profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        console.log('👤 User profile:', profile?.full_name || 'No profile found');
        
        // Create the simplest possible issue
        const simpleIssueData = {
            title: 'Simple Test Issue - ' + new Date().toLocaleTimeString(),
            description: 'This is a simple test issue to verify that basic issue submission works without any complex features.',
            category: 'infrastructure',
            priority: 'medium',
            status: 'submitted',
            address: 'Simple Test Address, Test City',
            reporter_id: session.user.id,
            reporter_name: profile?.full_name || session.user.email.split('@')[0],
            reporter_email: profile?.email || session.user.email,
            reporter_phone: profile?.phone || '+919876543210',
            created_at: new Date().toISOString()
        };
        
        console.log('📝 Creating simple issue...');
        console.log('Data:', simpleIssueData);
        
        // Direct database insertion
        const { data: createdIssue, error: createError } = await supabase
            .from('civic_issues')
            .insert([simpleIssueData])
            .select()
            .single();
        
        if (createError) {
            console.error('❌ Simple issue creation failed:', createError);
            
            // Provide specific solutions
            if (createError.message.includes('permission denied')) {
                console.log('🔧 SOLUTION: Run this in Supabase SQL Editor:');
                console.log(`
-- Quick RLS fix for issue submission
ALTER TABLE public.civic_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_can_create_issues" ON public.civic_issues;
CREATE POLICY "authenticated_can_create_issues"
ON public.civic_issues
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "public_can_read_issues" ON public.civic_issues;
CREATE POLICY "public_can_read_issues"
ON public.civic_issues
FOR SELECT
TO public
USING (true);

GRANT ALL ON public.civic_issues TO authenticated;
GRANT SELECT ON public.civic_issues TO anon;
                `);
            } else if (createError.message.includes('violates check constraint')) {
                console.log('🔧 ISSUE: Data validation failed');
                console.log('Check that all required fields are provided');
            } else if (createError.message.includes('foreign key')) {
                console.log('🔧 ISSUE: User profile reference problem');
                console.log('Ensure user_profiles table exists and user has a profile');
            }
            
            return false;
        }
        
        console.log('✅ Simple issue created successfully!');
        console.log('📋 Issue ID:', createdIssue.id);
        console.log('📝 Title:', createdIssue.title);
        
        // Test if we can read it back
        const { data: readBack, error: readError } = await supabase
            .from('civic_issues')
            .select('*')
            .eq('id', createdIssue.id)
            .single();
        
        if (readError) {
            console.error('❌ Could not read back created issue:', readError);
        } else {
            console.log('✅ Issue readable after creation');
        }
        
        // Test notifications (if configured)
        console.log('📱 Testing notifications...');
        
        try {
            const { notificationService } = await import('./src/services/notificationService.js');
            
            const notificationResult = await notificationService.sendIssueNotifications(
                createdIssue, 
                'created'
            );
            
            console.log('📨 Notification result:', notificationResult);
            
            if (notificationResult.user?.success) {
                console.log('✅ User WhatsApp notification sent');
            } else {
                console.log('⚠️ User notification failed:', notificationResult.user?.error);
            }
            
        } catch (notificationError) {
            console.log('⚠️ Notification test failed:', notificationError.message);
            console.log('💡 This is OK - notifications are optional');
        }
        
        console.log('🎉 Simple submission test completed successfully!');
        console.log('💡 The basic functionality works - issue might be in the UI form');
        
        return true;
        
    } catch (error) {
        console.error('💥 Simple test failed:', error);
        return false;
    }
}

// Run the simple test
console.log('🚀 Starting Simple Issue Submission Test...');
simpleIssueSubmissionTest();