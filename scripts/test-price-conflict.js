// Test price conflict creation
const mongoose = require('mongoose');

async function testPriceConflicts() {
  try {
    const uri = MONGODB_URI;
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // Check current websites and their statuses
    const websites = await collection.find({}).toArray();
    
    console.log('\n📋 Current websites in database:');
    console.log('Total websites:', websites.length);
    
    if (websites.length > 0) {
      const statusCounts = {};
      websites.forEach(site => {
        statusCounts[site.status] = (statusCounts[site.status] || 0) + 1;
        console.log(`- ${site.title}: ${site.status} (URL: ${site.url}, User: ${site.userId})`);
      });
      
      console.log('\n📊 Status breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      
      // Check for price conflicts specifically
      const priceConflicts = websites.filter(site => site.status === 'priceConflict');
      console.log(`\n🔥 Price conflicts found: ${priceConflicts.length}`);
      
      if (priceConflicts.length > 0) {
        console.log('Price conflict details:');
        priceConflicts.forEach(conflict => {
          console.log(`  - ${conflict.title} (${conflict.url})`);
          console.log(`    User: ${conflict.userId}, Group: ${conflict.conflictGroup}`);
          console.log(`    Is Original: ${conflict.isOriginal}`);
        });
      }
      
      // Group by URL to see duplicates
      const urlGroups = {};
      websites.forEach(site => {
        if (!urlGroups[site.url]) {
          urlGroups[site.url] = [];
        }
        urlGroups[site.url].push(site);
      });
      
      console.log('\n🌐 URLs with multiple submissions:');
      Object.entries(urlGroups).forEach(([url, sites]) => {
        if (sites.length > 1) {
          console.log(`  ${url} (${sites.length} submissions):`);
          sites.forEach(site => {
            console.log(`    - User: ${site.userId}, Status: ${site.status}, Price: $${site.price}`);
          });
        }
      });
      
    } else {
      console.log('No websites found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testPriceConflicts();