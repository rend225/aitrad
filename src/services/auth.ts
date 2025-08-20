import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updatePassword,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Initialize providers - Only Google and Facebook
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Configure providers
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Helper function to handle Firebase errors with better messaging
const handleFirebaseError = (error: any): string => {
  console.error('🔥 Firebase Error Details:', {
    code: error.code,
    message: error.message,
    name: error.name,
    customData: error.customData
  });

  // Handle specific network errors
  if (error.code === 'auth/network-request-failed') {
    return 'Unable to connect to authentication servers. This may be due to:\n' +
           '• Network connectivity issues\n' +
           '• Firewall restrictions\n' +
           '• DNS resolution problems\n\n' +
           'Please check your internet connection and try again.';
  }

  // Handle other common errors
  switch (error.code) {
    case 'auth/invalid-api-key':
      return 'Authentication service configuration error. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password (at least 6 characters).';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'permission-denied':
      return 'Permission denied. Please try signing in again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again or contact support.';
  }
};

// Simple retry logic with exponential backoff
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} failed:`, error.code || error.message);
      
      // Don't retry certain errors
      const nonRetryableErrors = [
        'auth/email-already-in-use',
        'auth/wrong-password',
        'auth/user-not-found',
        'auth/invalid-email',
        'auth/weak-password',
        'auth/invalid-api-key',
        'auth/operation-not-allowed',
        'auth/user-disabled'
      ];
      
      if (nonRetryableErrors.includes(error.code)) {
        console.log('❌ Non-retryable error, failing immediately');
        throw error;
      }
      
      if (attempt === maxRetries) {
        console.log('❌ Max retries exceeded');
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Check if Firebase is available
const checkFirebaseAvailability = (): boolean => {
  if (!auth || !db) {
    console.error('❌ Firebase services not available');
    return false;
  }
  return true;
};

export const registerUser = async (email: string, password: string, fullName?: string) => {
  try {
    console.log('🔄 Starting user registration for:', email);
    
    if (!checkFirebaseAvailability()) {
      throw new Error('Authentication service is temporarily unavailable. Please try again later.');
    }
    
    const operation = async () => {
      // Create user account
      console.log('📝 Creating Firebase user account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase user created:', user.uid);
      
      // Update user profile with display name if provided
      if (fullName) {
        try {
          console.log('👤 Updating user profile...');
          await updateProfile(user, { displayName: fullName });
          console.log('✅ User profile updated');
        } catch (profileError) {
          console.warn('⚠️ Failed to update profile, continuing...', profileError);
        }
      }
      
      // Send email verification (always send unless explicitly disabled)
      try {
        console.log('📧 Sending verification email...');
        await sendEmailVerification(user);
        console.log('✅ Verification email sent successfully to:', user.email);
      } catch (emailError: any) {
        console.error('❌ Failed to send verification email:', emailError);
        console.error('Error details:', {
          code: emailError.code,
          message: emailError.message
        });

        // Don't throw - user account should still be created
        console.warn('⚠️ Continuing registration without email verification...');
      }
      
      // Create user document in Firestore
      try {
        console.log('💾 Creating user document in Firestore...');
        const userData = {
          email: user.email,
          displayName: fullName || '',
          photoURL: user.photoURL || '',
          provider: 'email',
          plan: 'free',
          used_today: 0,
          recommendation_limit: 1,
          subscriptionId: null,
          school: 'default',
          createdAt: serverTimestamp(),
          isAdmin: false,
          emailVerified: true, // Allow access immediately for development
          verificationEmailSent: true,
          registrationCompleted: true
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('✅ User document created in Firestore');
      } catch (firestoreError: any) {
        console.error('❌ Failed to create user document:', firestoreError);
        // Don't throw here - user account is created, document can be created later
        console.warn('⚠️ User account created but profile incomplete. You can complete it later.');
      }
      
      return user;
    };
    
    const user = await retryOperation(operation);
    console.log('🎉 User registration completed successfully');
    return user;
    
  } catch (error: any) {
    console.error('❌ Registration failed:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('🔄 Starting user login for:', email);
    
    if (!checkFirebaseAvailability()) {
      throw new Error('Authentication service is temporarily unavailable. Please try again later.');
    }
    
    const operation = async () => {
      console.log('🔐 Signing in user...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ User signed in successfully:', user.uid);
      
      // Check if email is verified (more lenient for development)
      if (!user.emailVerified) {
        console.warn('⚠️ Email not verified, but allowing login for development');
        // In development, we'll allow login but show a notice
        // In production, this would throw an error
      }
      
      // Update user document with login info
      try {
        console.log('📝 Updating user document...');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            emailVerified: user.emailVerified,
            registrationCompleted: true,
            lastLoginAt: serverTimestamp()
          });
          console.log('✅ User document updated');
        } else {
          // Create user document if it doesn't exist
          console.log('📝 Creating missing user document...');
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            provider: 'email',
            plan: 'free',
            used_today: 0,
            recommendation_limit: 1,
            subscriptionId: null,
            school: 'default',
            createdAt: serverTimestamp(),
            isAdmin: false,
            emailVerified: user.emailVerified,
            registrationCompleted: true,
            lastLoginAt: serverTimestamp()
          });
          console.log('✅ User document created');
        }
      } catch (firestoreError) {
        console.warn('⚠️ Failed to update user document:', firestoreError);
        // Don't throw - login was successful
      }
      
      return user;
    };
    
    const user = await retryOperation(operation);
    console.log('🎉 User login completed successfully');
    return user;
    
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    throw new Error(handleFirebaseError(error));
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Starting Google sign in...');
    
    if (!checkFirebaseAvailability()) {
      throw new Error('Authentication service is temporarily unavailable. Please try again later.');
    }
    
    const operation = async () => {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('✅ Google sign in successful');
      
      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          provider: 'google',
          plan: 'free',
          used_today: 0,
          recommendation_limit: 1,
          subscriptionId: null,
          school: 'default',
          createdAt: serverTimestamp(),
          isAdmin: false,
          emailVerified: true, // Google accounts are pre-verified
          registrationCompleted: true
        });
        console.log('✅ New Google user document created');
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          ...userDoc.data(),
          lastLoginAt: serverTimestamp(),
          emailVerified: true,
          registrationCompleted: true
        });
        console.log('✅ Google user document updated');
      }
      
      return user;
    };
    
    return await retryOperation(operation);
    
  } catch (error: any) {
    console.error('❌ Google sign in error:', error);
    throw new Error(handleFirebaseError(error));
  }
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  try {
    console.log('🔄 Starting Facebook sign in...');
    
    if (!checkFirebaseAvailability()) {
      throw new Error('Authentication service is temporarily unavailable. Please try again later.');
    }
    
    const operation = async () => {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log('✅ Facebook sign in successful');
      
      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          provider: 'facebook',
          plan: 'free',
          used_today: 0,
          recommendation_limit: 1,
          subscriptionId: null,
          school: 'default',
          createdAt: serverTimestamp(),
          isAdmin: false,
          emailVerified: true, // Facebook accounts are pre-verified
          registrationCompleted: true
        });
        console.log('✅ New Facebook user document created');
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          ...userDoc.data(),
          lastLoginAt: serverTimestamp(),
          emailVerified: true,
          registrationCompleted: true
        });
        console.log('✅ Facebook user document updated');
      }
      
      return user;
    };
    
    return await retryOperation(operation);
    
  } catch (error: any) {
    console.error('❌ Facebook sign in error:', error);
    throw new Error(handleFirebaseError(error));
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    await sendEmailVerification(user);
    console.log('✅ Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error(handleFirebaseError(error));
  }
};

// Check email verification status
export const checkEmailVerification = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Reload user to get latest verification status
    await user.reload();
    
    if (user.emailVerified) {
      // Update Firestore if verification status changed
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.emailVerified) {
            await setDoc(doc(db, 'users', user.uid), {
              ...userData,
              emailVerified: true,
              registrationCompleted: true,
              emailVerifiedAt: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to update verification status:', error);
      }
    }
    
    return user.emailVerified;
  } catch (error) {
    console.error('❌ Error checking email verification:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Error signing out:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
      console.log('✅ Password updated successfully');
    }
  } catch (error) {
    console.error('❌ Error updating password:', error);
    throw new Error(handleFirebaseError(error));
  }
};
