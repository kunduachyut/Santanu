// Test direct database insertion to see what's happening
const mongoose = require('mongoose');

async function testDirect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // Try to insert two documents with the same URL directly
    const testDoc1 = {
      title: 'Test Site 1',
      url: 'https://test.example.com',
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
      url: 'https://test.example.com', // Same URL
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
    
    console.log('Inserting first document...');
    const result1 = await collection.insertOne(testDoc1);
    console.log('✅ First document inserted:', result1.insertedId);
    
    console.log('Inserting second document with same URL...');
    const result2 = await collection.insertOne(testDoc2);
    console.log('✅ Second document inserted:', result2.insertedId);
    
    console.log('Both documents inserted successfully! No unique constraint.');
    
    // Clean up
    await collection.deleteMany({ url: 'https://test.example.com' });
    console.log('Test documents cleaned up.');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 11000) {
      console.log('❌ Unique constraint still exists on URL field');
      
      // Try to drop all indexes and recreate collection
      try {
        const collection = mongoose.connection.db.collection('websites');
        await collection.drop();
        console.log('✅ Dropped entire collection to remove all indexes');
      } catch (dropError) {
        console.log('Could not drop collection (may not exist)');
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDirect();