// Fix Supabase connection issues
// Run this in browser console to diagnose connection problems

async function fixSupabaseConnection() {
    console.log('🔧 Diagnosing Supabase Connection Issues...');
    
    try {
        // Check environment variables
        console.log('1️⃣ Checking environment variables...');
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        console.log('Supabase URL:', supabaseUrl || '❌ NOT SET');
        console.log('Supabase Key:', supabaseKey ? '✅ SET' : '❌ NOT SET');
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase environment variables are missing!');
            console.log('🔧 SOLUTION: Check your .env file and ensure these variables are set:');
            console.log('VITE_SUPABASE_URL=your_supabase_url');
            console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
            return false;
        }
        
        // Test basic connectivity
        console.log('2️⃣ Testing basic connectivity...');
        
        try {
            const response = await fetch(supabaseUrl + '/rest/v1/', {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            
            if (!response.ok) {
                console.error('❌ Supabase API not responding:', response.status, response.statusText);
                
                if (response.status === 401) {
                    console.log('🔧 SOLUTION: Invalid API key - check your VITE_SUPABASE_ANON_KEY');
                } else if (response.status === 404) {
                    console.log('🔧 SOLUTION: Invalid URL - check your VITE_SUPABASE_URL');
                } else if (response.status === 503) {
                    console.log('🔧 SOLUTION: Supabase project is paused - go to Supabase dashboard and resume it');
                }
                
                return false;
            }
            
            console.log('✅ Basic connectivity works');
            
        } catch (fetchError) {
            console.error('❌ Network fetch failed:', fetchError.message);
            
            if (fetchError.message.includes('Failed to fetch')) {
                console.log('🔧 POSSIBLE SOLUTIONS:');
                console.log('1. Check if your Supabase project is paused');
                console.log('2. Check your internet connection');
                console.log('3. Check if the Supabase URL is correct');
                console.log('4. Try refreshing the page');
            }
            
            return false;
        }
        
        // Test Supabase client
        console.log('3️⃣ Testing Supabase client...');
        
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Test a simple query
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('count')
                .limit(1);
            
            if (error) {
                console.error('❌ Supabase client query failed:', error.message);
                
                if (error.message.includes('Failed to fetch')) {
                    console.log('🔧 SOLUTION: Your Supabase project is likely paused');
                    console.log('Go to https://supabase.com/dashboard/projects');
                    console.log('Find your project and click "Resume" if it shows as paused');
                } else if (error.message.includes('permission denied')) {
                    console.log('🔧 SOLUTION: RLS policies are blocking access (this is actually good - connection works)');
                }
                
                return false;
            }
            
            console.log('✅ Supabase client works');
            
        } catch (clientError) {
            console.error('❌ Supabase client error:', clientError.message);
            return false;
        }
        
        // Test authentication
        console.log('4️⃣ Testing authentication...');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            console.log('✅ User is authenticated:', session.user.email);
        } else {
            console.log('ℹ️ User not authenticated (this might be OK)');
        }
        
        console.log('🎉 Supabase connection diagnosis completed!');
        return true;
        
    } catch (error) {
        console.error('💥 Connection diagnosis failed:', error);
        return false;
    }
}

// Quick project status check
async function checkProjectStatus() {
    console.log('📊 Checking Supabase Project Status...');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
        console.error('❌ No Supabase URL configured');
        return false;
    }
    
    try {
        // Extract project reference from URL
        const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
        
        if (projectRef) {
            console.log('🏗️ Project Reference:', projectRef);
            console.log('🔗 Dashboard URL: https://supabase.com/dashboard/project/' + projectRef);
            console.log('💡 If your project is paused, go to the dashboard and click "Resume"');
        }
        
        // Test if the project responds
        const healthCheck = await fetch(supabaseUrl + '/rest/v1/');
        
        if (healthCheck.status === 503) {
            console.error('❌ Project appears to be paused or unavailable');
            console.log('🔧 IMMEDIATE SOLUTION:');
            console.log('1. Go to https://supabase.com/dashboard/projects');
            console.log('2. Find your project');
            console.log('3. If it shows "Paused", click "Resume"');
            console.log('4. Wait for it to start up (may take 1-2 minutes)');
            console.log('5. Refresh your application');
            return false;
        }
        
        console.log('✅ Project appears to be running');
        return true;
        
    } catch (error) {
        console.error('❌ Project status check failed:', error.message);
        return false;
    }
}

// Run the diagnosis
console.log('🚀 Starting Supabase Connection Fix...');
checkProjectStatus();
fixSupabaseConnection();