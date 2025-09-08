// Test the actual API price conflict logic
const fetch = require('node-fetch');

async function testAPIPriceConflict() {
  try {
    console.log('🧪 Testing API price conflict logic...');
    
    const baseURL = 'http://localhost:3000';
    
    // Test data
    const website1 = {
      title: 'Test Site 1',
      url: 'https://test-conflict.example.com',
      description: 'First submission of this URL',
      priceCents: 1200,
      category: 'business',
      tags: ['test'],
      DA: 50,
      PA: 40,
      DR: 35
    };
    
    const website2 = {
      title: 'Test Site 2 - Same URL',
      url: 'https://test-conflict.example.com', // Same URL
      description: 'Second submission with different price',
      priceCents: 800,
      category: 'business', 
      tags: ['test', 'conflict'],
      DA: 60,
      PA: 45,
      DR: 40
    };
    
    // Submit first website (should succeed normally)
    console.log('📤 Submitting first website...');
    const response1 = await fetch(`${baseURL}/api/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-user1' // Simulating different users
      },
      body: JSON.stringify(website1)
    });
    
    const result1 = await response1.json();
    console.log('✅ First submission result:', {
      status: response1.status,
      success: response1.ok,
      message: result1.message || result1.error,
      websiteStatus: result1.status
    });
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Submit second website with same URL (should create price conflict)
    console.log('\\n📤 Submitting second website with same URL...');
    const response2 = await fetch(`${baseURL}/api/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-user2' // Different user
      },
      body: JSON.stringify(website2)
    });
    
    const result2 = await response2.json();
    console.log('⚔️ Second submission result:', {
      status: response2.status,
      success: response2.ok,
      message: result2.message || result2.error,
      websiteStatus: result2.status
    });
    
    if (response2.ok) {
      console.log('\\n🔍 Checking if price conflicts were created...');
      
      // Check price conflicts endpoint
      const conflictResponse = await fetch(`${baseURL}/api/price-conflicts`, {
        headers: {
          'Authorization': 'Bearer fake-admin-token'
        }
      });
      
      const conflictData = await conflictResponse.json();
      console.log('🔥 Price conflicts found:', conflictData.conflicts?.length || 0);
      
      if (conflictData.conflicts && conflictData.conflicts.length > 0) {
        conflictData.conflicts.forEach(conflict => {
          console.log(`  - URL: ${conflict.url}`);
          console.log(`  - Websites in conflict: ${conflict.websites.length}`);
          conflict.websites.forEach(site => {
            console.log(`    * ${site.title}: $${site.price} (Status: ${site.status})`);
          });
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPIPriceConflict();