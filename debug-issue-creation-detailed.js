// Debug script for issue creation and notifications
// Run this in browser console after logging in

async function debugIssueCreation() {
    console.log('🔍 Debugging Issue Creation Process...');
    
    try {
        // Check if user is logged in
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ User not logged in');
            console.log('💡 Please log in first before creating issues');
            return false;
        }
        
        console.log('✅ User logged in:', session.user.email);
        
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.error('❌ User profile not found:', profileError);
            console.log('💡 This might prevent issue creation');
            return false;
        }
        
        console.log('✅ User profile found:', profile);
        
        // Test issue creation
        const testIssueData = {
            title: 'Test Issue - Debug Creation',
            description: 'This is a test issue created to debug the issue creation process. It should be created successfully and notifications should be sent.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Test Location, Debug City',
                coordinates: {
                    lat: 28.6139,
                    lng: 77.2090
                }
            },
            images: [], // No images for this test
            contactInfo: {
                name: profile.full_name || 'Test User',
                email: profile.email,
                phone: profile.phone || '+919876543210'
            }
        };
        
        console.log('📝 Creating test issue with data:', testIssueData);
        
        // Import the service
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        // Create the issue
        const result = await civicIssueService.createIssue(testIssueData);
        
        console.log('📊 Issue creation result:', result);
        
        if (result.error) {
            console.error('❌ Issue creation failed:', result.error);
            
            // Analyze common errors
            if (result.error.includes('permission denied')) {
                console.log('💡 Issue: RLS policy preventing issue creation');
                console.log('🔧 Solution: Check RLS policies for civic_issues table');
            } else if (result.error.includes('violates check constraint')) {
                console.log('💡 Issue: Data validation failed');
                console.log('🔧 Solution: Check required fields and data types');
            } else if (result.error.includes('null value')) {
                console.log('💡 Issue: Required field is missing');
                console.log('🔧 Solution: Check all required fields are provided');
            }
            
            return false;
        }
        
        if (result.data) {
            console.log('✅ Issue created successfully!');
            console.log('📋 Issue ID:', result.data.id);
            console.log('📍 Issue Title:', result.data.title);
            
            // Wait for notifications to process
            console.log('⏳ Waiting for notifications to process...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if notifications were sent
            console.log('📱 Check your WhatsApp/SMS for notifications');
            console.log('🔔 Check browser console for notification logs');
            
            return true;
        }
        
        console.error('❌ Unexpected result - no data returned');
        return false;
        
    } catch (error) {
        console.error('💥 Debug failed:', error);
        
        // Analyze the error
        if (error.message.includes('Failed to fetch')) {
            console.log('💡 Issue: Network problem or Supabase connection failed');
        } else if (error.message.includes('permission denied')) {
            console.log('💡 Issue: Database permission problem');
        } else if (error.message.includes('violates')) {
            console.log('💡 Issue: Database constraint violation');
        }
        
        return false;
    }
}

// Check notification configuration
async function checkNotificationConfig() {
    console.log('🔔 Checking Notification Configuration...');
    
    const config = {
        twilioAccountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
        twilioAuthToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN ? '***configured***' : 'NOT SET',
        twilioWhatsAppNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER,
        adminPhoneNumber: import.meta.env.VITE_ADMIN_PHONE_NUMBER
    };
    
    console.log('📋 Notification Configuration:');
    console.table(config);
    
    const allConfigured = !!(config.twilioAccountSid && 
                            import.meta.env.VITE_TWILIO_AUTH_TOKEN && 
                            config.twilioWhatsAppNumber);
    
    if (allConfigured) {
        console.log('✅ Notification services are configured');
    } else {
        console.log('❌ Notification services are missing configuration');
        console.log('💡 This is why you\'re not receiving WhatsApp messages');
    }
    
    return allConfigured;
}

// Check database tables
async function checkDatabaseTables() {
    console.log('🗄️ Checking Database Tables...');
    
    try {
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check civic_issues table
        const { data: issuesTest, error: issuesError } = await supabase
            .from('civic_issues')
            .select('count')
            .limit(1);
        
        if (issuesError) {
            console.error('❌ civic_issues table issue:', issuesError);
        } else {
            console.log('✅ civic_issues table accessible');
        }
        
        // Check notifications table
        const { data: notificationsTest, error: notificationsError } = await supabase
            .from('notifications')
            .select('count')
            .limit(1);
        
        if (notificationsError) {
            console.error('❌ notifications table issue:', notificationsError);
            console.log('💡 Run create-notifications-table.sql to fix this');
        } else {
            console.log('✅ notifications table accessible');
        }
        
    } catch (error) {
        console.error('💥 Database check failed:', error);
    }
}

// Run all checks
console.log('🚀 Starting Comprehensive Issue Creation Debug...');
checkNotificationConfig();
checkDatabaseTables();
debugIssueCreation();