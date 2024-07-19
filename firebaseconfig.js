// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBYqdtLRho0kcUg2mf4rjt0i26SwkQ0Uro",
  authDomain: "hijazistore.firebaseapp.com",
  projectId: "hijazistore",
  storageBucket: "hijazistore.appspot.com",
  messagingSenderId: "100043503993",
  appId: "1:100043503993:web:c359849a649b9586aad7a8",
  measurementId: "G-YZZEYG0RZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export Firebase modules
export { app, db, storage, auth };
