/* eslint-disable no-console */
/**
 * Seed-Import for the `invoices` Firestore collection.
 *
 * Usage:
 *   npx tsx scripts/seed-invoices.ts
 *
 * Skips invoices that already exist (matched by id).
 */

import { config } from 'dotenv';
import {
  initializeApp,
  cert,
  getApps,
  type App,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

config({ path: '.env.local' });

function getApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function main() {
  const seedPath = join(process.cwd(), 'scripts', 'seed-invoices.json');
  const raw = readFileSync(seedPath, 'utf-8');
  const seed = JSON.parse(raw) as Array<Record<string, unknown> & { id: string }>;

  const db = getFirestore(getApp());
  let created = 0;
  let skipped = 0;

  for (const inv of seed) {
    const { id, ...data } = inv;
    const ref = db.collection('invoices').doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }
    await ref.set(data);
    created++;
    console.log(`✓ Imported: ${id} (${data.invoiceNumber})`);
  }

  console.log(`\nDone. Created: ${created}, skipped (existing): ${skipped}.`);
}

main().catch((err) => {
  console.error('Fehler:', err);
  process.exit(1);
});
