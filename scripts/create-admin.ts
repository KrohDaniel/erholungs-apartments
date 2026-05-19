/* eslint-disable no-console */
/**
 * Create an admin user in Firebase Auth + set `admin: true` custom claim.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email>
 *
 * Generates a strong random password and prints it ONCE. Save it in your
 * password manager — it cannot be retrieved later.
 */

import { config } from 'dotenv';
import { randomBytes } from 'crypto';
import {
  initializeApp,
  cert,
  getApps,
  type App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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

function generateStrongPassword(): string {
  // 24 chars from a safe alphabet (no ambiguous chars like 0/O, 1/l)
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZ' +
    'abcdefghijkmnpqrstuvwxyz' +
    '23456789' +
    '!@#$%^&*-_=+';
  const bytes = randomBytes(24);
  let pw = '';
  for (let i = 0; i < bytes.length; i++) {
    pw += alphabet[bytes[i] % alphabet.length];
  }
  return pw;
}

async function main() {
  const email = process.argv[2];
  if (!email || !email.includes('@')) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email>');
    process.exit(1);
  }

  const auth = getAuth(getApp());
  const password = generateStrongPassword();

  let uid: string;
  try {
    const user = await auth.getUserByEmail(email);
    uid = user.uid;
    await auth.updateUser(uid, { password });
    console.log(`✓ Bestehender User aktualisiert: ${email} (uid: ${uid})`);
  } catch {
    const created = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: 'Admin',
    });
    uid = created.uid;
    console.log(`✓ Neuer User angelegt: ${email} (uid: ${uid})`);
  }

  await auth.setCustomUserClaims(uid, { admin: true });
  console.log('✓ Custom Claim gesetzt: { admin: true }');

  console.log('\n========================================');
  console.log(`E-Mail:    ${email}`);
  console.log(`Passwort:  ${password}`);
  console.log('========================================');
  console.log(
    '\n⚠️  Diese Anzeige NICHT verlieren — das Passwort kann nicht wiederhergestellt werden.'
  );
  console.log('   Login: https://erholungs-apartments.de/admin-login/\n');
}

main().catch((err) => {
  console.error('Fehler:', err);
  process.exit(1);
});
