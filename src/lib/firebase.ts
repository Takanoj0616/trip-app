// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBiS530u2Lu70xxRgEWDrUKQlqJAL-XSn4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trip-app-10370.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-app-10370",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trip-app-10370.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "199746269613",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:199746269613:web:035a318880732ede767124",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HCMJV8R71J"
};

// Initialize Firebase only if config is available and required environment variables are set
let app;
let auth;
let db;
let storage;

// Check if we have the minimum required config
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.authDomain && 
                      firebaseConfig.projectId;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services with error handling
    auth = getAuth(app);
  
  // Initialize Firestore with updated settings for production
  db = getFirestore(app);
  
  // Skip persistence configuration in production to avoid connection issues
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
      import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
        enableIndexedDbPersistence(db, {
          synchronizeTabs: true
        }).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.info('Firebase: Persistence disabled due to multiple tabs');
          } else if (err.code === 'unimplemented') {
            console.info('Firebase: Persistence not supported in this browser');
          } else {
            console.warn('Firebase persistence error:', err);
          }
        });
      });
    } catch (error) {
      console.info('Firebase persistence setup skipped:', error.message);
    }
  }
  
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // Provide fallback values
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('Firebase configuration incomplete - using fallback values');
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };

// Initialize Analytics (only in browser environment and if app is available)
let analytics;
if (typeof window !== 'undefined' && app) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
    analytics = null;
  }
} else {
  analytics = null;
}
export { analytics };

// Auth exports
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  // Expose generic OAuth provider for Apple, etc.
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
};

// Firestore exports
export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
};

// Storage exports
export {
  ref,
  uploadBytes,
  getDownloadURL
};

export default app;
