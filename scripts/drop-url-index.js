// Drop the unique index on URL field to allow duplicate URLs for price conflicts
const mongoose = require('mongoose');

async function dropUrlIndex() {
  try {
    // Connect using the same connection as the app
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('Connected to MongoDB via Mongoose');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // First, let's see what indexes exist
    try {
      const indexes = await collection.listIndexes().toArray();
      console.log('Current indexes:');
      indexes.forEach(index => {
        console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
      });
    } catch (listError) {
      console.log('Collection may not exist yet or no indexes found');
    }
    
    // Try to drop the url_1 index specifically
    try {
      await collection.dropIndex({ url: 1 });
      console.log('✅ Successfully dropped url index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Index on url field does not exist (already dropped)');
      } else {
        console.log('Trying alternative method...');
        try {
          await collection.dropIndex('url_1');
          console.log('✅ Successfully dropped url_1 index by name');
        } catch (altError) {
          console.log('Index may not exist or already dropped:', altError.message);
        }
      }
    }
    
    // List indexes after dropping
    try {
      const indexesAfter = await collection.listIndexes().toArray();
      console.log('\nIndexes after operation:');
      indexesAfter.forEach(index => {
        console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
      });
    } catch (listError) {
      console.log('Could not list indexes after operation');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

dropUrlIndex();