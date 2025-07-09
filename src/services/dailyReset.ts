// Daily usage reset service
import { collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to reset all users' daily usage
export const resetAllUsersDaily = async (): Promise<void> => {
  try {
    console.log('🔄 Starting daily usage reset for all users...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('ℹ️ No users found to reset');
      return;
    }
    
    // Use batch write for better performance
    const batch = writeBatch(db);
    let resetCount = 0;
    
    usersSnapshot.docs.forEach((userDoc) => {
      batch.update(userDoc.ref, {
        used_today: 0,
        daily_reset_at: serverTimestamp(),
        last_reset_date: new Date().toISOString().split('T')[0] // Store date for tracking
      });
      resetCount++;
    });
    
    await batch.commit();
    
    console.log(`✅ Daily usage reset completed for ${resetCount} users`);
    
    // Log the reset event
    await logResetEvent(resetCount);
    
  } catch (error) {
    console.error('❌ Error resetting daily usage:', error);
    throw error;
  }
};

// Log reset events for monitoring
const logResetEvent = async (userCount: number) => {
  try {
    const resetLog = {
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split('T')[0],
      users_reset: userCount,
      type: 'daily_usage_reset',
      status: 'completed'
    };
    
    // You could store this in a 'system_logs' collection for monitoring
    console.log('📊 Reset event logged:', resetLog);
  } catch (error) {
    console.warn('⚠️ Failed to log reset event:', error);
  }
};

// Check if reset is needed for today
export const checkIfResetNeeded = async (): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if any user has been reset today
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.last_reset_date === today) {
        console.log('ℹ️ Daily reset already completed for today');
        return false;
      }
    }
    
    console.log('🔄 Daily reset needed for today');
    return true;
  } catch (error) {
    console.error('❌ Error checking reset status:', error);
    return true; // Default to needing reset if check fails
  }
};

// Manual reset function for admin use
export const manualDailyReset = async (): Promise<{ success: boolean; message: string; userCount?: number }> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const userCount = usersSnapshot.size;
    
    await resetAllUsersDaily();
    
    return {
      success: true,
      message: `Successfully reset daily usage for ${userCount} users`,
      userCount
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset daily usage: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Initialize daily reset scheduler (runs in browser)
export const initializeDailyResetScheduler = () => {
  console.log('🕐 Initializing daily reset scheduler...');
  
  // Calculate milliseconds until next midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  console.log(`⏰ Next reset scheduled in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);
  
  // Set timeout for first reset at midnight
  setTimeout(async () => {
    console.log('🌙 Midnight reached - checking if reset is needed...');
    
    const resetNeeded = await checkIfResetNeeded();
    if (resetNeeded) {
      await resetAllUsersDaily();
    }
    
    // Set up daily interval (24 hours)
    setInterval(async () => {
      console.log('🌙 Daily reset interval triggered...');
      const resetNeeded = await checkIfResetNeeded();
      if (resetNeeded) {
        await resetAllUsersDaily();
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
    
  }, msUntilMidnight);
};

// Get reset status for admin dashboard
export const getResetStatus = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    let resetToday = 0;
    let totalUsers = 0;
    
    usersSnapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data();
      totalUsers++;
      if (userData.last_reset_date === today) {
        resetToday++;
      }
    });
    
    return {
      date: today,
      total_users: totalUsers,
      reset_today: resetToday,
      reset_completed: resetToday === totalUsers && totalUsers > 0,
      next_reset: getNextResetTime()
    };
  } catch (error) {
    console.error('Error getting reset status:', error);
    return null;
  }
};

// Get next reset time
const getNextResetTime = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};