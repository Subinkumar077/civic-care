// Quick check to verify database setup for issue submission
// Run this in browser console

async function checkDatabaseSetup() {
    console.log('🔍 Checking Database Setup...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            console.error('❌ Please log in first');
            return false;
        }
        
        console.log('✅ User logged in:', session.user.email);
        
        // Test 1: Check if civic_issues table exists and is accessible
        console.log('1️⃣ Testing civic_issues table access...');
        
        const { data: tableTest, error: tableError } = await supabase
            .from('civic_issues')
            .select('count')
            .limit(1);
        
        if (tableError) {
            console.error('❌ civic_issues table not accessible:', tableError.message);
            
            if (tableError.message.includes('permission denied')) {
                console.log('💡 SOLUTION: Run clean-rls-fix.sql in Supabase SQL Editor');
            } else if (tableError.message.includes('does not exist')) {
                console.log('💡 SOLUTION: Run database migration to create civic_issues table');
            }
            
            return false;
        }
        
        console.log('✅ civic_issues table accessible');
        
        // Test 2: Check insert permission
        console.log('2️⃣ Testing insert permission...');
        
        const testData = {
            title: 'Permission Test Issue',
            description: 'This is a test to check if we can insert issues.',
            category: 'infrastructure',
            priority: 'medium',
            status: 'submitted',
            address: 'Test Address',
            reporter_id: session.user.id,
            reporter_name: 'Test User',
            reporter_email: session.user.email,
            reporter_phone: '+919876543210'
        };
        
        const { data: insertTest, error: insertError } = await supabase
            .from('civic_issues')
            .insert([testData])
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ Insert permission failed:', insertError.message);
            
            if (insertError.message.includes('permission denied')) {
                console.log('💡 SOLUTION: Run clean-rls-fix.sql in Supabase SQL Editor');
            } else if (insertError.message.includes('violates check constraint')) {
                console.log('💡 ISSUE: Data validation failed - check required fields');
            } else if (insertError.message.includes('foreign key')) {
                console.log('💡 ISSUE: User profile reference problem');
            }
            
            return false;
        }
        
        console.log('✅ Insert permission works - test issue created:', insertTest.id);
        
        // Test 3: Check user profile
        console.log('3️⃣ Checking user profile...');
        
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.error('❌ User profile issue:', profileError.message);
            console.log('💡 SOLUTION: Ensure user profile was created during signup');
        } else {
            console.log('✅ User profile exists:', {
                name: profile.full_name,
                email: profile.email,
                phone: profile.phone || 'NOT SET',
                role: profile.role
            });
        }
        
        // Test 4: Check related tables
        console.log('4️⃣ Checking related tables...');
        
        const tables = [
            'issue_images',
            'issue_votes', 
            'issue_updates',
            'notifications'
        ];
        
        for (const table of tables) {
            try {
                const { error } = await supabase
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
        
        console.log('🎉 Database setup check completed!');
        console.log('💡 If all tests passed, the database is ready for issue submission');
        
        return true;
        
    } catch (error) {
        console.error('💥 Database setup check failed:', error);
        return false;
    }
}

// Also check if RLS policies exist
async function checkRLSPolicies() {
    console.log('🔒 Checking RLS Policies...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Try to read issues as anonymous user (should work if public policy exists)
        const { data: anonTest, error: anonError } = await supabase
            .from('civic_issues')
            .select('id, title')
            .limit(1);
        
        if (anonError && anonError.message.includes('permission denied')) {
            console.error('❌ Public read policy missing');
            console.log('💡 SOLUTION: Run clean-rls-fix.sql to create public read policy');
            return false;
        } else {
            console.log('✅ Public read policy exists');
        }
        
        // Check if we can insert (authenticated user)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const testInsert = {
                title: 'RLS Policy Test',
                description: 'Testing if RLS policies allow authenticated insert',
                category: 'infrastructure',
                address: 'Test Address',
                reporter_id: session.user.id,
                reporter_name: 'Test',
                reporter_email: session.user.email
            };
            
            const { error: insertPolicyError } = await supabase
                .from('civic_issues')
                .insert([testInsert])
                .select()
                .single();
            
            if (insertPolicyError && insertPolicyError.message.includes('permission denied')) {
                console.error('❌ Authenticated insert policy missing');
                console.log('💡 SOLUTION: Run clean-rls-fix.sql to create insert policy');
                return false;
            } else {
                console.log('✅ Authenticated insert policy exists');
            }
        }
        
        return true;
        
    } catch (error) {
        console.error('💥 RLS policy check failed:', error);
        return false;
    }
}

// Run all checks
console.log('🚀 Starting Database Setup Verification...');
checkRLSPolicies();
checkDatabaseSetup();