import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugIssueCreation() {
  console.log('🔍 Debugging issue creation process...\n');

  // Test 1: Check if we can create an issue directly
  console.log('1. Testing direct issue creation...');
  
  const testIssue = {
    title: 'Debug Test Issue',
    description: 'This is a debug test to isolate the issue creation problem.',
    category: 'roads',
    priority: 'medium',
    address: '123 Debug Street',
    reporter_name: 'Test User',
    reporter_email: 'test@example.com',
    reporter_phone: '+917764958828'
  };

  const { data: directIssue, error: directError } = await supabase
    .from('civic_issues')
    .insert([testIssue])
    .select()
    .single();

  if (directError) {
    console.log('❌ Direct creation failed:', directError.message);
    console.log('Error details:', directError);
    return;
  } else {
    console.log('✅ Direct creation successful:', directIssue.id);
  }

  // Test 2: Test the service function
  console.log('\n2. Testing service function...');
  
  try {
    const { civicIssueService } = await import('./src/services/civicIssueService.js');
    
    const serviceTestData = {
      title: 'Service Test Issue',
      description: 'Testing the civicIssueService.createIssue function.',
      category: 'sanitation',
      priority: 'low',
      location: {
        address: '456 Service Test Street',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      contactInfo: {
        name: 'Service Test User',
        email: 'servicetest@example.com',
        phone: '+917764958828'
      },
      images: [] // No images for this test
    };

    const serviceResult = await civicIssueService.createIssue(serviceTestData);
    
    if (serviceResult.error) {
      console.log('❌ Service creation failed:', serviceResult.error);
    } else {
      console.log('✅ Service creation successful:', serviceResult.data.id);
    }
    
  } catch (serviceError) {
    console.log('❌ Service import/execution error:', serviceError.message);
    console.log('Stack trace:', serviceError.stack);
  }

  console.log('\n✅ Debug test complete!');
}

debugIssueCreation().catch(console.error);