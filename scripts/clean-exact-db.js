// Clean the exact database that the app is using
const mongoose = require('mongoose');

async function cleanExactDatabase() {
  try {
    // Use the EXACT same connection string as the app
    const uri = MONGODB_URI
    console.log('Connecting to MongoDB with EXACT app URI...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully');
    
    // Get the database name that mongoose is actually using
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📍 Connected to database: "${dbName}"`);
    
    const db = mongoose.connection.db;
    
    // List all collections in this database
    const collections = await db.listCollections().toArray();
    console.log('\\n📂 Collections in this database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check if websites collection exists
    const websitesCol = collections.find(col => col.name === 'websites');
    if (websitesCol) {
      console.log('\\n🔍 Found websites collection. Checking indexes...');
      const collection = db.collection('websites');
      
      try {
        const indexes = await collection.listIndexes().toArray();
        console.log('📋 Current indexes:');
        let hasUniqueUrl = false;
        indexes.forEach(index => {
          const isUnique = index.unique ? ' (UNIQUE ❌)' : ' (OK ✅)';
          console.log(`  - ${index.name}: ${JSON.stringify(index.key)}${isUnique}`);
          if (index.name === 'url_1' && index.unique) {
            hasUniqueUrl = true;
          }
        });
        
        if (hasUniqueUrl) {
          console.log('\\n🗑️ DROPPING collection to remove unique constraint...');
          await collection.drop();
          console.log('✅ Collection dropped successfully!');
        } else {
          console.log('\\n✅ No problematic unique URL index found');
        }
        
      } catch (indexError) {
        console.log('Error checking indexes:', indexError.message);
      }
    } else {
      console.log('\\n✅ No websites collection found - perfect for fresh start');
    }
    
    // Also check if there's a 'test' database and clean it
    const adminDb = db.admin();
    try {
      const dbList = await adminDb.listDatabases();
      const testDb = dbList.databases.find(db => db.name === 'test');
      if (testDb) {
        console.log('\\n🔍 Found "test" database, cleaning it too...');
        const testDatabase = mongoose.connection.useDb('test');
        const testWebsites = testDatabase.collection('websites');
        try {
          await testWebsites.drop();
          console.log('✅ Dropped websites collection from test database');
        } catch (err) {
          console.log('Test database websites collection may not exist');
        }
      }
    } catch (err) {
      console.log('Could not check other databases (permissions may be limited)');
    }
    
    console.log('\\n🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\\n👋 Disconnected from MongoDB');
  }
}

cleanExactDatabase();