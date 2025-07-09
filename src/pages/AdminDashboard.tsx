import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  getAllUsers, 
  getAllRecommendations, 
  updateUserPlanAdmin, 
  updateUserUsage, 
  deleteUser,
  getPlans,
  getSchools,
  createPlan,
  updatePlan,
  deletePlan,
  createSchool,
  updateSchool,
  deleteSchool,
  getAllFeaturedSignals,
  saveFeaturedSignal,
  updateFeaturedSignal,
  deleteFeaturedSignal
} from '../services/firestore';
import { User, Plan, School, Recommendation } from '../types';
import DailyResetManager from '../components/DailyResetManager';
import ChatAdmin from '../components/ChatAdmin';
import SEOManager from '../components/SEOManager';
import ApiKeyManager from '../components/ApiKeyManager';
import { 
  Shield, 
  Users, 
  BarChart3, 
  DollarSign, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Crown,
  Zap,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Star,
  Target,
  BookOpen,
  Award,
  TrendingDown,
  Minus,
  MessageCircle,
  SquarePen,
  Search,
  Globe,
  Key,
  Database
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [featuredSignals, setFeaturedSignals] = useState<any[]>([]);
  
  // Edit states
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editingSchool, setEditingSchool] = useState<string | null>(null);
  const [editingSignal, setEditingSignal] = useState<string | null>(null);
  
  // Edit form states
  const [editPlanForm, setEditPlanForm] = useState<Partial<Plan>>({});
  const [editSchoolForm, setEditSchoolForm] = useState<Partial<School>>({});
  const [editSignalForm, setEditSignalForm] = useState<any>({});
  
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: '',
    price: 0,
    recommendations_per_day: 1,
    features: [],
    paypal_plan_id: '',
    popular: false
  });
  const [newSchool, setNewSchool] = useState<Partial<School>>({
    name: '',
    prompt: '',
    active: true
  });
  const [newSignal, setNewSignal] = useState<any>({
    pair: '',
    type: 'buy',
    entry: 0,
    stopLoss: 0,
    takeProfit1: 0,
    takeProfit2: 0,
    probability: 85,
    result: 'profit',
    profitPips: 0,
    date: new Date().toISOString().split('T')[0],
    school: '',
    featured: true
  });

  useEffect(() => {
    if (user?.isAdmin) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersData, recsData, plansData, schoolsData, signalsData] = await Promise.all([
        getAllUsers(),
        getAllRecommendations(),
        getPlans(),
        getSchools(),
        getAllFeaturedSignals()
      ]);
      
      setUsers(usersData);
      setRecommendations(recsData);
      setPlans(plansData);
      setSchools(schoolsData);
      setFeaturedSignals(signalsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserPlan = async (userId: string, planId: string) => {
    try {
      await updateUserPlanAdmin(userId, planId);
      await loadAllData();
    } catch (error) {
      console.error('Error updating user plan:', error);
    }
  };

  const handleUpdateUserUsage = async (userId: string, usedToday: number, limit: number) => {
    try {
      await updateUserUsage(userId, usedToday, limit);
      await loadAllData();
    } catch (error) {
      console.error('Error updating user usage:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteUser(userId);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreatePlan = async () => {
    try {
      if (!newPlan.name || newPlan.price === undefined) {
        alert('Please fill in all required fields');
        return;
      }
      
      await createPlan(newPlan as Omit<Plan, 'id'>);
      setNewPlan({
        name: '',
        price: 0,
        recommendations_per_day: 1,
        features: [],
        paypal_plan_id: '',
        popular: false
      });
      await loadAllData();
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Error creating plan: ' + (error as Error).message);
    }
  };

  const handleStartEditPlan = (plan: Plan) => {
    setEditingPlan(plan.id);
    setEditPlanForm({...plan});
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan || !editPlanForm) return;
    
    try {
      await updatePlan(editingPlan, editPlanForm);
      setEditingPlan(null);
      setEditPlanForm({});
      await loadAllData();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await deletePlan(planId);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleCreateSchool = async () => {
    try {
      if (!newSchool.name || !newSchool.prompt) {
        alert('Please fill in all required fields');
        return;
      }
      
      await createSchool(newSchool as Omit<School, 'id'>);
      setNewSchool({
        name: '',
        prompt: '',
        active: true
      });
      await loadAllData();
    } catch (error) {
      console.error('Error creating school:', error);
      alert('Error creating school: ' + (error as Error).message);
    }
  };

  const handleStartEditSchool = (school: School) => {
    setEditingSchool(school.id);
    setEditSchoolForm({...school});
  };

  const handleUpdateSchool = async () => {
    if (!editingSchool || !editSchoolForm) return;
    
    try {
      await updateSchool(editingSchool, editSchoolForm);
      setEditingSchool(null);
      setEditSchoolForm({});
      await loadAllData();
    } catch (error) {
      console.error('Error updating school:', error);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return;
    
    try {
      await deleteSchool(schoolId);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const handleCreateSignal = async () => {
    try {
      if (!newSignal.pair || !newSignal.school) {
        alert('Please fill in all required fields');
        return;
      }
      
      await saveFeaturedSignal(newSignal);
      setNewSignal({
        pair: '',
        type: 'buy',
        entry: 0,
        stopLoss: 0,
        takeProfit1: 0,
        takeProfit2: 0,
        probability: 85,
        result: 'profit',
        profitPips: 0,
        date: new Date().toISOString().split('T')[0],
        school: '',
        featured: true
      });
      await loadAllData();
    } catch (error) {
      console.error('Error creating signal:', error);
    }
  };

  const handleStartEditSignal = (signal: any) => {
    setEditingSignal(signal.id);
    setEditSignalForm({...signal});
  };

  const handleUpdateSignal = async () => {
    if (!editingSignal || !editSignalForm) return;
    
    try {
      await updateFeaturedSignal(editingSignal, editSignalForm);
      setEditingSignal(null);
      setEditSignalForm({});
      await loadAllData();
    } catch (error) {
      console.error('Error updating signal:', error);
    }
  };

  const handleDeleteSignal = async (signalId: string) => {
    if (!confirm('Are you sure you want to delete this signal?')) return;
    
    try {
      await deleteFeaturedSignal(signalId);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting signal:', error);
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeSubscriptions = users.filter(u => u.plan !== 'free').length;
    const totalRecommendations = recommendations.length;
    const revenueMonthly = users.reduce((sum, u) => {
      const plan = plans.find(p => p.id === u.plan);
      return sum + (plan?.price || 0);
    }, 0);

    return { totalUsers, activeSubscriptions, totalRecommendations, revenueMonthly };
  };

  // Get plan ID from user document and convert to plan type
  const getUserPlanType = (userPlan: string): string => {
    // Check if it's already a standard plan type
    if (['free', 'pro', 'elite'].includes(userPlan)) {
      return userPlan;
    }
    
    // Try to find the plan in the plans list
    const plan = plans.find(p => p.id === userPlan);
    if (plan) {
      return plan.id; // Return the plan ID which should be 'free', 'pro', or 'elite'
    }
    
    // Default to free if we can't determine the plan
    return 'free';
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-4 w-4" />;
      case 'pro': return <Zap className="h-4 w-4" />;
      case 'elite': return <Crown className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'pro': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'elite': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
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
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'plans', label: 'Plans', icon: Crown },
    { id: 'schools', label: 'Schools', icon: BookOpen },
    { id: 'signals', label: 'Featured Signals', icon: Star },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'seo', label: 'SEO Management', icon: Search },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle },
    { id: 'reset', label: 'Daily Reset', icon: Clock }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-300">Manage users, plans, and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">{stats.activeSubscriptions}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Signals</p>
                <p className="text-2xl font-bold text-white">{stats.totalRecommendations}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">${stats.revenueMonthly}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="flex flex-wrap border-b border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Platform Overview</h3>
                
                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Recent Users</h4>
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user) => (
                        <div
                          key={user.uid}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{user.displayName || user.email}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getPlanColor(getUserPlanType(user.plan))}`}>
                            {getUserPlanType(user.plan)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Recent Signals</h4>
                    <div className="space-y-3">
                      {recommendations.slice(0, 5).map((rec) => (
                        <div key={rec.id} className="p-3 bg-black/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-white font-medium">{rec.school}</p>
                            <p className="text-gray-400 text-xs">
                              {rec.timestamp.toDate().toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {rec.response.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">User Management</h3>
                  <button
                    onClick={loadAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white font-semibold py-3">User</th>
                        <th className="text-left text-white font-semibold py-3">Plan</th>
                        <th className="text-left text-white font-semibold py-3">Usage</th>
                        <th className="text-left text-white font-semibold py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.uid} className="border-b border-white/10">
                          <td className="py-3">
                            <div>
                              <p className="text-white font-medium">{user.displayName || 'No name'}</p>
                              <p className="text-gray-400 text-xs">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            {editingUser === user.uid ? (
                              <select
                                value={getUserPlanType(user.plan)}
                                onChange={(e) => handleUpdateUserPlan(user.uid, e.target.value)}
                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs"
                              >
                                {plans.map((plan) => (
                                  <option key={plan.id} value={plan.id} className="bg-gray-800">
                                    {plan.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${getPlanColor(getUserPlanType(user.plan))} flex items-center space-x-1`}>
                                {getPlanIcon(getUserPlanType(user.plan))}
                                <span>{getUserPlanType(user.plan)}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="text-xs">
                              <span className="text-white">{user.used_today}</span>
                              <span className="text-gray-400"> / {user.recommendation_limit}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingUser(editingUser === user.uid ? null : user.uid)}
                                className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <SquarePen className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.uid)}
                                className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                              >
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

            {activeTab === 'plans' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Plan Management</h3>
                  <button
                    onClick={loadAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Create New Plan */}
                <div className="bg-black/20 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Create New Plan</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Plan Name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({...newPlan, price: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="Recommendations per day"
                      value={newPlan.recommendations_per_day}
                      onChange={(e) => setNewPlan({...newPlan, recommendations_per_day: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="PayPal Plan ID"
                      value={newPlan.paypal_plan_id}
                      onChange={(e) => setNewPlan({...newPlan, paypal_plan_id: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleCreatePlan}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Plan</span>
                  </button>
                </div>

                {/* Plans List */}
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="bg-black/20 rounded-lg p-4">
                      {editingPlan === plan.id ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Plan Name
                              </label>
                              <input
                                type="text"
                                value={editPlanForm.name || ''}
                                onChange={(e) => setEditPlanForm({...editPlanForm, name: e.target.value})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price
                              </label>
                              <input
                                type="number"
                                value={editPlanForm.price || 0}
                                onChange={(e) => setEditPlanForm({...editPlanForm, price: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recommendations per day
                              </label>
                              <input
                                type="number"
                                value={editPlanForm.recommendations_per_day || 0}
                                onChange={(e) => setEditPlanForm({...editPlanForm, recommendations_per_day: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                PayPal Plan ID
                              </label>
                              <input
                                type="text"
                                value={editPlanForm.paypal_plan_id || ''}
                                onChange={(e) => setEditPlanForm({...editPlanForm, paypal_plan_id: e.target.value})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={handleUpdatePlan}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                            >
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingPlan(null);
                                setEditPlanForm({});
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                            >
                              <X className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getPlanIcon(plan.id)}
                            <div>
                              <h4 className="text-white font-semibold">{plan.name}</h4>
                              <p className="text-gray-400 text-sm">${plan.price}/month • {plan.recommendations_per_day} signals/day</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStartEditPlan(plan)}
                              className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schools' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Trading Schools Management</h3>
                  <button
                    onClick={loadAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Create New School */}
                <div className="bg-black/20 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Create New Trading School</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="School Name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <textarea
                      placeholder="Trading Prompt"
                      value={newSchool.prompt}
                      onChange={(e) => setNewSchool({...newSchool, prompt: e.target.value})}
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleCreateSchool}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create School</span>
                  </button>
                </div>

                {/* Schools List */}
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="bg-black/20 rounded-lg p-4">
                      {editingSchool === school.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              School Name
                            </label>
                            <input
                              type="text"
                              value={editSchoolForm.name || ''}
                              onChange={(e) => setEditSchoolForm({...editSchoolForm, name: e.target.value})}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Trading Prompt
                            </label>
                            <textarea
                              value={editSchoolForm.prompt || ''}
                              onChange={(e) => setEditSchoolForm({...editSchoolForm, prompt: e.target.value})}
                              rows={4}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-2 text-gray-300">
                              <input
                                type="checkbox"
                                checked={editSchoolForm.active}
                                onChange={(e) => setEditSchoolForm({...editSchoolForm, active: e.target.checked})}
                                className="rounded border-white/20 text-blue-600 focus:ring-blue-500"
                              />
                              <span>Active</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={handleUpdateSchool}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                            >
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingSchool(null);
                                setEditSchoolForm({});
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                            >
                              <X className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-blue-400" />
                            <div>
                              <h4 className="text-white font-semibold">{school.name}</h4>
                              <p className="text-gray-400 text-sm">
                                {school.active ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStartEditSchool(school)}
                              className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchool(school.id)}
                              className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      {!editingSchool || editingSchool !== school.id ? (
                        <p className="text-gray-300 text-sm">{school.prompt.substring(0, 200)}...</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'signals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Featured Signals Management</h3>
                  <button
                    onClick={loadAllData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Create New Signal */}
                <div className="bg-black/20 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Create New Featured Signal</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Trading Pair (e.g., XAUUSD)"
                      value={newSignal.pair}
                      onChange={(e) => setNewSignal({...newSignal, pair: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <select
                      value={newSignal.type}
                      onChange={(e) => setNewSignal({...newSignal, type: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                    >
                      <option value="buy" className="bg-gray-800">Buy</option>
                      <option value="sell" className="bg-gray-800">Sell</option>
                      <option value="hold" className="bg-gray-800">Hold</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Entry Price"
                      value={newSignal.entry}
                      onChange={(e) => setNewSignal({...newSignal, entry: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Stop Loss"
                      value={newSignal.stopLoss}
                      onChange={(e) => setNewSignal({...newSignal, stopLoss: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Take Profit 1"
                      value={newSignal.takeProfit1}
                      onChange={(e) => setNewSignal({...newSignal, takeProfit1: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="Probability %"
                      value={newSignal.probability}
                      onChange={(e) => setNewSignal({...newSignal, probability: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="School"
                      value={newSignal.school}
                      onChange={(e) => setNewSignal({...newSignal, school: e.target.value})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="Profit Pips"
                      value={newSignal.profitPips}
                      onChange={(e) => setNewSignal({...newSignal, profitPips: Number(e.target.value)})}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleCreateSignal}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Signal</span>
                  </button>
                </div>

                {/* Signals List */}
                <div className="space-y-4">
                  {featuredSignals.map((signal) => (
                    <div key={signal.id} className="bg-black/20 rounded-lg p-4">
                      {editingSignal === signal.id ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Trading Pair
                              </label>
                              <input
                                type="text"
                                value={editSignalForm.pair || ''}
                                onChange={(e) => setEditSignalForm({...editSignalForm, pair: e.target.value})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Signal Type
                              </label>
                              <select
                                value={editSignalForm.type || 'buy'}
                                onChange={(e) => setEditSignalForm({...editSignalForm, type: e.target.value})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              >
                                <option value="buy" className="bg-gray-800">Buy</option>
                                <option value="sell" className="bg-gray-800">Sell</option>
                                <option value="hold" className="bg-gray-800">Hold</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Entry Price
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editSignalForm.entry || 0}
                                onChange={(e) => setEditSignalForm({...editSignalForm, entry: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Stop Loss
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editSignalForm.stopLoss || 0}
                                onChange={(e) => setEditSignalForm({...editSignalForm, stopLoss: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Take Profit 1
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editSignalForm.takeProfit1 || 0}
                                onChange={(e) => setEditSignalForm({...editSignalForm, takeProfit1: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Probability %
                              </label>
                              <input
                                type="number"
                                value={editSignalForm.probability || 0}
                                onChange={(e) => setEditSignalForm({...editSignalForm, probability: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                School
                              </label>
                              <input
                                type="text"
                                value={editSignalForm.school || ''}
                                onChange={(e) => setEditSignalForm({...editSignalForm, school: e.target.value})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Profit Pips
                              </label>
                              <input
                                type="number"
                                value={editSignalForm.profitPips || 0}
                                onChange={(e) => setEditSignalForm({...editSignalForm, profitPips: Number(e.target.value)})}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={handleUpdateSignal}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                            >
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingSignal(null);
                                setEditSignalForm({});
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                            >
                              <X className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getSignalTypeColor(signal.type)}`}>
                                {getSignalTypeIcon(signal.type)}
                                <span>{signal.type.toUpperCase()}</span>
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{signal.pair}</h4>
                                <p className="text-gray-400 text-sm">{signal.school} • {signal.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                                +{signal.profitPips} pips
                              </div>
                              <button
                                onClick={() => handleStartEditSignal(signal)}
                                className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <SquarePen className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSignal(signal.id)}
                                className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Entry: </span>
                              <span className="text-white">{signal.entry}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">SL: </span>
                              <span className="text-red-400">{signal.stopLoss}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">TP: </span>
                              <span className="text-green-400">{signal.takeProfit1}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Probability: </span>
                              <span className="text-blue-400">{signal.probability}%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Market Data API Keys</h3>
                </div>
                <ApiKeyManager />
              </div>
            )}

            {activeTab === 'seo' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">SEO Management</h3>
                </div>
                <SEOManager />
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Live Chat Management</h3>
                </div>
                <ChatAdmin />
              </div>
            )}

            {activeTab === 'reset' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Daily Usage Reset Management</h3>
                <DailyResetManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;