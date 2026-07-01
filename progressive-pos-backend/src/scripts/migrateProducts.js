/**
 * Migration script: Convert flat size/stock products to master-variant format.
 * 
 * Old format: { name: "Denim Jacket", size: "Small", stock: 15 }
 * New format: { name: "Denim Jacket", variants: [{ size: "Small", stock: 15 }] }
 * 
 * Products with the same name+businessId are merged into one master product.
 */
import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/progressive-pos?retryWrites=false';

async function migrate() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('products');

  // Step 1: Drop old indexes that conflict with new schema
  console.log('🗑️  Dropping old indexes...');
  const indexes = await collection.indexes();
  for (const idx of indexes) {
    if (idx.name === '_id_') continue;
    // Drop any index that references 'size' or the old name+businessId combo
    const keys = Object.keys(idx.key);
    if (keys.includes('size') || (keys.includes('name') && !keys.includes('size') && idx.unique)) {
      try {
        await collection.dropIndex(idx.name);
        console.log(`   ✅ Dropped index: ${idx.name}`);
      } catch (e) {
        console.log(`   ⚠️  Could not drop index ${idx.name}: ${e.message}`);
      }
    }
  }

  // Also try dropping known index names explicitly
  for (const idxName of ['name_1_businessId_1', 'name_1_size_1_businessId_1']) {
    try {
      await collection.dropIndex(idxName);
      console.log(`   ✅ Dropped index: ${idxName}`);
    } catch (e) {
      // Already dropped or doesn't exist
    }
  }

  // Step 2: Find all products that still have the old flat format (have 'size' or 'stock' field but no 'variants')
  const oldProducts = await collection.find({
    $or: [
      { variants: { $exists: false } },
      { variants: null },
      { variants: { $size: 0 } },
    ]
  }).toArray();

  if (oldProducts.length === 0) {
    console.log('✅ No old-format products found. Nothing to migrate.');
    await mongoose.disconnect();
    return;
  }

  console.log(`📦 Found ${oldProducts.length} old-format product(s) to migrate.`);

  // Step 3: Group products by name + businessId to merge same-name products
  const groups = {};
  for (const p of oldProducts) {
    const key = `${p.name}__${p.businessId}`;
    if (!groups[key]) {
      groups[key] = {
        master: p,
        variants: [],
      };
    }
    groups[key].variants.push({
      size: p.size || 'Default',
      sku: p.sku || '',
      stock: p.stock || 0,
    });
  }

  console.log(`🔀 Merging into ${Object.keys(groups).length} master product(s)...`);

  // Step 4: For each group, keep 1 master and delete the rest
  for (const key of Object.keys(groups)) {
    const { master, variants } = groups[key];

    // Use the master SKU as the product-level SKU, variant SKUs are auto-generated
    const masterSku = master.sku || '';
    const processedVariants = variants.map((v, i) => ({
      size: v.size,
      sku: masterSku ? `${masterSku}-${v.size.charAt(0).toUpperCase()}` : '',
      stock: v.stock,
    }));

    // Update the master document
    await collection.updateOne(
      { _id: master._id },
      {
        $set: { variants: processedVariants, sku: masterSku },
        $unset: { size: '', stock: '' },
      }
    );

    // Delete all other documents in this group
    const idsToDelete = oldProducts
      .filter(p => `${p.name}__${p.businessId}` === key && !p._id.equals(master._id))
      .map(p => p._id);

    if (idsToDelete.length > 0) {
      await collection.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`   🗑️  Deleted ${idsToDelete.length} duplicate(s) for "${master.name}"`);
    }

    console.log(`   ✅ "${master.name}" → ${processedVariants.length} variant(s)`);
  }

  console.log('🎉 Migration complete!');
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
