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
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Initialize providers - Only Google and Facebook
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Configure providers
googleProvider.addScope('email');
googleProvider.addScope('profile');

export const registerUser = async (email: string, password: string, fullName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name if provided
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName
      });
    }
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore with email verification status
    await setDoc(doc(db, 'users', user.uid), {
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
    });
    
    console.log('✅ User registered successfully. Verification email sent.');
    return user;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
    }
    
    // Update user document with email verification status
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (!userData.emailVerified) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          emailVerified: true,
          registrationCompleted: true,
          lastLoginAt: serverTimestamp()
        });
      }
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
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
    } else {
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        ...userDoc.data(),
        lastLoginAt: serverTimestamp(),
        emailVerified: true,
        registrationCompleted: true
      });
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
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
    } else {
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        ...userDoc.data(),
        lastLoginAt: serverTimestamp(),
        emailVerified: true,
        registrationCompleted: true
      });
    }
    
    return user;
  } catch (error) {
    throw error;
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
    throw error;
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
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
    }
  } catch (error) {
    throw error;
  }
};