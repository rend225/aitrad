import { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Set up real-time listener for user data
          const unsubscribeUser = onSnapshot(
            doc(db, 'users', firebaseUser.uid), 
            (userDoc) => {
              if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Get plan type from plan ID if needed
                let planType = userData.plan;
                
                // If plan is not a standard type, we'll need to fetch the plan details
                if (!['free', 'pro', 'elite'].includes(planType)) {
                  // For now, we'll just set a default value
                  // In a production app, you might want to fetch the plan details
                  console.log(`Plan ID detected: ${planType}. This should be converted to a plan type.`);
                }
                
                setUser({ 
                  uid: firebaseUser.uid, 
                  ...userData,
                  // Ensure these fields exist even if they're not in Firestore
                  displayName: userData.displayName || firebaseUser.displayName || '',
                  email: userData.email || firebaseUser.email || '',
                  photoURL: userData.photoURL || firebaseUser.photoURL || '',
                  isAdmin: userData.isAdmin || false,
                  plan: planType || 'free',
                  used_today: userData.used_today || 0,
                  recommendation_limit: userData.recommendation_limit || 1
                } as User);
              } else {
                // User document doesn't exist in Firestore
                setUser(null);
              }
              setLoading(false);
            },
            (error) => {
              // Handle Firestore permission errors gracefully
              console.error('Error listening to user document:', error);
              if (error.code === 'permission-denied') {
                console.warn('Permission denied accessing user document. User may need to be authenticated or Firestore rules may need adjustment.');
              }
              setUser(null);
              setLoading(false);
            }
          );
          
          return () => {
            unsubscribeUser();
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, firebaseUser, loading };
};