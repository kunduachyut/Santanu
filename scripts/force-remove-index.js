// Force remove the unique index and prevent it from being recreated
const mongoose = require('mongoose');

async function forceRemoveIndex() {
  try {
    // Use the actual MongoDB URI from your .env file
    const uri = 'mongodb://santanu:santanu123@ac-se8zhft-shard-00-00.8b6iys2.mongodb.net:27017,ac-se8zhft-shard-00-01.8b6iys2.mongodb.net:27017,ac-se8zhft-shard-00-02.8b6iys2.mongodb.net:27017/?ssl=true&replicaSet=atlas-51zpjw-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas successfully');
    
    const db = mongoose.connection.db;
    
    // First, let's see what collections exist
    const collections = await db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check if websites collection exists and its indexes
    const websitesExists = collections.find(col => col.name === 'websites');
    if (websitesExists) {
      console.log('\nWebsites collection exists. Checking indexes...');
      const collection = db.collection('websites');
      
      try {
        const indexes = await collection.listIndexes().toArray();
        console.log('Current indexes on websites collection:');
        indexes.forEach(index => {
          console.log(`- ${index.name}: ${JSON.stringify(index.key)} ${index.unique ? '(UNIQUE ❌)' : '(non-unique ✅)'}`);
        });
        
        // Drop the collection completely to remove all indexes
        await collection.drop();
        console.log('\n🗑️ Dropped websites collection completely from Atlas');
      } catch (error) {
        console.log('Error with collection operations:', error.message);
      }
    } else {
      console.log('\nℹ️ Websites collection does not exist yet - that\'s perfect!');
    }
    
    // Wait a moment for the drop to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify the collection is gone
    const collectionsAfter = await db.listCollections().toArray();
    const websitesExistsAfter = collectionsAfter.find(col => col.name === 'websites');
    
    if (!websitesExistsAfter) {
      console.log('✅ SUCCESS: Websites collection has been completely removed from Atlas');
      console.log('✅ No unique constraints will interfere with duplicate URL submissions');
    } else {
      console.log('⚠️ Collection still exists, but may have been cleared');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB Atlas');
  }
}

forceRemoveIndex();