// Test script for Credit Card API
const API_URL = 'https://cards.finonest.com/api/leads.php';
const API_KEY = 'lms_8188272ffd90118df860b5e768fe6681';

async function testCreditCardAPI() {
  console.log('🧪 Testing Credit Card API...\n');

  const testData = {
    name: 'Test User',
    mobile: '9876543210',
    email: 'test@example.com',
    product_id: 1,
    product_name: 'Test Credit Card',
    product_variant: 'Premium',
    product_highlights: 'Test highlights',
    bank_redirect_url: 'https://example.com',
    channel_code: 'PARTNER_001',
    status: 'new'
  };

  try {
    console.log('📤 Sending POST request to:', API_URL);
    console.log('📋 Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('\n📄 Raw Response:', responseText);

    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log('\n✅ Parsed JSON Response:', JSON.stringify(jsonData, null, 2));
      
      if (jsonData.lead_id || jsonData.data?.lead_id) {
        console.log('🎉 SUCCESS: Lead created with ID:', jsonData.lead_id || jsonData.data?.lead_id);
      }
    } catch (parseError) {
      console.log('\n❌ Failed to parse JSON:', parseError.message);
      
      // Check for PHP errors
      if (responseText.includes('Parse error') || responseText.includes('<b>')) {
        console.log('🚨 PHP Error detected in response');
      }
    }

  } catch (error) {
    console.error('\n💥 Request failed:', error.message);
  }
}

// Run the test
testCreditCardAPI();