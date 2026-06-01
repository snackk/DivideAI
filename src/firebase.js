import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = typeof window.__FIREBASE_CONFIG__ !== 'undefined'
  ? window.__FIREBASE_CONFIG__
  : JSON.parse(import.meta.env.VITE_FIREBASE || '{}');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const APP_ID = 'DivideAI';

