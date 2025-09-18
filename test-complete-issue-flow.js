// Complete test for issue submission with WhatsApp notifications
// Run this in browser console after logging in

async function testCompleteIssueFlow() {
    console.log('🧪 Testing Complete Issue Submission Flow...');
    
    try {
        // Check if user is logged in
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ Please log in first');
            return false;
        }
        
        console.log('✅ User logged in:', session.user.email);
        
        // Get user profile to check phone number
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.error('❌ User profile not found:', profileError);
            return false;
        }
        
        console.log('👤 User profile:', profile);
        console.log('📱 Phone number:', profile.phone || 'NOT SET');
        
        if (!profile.phone) {
            console.warn('⚠️ No phone number in profile - WhatsApp notification will not be sent');
            console.log('💡 Add phone number during signup or update profile');
        }
        
        // Test issue data
        const testIssueData = {
            title: 'Test Issue - Complete Flow with WhatsApp',
            description: 'This is a comprehensive test to verify that issue submission works with WhatsApp notifications and toast messages.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Test Location for WhatsApp, Test City',
                coordinates: {
                    lat: 28.6139,
                    lng: 77.2090
                }
            },
            images: [],
            contactInfo: {
                name: profile.full_name,
                email: profile.email,
                phone: profile.phone
            }
        };
        
        console.log('📝 Creating issue with data:', testIssueData);
        
        // Import and use the civic issue service
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        const result = await civicIssueService.createIssue(testIssueData);
        
        if (result.error) {
            console.error('❌ Issue creation failed:', result.error);
            return false;
        }
        
        console.log('✅ Issue created successfully:', result.data);
        
        // Wait for notifications to process
        console.log('⏳ Waiting for WhatsApp notification to be sent...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check notification logs
        console.log('📱 Check your WhatsApp for the notification message');
        console.log('🔔 Expected message format:');
        console.log(`
🎉 Report Submitted Successfully!

Thank you for reporting this issue...
📋 Issue: ${testIssueData.title}
📍 Location: ${testIssueData.location.address}
🏷️ Category: INFRASTRUCTURE
⚡ Priority: MEDIUM
📅 Submitted: [Date]
Reference ID: #[ID]

You'll receive updates on WhatsApp as we work on resolving this issue.
        `);
        
        return true;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        return false;
    }
}

// Test WhatsApp configuration
function testWhatsAppConfig() {
    console.log('📱 Testing WhatsApp Configuration...');
    
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
    
    console.log('✅ All WhatsApp configuration variables are set');
    return true;
}

// Test toast functionality (if available)
function testToastNotification() {
    console.log('🍞 Testing Toast Notification...');
    
    try {
        // Try to show a test toast
        if (window.showToast) {
            window.showToast('🧪 Test toast notification!', 'success');
            console.log('✅ Toast notification shown');
        } else {
            console.log('ℹ️ Toast function not available in console (this is normal)');
            console.log('💡 Toast will work when submitting through the UI');
        }
    } catch (error) {
        console.log('ℹ️ Toast test skipped:', error.message);
    }
}

// Run all tests
console.log('🚀 Starting Complete Issue Flow Test...');
testWhatsAppConfig();
testToastNotification();
testCompleteIssueFlow();