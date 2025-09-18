// Debug script to check notification configuration
// Run this in browser console

function checkNotificationConfig() {
    console.log('🔍 Checking notification configuration...');
    
    const config = {
        twilioAccountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
        twilioAuthToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN ? '***configured***' : 'NOT SET',
        twilioWhatsAppNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER,
        adminPhoneNumber: import.meta.env.VITE_ADMIN_PHONE_NUMBER,
        twilioPhoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER
    };
    
    console.log('📋 Configuration Status:');
    console.table(config);
    
    // Check which services are properly configured
    const checks = {
        'Twilio Account SID': !!config.twilioAccountSid,
        'Twilio Auth Token': !!import.meta.env.VITE_TWILIO_AUTH_TOKEN,
        'WhatsApp Number': !!config.twilioWhatsAppNumber,
        'Admin Phone': !!config.adminPhoneNumber,
        'SMS Phone Number': !!config.twilioPhoneNumber
    };
    
    console.log('✅ Service Availability:');
    console.table(checks);
    
    const allConfigured = Object.values(checks).every(Boolean);
    
    if (allConfigured) {
        console.log('🎉 All notification services are properly configured!');
    } else {
        console.log('⚠️ Some notification services are missing configuration');
        Object.entries(checks).forEach(([service, configured]) => {
            if (!configured) {
                console.log(`❌ Missing: ${service}`);
            }
        });
    }
    
    return { config, checks, allConfigured };
}

// Run the check
checkNotificationConfig();