// Test script to verify issue creation with notifications
// Run this in browser console after logging in

async function testIssueCreationWithNotifications() {
    console.log('🧪 Testing issue creation with notifications...');
    
    // Test data for issue creation
    const testIssueData = {
        title: 'Test Issue - Notifications Enabled',
        description: 'This is a test issue to verify that notifications are working properly after re-enabling them. The issue should be created successfully and notifications should be sent to both user and admin.',
        category: 'infrastructure',
        priority: 'medium',
        location: {
            address: 'Test Location, Test City',
            coordinates: {
                lat: 28.6139,
                lng: 77.2090
            }
        },
        images: [], // No images for this test
        contactInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+919876543210' // Test phone number
        }
    };

    try {
        // Import the service
        const { civicIssueService } = await import('./src/services/civicIssueService.js');
        
        console.log('📝 Creating test issue...');
        const result = await civicIssueService.createIssue(testIssueData);
        
        if (result.error) {
            console.error('❌ Issue creation failed:', result.error);
            return false;
        }
        
        console.log('✅ Issue created successfully:', result.data);
        console.log('📱 Notifications should be sent in the background...');
        
        // Wait a bit for notifications to process
        setTimeout(() => {
            console.log('🔔 Check your WhatsApp/SMS for notifications!');
            console.log('📊 Check browser network tab for Twilio API calls');
        }, 2000);
        
        return true;
        
    } catch (error) {
        console.error('💥 Test failed with error:', error);
        return false;
    }
}

// Run the test
testIssueCreationWithNotifications();