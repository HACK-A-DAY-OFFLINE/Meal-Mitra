import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Demo config - replace with your Firebase config
const firebaseConfig = {
  apiKey: "demo-mealmitra",
  authDomain: "mealmitra-demo.firebaseapp.com",
  projectId: "mealmitra-demo",
  storageBucket: "mealmitra-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id-mealmitra"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);