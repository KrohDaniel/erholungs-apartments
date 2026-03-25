// =============================================================================
// Erholungs Apartments - Firebase Client
// =============================================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

// -----------------------------------------------------------------------------
// Firebase Configuration
// -----------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// -----------------------------------------------------------------------------
// Client-Side Firebase App (Singleton)
// -----------------------------------------------------------------------------

let app: FirebaseApp;

function getApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

// -----------------------------------------------------------------------------
// Firestore Client
// -----------------------------------------------------------------------------

let db: Firestore;

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getApp());
  }
  return db;
}

export { getApp };
