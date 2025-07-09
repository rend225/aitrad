import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';
import { db } from '../config/firebase';
import { User, Plan, School, Recommendation } from '../types';

// User operations with improved plan updates
export const updateUserPlan = async (userId: string, planId: string, subscriptionId: string) => {
  try {
    // Get the plan details first
    const planDoc = await getDoc(doc(db, 'plans', planId));
    if (!planDoc.exists()) {
      throw new Error('Plan not found');
    }
    
    const planData = planDoc.data();
    const recommendationLimit = planData.recommendations_per_day || 1;
    
    console.log(`🔄 Updating user ${userId} to plan ${planId} with ${recommendationLimit} daily recommendations`);
    
    // Update user with new plan and reset daily usage
    await updateDoc(doc(db, 'users', userId), {
      plan: planId,
      subscriptionId,
      recommendation_limit: recommendationLimit,
      used_today: 0, // Reset usage when plan changes
      plan_updated_at: serverTimestamp()
    });
    
    console.log(`✅ User plan updated successfully`);
  } catch (error) {
    console.error('❌ Error updating user plan:', error);
    throw error;
  }
};

export const incrementUserUsage = async (userId: string) => {
  try {
    console.log(`📊 Incrementing usage for user ${userId}`);
    
    await updateDoc(doc(db, 'users', userId), {
      used_today: increment(1),
      last_recommendation_at: serverTimestamp()
    });
    
    console.log(`✅ User usage incremented`);
  } catch (error) {
    console.error('❌ Error incrementing user usage:', error);
    throw error;
  }
};

// Daily usage reset function (should be called by a scheduled function)
export const resetDailyUsage = async (userId: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      used_today: 0,
      daily_reset_at: serverTimestamp()
    });
    console.log(`✅ Daily usage reset for user ${userId}`);
  } catch (error) {
    console.error('❌ Error resetting daily usage:', error);
    throw error;
  }
};

// Reset all users' daily usage (admin function)
export const resetAllUsersDaily = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const batch = writeBatch(db);
    
    usersSnapshot.docs.forEach((userDoc) => {
      batch.update(userDoc.ref, {
        used_today: 0,
        daily_reset_at: serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`✅ Daily usage reset for all users`);
  } catch (error) {
    console.error('❌ Error resetting all users daily usage:', error);
    throw error;
  }
};

// Check if user can generate recommendation
export const canUserGenerateRecommendation = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData.used_today < userData.recommendation_limit;
  } catch (error) {
    console.error('Error checking user recommendation limit:', error);
    return false;
  }
};

// Admin user management functions
export const updateUserPlanAdmin = async (userId: string, planId: string) => {
  try {
    // Get the plan details
    const planDoc = await getDoc(doc(db, 'plans', planId));
    if (!planDoc.exists()) {
      throw new Error('Plan not found');
    }
    
    const planData = planDoc.data();
    const recommendationLimit = planData.recommendations_per_day || 1;
    
    await updateDoc(doc(db, 'users', userId), {
      plan: planId,
      recommendation_limit: recommendationLimit,
      used_today: 0, // Reset usage when changing plan
      admin_updated_at: serverTimestamp()
    });
    
    console.log(`✅ Admin updated user ${userId} to plan ${planId}`);
  } catch (error) {
    console.error('❌ Error updating user plan (admin):', error);
    throw error;
  }
};

export const updateUserUsage = async (userId: string, usedToday: number, recommendationLimit: number) => {
  await updateDoc(doc(db, 'users', userId), {
    used_today: usedToday,
    recommendation_limit: recommendationLimit,
    admin_usage_updated_at: serverTimestamp()
  });
};

