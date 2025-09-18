// Test script to debug reports listing issues
// Run this in browser console

async function testReportsListing() {
    console.log('🧪 Testing Reports Listing...');
    
    try {
        // Test basic Supabase connection
        const { supabase } = await import('./src/lib/supabase.js');
        
        console.log('1️⃣ Testing basic Supabase connection...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('civic_issues')
            .select('count')
            .limit(1);
        
        if (connectionError) {
            console.error('❌ Supabase connection failed:', connectionError);
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        
        // Test basic issues query
        console.log('2️⃣ Testing basic issues query...');
        const { data: basicIssues, error: basicError } = await supabase
            .from('civic_issues')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (basicError) {
            console.error('❌ Basic issues query failed:', basicError);
            
            if (basicError.message.includes('permission denied')) {
                console.log('💡 Issue: RLS policy blocking read access');
                console.log('🔧 Solution: Run fix-issue-creation-rls.sql to fix policies');
            } else if (basicError.message.includes('relation') && basicError.message.includes('does not exist')) {
                console.log('💡 Issue: civic_issues table does not exist');
                console.log('🔧 Solution: Run database migration scripts');
            }
            
            return false;
        }
        
        console.log('✅ Basic issues query successful');
        console.log('📊 Found issues:', basicIssues?.length || 0);
        
        if (basicIssues && basicIssues.length > 0) {
            console.log('📋 Sample issue:', basicIssues[0]);
        }
        
        // Test the service function
        console.log('3️⃣ Testing civicIssueService.getIssues()...');
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        const serviceResult = await civicIssueService.getIssues();
        
        if (serviceResult.error) {
            console.error('❌ Service getIssues failed:', serviceResult.error);
            return false;
        }
        
        console.log('✅ Service getIssues successful');
        console.log('📊 Service returned issues:', serviceResult.data?.length || 0);
        
        // Test related tables
        console.log('4️⃣ Testing related tables...');
        
        const tables = ['user_profiles', 'issue_images', 'issue_votes', 'issue_updates'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('count')
                    .limit(1);
                
                if (error) {
                    console.warn(`⚠️ Table ${table} issue:`, error.message);
                } else {
                    console.log(`✅ Table ${table} accessible`);
                }
            } catch (tableError) {
                console.warn(`⚠️ Table ${table} error:`, tableError.message);
            }
        }
        
        return true;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('💡 Issue: Network problem or Supabase project paused');
            console.log('🔧 Solution: Check Supabase dashboard, ensure project is active');
        }
        
        return false;
    }
}

// Test RLS policies specifically
async function testRLSPolicies() {
    console.log('🔒 Testing RLS Policies...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Test as anonymous user
        console.log('Testing anonymous read access...');
        const { data: anonData, error: anonError } = await supabase
            .from('civic_issues')
            .select('id, title, status')
            .limit(1);
        
        if (anonError) {
            console.error('❌ Anonymous read failed:', anonError.message);
            console.log('💡 RLS policy may be blocking public read access');
        } else {
            console.log('✅ Anonymous read successful');
        }
        
        // Check current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            console.log('Testing authenticated read access...');
            const { data: authData, error: authError } = await supabase
                .from('civic_issues')
                .select('*')
                .limit(1);
            
            if (authError) {
                console.error('❌ Authenticated read failed:', authError.message);
            } else {
                console.log('✅ Authenticated read successful');
            }
        } else {
            console.log('ℹ️ No authenticated user to test with');
        }
        
    } catch (error) {
        console.error('💥 RLS test failed:', error);
    }
}

// Run all tests
console.log('🚀 Starting Reports Listing Debug...');
testRLSPolicies();
testReportsListing();