/**
 * Migration: Flat *Ar fields → translations Map
 *
 * BlogPost: { title, titleAr, body, bodyAr, excerpt, excerptAr }
 *        → { translations: { en: { title, body, excerpt }, ar: { title, body, excerpt } } }
 *
 * Page: { title, titleAr, body, bodyAr }
 *     → { translations: { en: { title, body }, ar: { title, body } } }
 *
 * QuizQuestion / QuizOption: { prompt/promptAr, label/labelAr }
 *                           → { translations: { en: {...}, ar: {...} } }
 *
 * Run: npx tsx src/scripts/migrations/migrateContentI18n.ts [--dry-run]
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

async function migrateBlogPosts(db: mongoose.mongo.Db) {
  const col = db.collection("blogposts");
  const cursor = col.find({ translations: { $exists: false } });
  let count = 0;

  for await (const doc of cursor) {
    const translations = {
      en: { title: doc.title, excerpt: doc.excerpt, body: doc.body ?? doc.content },
      ar: { title: doc.titleAr, excerpt: doc.excerptAr, body: doc.bodyAr }
    };

    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}BlogPost: ${doc._id} (${doc.slug})`);

    if (!DRY_RUN) {
      await col.updateOne(
        { _id: doc._id },
        {
          $set: { translations },
          $unset: { title: "", titleAr: "", excerpt: "", excerptAr: "", body: "", bodyAr: "", content: "" }
        }
      );
    }
    count++;
  }

  console.log(`BlogPosts migrated: ${count}`);
}

async function migratePages(db: mongoose.mongo.Db) {
  const col = db.collection("pages");
  const cursor = col.find({ translations: { $exists: false } });
  let count = 0;

  for await (const doc of cursor) {
    const translations = {
      en: { title: doc.title, body: doc.body ?? doc.content },
      ar: { title: doc.titleAr, body: doc.bodyAr }
    };

    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Page: ${doc._id} (${doc.slug})`);

    if (!DRY_RUN) {
      await col.updateOne(
        { _id: doc._id },
        {
          $set: { translations },
          $unset: { title: "", titleAr: "", body: "", bodyAr: "", content: "" }
        }
      );
    }
    count++;
  }

  console.log(`Pages migrated: ${count}`);
}

async function migrateQuiz(db: mongoose.mongo.Db) {
  const col = db.collection("quizquestions");
  const cursor = col.find({ translations: { $exists: false } });
  let count = 0;

  for await (const doc of cursor) {
    const translations = {
      en: { prompt: doc.prompt },
      ar: { prompt: doc.promptAr }
    };

    const options = (doc.options ?? []).map((opt: Record<string, unknown>) => ({
      translations: {
        en: { label: opt.label },
        ar: { label: opt.labelAr }
      },
      score: opt.score,
      note: opt.note
    }));

    console.log(`${DRY_RUN ? "[DRY RUN] " : ""}QuizQuestion: ${doc._id}`);

    if (!DRY_RUN) {
      await col.updateOne(
        { _id: doc._id },
        {
          $set: { translations, options },
          $unset: { prompt: "", promptAr: "" }
        }
      );
    }
    count++;
  }

  console.log(`QuizQuestions migrated: ${count}`);
}

async function run() {
  await mongoose.connect(MONGO_URI!);
  const db = mongoose.connection.db!;

  await migrateBlogPosts(db);
  await migratePages(db);
  await migrateQuiz(db);

  console.log(`\nAll migrations complete. ${DRY_RUN ? "(DRY RUN — no changes written)" : ""}`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
