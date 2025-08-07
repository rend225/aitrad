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

// Helper function to handle Firebase errors
const handleFirebaseError = (error: any): string => {
  console.error('Firebase Error Details:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });

  switch (error.code) {
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection and try again.';
    case 'auth/invalid-api-key':
      return 'Authentication service is temporarily unavailable. Please try again later.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'permission-denied':
      return 'Permission denied. Please try logging in again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Helper function to retry operations
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Don't retry certain errors
      if (error.code === 'auth/email-already-in-use' || 
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-email') {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error('Max retries exceeded');
};

export const registerUser = async (email: string, password: string, fullName?: string) => {
  try {
    console.log('🔄 Starting user registration...');
    
    const operation = async () => {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase user created successfully');
      
      // Update user profile with display name if provided
      if (fullName) {
        try {
          await updateProfile(user, { displayName: fullName });
          console.log('✅ User profile updated with display name');
        } catch (profileError) {
          console.warn('⚠️ Failed to update profile, continuing...', profileError);
        }
      }
      
      // Send email verification
      try {
        await sendEmailVerification(user);
        console.log('✅ Verification email sent');
      } catch (emailError) {
        console.warn('⚠️ Failed to send verification email, continuing...', emailError);
      }
      
      // Create user document in Firestore
      try {
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
          emailVerified: false,
          verificationEmailSent: true,
          registrationCompleted: false
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('✅ User document created in Firestore');
      } catch (firestoreError) {
        console.error('❌ Failed to create user document:', firestoreError);
        // Don't throw here - user account is created, document can be created later
      }
      
      return user;
    };
    
    const user = await retryOperation(operation);
    console.log('✅ User registration completed successfully');
    return user;
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('🔄 Starting user login...');
    
    const operation = async () => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ User signed in successfully');
      
      // Check if email is verified (skip for development)
      if (!user.emailVerified && import.meta.env.PROD) {
        throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
      }
      
      // Update user document with email verification status
      try {
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
          console.log('✅ New user document created');
        }
      } catch (firestoreError) {
        console.warn('⚠️ Failed to update user document:', firestoreError);
        // Don't throw - login was successful
      }
      
      return user;
    };
    
    const user = await retryOperation(operation);
    console.log('✅ User login completed successfully');
    return user;
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    throw new Error(handleFirebaseError(error));
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Starting Google sign in...');
    
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
