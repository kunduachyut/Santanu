// Completely reset the websites collection to remove any unique constraints
const mongoose = require('mongoose');

async function resetWebsitesCollection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // First, let's see if the collection exists and what indexes it has
    try {
      const collections = await db.listCollections({ name: 'websites' }).toArray();
      if (collections.length > 0) {
        console.log('Found existing websites collection');
        
        const collection = db.collection('websites');
        const indexes = await collection.listIndexes().toArray();
        console.log('Current indexes:');
        indexes.forEach(index => {
          console.log(`- ${index.name}: ${JSON.stringify(index.key)} ${index.unique ? '(UNIQUE)' : ''}`);
        });
        
        // Drop the entire collection to remove all constraints
        await collection.drop();
        console.log('✅ Dropped websites collection completely');
      } else {
        console.log('No existing websites collection found');
      }
    } catch (error) {
      console.log('Collection does not exist or could not list:', error.message);
    }
    
    // Now test creating a new document directly (without Mongoose model)
    console.log('\\nTesting direct insertion after collection reset...');
    const collection = db.collection('websites');
    
    const testDoc1 = {
      title: 'Test Site 1',
      url: 'https://brave.search.test.com',
      description: 'Test description 1',
      category: 'blog',
      price: 10,
      priceCents: 1000,
      userId: 'test-user-1',
      status: 'pending',
      tags: [],
      views: 0,
      clicks: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const testDoc2 = {
      title: 'Test Site 2',
      url: 'https://brave.search.test.com', // Same URL
      description: 'Test description 2',
      category: 'blog',
      price: 15,
      priceCents: 1500,
      userId: 'test-user-2',
      status: 'pending',
      tags: [],
      views: 0,
      clicks: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Inserting first test document...');
    const result1 = await collection.insertOne(testDoc1);
    console.log('✅ First document inserted:', result1.insertedId);
    
    console.log('Inserting second test document with same URL...');
    const result2 = await collection.insertOne(testDoc2);
    console.log('✅ Second document inserted:', result2.insertedId);
    
    console.log('\\n🎉 SUCCESS: Both documents with same URL inserted successfully!');
    console.log('Collection has been reset and duplicate URLs are now allowed.');
    
    // Clean up test documents
    await collection.deleteMany({ url: 'https://brave.search.test.com' });
    console.log('Test documents cleaned up.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('Still getting unique constraint error. This suggests a deeper issue.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetWebsitesCollection();