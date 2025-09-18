// Comprehensive diagnostic script for issue submission failure
// Run this in browser console after logging in as the new user

async function diagnoseSubmissionFailure() {
    console.log('🔍 Diagnosing Issue Submission Failure...');
    
    try {
        // Step 1: Check authentication
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ User not authenticated');
            return { success: false, error: 'Not authenticated' };
        }
        
        console.log('✅ User authenticated:', {
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at
        });
        
        // Step 2: Check user profile
        console.log('👤 Checking user profile...');
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.error('❌ User profile error:', profileError);
            console.log('💡 This might prevent issue submission');
        } else {
            console.log('✅ User profile found:', {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                phone: profile.phone,
                role: profile.role
            });
        }
        
        // Step 3: Test basic database permissions
        console.log('🔒 Testing database permissions...');
        
        // Test read permission
        const { data: readTest, error: readError } = await supabase
            .from('civic_issues')
            .select('id, title')
            .limit(1);
        
        if (readError) {
            console.error('❌ Read permission failed:', readError);
        } else {
            console.log('✅ Read permission works');
        }
        
        // Test insert permission with minimal data
        console.log('📝 Testing insert permission...');
        const testIssueData = {
            title: 'Diagnostic Test Issue - ' + Date.now(),
            description: 'This is a diagnostic test to identify why issue submission is failing.',
            category: 'infrastructure',
            priority: 'medium',
            status: 'submitted',
            address: 'Test Address for Diagnostic',
            reporter_id: session.user.id,
            reporter_name: profile?.full_name || 'Test User',
            reporter_email: profile?.email || session.user.email,
            reporter_phone: profile?.phone || '+919876543210'
        };
        
        const { data: insertTest, error: insertError } = await supabase
            .from('civic_issues')
            .insert([testIssueData])
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ Insert permission failed:', insertError);
            
            // Analyze the error
            if (insertError.message.includes('permission denied')) {
                console.log('💡 RLS policy is blocking insert - need to run clean-rls-fix.sql');
            } else if (insertError.message.includes('violates check constraint')) {
                console.log('💡 Data validation failed - check required fields');
            } else if (insertError.message.includes('foreign key')) {
                console.log('💡 Foreign key constraint failed - user_profiles reference issue');
            } else if (insertError.message.includes('null value')) {
                console.log('💡 Required field is null - check data preparation');
            }
            
            return { success: false, error: insertError.message };
        } else {
            console.log('✅ Insert permission works - test issue created:', insertTest.id);
        }
        
        // Step 4: Test the civic issue service
        console.log('🚀 Testing civic issue service...');
        
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        const serviceTestData = {
            title: 'Service Test Issue - ' + Date.now(),
            description: 'This is a test of the civic issue service to identify submission failures.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Service Test Address',
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
        
        const serviceResult = await civicIssueService.createIssue(serviceTestData);
        
        if (!serviceResult.success) {
            console.error('❌ Civic issue service failed:', serviceResult.error);
            return { success: false, error: serviceResult.error };
        } else {
            console.log('✅ Civic issue service works:', serviceResult.data.id);
        }
        
        // Step 5: Test the hook
        console.log('🪝 Testing useCivicIssues hook...');
        
        // We can't directly test the hook here, but we can test the underlying service calls
        const hookTestData = {
            title: 'Hook Test Issue - ' + Date.now(),
            description: 'This is a test to verify the hook integration works properly.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Hook Test Address',
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
        
        // Simulate what the hook does
        try {
            const hookResult = await civicIssueService.createIssue(hookTestData);
            if (hookResult.success) {
                console.log('✅ Hook simulation successful:', hookResult.data.id);
            } else {
                console.error('❌ Hook simulation failed:', hookResult.error);
            }
        } catch (hookError) {
            console.error('❌ Hook simulation error:', hookError);
        }
        
        // Step 6: Check RLS policies
        console.log('🔐 Checking RLS policies...');
        
        try {
            // This will show us what policies exist
            const { data: policies, error: policyError } = await supabase
                .rpc('get_table_policies', { table_name: 'civic_issues' });
            
            if (policyError) {
                console.log('ℹ️ Could not check policies (this is normal)');
            } else {
                console.log('📋 RLS policies:', policies);
            }
        } catch (policyCheckError) {
            console.log('ℹ️ Policy check not available');
        }
        
        console.log('🎉 Diagnostic completed successfully!');
        console.log('💡 If you see this message, the basic functionality works');
        console.log('🔧 The issue might be in the form validation or UI integration');
        
        return { success: true };
        
    } catch (error) {
        console.error('💥 Diagnostic failed:', error);
        return { success: false, error: error.message };
    }
}

// Quick form validation test
function testFormValidation() {
    console.log('📝 Testing form validation logic...');
    
    // Test data that should pass validation
    const validFormData = {
        title: 'This is a valid title that is more than 10 characters',
        description: 'This is a valid description that is definitely more than 20 characters long and should pass validation.',
        category: 'infrastructure',
        priority: 'medium',
        location: {
            address: 'Valid Address, Valid City'
        },
        contactInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+919876543210'
        }
    };
    
    // Simulate validation logic
    const validationErrors = [];
    
    if (!validFormData.title || validFormData.title.trim().length < 10) {
        validationErrors.push('Title must be at least 10 characters');
    }
    
    if (!validFormData.description || validFormData.description.trim().length < 20) {
        validationErrors.push('Description must be at least 20 characters');
    }
    
    if (!validFormData.category) {
        validationErrors.push('Category is required');
    }
    
    if (!validFormData.location || !validFormData.location.address) {
        validationErrors.push('Location address is required');
    }
    
    if (validationErrors.length > 0) {
        console.error('❌ Form validation failed:', validationErrors);
        return false;
    } else {
        console.log('✅ Form validation passed');
        return true;
    }
}

// Run comprehensive diagnosis
console.log('🚀 Starting Comprehensive Submission Diagnosis...');
testFormValidation();
diagnoseSubmissionFailure();