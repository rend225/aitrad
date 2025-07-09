import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUserPassword } from '../services/auth';
import { updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  testTelegramConfig, 
  getTelegramBotInfo, 
  getTelegramChatInfo,
  getTelegramSetupInstructions 
} from '../services/telegram';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  CreditCard,
  Crown,
  Zap,
  Mail,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  Send,
  MessageSquare,
  Bot,
  TestTube,
  ExternalLink,
  Info,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Real-time user data
  const [userProfile, setUserProfile] = useState<any>(null);

  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Privacy settings
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  // Telegram settings (Elite only)
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramTesting, setTelegramTesting] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<'success' | 'error' | null>(null);
  const [showTelegramInstructions, setShowTelegramInstructions] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      loadUserSettings();
      setupRealtimeListener();
    }
  }, [user]);

  // Real-time listener for user data updates
  const setupRealtimeListener = () => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserProfile(userData);
        console.log('📊 Real-time user data updated:', {
          plan: userData.plan,
          used_today: userData.used_today,
          recommendation_limit: userData.recommendation_limit,
          subscriptionId: userData.subscriptionId
        });
      }
    });

    return () => unsubscribe();
  };

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        
        // Load notification settings
        if (userData.notifications) {
          setEmailNotifications(userData.notifications.email ?? true);
          setPushNotifications(userData.notifications.push ?? true);
          setTradingAlerts(userData.notifications.tradingAlerts ?? true);
          setWeeklyReports(userData.notifications.weeklyReports ?? true);
        }
        
        // Load privacy settings
        if (userData.privacy) {
          setDataSharing(userData.privacy.dataSharing ?? false);
          setAnalyticsTracking(userData.privacy.analyticsTracking ?? true);
        }
        
        // Load Telegram settings (Elite only)
        if (userData.telegram && userData.plan === 'elite') {
          setTelegramBotToken(userData.telegram.botToken || '');
          setTelegramChatId(userData.telegram.chatId || '');
          setTelegramEnabled(userData.telegram.enabled ?? false);
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const clearMessages = () => {
    setSuccess('');
    setError('');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    clearMessages();

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim()
      });

      setSuccess('Profile updated successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await updateUserPassword(newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    if (!user) return;

    setLoading(true);
    clearMessages();

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          tradingAlerts,
          weeklyReports
        }
      });

      setSuccess('Notification preferences updated!');
    } catch (error: any) {
      setError(error.message || 'Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    if (!user) return;

    setLoading(true);
    clearMessages();

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        privacy: {
          dataSharing,
          analyticsTracking
        }
      });

      setSuccess('Privacy settings updated!');
    } catch (error: any) {
      setError(error.message || 'Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramTest = async () => {
    if (!telegramBotToken || !telegramChatId) {
      setError('Please enter both bot token and chat ID');
      return;
    }

    setTelegramTesting(true);
    setTelegramTestResult(null);
    clearMessages();

    try {
      // Test the configuration
      const success = await testTelegramConfig({
        botToken: telegramBotToken,
        chatId: telegramChatId
      });

      if (success) {
        setTelegramTestResult('success');
        setSuccess('Telegram test message sent successfully!');
      } else {
        throw new Error('Test failed');
      }
    } catch (error: any) {
      setTelegramTestResult('error');
      setError(`Telegram test failed: ${error.message}`);
    } finally {
      setTelegramTesting(false);
    }
  };

  const handleTelegramUpdate = async () => {
    if (!user) return;

    setLoading(true);
    clearMessages();

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        telegram: {
          botToken: telegramBotToken,
          chatId: telegramChatId,
          enabled: telegramEnabled,
          updatedAt: new Date().toISOString()
        }
      });

      setSuccess('Telegram settings updated!');
    } catch (error: any) {
      setError(error.message || 'Failed to update Telegram settings');
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = () => {
    if (!user || !userProfile) return;

    const userData = {
      profile: {
        email: user.email,
        displayName: user.displayName,
        plan: userProfile.plan,
        createdAt: user.createdAt
      },
      usage: {
        usedToday: userProfile.used_today,
        recommendationLimit: userProfile.recommendation_limit
      },
      subscription: {
        subscriptionId: userProfile.subscriptionId,
        planUpdatedAt: userProfile.plan_updated_at
      },
      settings: {
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          tradingAlerts,
          weeklyReports
        },
        privacy: {
          dataSharing,
          analyticsTracking
        },
        telegram: userProfile.plan === 'elite' ? {
          enabled: telegramEnabled,
          configured: !!(telegramBotToken && telegramChatId)
        } : null
      }
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-trader-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <Shield className="h-5 w-5" />;
      case 'pro': return <Zap className="h-5 w-5" />;
      case 'elite': return <Crown className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-400 bg-gray-400/10';
      case 'pro': return 'text-blue-400 bg-blue-400/10';
      case 'elite': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free Plan';
      case 'pro': return 'Pro Plan';
      case 'elite': return 'Elite Plan';
      default: return 'Unknown Plan';
    }
  };

  if (!user) return null;

  const currentPlan = userProfile?.plan || user.plan || 'free';
  const currentUsage = userProfile?.used_today || 0;
  const currentLimit = userProfile?.recommendation_limit || 1;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'telegram', label: 'Telegram', icon: Send, eliteOnly: true },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  const telegramInstructions = getTelegramSetupInstructions();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-blue-400" />
            <span>Account Settings</span>
          </h1>
          <p className="text-gray-300">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Global Messages */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl flex items-center space-x-3">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
            <button onClick={clearMessages} className="ml-auto text-green-400 hover:text-green-300">×</button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center space-x-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const isEliteOnly = tab.eliteOnly && currentPlan !== 'elite';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !isEliteOnly && setActiveTab(tab.id)}
                      disabled={isEliteOnly}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : isEliteOnly
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                      {tab.eliteOnly && (
                        <Crown className="h-4 w-4 text-purple-400 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 sm:p-6 lg:p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Display Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your display name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="pl-10 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current Plan
                        </label>
                        <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${getPlanColor(currentPlan)}`}>
                          {getPlanIcon(currentPlan)}
                          <span className="font-semibold">{getPlanDisplayName(currentPlan)}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Daily Usage
                        </label>
                        <div className="flex items-center space-x-2 px-4 py-3 bg-white/10 rounded-lg">
                          <Activity className="h-5 w-5 text-green-400" />
                          <span className="text-white font-semibold">
                            {currentUsage} / {currentLimit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Member Since
                        </label>
                        <div className="flex items-center space-x-2 px-4 py-3 bg-white/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <span className="text-white font-semibold">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showPasswords"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="showPasswords" className="text-gray-300 flex items-center space-x-2">
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>Show passwords</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Email Notifications</h3>
                          <p className="text-gray-400 text-sm">Receive updates via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Push Notifications</h3>
                          <p className="text-gray-400 text-sm">Browser push notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Trading Alerts</h3>
                          <p className="text-gray-400 text-sm">Get notified about important market signals</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={tradingAlerts}
                          onChange={(e) => setTradingAlerts(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Weekly Reports</h3>
                          <p className="text-gray-400 text-sm">Weekly summary of your trading activity</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={weeklyReports}
                          onChange={(e) => setWeeklyReports(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'telegram' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-2xl font-bold text-white">Telegram Integration</h2>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                      <Crown className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">Elite Feature</span>
                    </div>
                  </div>

                  {currentPlan !== 'elite' ? (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
                      <Crown className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Elite Feature</h3>
                      <p className="text-gray-300 mb-6">
                        Telegram integration is available exclusively for Elite plan users. Send your trading signals directly to your Telegram channel.
                      </p>
                      <a
                        href="/plans"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Upgrade to Elite
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Setup Instructions */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                        <button
                          onClick={() => setShowTelegramInstructions(!showTelegramInstructions)}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium"
                        >
                          <Info className="h-4 w-4" />
                          <span>Setup Instructions</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${showTelegramInstructions ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showTelegramInstructions && (
                          <div className="mt-4 space-y-2 text-sm text-gray-300">
                            {telegramInstructions.steps.map((step, index) => (
                              <p key={index} className="leading-relaxed">
                                {step}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Configuration Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bot Token
                          </label>
                          <div className="relative">
                            <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="password"
                              value={telegramBotToken}
                              onChange={(e) => setTelegramBotToken(e.target.value)}
                              className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Get this from @BotFather on Telegram</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Chat ID
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={telegramChatId}
                              onChange={(e) => setTelegramChatId(e.target.value)}
                              className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="-1001234567890"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Your group/channel chat ID (negative number for groups)</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="telegramEnabled"
                            checked={telegramEnabled}
                            onChange={(e) => setTelegramEnabled(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="telegramEnabled" className="text-gray-300">
                            Enable Telegram integration
                          </label>
                        </div>
                      </div>

                      {/* Test Button */}
                      <div className="flex space-x-3">
                        <button
                          onClick={handleTelegramTest}
                          disabled={telegramTesting || !telegramBotToken || !telegramChatId}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                        >
                          {telegramTesting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Testing...</span>
                            </>
                          ) : (
                            <>
                              <TestTube className="h-4 w-4" />
                              <span>Test Connection</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleTelegramUpdate}
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                      </div>

                      {/* Test Result */}
                      {telegramTestResult && (
                        <div className={`p-4 rounded-lg border ${
                          telegramTestResult === 'success' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {telegramTestResult === 'success' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {telegramTestResult === 'success' 
                                ? 'Test successful! Check your Telegram channel.'
                                : 'Test failed. Please check your configuration.'
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Feature Description */}
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                        <h3 className="text-purple-400 font-semibold mb-3">How it works:</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                          <li>• Generate trading signals in the dashboard</li>
                          <li>• Click "Send to Telegram" button on any analysis</li>
                          <li>• Formatted signal with all details sent to your channel</li>
                          <li>• Share signals with your team or community</li>
                          <li>• Professional formatting with risk warnings</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy & Data</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Data Sharing</h3>
                          <p className="text-gray-400 text-sm">Allow anonymized data sharing for service improvement</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={dataSharing}
                          onChange={(e) => setDataSharing(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Analytics Tracking</h3>
                          <p className="text-gray-400 text-sm">Help us improve the platform with usage analytics</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={analyticsTracking}
                          onChange={(e) => setAnalyticsTracking(e.target.checked)}
                          className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/20 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Data Export & Deletion</h3>
                      
                      <div className="space-y-3">
                        <button
                          onClick={exportUserData}
                          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export My Data</span>
                        </button>

                        <button
                          onClick={() => setError('Account deletion is not available in this demo. Please contact support.')}
                          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePrivacyUpdate}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Privacy Settings'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Subscription Management</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getPlanColor(currentPlan)}`}>
                            {getPlanIcon(currentPlan)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{getPlanDisplayName(currentPlan)}</h3>
                            <p className="text-gray-400">
                              {currentPlan === 'free' ? 'Free forever' : 'Active subscription'}
                            </p>
                          </div>
                        </div>
                        
                        {currentPlan !== 'elite' && (
                          <a
                            href="/plans"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                          >
                            Upgrade Plan
                          </a>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-medium mb-2">Daily Signal Limit</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${(currentUsage / currentLimit) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {currentUsage} / {currentLimit}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-medium mb-2">Subscription Status</h4>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {userProfile?.subscriptionId && (
                      <div className="bg-white/5 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subscription ID:</span>
                            <span className="text-white font-mono text-xs">{userProfile.subscriptionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Payment Method:</span>
                            <span className="text-white">PayPal</span>
                          </div>
                          {userProfile.plan_updated_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Last Updated:</span>
                              <span className="text-white">{new Date(userProfile.plan_updated_at.seconds * 1000).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                      <h3 className="text-yellow-400 font-semibold mb-2">Need Help?</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        For subscription changes, billing questions, or cancellations, please contact our support team.
                      </p>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;