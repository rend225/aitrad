import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPlans, updateUserPlan } from '../services/firestore';
import { 
  validatePayPalConfig, 
  hasValidPayPalPlan, 
  getPayPalSetupInstructions,
  debugPayPalConfig,
  testPayPalConnection,
  PAYPAL_PLAN_IDS
} from '../services/paypal';
import { Plan } from '../types';
import PayPalButton from '../components/PayPalButton';
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Shield, 
  Star,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Headphones,
  Database,
  Smartphone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Info,
  Loader,
  ExternalLink,
  CreditCard,
  Settings,
  Wrench,
  RefreshCw,
  CheckSquare,
  XSquare,
  ChevronDown,
  Mail,
  MessageCircle,
  Activity,
  Globe,
  Rocket,
  Award,
  Lightning,
  Target,
  Briefcase,
  Bot,
  PieChart,
  TrendingDown,
  ChevronRight,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Plans: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');
  const [paypalReady, setPaypalReady] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Hide debug mode from customers - only show for admins
  const [debugMode, setDebugMode] = useState(false);
  const [configStatus, setConfigStatus] = useState<{
    validPlans: string[];
    errors: string[];
    lastCheck: Date | null;
  }>({
    validPlans: [],
    errors: [],
    lastCheck: null
  });

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Plans loading timeout, using fallback data');
        setPlans(fallbackPlans);
        setLoading(false);
        setPaymentError('Connection timeout. Showing standard plans.');
      }
    }, 10000); // 10 second timeout

    loadPlans();
    initializePayPal();

    return () => clearTimeout(timeout);
  }, [loading]); // Add loading dependency

  const initializePayPal = async () => {
    try {
      console.log('🔄 Initializing PayPal configuration...');
      
      // Run debug check (only log to console, don't show to users)
      debugPayPalConfig();
      
      // Test connection
      const connectionTest = await testPayPalConnection();
      
      if (connectionTest) {
        validatePayPalConfig();
        setPaypalReady(true);
        setConfigStatus({
          validPlans: ['plans-with-paypal-ids'], // Will be updated after plans load
          errors: [],
          lastCheck: new Date()
        });
        console.log('✅ PayPal initialization successful!');
        setPaymentError('');
      } else {
        throw new Error('Failed to connect to PayPal SDK');
      }
      
    } catch (error: any) {
      console.error('❌ PayPal initialization failed:', error);
      setPaymentError(`PayPal Configuration Error: ${error.message}`);
      setShowSetupInstructions(true);
      setPaypalReady(false);
      setConfigStatus({
        validPlans: [],
        errors: [error.message],
        lastCheck: new Date()
      });
    }
  };

  // Fallback plans data in case Firestore fails
  const fallbackPlans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      recommendations_per_day: 5,
      features: [
        '5 AI Trading analyses per month',
        'Basic market insights',
        'Email support',
        'Community access'
      ],
      popular: false,
      paypal_plan_id: null
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      recommendations_per_day: 50,
      features: [
        '50 AI Trading analyses per month',
        'Advanced market insights',
        'Real-time alerts',
        'Priority email support',
        'Historical data access'
      ],
      popular: false,
      paypal_plan_id: 'P-3RX65613XN908640NM3DIWUA'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      recommendations_per_day: 100,
      features: [
        '100 AI Trading analyses per month',
        'Premium market insights',
        'Real-time signals',
        'Priority support',
        'Advanced analytics',
        'Custom alerts',
        'Portfolio tracking'
      ],
      popular: true,
      paypal_plan_id: 'P-0CX65613XN908640NM3DIWUB'
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 199,
      recommendations_per_day: 200,
      features: [
        '200 AI Trading analyses per month',
        'VIP market insights',
        'Real-time trading signals',
        '24/7 VIP support',
        'Advanced analytics',
        'Custom strategies',
        'Telegram integration',
        'MetaTrader integration',
        'API access'
      ],
      popular: false,
      paypal_plan_id: 'P-1DX65613XN908640NM3DIWUC'
    }
  ];

  const loadPlans = async () => {
    try {
      console.log('🔄 Loading plans from Firestore...');
      const plansData = await getPlans();

      if (plansData.length === 0) {
        console.warn('⚠️ No plans found in Firestore, using fallback data');
        setPlans(fallbackPlans);
      } else {
        setPlans(plansData);
        console.log('✅ Plans loaded from Firestore:', plansData.length);
      }

      // Update config status with actual plan support info
      const currentPlans = plansData.length > 0 ? plansData : fallbackPlans;
      const validPlans = currentPlans.filter(p => hasValidPayPalPlan(p));
      setConfigStatus(prev => ({
        ...prev,
        validPlans: validPlans.map(p => p.id)
      }));

      console.log('📊 Final plans loaded:', currentPlans.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        paypal_plan_id: p.paypal_plan_id,
        paypal_supported: hasValidPayPalPlan(p)
      })));

    } catch (error) {
      console.error('❌ Error loading plans from Firestore:', error);
      console.log('🔄 Using fallback plans data...');
      setPlans(fallbackPlans);
      setPaymentError('Could not connect to pricing database. Showing standard plans. Some features may be limited.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!user || !selectedPlan) {
      setPaymentError('User session expired. Please log in again.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      console.log('🎉 PayPal Payment Success:', paymentData);
      
      // Update user subscription in Firestore
      await updateUserPlan(user.uid, selectedPlan.id, paymentData.subscriptionId || paymentData.id);
      
      setPaymentSuccess(`🎉 Welcome to ${selectedPlan.name}! Your subscription is now active.`);
      setSelectedPlan(null);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
      
    } catch (error: any) {
      console.error('Error processing subscription:', error);
      setPaymentError(`Subscription activation failed: ${error.message}. Please contact support.`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('PayPal Payment Error:', error);
    setPaymentError(error);
    setPaymentLoading(false);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-8 w-8" />;
      case 'basic': return <Activity className="h-8 w-8" />;
      case 'pro': return <Zap className="h-8 w-8" />;
      case 'elite': return <Crown className="h-8 w-8" />;
      default: return <Shield className="h-8 w-8" />;
    }
  };

  const getPlanColors = (planId: string) => {
    switch (planId) {
      case 'free': return {
        gradient: 'from-slate-600 via-slate-700 to-slate-800',
        border: 'border-slate-600/50',
        glow: 'shadow-slate-500/20',
        button: 'from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
      };
      case 'basic': return {
        gradient: 'from-emerald-600 via-green-700 to-teal-800',
        border: 'border-emerald-500/50',
        glow: 'shadow-emerald-500/20',
        button: 'from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800'
      };
      case 'pro': return {
        gradient: 'from-blue-600 via-indigo-700 to-purple-800',
        border: 'border-blue-500/50',
        glow: 'shadow-blue-500/30',
        button: 'from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800'
      };
      case 'elite': return {
        gradient: 'from-amber-500 via-orange-600 to-red-700',
        border: 'border-amber-400/60',
        glow: 'shadow-amber-500/40',
        button: 'from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800'
      };
      default: return {
        gradient: 'from-slate-600 via-slate-700 to-slate-800',
        border: 'border-slate-600/50',
        glow: 'shadow-slate-500/20',
        button: 'from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
      };
    }
  };

  const getPlanBadge = (plan: Plan) => {
    if (plan.popular) return { text: 'Most Popular', color: 'bg-gradient-to-r from-blue-500 to-purple-600', icon: <Star className="h-3 w-3" /> };
    if (plan.id === 'elite') return { text: 'Best Value', color: 'bg-gradient-to-r from-amber-500 to-orange-600', icon: <Crown className="h-3 w-3" /> };
    return null;
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('signal') || feature.includes('analyses')) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (feature.includes('analysis')) return <BarChart3 className="h-4 w-4 text-blue-400" />;
    if (feature.includes('support')) return <Headphones className="h-4 w-4 text-purple-400" />;
    if (feature.includes('data') || feature.includes('Historical')) return <Database className="h-4 w-4 text-cyan-400" />;
    if (feature.includes('API') || feature.includes('MetaTrader') || feature.includes('Telegram')) return <Smartphone className="h-4 w-4 text-orange-400" />;
    return <CheckCircle className="h-4 w-4 text-green-400" />;
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8); // 20% discount for yearly
  };

  const categories = [
    { id: 'all', name: 'All Plans', icon: <Globe className="h-4 w-4" /> },
    { id: 'beginner', name: 'Beginner', icon: <Target className="h-4 w-4" /> },
    { id: 'professional', name: 'Professional', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'enterprise', name: 'Enterprise', icon: <Crown className="h-4 w-4" /> }
  ];

  const filteredPlans = selectedCategory === 'all' ? plans : plans.filter(plan => {
    if (selectedCategory === 'beginner') return ['free', 'basic'].includes(plan.id);
    if (selectedCategory === 'professional') return ['pro'].includes(plan.id);
    if (selectedCategory === 'enterprise') return ['elite'].includes(plan.id);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-lg">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  const setupInstructions = getPayPalSetupInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
              <span className="text-blue-300 font-medium">AI-Powered Trading Revolution</span>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 mb-8 leading-tight">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Trading Edge
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your trading with AI-powered insights. Join thousands of successful traders 
              who trust our advanced algorithms and real-time market analysis.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Secure Payments</p>
                  <p className="text-sm">PayPal Protection</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">10,000+ Traders</p>
                  <p className="text-sm">Trust Our Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">87% Accuracy</p>
                  <p className="text-sm">AI Signal Success Rate</p>
                </div>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-16">
              <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isYearly ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="text-left">
                <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                  Yearly
                </span>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full ml-2 inline-block">
                  Save 20%
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Status Panel - Only show for admins */}
      {user?.isAdmin && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>PayPal Configuration Status (Admin Only)</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${debugMode ? 'rotate-180' : ''}`} />
          </button>
          
          {debugMode && (
            <div className="mt-4 bg-black/40 border border-gray-600 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-3">✅ Configuration Status</h3>
                  <div className="space-y-2 text-sm">
                    <p>PayPal Ready: {paypalReady ? '✅ YES' : '❌ NO'}</p>
                    <p>Plans Loaded: {plans.length}</p>
                    <p>Plans with PayPal IDs: {configStatus.validPlans.length}/{plans.length}</p>
                    {configStatus.lastCheck && (
                      <p>Last Check: {configStatus.lastCheck.toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">📊 Plan Support</h3>
                  <div className="space-y-2 text-sm">
                    {plans.map(plan => {
                      const isSupported = hasValidPayPalPlan(plan);
                      return (
                        <div key={plan.id} className="flex items-center space-x-2">
                          {isSupported ? (
                            <CheckSquare className="h-4 w-4 text-green-400" />
                          ) : (
                            <XSquare className="h-4 w-4 text-red-400" />
                          )}
                          <span className={isSupported ? 'text-green-400' : 'text-red-400'}>
                            {plan.name}: {isSupported ? 'Supported' : 'Missing PayPal ID'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">📋 PayPal Plan IDs Found:</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  {plans.map(plan => (
                    <p key={plan.id}>
                      {plan.name}: {plan.paypal_plan_id || 'Not Set'}
                    </p>
                  ))}
                </div>
              </div>
              
              {configStatus.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">⚠️ Configuration Issues:</h4>
                  <ul className="text-red-300 text-sm space-y-1">
                    {configStatus.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={initializePayPal}
                  className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-sm"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Refresh Configuration</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Success Message */}
      {paymentSuccess && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-green-300 px-6 py-4 rounded-2xl flex items-start space-x-3 backdrop-blur-sm">
            <CheckCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-lg">{paymentSuccess}</p>
              <p className="text-sm text-green-200 mt-1">Redirecting to dashboard in a few seconds...</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Error Message */}
      {paymentError && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl flex items-start space-x-3 backdrop-blur-sm">
            <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-lg mb-2">Payment Issue</p>
              <p className="text-sm">{paymentError}</p>
            </div>
            <button
              onClick={() => setPaymentError('')}
              className="text-red-400 hover:text-red-300 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* PayPal Setup Instructions - Only show for admins */}
      {showSetupInstructions && user?.isAdmin && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-blue-300 font-semibold mb-3">{setupInstructions.title}</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  {setupInstructions.steps.map((step, index) => (
                    <p key={index} className="leading-relaxed">{step}</p>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-300 text-sm">
                    <strong>Note:</strong> {setupInstructions.note}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupInstructions(false)}
                className="text-blue-400 hover:text-blue-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 relative">
            {filteredPlans.map((plan, index) => {
              const badge = getPlanBadge(plan);
              const isCurrentPlan = user?.plan === plan.id;
              const isSupported = hasValidPayPalPlan(plan) || plan.id === 'free';
              const colors = getPlanColors(plan.id);
              const displayPrice = isYearly && plan.price > 0 ? getYearlyPrice(plan.price) : plan.price;
              const monthlyEquivalent = isYearly && plan.price > 0 ? Math.round(displayPrice / 12) : plan.price;
              
              return (
                <div
                  key={plan.id}
                  className={`relative group transition-all duration-500 hover:scale-105 ${
                    plan.popular ? 'lg:scale-110 z-10' : ''
                  }`}
                >
                  {/* Background Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-xl ${colors.glow} opacity-75 group-hover:opacity-100 transition-opacity`}></div>
                  
                  {/* Card */}
                  <div className={`relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border ${colors.border} overflow-hidden`}>
                    {/* Badge */}
                    {badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className={`${badge.color} text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg`}>
                          {badge.icon}
                          <span>{badge.text}</span>
                        </div>
                      </div>
                    )}

                    {/* Card Header */}
                    <div className={`bg-gradient-to-br ${colors.gradient} p-8 text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          {getPlanIcon(plan.id)}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {plan.name}
                        </h3>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-black text-white">
                              ${isYearly && plan.price > 0 ? monthlyEquivalent : plan.price}
                            </span>
                            <span className="text-white/80 ml-2 font-medium">
                              {isYearly && plan.price > 0 ? '/month' : '/month'}
                            </span>
                          </div>
                          {isYearly && plan.price > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-white/60 text-sm line-through">
                                ${plan.price * 12}/year
                              </p>
                              <p className="text-green-300 text-sm font-semibold">
                                ${displayPrice}/year (Save 20%)
                              </p>
                            </div>
                          )}
                          {plan.price > 0 && (
                            <p className="text-white/70 text-sm mt-2">
                              Billed {isYearly ? 'annually' : 'monthly'} via PayPal
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-white/90">
                          <Activity className="h-5 w-5" />
                          <span className="font-semibold">
                            {plan.recommendations_per_day} analyses per month
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                      {/* Features List */}
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                              {getFeatureIcon(feature)}
                            </div>
                            <span className="text-gray-300 leading-relaxed font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {isCurrentPlan ? (
                        <div className="text-center">
                          <div className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Your Current Plan</span>
                          </div>
                        </div>
                      ) : plan.id === 'free' ? (
                        <Link
                          to="/register"
                          className={`w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r ${colors.button} text-white shadow-xl transition-all hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2`}
                        >
                          <span>Start Free</span>
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      ) : (
                        <>
                          {!selectedPlan || selectedPlan.id !== plan.id ? (
                            <button
                              onClick={() => {
                                if (!user) {
                                  window.location.href = '/login';
                                  return;
                                }
                                if (!isSupported || !paypalReady) {
                                  if (user?.isAdmin) {
                                    setShowSetupInstructions(true);
                                  } else {
                                    setPaymentError('Payment system is currently unavailable. Please try again later or contact support.');
                                  }
                                  return;
                                }
                                setSelectedPlan(plan);
                                setPaymentError('');
                                setPaymentSuccess('');
                              }}
                              disabled={!isSupported || !paypalReady}
                              className={`w-full py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                                !isSupported || !paypalReady
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                  : `bg-gradient-to-r ${colors.button} text-white shadow-xl hover:shadow-2xl`
                              }`}
                            >
                              {!user ? (
                                <>
                                  <span>Sign In to Subscribe</span>
                                  <ExternalLink className="h-5 w-5" />
                                </>
                              ) : !isSupported || !paypalReady ? (
                                <>
                                  <AlertCircle className="h-5 w-5" />
                                  <span>Temporarily Unavailable</span>
                                </>
                              ) : (
                                <>
                                  <span>Get Started</span>
                                  <ArrowRight className="h-5 w-5" />
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="space-y-4">
                              {paymentLoading && (
                                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                                  <Loader className="h-5 w-5 animate-spin" />
                                  <span>Processing subscription...</span>
                                </div>
                              )}

                              {isSupported && paypalReady && user ? (
                                <PayPalButton
                                  plan={plan}
                                  userEmail={user.email}
                                  userId={user.uid}
                                  onSuccess={handlePaymentSuccess}
                                  onError={handlePaymentError}
                                  disabled={paymentLoading}
                                />
                              ) : (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-xl flex items-center space-x-2 backdrop-blur-sm">
                                  <AlertCircle className="h-5 w-5" />
                                  <span>Payment system unavailable</span>
                                </div>
                              )}
                              
                              <button
                                onClick={() => {
                                  setSelectedPlan(null);
                                  setPaymentError('');
                                  setPaymentSuccess('');
                                }}
                                disabled={paymentLoading}
                                className="w-full py-3 px-4 rounded-xl text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50 bg-black/20 backdrop-blur-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                  Why Choose AI Trader?
                </h3>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Experience the future of trading with our advanced AI technology and comprehensive feature set
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <BarChart3 className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-indigo-700/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">
                    Advanced AI Analysis
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Powered by GPT-4 and cutting-edge machine learning algorithms for precise market predictions and actionable insights
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <Shield className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-600/20 to-teal-700/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">
                    Secure & Reliable
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Bank-grade security with PayPal integration, buyer protection, and multiple payment methods for your peace of mind
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-600/20 to-rose-700/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">
                    Trusted Community
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Join over 10,000+ successful traders who trust our AI-powered insights for their daily trading decisions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-500/10 via-orange-600/10 to-red-700/10 backdrop-blur-xl rounded-3xl border border-amber-400/30 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
            
            <div className="relative p-12 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Crown className="h-14 w-14 text-white" />
              </div>
              
              <h3 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-6">
                Need a Custom Solution?
              </h3>
              
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Scale your trading operations with enterprise-grade features, custom integrations, and dedicated support tailored to your organization's needs
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-medium">Custom API integrations</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-medium">Dedicated account manager</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-medium">White-label solutions</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-medium">Priority support & SLA</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = 'mailto:enterprise@aitrader.com?subject=Enterprise Inquiry'}
                className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 hover:from-amber-700 hover:via-orange-700 hover:to-red-800 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-2xl"
              >
                <span>Contact Sales Team</span>
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our plans, features, and platform
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                id: 'faq-1',
                question: "What's the difference between the plans?",
                answer: "Our Free plan includes basic features with limited analyses. The Basic plan offers 50 analyses per month with basic analysis features. The Pro plan offers 100 analyses per month with advanced analysis and priority support. The Elite plan provides 200 analyses per month, VIP analysis, 24/7 support, custom strategies, Telegram integration, MetaTrader integration, and API access for automated trading."
              },
              {
                id: 'faq-2',
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle."
              },
              {
                id: 'faq-3',
                question: "Do you offer a money-back guarantee?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund."
              },
              {
                id: 'faq-4',
                question: "How accurate are the AI-generated signals?",
                answer: "Our AI signals have shown an average accuracy rate of 87% based on historical performance. However, past performance doesn't guarantee future results. We recommend using proper risk management and never investing more than you can afford to lose."
              },
              {
                id: 'faq-5',
                question: "How does the Telegram integration work?",
                answer: "With our Elite plan, you can connect your Telegram account to receive trading signals directly in your Telegram channel or group. Simply set up a Telegram bot, add it to your channel, and configure the integration in your account settings. Whenever you generate a new trading signal, you can send it to your Telegram channel with one click."
              },
              {
                id: 'faq-6',
                question: "What is the MetaTrader integration?",
                answer: "The MetaTrader integration, available exclusively with our Elite plan, allows you to connect your MetaTrader 4 or 5 account to our platform. This enables you to receive signals directly in your trading terminal and even execute trades automatically based on our AI recommendations. The integration is secure and requires minimal setup."
              }
            ].map((faq) => (
              <div key={faq.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <span className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">{faq.question}</span>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-400 transition-all duration-300 group-hover:text-blue-400 ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/" className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-2 text-lg font-medium group">
              <span>View all FAQs</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            Questions? We're here to help
          </h3>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Contact our support team for any questions about our plans, features, or getting started with AI-powered trading
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.location.href = 'mailto:support@aitrader.com?subject=Plan Question'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3"
            >
              <Mail className="h-6 w-6" />
              <span>Email Support</span>
            </button>
            <button
              onClick={() => alert('Live chat feature coming soon!')}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
