import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const makeUserAdmin = async (userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isAdmin: true
    });
    console.log(`✅ User ${userId} is now an admin`);
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    throw error;
  }
};

// Helper function to make current user admin (for development)
export const makeCurrentUserAdmin = async (userEmail: string) => {
  try {
    // In a real app, you'd query by email to get the user ID
    // For now, you'll need to get the user ID from Firebase console
    console.log(`To make ${userEmail} an admin:`);
    console.log('1. Go to Firebase Console → Firestore');
    console.log('2. Find the user document in the "users" collection');
    console.log('3. Add field: isAdmin = true (boolean)');
    console.log('4. Or use the makeUserAdmin function with the user ID');
  } catch (error) {
    console.error('Error:', error);
  }
};