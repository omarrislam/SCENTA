/**
 * Migration: Add deletedAt: null to all existing products that don't have the field.
 * This ensures the partial index { status, deletedAt } works correctly for catalog queries.
 *
 * Run: npx tsx src/scripts/migrations/migrateSoftDeletes.ts [--dry-run]
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DRY_RUN = process.argv.includes("--dry-run");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI!);
  const db = mongoose.connection.db!;
  const products = db.collection("products");

  const count = await products.countDocuments({ deletedAt: { $exists: false } });
  console.log(`Found ${count} products without deletedAt field`);

  if (!DRY_RUN && count > 0) {
    const result = await products.updateMany(
      { deletedAt: { $exists: false } },
      { $set: { deletedAt: null } }
    );
    console.log(`Updated ${result.modifiedCount} products`);
  } else if (DRY_RUN) {
    console.log(`[DRY RUN] Would update ${count} products`);
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
