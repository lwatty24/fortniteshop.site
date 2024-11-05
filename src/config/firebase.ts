import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeIHygUEMK65ZqA0qXJRzQ6rR1g65ns3E",
  authDomain: "fortniteshop-site.firebaseapp.com",
  projectId: "fortniteshop-site",
  storageBucket: "fortniteshop-site.firebasestorage.app",
  messagingSenderId: "1081984934903",
  appId: "1:1081984934903:web:fc6024bcf96aaafff684f2",
  measurementId: "G-SGHTNL7QGS"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();