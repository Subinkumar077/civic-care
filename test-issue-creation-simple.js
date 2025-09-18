// Simple test for issue creation
// Run this in browser console after logging in

async function testIssueCreation() {
    console.log('🧪 Testing Issue Creation...');
    
    try {
        // Check login status
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            console.error('❌ Please log in first');
            return;
        }
        
        console.log('✅ User logged in:', session.user.email);
        
        // Simple test data
        const testData = {
            title: 'Test Issue Creation',
            description: 'This is a test to verify issue creation works properly.',
            category: 'infrastructure',
            priority: 'medium',
            location: {
                address: 'Test Address, Test City',
                coordinates: { lat: 28.6139, lng: 77.2090 }
            },
            images: [],
            contactInfo: {
                name: 'Test User',
                email: session.user.email,
                phone: '+919876543210'
            }
        };
        
        console.log('📝 Creating issue...');
        
        // Test direct database insertion
        const issueToCreate = {
            title: testData.title,
            description: testData.description,
            category: testData.category,
            priority: testData.priority,
            address: testData.location.address,
            latitude: testData.location.coordinates.lat,
            longitude: testData.location.coordinates.lng,
            reporter_id: session.user.id,
            reporter_name: testData.contactInfo.name,
            reporter_email: testData.contactInfo.email,
            reporter_phone: testData.contactInfo.phone
        };
        
        const { data: issue, error } = await supabase
            .from('civic_issues')
            .insert([issueToCreate])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Issue creation failed:', error);
            
            if (error.message.includes('permission denied')) {
                console.log('💡 RLS policy issue - run fix-issue-creation-rls.sql');
            } else if (error.message.includes('violates check constraint')) {
                console.log('💡 Data validation failed - check required fields');
            }
            
            return false;
        }
        
        console.log('✅ Issue created successfully:', issue);
        
        // Test notifications
        console.log('📱 Testing notifications...');
        
        try {
            const { notificationService } = await import('./src/services/notificationService.js');
            const notificationResult = await notificationService.sendIssueNotifications(issue, 'created');
            console.log('📨 Notification result:', notificationResult);
            
            if (notificationResult.user?.success) {
                console.log('✅ User notification sent successfully');
            } else {
                console.log('❌ User notification failed:', notificationResult.user?.error);
            }
            
            if (notificationResult.admin?.success) {
                console.log('✅ Admin notification sent successfully');
            } else {
                console.log('❌ Admin notification failed:', notificationResult.admin?.error);
            }
            
        } catch (notificationError) {
            console.error('❌ Notification test failed:', notificationError);
        }
        
        return true;
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        return false;
    }
}

// Check environment variables
function checkEnvVars() {
    console.log('🔧 Checking Environment Variables...');
    
    const requiredVars = [
        'VITE_TWILIO_ACCOUNT_SID',
        'VITE_TWILIO_AUTH_TOKEN', 
        'VITE_TWILIO_WHATSAPP_NUMBER',
        'VITE_ADMIN_PHONE_NUMBER'
    ];
    
    const missing = [];
    
    requiredVars.forEach(varName => {
        const value = import.meta.env[varName];
        if (!value) {
            missing.push(varName);
        } else {
            console.log(`✅ ${varName}: ${varName.includes('TOKEN') ? '***SET***' : value}`);
        }
    });
    
    if (missing.length > 0) {
        console.log('❌ Missing environment variables:');
        missing.forEach(varName => console.log(`   - ${varName}`));
        console.log('💡 Add these to your .env file');
        return false;
    }
    
    console.log('✅ All environment variables are set');
    return true;
}

// Run tests
console.log('🚀 Starting Issue Creation Test...');
checkEnvVars();
testIssueCreation();