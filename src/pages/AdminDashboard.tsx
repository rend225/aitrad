import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, getAllRecommendations, getFeaturedSignals, getPlans, getSchools } from '../services/firestore';
import { testApiConnection, getApiKeyStatus } from '../services/marketData';
import { 
  Users, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Settings, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Zap,
  Database,
  Server,
  Activity,
  CreditCard,
  User,
  Mail,
  MessageSquare,
  Crown,
  Layers,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Wifi,
  WifiOff
} from 'lucide-react';
import ChatAdmin from '../components/ChatAdmin';
import DailyResetManager from '../components/DailyResetManager';
import ApiKeyManager from '../components/ApiKeyManager';
import SEOManager from '../components/SEOManager';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard data
  const [users, setUsers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [featuredSignals, setFeaturedSignals] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSignals: 0,
    signalsToday: 0,
    proUsers: 0,
    eliteUsers: 0,
    basicUsers: 0,
    monthlyRevenue: 0,
    apiKeys: 0,
    activeApiKeys: 0
  });

  useEffect(() => {
    if (user?.isAdmin) {
      loadAllData();
      checkApiConnection();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all data in parallel
      const [usersData, recommendationsData, featuredSignalsData, plansData, schoolsData, apiStatus] = await Promise.all([
        getAllUsers(),
        getAllRecommendations(50),
        getFeaturedSignals(),
        getPlans(),
        getSchools(),
        getApiKeyStatus()
      ]);
      
      // Set data
      setUsers(usersData);
      setRecommendations(recommendationsData);
      setFeaturedSignals(featuredSignalsData);
      setPlans(plansData);
      setSchools(schoolsData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      const activeUsers = usersData.filter(u => u.lastLoginAt && new Date(u.lastLoginAt.seconds * 1000) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
      const signalsToday = recommendationsData.filter(r => r.timestamp && new Date(r.timestamp.seconds * 1000) >= new Date(today)).length;
      const proUsers = usersData.filter(u => u.plan === 'pro').length;
      const eliteUsers = usersData.filter(u => u.plan === 'elite').length;
      const basicUsers = usersData.filter(u => u.plan === 'basic').length;
      
      // Calculate monthly revenue
      const monthlyRevenue = proUsers * 19 + eliteUsers * 29 + basicUsers * 10.50;
      
      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalSignals: recommendationsData.length,
        signalsToday,
        proUsers,
        eliteUsers,
        basicUsers,
        monthlyRevenue,
        apiKeys: apiStatus.keys?.length || 0,
        activeApiKeys: apiStatus.keys?.filter(k => k.status === 'active').length || 0
      });
      
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      setError(error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const checkApiConnection = async () => {
    try {
      const isConnected = await testApiConnection();
      setApiStatus(isConnected ? 'connected' : 'error');
    } catch (error) {
      console.error('Error checking API connection:', error);
      setApiStatus('error');
    }
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'hold': return <Minus className="h-4 w-4 text-yellow-400" />;
      default: return <Target className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'sell': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'hold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-xl max-w-md text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="mb-4">You don't have permission to access the admin dashboard.</p>
          <a href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Gradient */}
        <div className="mb-10 pb-6 border-b border-gradient-to-r from-blue-500/30 to-purple-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 flex items-center space-x-3">
                <Shield className="h-9 w-9 text-blue-400" />
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your AI Trading platform and monitor performance
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all disabled:opacity-50 shadow-lg"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center space-x-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        {/* Admin Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'users' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </button>
            
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'signals' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Signals</span>
            </button>
            
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'plans' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Plans</span>
            </button>
            
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'api' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>API Keys</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reset')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'reset' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Daily Reset</span>
            </button>
            
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Support Chat</span>
            </button>
            
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'seo' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>SEO</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Users</h3>
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.totalUsers}</p>
                    <p className="text-gray-400 text-sm">Total Users</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{stats.activeUsers}</p>
                    <p className="text-gray-400 text-sm">Active (30d)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Signals</h3>
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.totalSignals}</p>
                    <p className="text-gray-400 text-sm">Total Signals</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{stats.signalsToday}</p>
                    <p className="text-gray-400 text-sm">Today</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Revenue</h3>
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">${stats.monthlyRevenue.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">Monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">${(stats.monthlyRevenue * 12).toFixed(0)}</p>
                    <p className="text-gray-400 text-sm">Annual</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">API Status</h3>
                  {apiStatus === 'connected' ? (
                    <Wifi className="h-6 w-6 text-green-400" />
                  ) : (
                    <WifiOff className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.apiKeys}</p>
                    <p className="text-gray-400 text-sm">Total Keys</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{stats.activeApiKeys}</p>
                    <p className="text-gray-400 text-sm">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Stats */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span>Subscription Overview</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <h4 className="text-lg font-semibold text-white">Basic Plan</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-300">{stats.basicUsers}</p>
                      <p className="text-gray-400 text-sm">Users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">${(stats.basicUsers * 10.50).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Revenue</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversion Rate:</span>
                      <span className="text-white font-medium">{stats.totalUsers > 0 ? ((stats.basicUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">Pro Plan</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-blue-300">{stats.proUsers}</p>
                      <p className="text-gray-400 text-sm">Users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">${(stats.proUsers * 19).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Revenue</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversion Rate:</span>
                      <span className="text-white font-medium">{stats.totalUsers > 0 ? ((stats.proUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Crown className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-white">Elite Plan</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-300">{stats.eliteUsers}</p>
                      <p className="text-gray-400 text-sm">Users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">${(stats.eliteUsers * 29).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Revenue</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversion Rate:</span>
                      <span className="text-white font-medium">{stats.totalUsers > 0 ? ((stats.eliteUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <User className="h-6 w-6 text-blue-400" />
                  <span>Recent Users</span>
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white font-semibold py-3">User</th>
                        <th className="text-left text-white font-semibold py-3">Plan</th>
                        <th className="text-left text-white font-semibold py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((user, index) => (
                        <tr key={user.uid} className="border-b border-white/10">
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.displayName || 'User'}</p>
                                <p className="text-gray-400 text-xs">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-1">
                              {user.plan === 'elite' ? (
                                <Crown className="h-4 w-4 text-purple-400" />
                              ) : user.plan === 'pro' ? (
                                <Zap className="h-4 w-4 text-blue-400" />
                              ) : (
                                <Shield className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={`capitalize ${
                                user.plan === 'elite' ? 'text-purple-400' : 
                                user.plan === 'pro' ? 'text-blue-400' : 
                                'text-gray-400'
                              }`}>
                                {user.plan}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-300">
                            {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View All Users
                  </button>
                </div>
              </div>
              
              {/* Recent Signals */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-blue-400" />
                  <span>Recent Signals</span>
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white font-semibold py-3">Signal</th>
                        <th className="text-left text-white font-semibold py-3">User</th>
                        <th className="text-left text-white font-semibold py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.slice(0, 5).map((rec, index) => {
                        const signalType = rec.signal?.type || 'unknown';
                        return (
                          <tr key={rec.id} className="border-b border-white/10">
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getSignalTypeColor(signalType)}`}>
                                  {getSignalTypeIcon(signalType)}
                                  <span>{signalType.toUpperCase()}</span>
                                </div>
                                <span className="text-white">{rec.signal?.pair || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="py-3 text-gray-300">
                              {users.find(u => u.uid === rec.userId)?.email || rec.userId}
                            </td>
                            <td className="py-3 text-gray-300">
                              {rec.timestamp ? new Date(rec.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('signals')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View All Signals
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <PieChart className="h-6 w-6 text-blue-400" />
                <span>Performance Metrics</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <ArrowUpRight className="h-5 w-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Conversion Rate</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-400">
                        {stats.totalUsers > 0 ? (((stats.proUsers + stats.eliteUsers) / stats.totalUsers) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-gray-400 text-sm">Free to Paid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">
                        {stats.proUsers + stats.eliteUsers}
                      </p>
                      <p className="text-gray-400 text-sm">Paid Users</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Percent className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-white">Upgrade Rate</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-400">
                        {stats.proUsers > 0 ? ((stats.eliteUsers / (stats.proUsers + stats.eliteUsers)) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-gray-400 text-sm">Pro to Elite</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">
                        {stats.eliteUsers}
                      </p>
                      <p className="text-gray-400 text-sm">Elite Users</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">Signal Usage</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-blue-400">
                        {stats.totalUsers > 0 ? (stats.totalSignals / stats.totalUsers).toFixed(1) : 0}
                      </p>
                      <p className="text-gray-400 text-sm">Per User</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">
                        {stats.signalsToday}
                      </p>
                      <p className="text-gray-400 text-sm">Today</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">ARPU</h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-400">
                        ${stats.totalUsers > 0 ? (stats.monthlyRevenue / stats.totalUsers).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-gray-400 text-sm">Per User</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">
                        ${stats.monthlyRevenue.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">MRR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-400" />
              <span>User Management</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white font-semibold py-3">User</th>
                    <th className="text-left text-white font-semibold py-3">Plan</th>
                    <th className="text-left text-white font-semibold py-3">Joined</th>
                    <th className="text-left text-white font-semibold py-3">Usage</th>
                    <th className="text-left text-white font-semibold py-3">Status</th>
                    <th className="text-left text-white font-semibold py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="border-b border-white/10">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.displayName || 'User'}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          {user.plan === 'elite' ? (
                            <Crown className="h-4 w-4 text-purple-400" />
                          ) : user.plan === 'pro' ? (
                            <Zap className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Shield className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`capitalize ${
                            user.plan === 'elite' ? 'text-purple-400' : 
                            user.plan === 'pro' ? 'text-blue-400' : 
                            'text-gray-400'
                          }`}>
                            {user.plan}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">
                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-white">{user.used_today || 0}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-300">{user.recommendation_limit || 0}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {user.isAdmin ? (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Admin</span>
                        ) : (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Active</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                            <Settings className="h-4 w-4" />
                          </button>
                          <button className="p-1 bg-red-600 hover:bg-red-700 text-white rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-400" />
              <span>Signal Management</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white font-semibold py-3">Signal</th>
                    <th className="text-left text-white font-semibold py-3">User</th>
                    <th className="text-left text-white font-semibold py-3">School</th>
                    <th className="text-left text-white font-semibold py-3">Date</th>
                    <th className="text-left text-white font-semibold py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec) => {
                    const signalType = rec.signal?.type || 'unknown';
                    return (
                      <tr key={rec.id} className="border-b border-white/10">
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getSignalTypeColor(signalType)}`}>
                              {getSignalTypeIcon(signalType)}
                              <span>{signalType.toUpperCase()}</span>
                            </div>
                            <span className="text-white">{rec.signal?.pair || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-300">
                          {users.find(u => u.uid === rec.userId)?.email || rec.userId}
                        </td>
                        <td className="py-3 text-gray-300">
                          {rec.school}
                        </td>
                        <td className="py-3 text-gray-300">
                          {rec.timestamp ? new Date(rec.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 bg-green-600 hover:bg-green-700 text-white rounded">
                              <Star className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Layers className="h-6 w-6 text-blue-400" />
              <span>Plan Management</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white font-semibold py-3">Plan</th>
                    <th className="text-left text-white font-semibold py-3">Price</th>
                    <th className="text-left text-white font-semibold py-3">Signals</th>
                    <th className="text-left text-white font-semibold py-3">Users</th>
                    <th className="text-left text-white font-semibold py-3">Revenue</th>
                    <th className="text-left text-white font-semibold py-3">PayPal ID</th>
                    <th className="text-left text-white font-semibold py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const planUsers = users.filter(u => u.plan === plan.id).length;
                    const planRevenue = planUsers * plan.price;
                    
                    return (
                      <tr key={plan.id} className="border-b border-white/10">
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            {plan.id === 'elite' ? (
                              <Crown className="h-5 w-5 text-purple-400" />
                            ) : plan.id === 'pro' ? (
                              <Zap className="h-5 w-5 text-blue-400" />
                            ) : (
                              <Shield className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="text-white font-medium">{plan.name}</span>
                            {plan.popular && (
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">Popular</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-white font-medium">
                          ${plan.price}
                        </td>
                        <td className="py-3 text-gray-300">
                          {plan.recommendations_per_day} / month
                        </td>
                        <td className="py-3 text-gray-300">
                          {planUsers}
                        </td>
                        <td className="py-3 text-green-400 font-medium">
                          ${planRevenue.toFixed(2)}
                        </td>
                        <td className="py-3 text-gray-300 font-mono text-xs">
                          {plan.paypal_plan_id || 'Not Set'}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                              <Settings className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium mb-1">Plan Configuration</p>
                  <p className="text-gray-300 text-sm">
                    To modify plans, update the Firestore database directly or use the setup script. Changes to plan prices or features will affect all users on their next billing cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <ApiKeyManager />
        )}

        {activeTab === 'reset' && (
          <DailyResetManager />
        )}

        {activeTab === 'chat' && (
          <ChatAdmin />
        )}

        {activeTab === 'seo' && (
          <SEOManager />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;