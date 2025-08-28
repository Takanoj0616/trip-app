/*
  Firestore seeding script for spots data.
  - Uses Application Default Credentials if available (GOOGLE_APPLICATION_CREDENTIALS or gcloud).
  - Falls back to local .firebase-admin.json in project root if present.
  - Upserts docs into `spots` with doc.id = slug.
*/

const fs = require("node:fs");
const path = require("node:path");

let admin;
let FirestorePkg;
let AUTH_MODE = ""; // "service_account" | "adc"
try {
  admin = require("firebase-admin");
  FirestorePkg = require("@google-cloud/firestore");
} catch (e) {
  console.error("firebase-admin is not installed. Run: npm i firebase-admin");
  process.exit(1);
}

const DATA_PATH = path.resolve("src/data/tokyo-bookstore-spots.json");
const LOCAL_SA_PATH = path.resolve(".firebase-admin.json");
const ENV_LOCAL_PATH = path.resolve(".env.local");

function loadEnvProjectId() {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return;
  if (!fs.existsSync(ENV_LOCAL_PATH)) return;
  try {
    const content = fs.readFileSync(ENV_LOCAL_PATH, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*NEXT_PUBLIC_FIREBASE_PROJECT_ID\s*=\s*(.+)\s*$/);
      if (m) {
        const val = m[1].replace(/^"|"$/g, "").replace(/^'|'$/g, "");
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = val;
        if (!process.env.GOOGLE_CLOUD_PROJECT) process.env.GOOGLE_CLOUD_PROJECT = val;
        if (!process.env.GCLOUD_PROJECT) process.env.GCLOUD_PROJECT = val;
        break;
      }
    }
  } catch (_) {}
}

function initFirebase() {
  // If project id is provided via Next public env, propagate to admin env vars
  loadEnvProjectId();
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !process.env.GOOGLE_CLOUD_PROJECT) {
    process.env.GOOGLE_CLOUD_PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  }
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !process.env.GCLOUD_PROJECT) {
    process.env.GCLOUD_PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  }

  // Prefer local service account if available for determinism
  if (fs.existsSync(LOCAL_SA_PATH)) {
    const serviceAccount = JSON.parse(fs.readFileSync(LOCAL_SA_PATH, "utf8"));
    if (!process.env.FIREBASE_PROJECT_ID) {
      process.env.FIREBASE_PROJECT_ID = serviceAccount.project_id;
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    AUTH_MODE = "service_account";
    console.log("Initialized Firebase using .firebase-admin.json");
    return;
  }

  // Fallback to ADC
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    AUTH_MODE = "adc";
    console.log("Initialized Firebase using Application Default Credentials.");
    return;
  } catch (_) {
    // ignore
  }

  throw new Error(
    "Failed to initialize Firebase Admin. Provide .firebase-admin.json or ADC."
  );
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Data file not found: ${DATA_PATH}`);
  }

  initFirebase();
  // Build Firestore client with explicit projectId to avoid ADC project detection issues
  const projectId =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "Project ID is not set. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT."
    );
  }

  let db;
  if (AUTH_MODE === "service_account") {
    const sa = JSON.parse(fs.readFileSync(LOCAL_SA_PATH, "utf8"));
    db = new FirestorePkg.Firestore({
      projectId: sa.project_id,
      credentials: {
        client_email: sa.client_email,
        private_key: sa.private_key,
      },
    });
  } else {
    // Use ADC with explicit projectId
    db = new FirestorePkg.Firestore({ projectId });
  }

  console.log(`Using Firestore project: ${projectId} (auth: ${AUTH_MODE || "adc"})`);

  const raw = fs.readFileSync(DATA_PATH, "utf8");
  /** @type {Array<any>} */
  const spots = JSON.parse(raw);

  const prepared = spots.map((s) => {
    const slug = s.slug || slugify(s.name);
    const area = s.area || "tokyo";
    const photos = Array.isArray(s.photos) && s.photos.length > 0
      ? s.photos
      : Array.from({ length: 10 }, (_, i) => `/images/photos/${s.placeId}/${i + 1}.jpg`);
    return { ...s, slug, area, photos };
  });

  let total = 0;
  const batchSize = 400;
  try {
    for (let i = 0; i < prepared.length; i += batchSize) {
      const batch = db.batch();
      const slice = prepared.slice(i, i + batchSize);
      for (const spot of slice) {
        const docId = spot.slug;
        const ref = db.collection("spots").doc(docId);
        batch.set(
          ref,
          {
            ...spot,
            id: docId,
            updatedAt: FirestorePkg.Timestamp.now(),
            // createdAt will be set on first write; preserved on merge
            createdAt: FirestorePkg.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        total += 1;
      }
      await batch.commit();
      console.log(`Committed batch: ${slice.length} docs`);
    }
  } catch (err) {
    if (err && (err.code === 5 || err.code === '5')) {
      console.error(
        `NOT_FOUND: Firestore database for project '${projectId}' not found.\n` +
          "- Ensure Firestore is enabled and a default database exists in this project.\n" +
          "- Console: https://console.firebase.google.com/ > Firestore Database > Create database\n" +
          "- Or verify the projectId is correct."
      );
    }
    throw err;
  }

  console.log(`Seeded ${total} spots to Firestore.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
