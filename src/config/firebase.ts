import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7tXV2VLkF_ot_9PVQDjFgzJOvpvjdoZo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-trading-app-420e9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-trading-app-420e9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-trading-app-420e9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "567924040476",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:567924040476:web:6dd9daf17cb3a30c3dbb4b"
};

// Debug function to test Firebase connectivity
const testFirebaseConnectivity = async () => {
  try {
    console.log('🔄 Testing Firebase connectivity...');
    
    // Test if we can reach Firebase Auth endpoint
    const authTestUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
    
    const response = await fetch(authTestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword',
        returnSecureToken: true
      })
    });
    
    if (response.status === 400) {
      // This is expected for test request - means Firebase is reachable
      console.log('✅ Firebase Auth endpoint is reachable');
      return true;
    } else if (response.status === 403) {
      console.warn('⚠️ Firebase API key may be restricted or invalid');
      return false;
    } else {
      console.log('🔍 Firebase response status:', response.status);
      return true;
    }
  } catch (error: any) {
    console.error('❌ Firebase connectivity test failed:', error.message);
    return false;
  }
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
  
  console.log('🔍 Firebase Configuration:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 20)}...` : 'missing'
  });
  
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

// Initialize Firebase with enhanced error handling
let app;
let auth;
let db;

try {
  console.log('🚀 Initializing Firebase...');
  
  // Validate configuration first
  validateFirebaseConfig();
  
  // Test connectivity
  testFirebaseConnectivity().then(isConnected => {
    if (isConnected) {
      console.log('✅ Firebase connectivity confirmed');
    } else {
      console.warn('⚠️ Firebase connectivity issues detected - check network/API key');
    }
  });
  
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Firebase Auth with enhanced settings
  auth = getAuth(app);
  
  // Configure auth settings for better network handling
  if (auth) {
    // Set custom timeout and retry settings
    auth.tenantId = null; // Ensure we're not using multi-tenancy
    console.log('✅ Firebase Auth initialized successfully');
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
} catch (error: any) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('📋 Error details:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  
  // Don't throw - allow app to continue with limited functionality
  console.warn('⚠️ Continuing with limited Firebase functionality');
  
  // Show user-friendly error
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      console.error('🔥 Firebase Configuration Error - Please check your internet connection or contact support');
    }, 1000);
  }
}

// Network monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Network restored - Firebase should be accessible again');
  });
  
  window.addEventListener('offline', () => {
    console.warn('📶 Network lost - Firebase operations may fail');
  });
}

// Export Firebase instances
export { auth, db };
export default app;

// Export configuration and testing functions for debugging
export { validateFirebaseConfig, firebaseConfig, testFirebaseConnectivity };