// Enhanced user deletion - removes from both Firestore and Firebase Auth
export const deleteUser = async (userId: string) => {
  try {
    console.log(`🗑️ Starting deletion process for user ${userId}...`);
    
    // Step 1: Delete user's recommendations subcollection
    try {
      const recommendationsRef = collection(db, 'recommendations', userId, 'recommendations');
      const recommendationsSnapshot = await getDocs(recommendationsRef);
      
      if (!recommendationsSnapshot.empty) {
        const batch = writeBatch(db);
        recommendationsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`✅ Deleted ${recommendationsSnapshot.size} recommendations for user ${userId}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not delete recommendations for user ${userId}:`, error);
    }
    
    // Step 2: Delete user document from Firestore
    await deleteDoc(doc(db, 'users', userId));
    console.log(`✅ Deleted user document from Firestore: ${userId}`);
    
    // Step 3: Note about Firebase Auth deletion
    console.log(`ℹ️ Note: Firebase Auth user deletion requires admin SDK on backend`);
    console.log(`ℹ️ User ${userId} has been removed from Firestore. Auth deletion should be handled server-side.`);
    
    return {
      success: true,
      message: 'User deleted from database successfully. Authentication cleanup may require backend processing.',
      firestoreDeleted: true,
      authDeleted: false // Would need backend implementation
    };
    
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Enhanced recommendation saving with proper usage tracking
export const saveRecommendation = async (recommendation: Omit<Recommendation, 'id'>) => {
  try {
    const { userId } = recommendation;
    
    // Check if user can generate recommendation
    const canGenerate = await canUserGenerateRecommendation(userId);
    if (!canGenerate) {
      throw new Error('Daily recommendation limit reached');
    }
    
    // Save recommendation
    const docRef = await addDoc(collection(db, 'recommendations', userId, 'recommendations'), {
      ...recommendation,
      timestamp: serverTimestamp(),
      created_at: serverTimestamp()
    });
    
    // Increment user usage
    await incrementUserUsage(userId);
    
    console.log(`✅ Recommendation saved and usage updated for user ${userId}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving recommendation:', error);
    throw error;
  }
};

export const getUserRecommendations = async (userId: string, limitCount = 10) => {
  // Query from the path: /recommendations/{userId}/recommendations
  const q = query(
    collection(db, 'recommendations', userId, 'recommendations'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recommendation[];
};

// Featured Signals - Admin curated examples for homepage
export const getFeaturedSignals = async () => {
  try {
    const q = query(
      collection(db, 'featured_signals'),
      where('featured', '==', true),
      orderBy('date', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured signals:', error);
    return [];
  }
};

export const getAllFeaturedSignals = async () => {
  try {
    const q = query(
      collection(db, 'featured_signals'),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all featured signals:', error);
    return [];
  }
};

export const saveFeaturedSignal = async (signal: any) => {
  try {
    const docRef = await addDoc(collection(db, 'featured_signals'), {
      ...signal,
      createdAt: serverTimestamp(),
      featured: signal.featured || false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving featured signal:', error);
    throw error;
  }
};

export const updateFeaturedSignal = async (signalId: string, updates: any) => {
  try {
    await updateDoc(doc(db, 'featured_signals', signalId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating featured signal:', error);
    throw error;
  }
};

export const deleteFeaturedSignal = async (signalId: string) => {
  try {
    await deleteDoc(doc(db, 'featured_signals', signalId));
  } catch (error) {
    console.error('Error deleting featured signal:', error);
    throw error;
  }
};

// Convert user recommendation to featured signal
export const promoteToFeaturedSignal = async (recommendation: Recommendation, signalData: any) => {
  try {
    const featuredSignal = {
      pair: signalData.pair || 'UNKNOWN',
      type: signalData.type || 'hold',
      entry: signalData.entry || 0,
      stopLoss: signalData.stopLoss,
      takeProfit1: signalData.takeProfit1,
      takeProfit2: signalData.takeProfit2,
      probability: signalData.probability || 85,
      result: 'profit', // Admin can set this
      profitPips: 0, // Admin can set this
      date: new Date().toISOString().split('T')[0],
      school: recommendation.school,
      featured: true,
      originalRecommendationId: recommendation.id,
      originalUserId: recommendation.userId,
      analysis: recommendation.response
    };
    
    return await saveFeaturedSignal(featuredSignal);
  } catch (error) {
    console.error('Error promoting to featured signal:', error);
    throw error;
  }
};

// Plans - Enhanced with proper document naming
export const getPlans = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'plans'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plan[];
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

// Create plan with plan name as document ID (instead of random ID)
export const createPlan = async (plan: Omit<Plan, 'id'>) => {
  try {
    // Use plan name (lowercase, no spaces) as document ID
    const planId = plan.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if plan with this ID already exists
    const existingPlan = await getDoc(doc(db, 'plans', planId));
    if (existingPlan.exists()) {
      throw new Error(`Plan with name "${plan.name}" already exists`);
    }
    
    // Create plan with custom ID
    await setDoc(doc(db, 'plans', planId), {
      ...plan,
      created_at: serverTimestamp()
    });
    
    console.log(`✅ Plan created with ID: ${planId}`);
    return planId;
  } catch (error) {
    console.error('❌ Error creating plan:', error);
    throw error;
  }
};

export const updatePlan = async (planId: string, updates: Partial<Omit<Plan, 'id'>>) => {
  await updateDoc(doc(db, 'plans', planId), {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const deletePlan = async (planId: string) => {
  await deleteDoc(doc(db, 'plans', planId));
};

// Schools - Enhanced with proper document naming
export const getSchools = async () => {
  const snapshot = await getDocs(collection(db, 'schools'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as School[];
};

// Create school with school name as document ID (instead of random ID)
export const createSchool = async (school: Omit<School, 'id'>) => {
  try {
    // Use school name (lowercase, no spaces) as document ID
    const schoolId = school.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if school with this ID already exists
    const existingSchool = await getDoc(doc(db, 'schools', schoolId));
    if (existingSchool.exists()) {
      throw new Error(`School with name "${school.name}" already exists`);
    }
    
    // Create school with custom ID
    await setDoc(doc(db, 'schools', schoolId), {
      ...school,
      created_at: serverTimestamp()
    });
    
    console.log(`✅ School created with ID: ${schoolId}`);
    return schoolId;
  } catch (error) {
    console.error('❌ Error creating school:', error);
    throw error;
  }
};

export const updateSchool = async (schoolId: string, updates: Partial<Omit<School, 'id'>>) => {
  await updateDoc(doc(db, 'schools', schoolId), {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const deleteSchool = async (schoolId: string) => {
  await deleteDoc(doc(db, 'schools', schoolId));
};

// SEO Settings
export const getSEOSettings = async () => {
  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      return seoDoc.data();
    }
    return {};
  } catch (error) {
    console.error('Error getting SEO settings:', error);
    return {};
  }
};

export const updateSEOSettings = async (settings: any) => {
  try {
    await setDoc(doc(db, 'settings', 'seo'), {
      ...settings,
      lastUpdated: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    throw error;
  }
};

// General settings management
export const getSetting = async (settingId: string) => {
  try {
    const settingDoc = await getDoc(doc(db, 'settings', settingId));
    if (settingDoc.exists()) {
      return settingDoc.data();
    }
    return null;
  } catch (error) {
    console.error(`Error getting setting ${settingId}:`, error);
    return null;
  }
};

export const updateSetting = async (settingId: string, data: any) => {
  try {
    await setDoc(doc(db, 'settings', settingId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error updating setting ${settingId}:`, error);
    throw error;
  }
};

// Admin operations
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[];
};

// Get all recommendations across all users (admin only)
export const getAllRecommendations = async (limitCount = 50) => {
  try {
    // This is a simplified approach - in production you might want to use a different structure
    // For now, we'll get recommendations from all users
    const users = await getAllUsers();
    const allRecommendations: Recommendation[] = [];
    
    for (const user of users.slice(0, 10)) { // Limit to first 10 users to avoid quota issues
      try {
        const userRecs = await getUserRecommendations(user.uid, 5);
        allRecommendations.push(...userRecs);
      } catch (error) {
        console.warn(`Failed to get recommendations for user ${user.uid}:`, error);
      }
    }
    
    // Sort by timestamp and limit
    return allRecommendations
      .sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime())
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching all recommendations:', error);
    return [];
  }
};