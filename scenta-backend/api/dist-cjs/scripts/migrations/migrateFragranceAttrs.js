"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Migration: Move flat fragrance fields → fragranceAttrs subdocument
 *
 * Before: { gender, concentration, bottleType, notes, season, occasion, longevity, sillage }
 * After:  { fragranceAttrs: { gender, concentration, ... } }
 *
 * Run: npx tsx src/scripts/migrations/migrateFragranceAttrs.ts [--dry-run]
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DRY_RUN = process.argv.includes("--dry-run");
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI not set");
    process.exit(1);
}
async function run() {
    await mongoose_1.default.connect(MONGO_URI);
    const db = mongoose_1.default.connection.db;
    const products = db.collection("products");
    const cursor = products.find({
        fragranceAttrs: { $exists: false },
        $or: [
            { gender: { $exists: true } },
            { notes: { $exists: true } },
            { concentration: { $exists: true } }
        ]
    });
    let updated = 0;
    let skipped = 0;
    for await (const doc of cursor) {
        const fragranceAttrs = {
            gender: doc.gender,
            concentration: doc.concentration,
            bottleType: doc.bottleType,
            notes: doc.notes,
            season: doc.season,
            occasion: doc.occasion,
            longevity: doc.longevity,
            sillage: doc.sillage
        };
        // Skip if no fragrance data to migrate
        const hasData = Object.values(fragranceAttrs).some((v) => v !== undefined && v !== null);
        if (!hasData) {
            skipped++;
            continue;
        }
        console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Migrating product: ${doc._id} (${doc.slug})`);
        if (!DRY_RUN) {
            await products.updateOne({ _id: doc._id }, {
                $set: { fragranceAttrs },
                $unset: {
                    gender: "",
                    concentration: "",
                    bottleType: "",
                    notes: "",
                    season: "",
                    occasion: "",
                    longevity: "",
                    sillage: ""
                }
            });
        }
        updated++;
    }
    console.log(`\nDone. ${DRY_RUN ? "[DRY RUN] " : ""}Updated: ${updated}, Skipped: ${skipped}`);
    await mongoose_1.default.disconnect();
}
run().catch((error) => {
    console.error(error);
    process.exit(1);
});
