import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase configuration fields:', missingFields);
    console.error('💡 Make sure these environment variables are set:', 
      missingFields.map(field => `VITE_FIREBASE_${field.toUpperCase()}`));
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
  
  console.log('✅ Firebase configuration validated successfully');
  return true;
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
  // Validate configuration first
  validateFirebaseConfig();
  
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Firebase Auth
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // Configure auth settings for better connectivity
  auth.settings = {
    appVerificationDisabledForTesting: false
  };
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Create fallback objects to prevent app crashes
  console.warn('⚠️ Using fallback Firebase configuration');
  
  // You might want to show a user-friendly error message here
  if (typeof window !== 'undefined') {
    console.error('Firebase is not properly configured. Please check your environment variables.');
  }
  
  throw error;
}

// Export Firebase instances
export { auth, db };
export default app;

// Export configuration validation function for debugging
export { validateFirebaseConfig, firebaseConfig };
