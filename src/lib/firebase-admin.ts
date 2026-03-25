// =============================================================================
// Erholungs Apartments - Firebase Admin (Server-Side Only)
// =============================================================================

import {
  initializeApp,
  getApps,
  cert,
  type App,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// -----------------------------------------------------------------------------
// Admin App (Singleton)
// -----------------------------------------------------------------------------

let adminApp: App;

function getAdminApp(): App {
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

// -----------------------------------------------------------------------------
// Admin Firestore
// -----------------------------------------------------------------------------

let adminDb: Firestore;

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export { getAdminApp };
