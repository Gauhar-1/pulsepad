// src/firebase/admin.ts
import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

let firestore: Firestore;
let auth: Auth;

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
  firestore = admin.firestore();
  auth = admin.auth();
}

function getFirebaseAdmin() {
  if (!admin.apps.length) {
    initializeFirebaseAdmin();
  }
  return { firestore, auth };
}

export { getFirebaseAdmin };
