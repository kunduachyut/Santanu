// Fix existing duplicate URLs to have proper price conflict status
const mongoose = require('mongoose');

async function fixExistingConflicts() {
  try {
    const uri = 'mongodb://santanu:santanu123@ac-se8zhft-shard-00-00.8b6iys2.mongodb.net:27017,ac-se8zhft-shard-00-01.8b6iys2.mongodb.net:27017,ac-se8zhft-shard-00-02.8b6iys2.mongodb.net:27017/?ssl=true&replicaSet=atlas-51zpjw-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully');
    
    const db = mongoose.connection.db;
    const collection = db.collection('websites');
    
    // Find all websites
    const websites = await collection.find({}).toArray();
    console.log(`📋 Found ${websites.length} websites`);
    
    // Group by URL to find duplicates
    const urlGroups = {};
    websites.forEach(site => {
      if (!urlGroups[site.url]) {
        urlGroups[site.url] = [];
      }
      urlGroups[site.url].push(site);
    });
    
    // Find URLs with multiple submissions from different users
    const duplicateUrls = Object.entries(urlGroups).filter(([url, sites]) => {
      if (sites.length < 2) return false;
      
      // Check if they're from different users
      const uniqueUsers = [...new Set(sites.map(site => site.userId))];
      return uniqueUsers.length > 1;
    });
    
    console.log(`🔍 Found ${duplicateUrls.length} URLs with conflicts from different users:`);
    
    for (const [url, sites] of duplicateUrls) {
      console.log(`\\n🌐 URL: ${url}`);
      console.log(`   Submissions: ${sites.length}`);
      
      // Check if any are already in priceConflict status
      const conflictSites = sites.filter(site => site.status === 'priceConflict');
      const pendingSites = sites.filter(site => site.status === 'pending');
      
      console.log(`   Price conflicts: ${conflictSites.length}, Pending: ${pendingSites.length}`);
      
      // If we have pending sites from different users, convert them to price conflicts
      if (pendingSites.length >= 2) {
        const uniquePendingUsers = [...new Set(pendingSites.map(site => site.userId))];
        
        if (uniquePendingUsers.length >= 2) {
          console.log('   🔧 Converting pending sites to price conflicts...');
          
          const conflictGroup = `conflict_${pendingSites[0]._id}_${Date.now()}`;
          
          // Update all pending sites to priceConflict status
          for (let i = 0; i < pendingSites.length; i++) {
            const site = pendingSites[i];
            const isOriginal = i === 0; // First one is original
            
            await collection.updateOne(
              { _id: site._id },
              {
                $set: {
                  status: 'priceConflict',
                  conflictGroup: conflictGroup,
                  isOriginal: isOriginal,
                  conflictsWith: isOriginal ? null : pendingSites[0]._id
                }
              }
            );
            
            console.log(`     ✅ Updated ${site.title} (${isOriginal ? 'Original' : 'New'}) to priceConflict`);
          }
        }
      }
    }
    
    // Verify the changes
    console.log('\\n📊 Final status after fixes:');
    const updatedWebsites = await collection.find({}).toArray();
    const statusCounts = {};
    updatedWebsites.forEach(site => {
      statusCounts[site.status] = (statusCounts[site.status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    const priceConflicts = updatedWebsites.filter(site => site.status === 'priceConflict');
    console.log(`\\n🔥 Total price conflicts: ${priceConflicts.length}`);
    
    if (priceConflicts.length > 0) {
      console.log('Price conflict details:');
      priceConflicts.forEach(conflict => {
        console.log(`  - ${conflict.title} (${conflict.url})`);
        console.log(`    User: ${conflict.userId}, Group: ${conflict.conflictGroup}, Original: ${conflict.isOriginal}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\\n👋 Disconnected from MongoDB');
  }
}

fixExistingConflicts();