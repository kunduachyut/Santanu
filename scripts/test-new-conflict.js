// Test creating a new price conflict via the API
const mongoose = require('mongoose');

async function testNewPriceConflict() {
  try {
    const uri = MONGODB_URI;
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // Create a fresh test URL
    const testUrl = `https://test-new-conflict-${Date.now()}.com`;
    
    console.log(`🧪 Testing with URL: ${testUrl}`);
    
    // Create first website manually
    console.log('📝 Creating first website...');
    const firstWebsite = await collection.insertOne({
      title: 'First Test Website',
      url: testUrl,
      description: 'First submission for testing',
      category: 'business',
      price: 10,
      priceCents: 1000,
      userId: 'test_user_1',
      status: 'pending',
      tags: ['test'],
      views: 0,
      clicks: 0,
      featured: false,
      image: '/default-website-image.png',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ First website created:', firstWebsite.insertedId);
    
    // Now test the API by simulating a request
    console.log('\\n🔄 Now when someone submits the same URL, both should become priceConflict status');
    console.log('You can test this by:');
    console.log('1. Go to Publisher Dashboard');
    console.log('2. Submit a website with URL:', testUrl);
    console.log('3. Both websites should get "priceConflict" status');
    console.log('4. Check Super Admin → Price Conflicts to see them');
    
    // Check current conflicts
    const conflicts = await collection.find({ status: 'priceConflict' }).toArray();
    console.log(`\\n🔥 Current price conflicts in database: ${conflicts.length}`);
    
    if (conflicts.length > 0) {
      console.log('Existing conflicts:');
      conflicts.forEach(conflict => {
        console.log(`  - ${conflict.title} (${conflict.url}) - User: ${conflict.userId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\\n👋 Disconnected from MongoDB');
  }
}

testNewPriceConflict();