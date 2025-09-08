// Manually create a price conflict to test the system
const mongoose = require('mongoose');

async function createTestPriceConflict() {
  try {
    const uri = MONGODB_URI;
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // Clear existing websites to start fresh
    console.log('🗑️ Clearing existing websites...');
    await collection.deleteMany({});
    
    // Create first website (original)
    const originalWebsite = {
      title: 'Original Search Engine',
      url: 'https://example-search.com',
      description: 'Original search engine submission',
      category: 'business',
      price: 10,
      priceCents: 1000,
      userId: 'user_original_123',
      status: 'pending',
      tags: ['search', 'engine'],
      views: 0,
      clicks: 0,
      featured: false,
      image: '/default-website-image.png',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('📝 Creating original website...');
    const result1 = await collection.insertOne(originalWebsite);
    console.log('✅ Original website created:', result1.insertedId);
    
    // Create second website (new submission with same URL)
    const newWebsite = {
      title: 'New Search Engine',
      url: 'https://example-search.com', // Same URL
      description: 'New search engine submission with better price',
      category: 'business', 
      price: 8,
      priceCents: 800,
      userId: 'user_different_456',
      status: 'pending',
      tags: ['search', 'better'],
      views: 0,
      clicks: 0,
      featured: false,
      image: '/default-website-image.png',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('📝 Creating new website submission...');
    const result2 = await collection.insertOne(newWebsite);
    console.log('✅ New website created:', result2.insertedId);
    
    // Now manually create the price conflict
    const conflictGroup = `conflict_${result1.insertedId}_${Date.now()}`;
    
    console.log('⚔️ Creating price conflict manually...');
    
    // Update original to priceConflict status
    await collection.updateOne(
      { _id: result1.insertedId },
      {
        $set: {
          status: 'priceConflict',
          conflictGroup: conflictGroup,
          isOriginal: true
        }
      }
    );
    
    // Update new submission to priceConflict status
    await collection.updateOne(
      { _id: result2.insertedId },
      {
        $set: {
          status: 'priceConflict',
          conflictGroup: conflictGroup,
          conflictsWith: result1.insertedId,
          isOriginal: false
        }
      }
    );
    
    console.log('✅ Price conflict created successfully!');
    
    // Verify the results
    const websites = await collection.find({}).toArray();
    console.log('\\n📋 Final website status:');
    websites.forEach(site => {
      console.log(`- ${site.title}: ${site.status} (Price: $${site.price}, User: ${site.userId})`);
      if (site.conflictGroup) {
        console.log(`  Conflict Group: ${site.conflictGroup}, Is Original: ${site.isOriginal}`);
      }
    });
    
    console.log('\\n🎉 Test data created successfully!');
    console.log('Now you can go to Super Admin → Price Conflicts to see the conflict.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\\n👋 Disconnected from MongoDB');
  }
}

createTestPriceConflict();