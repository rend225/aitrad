import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getSchools, saveRecommendation, canUserGenerateRecommendation } from '../services/firestore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { generateTradingSignalWithRealData } from '../services/gpt';
import { fetchMultiTimeframeData, generateMockMultiTimeframeData, TRADING_PAIRS, testApiConnection, loadApiKeys } from '../services/marketData';
import { sendTelegramMessage } from '../services/telegram';
import { db } from '../config/firebase';
import { School } from '../types';
import AnalysisDisplay from '../components/AnalysisDisplay';
import { 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  BarChart3, 
  Crown, 
  Clock, 
  Settings,
  RefreshCw,
  Activity,
  Target,
  ChevronDown,
  Loader,
  Wifi,
  WifiOff,
  CheckCircle,
  Copy,
  Check,
  FileText,
  Shield,
  ArrowDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedPair, setSelectedPair] = useState('XAUUSD');
  const [candleCount, setCandleCount] = useState(50);
  const [aiProvider, setAiProvider] = useState<'openrouter' | 'gemini'>('openrouter');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [lastRecommendation, setLastRecommendation] = useState<string>('');
  const [lastSignal, setLastSignal] = useState<any>(null);
  const [error, setError] = useState('');
  const [marketData, setMarketData] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [telegramConfig, setTelegramConfig] = useState<any>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [showAnalysisSection, setShowAnalysisSection] = useState(false);
  const [userStats, setUserStats] = useState({
    used_today: 0,
    recommendation_limit: 1
  });
  
  const analysisRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSchools();
    
    if (user?.plan === 'elite') {
      loadTelegramConfig();
    }
  }, [user]);

  // Real-time user stats listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserStats({
          used_today: userData.used_today || 0,
          recommendation_limit: userData.recommendation_limit || 1
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Scroll to analysis section after generation
  useEffect(() => {
    if (lastRecommendation && analysisRef.current) {
      setShowAnalysisSection(true);
      setAnalysisVisible(true);
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [lastRecommendation]);

  const loadSchools = async () => {
    try {
      console.log('📚 Loading trading schools...');
      const schoolsData = await getSchools();
      console.log(`✅ Schools loaded: ${schoolsData.length}`);
      setSchools(schoolsData);
      if (schoolsData.length > 0 && !selectedSchool) {
        setSelectedSchool(schoolsData[0].id);
        console.log(`✅ Selected default school: ${schoolsData[0].id}`);
      }
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const loadTelegramConfig = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.telegram && userData.telegram.enabled) {
          setTelegramConfig({
            botToken: userData.telegram.botToken,
            chatId: userData.telegram.chatId
          });
          console.log('✅ Telegram configuration loaded successfully');
        }
      }
    } catch (error) {
      console.error('Error loading Telegram config:', error);
    }
  };

  const checkApiConnection = async () => {
    try {
      console.log('🔌 Checking API connection...');
      const isConnected = await testApiConnection();
      console.log(`✅ API connection status: ${isConnected ? 'connected' : 'error'}`);
      setApiStatus(isConnected ? 'connected' : 'error');
      return isConnected;
    } catch (error) {
      console.error('Error checking API connection:', error);
      setApiStatus('error');
      return false;
    }
  };

  const fetchMarketData = async () => {
    setDataLoading(true);
    setError('');
    
    try {
      console.log(`📊 Fetching market data for ${selectedPair}...`);
      
      // Only load API keys when explicitly fetching market data
      console.log('🔄 Loading API keys...');
      await loadApiKeys();
      
      // Check API connection only when fetching data
      await checkApiConnection();
      
      const data = await fetchMultiTimeframeData(selectedPair, candleCount);
      console.log('✅ Market data fetched successfully:', {
        symbol: data.symbol,
        timeframes: {
          '5min': data.timeframes['5min']?.length,
          '15min': data.timeframes['15min']?.length,
          '1h': data.timeframes['1h']?.length,
          '4h': data.timeframes['4h']?.length
        }
      });
      
      setMarketData(data);
      setError('');
      setApiStatus('connected');
      
      // Scroll to generator section
      setTimeout(() => {
        generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } catch (error: any) {
      console.error('❌ Error fetching market data:', error);
      setApiStatus('error');
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (errorMessage.includes('API key')) {
        errorMessage = t('error.apiNotConfigured');
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = t('error.rateLimitReached');
      } else if (errorMessage.includes('symbol')) {
        errorMessage = t('error.symbolNotFound');
      } else {
        errorMessage = t('error.marketDataUnavailable');
      }
      
      // Fallback to mock data
      console.log('🔄 Falling back to demo data...');
      const mockData = generateMockMultiTimeframeData(selectedPair);
      setMarketData(mockData);
      setError(errorMessage);
    } finally {
      setDataLoading(false);
    }
  };

  // Create the full prompt that would be sent to AI
  const createFullPrompt = (): string => {
    if (!marketData || !selectedSchool) return '';
    
    const school = schools.find(s => s.id === selectedSchool);
    if (!school) return '';

    const jsonData = JSON.stringify(marketData, null, 2);
    
    return `You are an elite-level financial market analyst and trading assistant, specialized in short-term technical analysis of assets like Gold (XAU/USD), indices, and currencies.

Your task is to generate highly detailed, actionable trade recommendations based on raw candlestick data (OHLC), focusing on the 5-minute and 15-minute timeframes, while considering the context of the 1-hour and 4-hour charts.

The recommendations are for intraday scalping or short-term swings, valid for a few hours unless market structure shifts significantly.

You are allowed to use only ONE indicator: *ATR (Average True Range)* (14-period, on 15m or 5m), strictly for:
- Dynamic stop-loss placement (e.g., 1.5x ATR below demand zone)
- Assessing market volatility (avoid trades in low or extremely high volatility)
- Adjusting risk-to-reward calculations

━━━━━━━━━━━━━━━━━━━━━━
📌 *Strict Trading Rules:*
✅ Only trade setups based on *strong Supply & Demand zones*  
✅ Do *NOT* enter immediately — wait for *clear confirmation* like:
- Bullish/Bearish Engulfing candle
- CHoCH (Change of Character) on 5m
- Internal liquidity sweep or FVG mitigation

🚫 Ignore weak zones or already-mitigated zones.

━━━━━━━━━━━━━━━━━━━━━━
🔶 Definition of a "Strong Zone":
- Fresh and untouched (unmitigated)
- Originated from an aggressive move away (impulsive)
- Clearly visible on 1H or 4H charts
- Contains FVG or internal/external liquidity sweep
- Aligned with higher timeframe market structure

━━━━━━━━━━━━━━━━━━━━━━
📊 1. Multi-Timeframe Context (4H & 1H)
- What is the overall market structure and trend?
- Are we approaching any strong institutional Supply/Demand zones?
- Is there unmitigated imbalance or liquidity above/below?
- What is the current ATR value and what does it imply?

━━━━━━━━━━━━━━━━━━━━━━
📈 2. Execution Timeframes (15M & 5M)
- Detect CHoCH / BOS / liquidity traps
- Look for price action confirmations: Engulfing candle, FVG tap, etc.
- Check if ATR conditions support a clean entry
- Validate that the zone has not been touched

━━━━━━━━━━━━━━━━━━━━━━
🎯 3. Trade Setup Recommendation
- Direction: Buy / Sell / No Trade
- Entry Price: After confirmation only
- Stop Loss: Below/above structure or zone using 1.5x ATR
- TP1 & TP2: Defined profit targets
- Risk-to-Reward Ratio: To TP1 and TP2
- Trade Type: Momentum / Reversal / Liquidity Sweep
- ATR Notes: Include value and how it influenced SL or trade filtering

━━━━━━━━━━━━━━━━━━━━━━
🧠 4. Justification & Reasoning
- Why this zone specifically?
- What confirmation was used?
- How does this align with higher timeframe context?
- How did ATR and structure support this setup?

━━━━━━━━━━━━━━━━━━━━━━
⚠ 5. Invalidation / No-Trade Criteria
- Zone has already been touched or broken
- ATR is too high or too low (causing poor RR)
- No valid confirmation appears near the zone
- Sudden market structure shift or BOS in the opposite direction

IMPORTANT: At the end of your analysis, provide a structured summary in this exact format:

SIGNAL SUMMARY:
Pair: [SYMBOL]
Type: [BUY/SELL/HOLD]
Entry: [price or "Wait for confirmation"]
Stop Loss: [price]
Take Profit 1: [price]
Take Profit 2: [price]
Probability: [percentage]%

📝 Format your analysis like a professional trader's briefing note — clean, structured, and concise — as if you're advising a prop trading firm.
Be as brief as possible in your answer and give me only the important points such as the recommendation, the reason for entering and its success rate.

TRADING SCHOOL METHODOLOGY:
${school.prompt}

SYMBOL: ${selectedPair}

Here is the multi-timeframe candlestick data:

${jsonData}`;
  };

  const copyFullPromptToClipboard = async () => {
    try {
      const fullPrompt = createFullPrompt();
      if (!fullPrompt) {
        setError('No prompt available. Please select a trading school and fetch market data first.');
        return;
      }
      
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt to clipboard:', error);
      setError('Failed to copy prompt to clipboard');
    }
  };

  const generateSignal = async () => {
    if (!user || !selectedSchool) return;

    // Check if user can generate recommendation
    try {
      console.log('Checking if user can generate recommendation...');
      const canGenerate = await canUserGenerateRecommendation(user.uid);
      if (!canGenerate) {
        setError(t('signal.dailyLimitReached'));
        return;
      }
      console.log('User can generate recommendation: Yes');
    } catch (error) {
      console.error('Error checking recommendation limit:', error);
      setError('Error checking recommendation limit');
      return;
    }

    // Fetch fresh market data if not available
    if (!marketData) {
      console.log('No market data available, fetching now...');
      await fetchMarketData();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const school = schools.find(s => s.id === selectedSchool);
      if (!school) {
        throw new Error('Selected school not found');
      }

      console.log('🧠 Generating signal with market data...');
      console.log('Selected school:', school.name);
      console.log('Selected pair:', selectedPair);
      console.log('AI Provider:', aiProvider);
      
      const result = await generateTradingSignalWithRealData({
        symbol: selectedPair,
        marketData,
        schoolPrompt: school.prompt,
        provider: aiProvider
      });
      
      console.log('✅ Signal generation result:', result);
      console.log('📝 Analysis length:', result.analysis.length);
      console.log('📊 Signal data:', result.signal);
      console.log('Used provider:', result.usedProvider);

      // Show a notification if we had to fallback to a different provider
      if (result.usedProvider && result.usedProvider !== aiProvider) {
        setError(`Note: Switched to ${result.usedProvider === 'openrouter' ? 'OpenRouter (GPT-4)' : 'Gemini'} due to quota limits on the selected provider.`);
      }

      // First save the recommendation to Firestore
      await saveRecommendation({
        userId: user.uid,
        school: school.name,
        prompt: school.prompt,
        response: result.analysis,
        candlestick_data: marketData,
        timestamp: new Date().toISOString(),
        signal: result.signal
      });
      
      // Update state with the results
      setLastRecommendation(result.analysis);
      setLastSignal(result.signal);
      setShowAnalysisSection(true);
      
      console.log('✅ Analysis saved successfully:', {
        analysis: result.analysis.substring(0, 100) + '...',
        signal: result.signal
      });
      
      // Ensure we scroll to the analysis section
      scrollToAnalysis();
    } catch (error: any) {
      console.error('Error generating signal:', error);
      
      // Enhanced error handling for specific API issues
      let errorMessage = error.message || 'Failed to generate signal';
      
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = 'API quota exceeded. Please try switching to a different AI provider in Advanced Settings, or try again later.';
      } else if (errorMessage.includes('API key')) {
        errorMessage = 'API configuration issue. Please check your API keys in the environment settings.';
      } else if (errorMessage.includes('403')) {
        errorMessage = 'API access denied. Please verify your API key permissions.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to scroll to analysis section
  const scrollToAnalysis = () => {
    if (analysisRef.current) {
      setShowAnalysisSection(true);
      setAnalysisVisible(true);
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const handleSendToTelegram = async (message: string) => {
    if (!telegramConfig || !user || user.plan !== 'elite') {
      throw new Error('Telegram not configured or not available for your plan');
    }

    try {
      await sendTelegramMessage(telegramConfig, message);
    } catch (error: any) {
      throw new Error(`Failed to send to Telegram: ${error.message}`);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-400';
      case 'pro': return 'text-blue-400';
      case 'elite': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'elite': return <Crown className="h-5 w-5" />;
      case 'pro': return <Zap className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-400" />;
      default:
        return <Loader className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return t('api.connected');
      case 'error':
        return t('api.disconnected');
      default:
        return t('api.checking');
    }
  };

  const selectedPairInfo = TRADING_PAIRS.find(p => p.symbol === selectedPair);
  const hasReachedDailyLimit = userStats.used_today >= userStats.recommendation_limit;

  if (!user) return null;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                <Activity className="h-8 w-8 text-blue-400" />
                <span>AI Signal Generator</span>
              </h1>
              <p className="text-gray-300">
                Generate professional trading signals powered by advanced AI analysis
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* User Plan Badge */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getPlanColor(user.plan)} bg-opacity-10 border border-opacity-20`} style={{backgroundColor: `rgba(var(--${user.plan === 'elite' ? 'purple' : user.plan === 'pro' ? 'blue' : 'gray'}-500-rgb), 0.1)`, borderColor: `rgba(var(--${user.plan === 'elite' ? 'purple' : user.plan === 'pro' ? 'blue' : 'gray'}-500-rgb), 0.2)`}}>
                {getPlanIcon(user.plan)}
                <span className="font-medium capitalize">{user.plan} Plan</span>
              </div>
              
              {/* Usage Counter */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">{userStats.used_today} / {userStats.recommendation_limit}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Signal Generator Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Market Data */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Step 1: Select Market Data</span>
                </h2>
                
                {/* API Status Indicator */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                  apiStatus === 'connected' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : apiStatus === 'error'
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'
                }`}>
                  {getApiStatusIcon()}
                  <span>{getApiStatusText()}</span>
                </div>
              </div>
              
              <div className="space-y-5">
                {/* Trading Pair Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trading Pair
                  </label>
                  <select
                    value={selectedPair}
                    onChange={(e) => {
                      setSelectedPair(e.target.value);
                      setMarketData(null);
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {TRADING_PAIRS.map((pair) => (
                      <option key={pair.symbol} value={pair.symbol} className="bg-gray-800">
                        {pair.name} ({pair.symbol}) - {pair.category}
                      </option>
                    ))}
                  </select>
                  {selectedPairInfo && (
                    <p className="text-xs text-gray-400 mt-1">
                      Category: {selectedPairInfo.category}
                    </p>
                  )}
                </div>
                
                {/* Candle Count Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data Points
                  </label>
                  <select
                    value={candleCount}
                    onChange={(e) => setCandleCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={30} className="bg-gray-800">30 Candles</option>
                    <option value={50} className="bg-gray-800">50 Candles</option>
                    <option value={100} className="bg-gray-800">100 Candles</option>
                  </select>
                </div>
                
                {/* Fetch Data Button */}
                <button
                  onClick={fetchMarketData}
                  disabled={dataLoading || hasReachedDailyLimit}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {dataLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Fetching Market Data...</span>
                    </>
                  ) : hasReachedDailyLimit ? (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span>Daily Limit Reached</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>Fetch Market Data</span>
                    </>
                  )}
                </button>
                
                {/* Market Data Status */}
                {marketData && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-medium">Market Data Ready</p>
                      <p className="text-green-300 text-sm mt-1">
                        {selectedPair} • {candleCount} candles • 4 timeframes
                      </p>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        <div className="bg-black/20 rounded px-2 py-1 text-xs text-center">
                          <span className="text-gray-400">5min:</span> <span className="text-white">{marketData.timeframes['5min']?.length || 0}</span>
                        </div>
                        <div className="bg-black/20 rounded px-2 py-1 text-xs text-center">
                          <span className="text-gray-400">15min:</span> <span className="text-white">{marketData.timeframes['15min']?.length || 0}</span>
                        </div>
                        <div className="bg-black/20 rounded px-2 py-1 text-xs text-center">
                          <span className="text-gray-400">1h:</span> <span className="text-white">{marketData.timeframes['1h']?.length || 0}</span>
                        </div>
                        <div className="bg-black/20 rounded px-2 py-1 text-xs text-center">
                          <span className="text-gray-400">4h:</span> <span className="text-white">{marketData.timeframes['4h']?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Notice</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 2: Generate Signal */}
            <div ref={generatorRef} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2 mb-6">
                <Zap className="h-5 w-5 text-purple-400" />
                <span>Step 2: Generate AI Signal</span>
              </h2>
              
              <div className="space-y-5">
                {/* Trading School Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trading Methodology
                  </label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id} className="bg-gray-800">
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Advanced Settings */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Advanced Settings</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          AI Provider
                        </label>
                        <select
                          value={aiProvider}
                          onChange={(e) => setAiProvider(e.target.value as 'openrouter' | 'gemini')}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="openrouter" className="bg-gray-800">OpenRouter (GPT-4)</option>
                          <option value="gemini" className="bg-gray-800">Google Gemini</option>
                        </select>
                      </div>
                      
                      {/* Admin-only: Copy Prompt Button */}
                      {user.isAdmin && (
                        <div>
                          <button
                            onClick={copyFullPromptToClipboard}
                            disabled={!marketData || !selectedSchool}
                            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                          >
                            {copiedPrompt ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Prompt Copied!</span>
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                <span>Copy Full Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Generate Button */}
                <button
                  onClick={generateSignal}
                  disabled={loading || !marketData || hasReachedDailyLimit}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Analyzing Market Data...</span>
                    </>
                  ) : hasReachedDailyLimit ? (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span>Daily Limit Reached</span>
                    </>
                  ) : !marketData ? (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span>Fetch Market Data First</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate Trading Signal</span>
                    </>
                  )}
                </button>
                
                {/* Scroll to Analysis Indicator */}
                {lastRecommendation && (
                  <div className="text-center">
                    <button 
                      onClick={scrollToAnalysis}
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>View Analysis Results</span>
                      <ArrowDown className="h-4 w-4 animate-bounce" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>Your Trading Stats</span>
              </h3>
              
              <div className="space-y-4">
                {/* Usage Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Daily Signal Usage</span>
                    <span className="text-white font-medium">{userStats.used_today} / {userStats.recommendation_limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (userStats.used_today / userStats.recommendation_limit) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {userStats.recommendation_limit - userStats.used_today} signals remaining today
                  </p>
                </div>
                
                {/* Plan Details */}
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    {getPlanIcon(user.plan)}
                    <h4 className={`font-medium capitalize ${getPlanColor(user.plan)}`}>{user.plan} Plan</h4>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">Daily Signals:</span>
                      <span className="text-white font-medium">{userStats.recommendation_limit}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">Used Today:</span>
                      <span className="text-white font-medium">{userStats.used_today}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">Remaining:</span>
                      <span className="text-white font-medium">{userStats.recommendation_limit - userStats.used_today}</span>
                    </li>
                  </ul>
                  
                  {user.plan !== 'elite' && (
                    <a
                      href="/plans"
                      className="mt-4 block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
                    >
                      Upgrade Plan
                    </a>
                  )}
                </div>
                
                {/* Telegram Status (Elite only) */}
                {user.plan === 'elite' && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-4 w-4 text-purple-400" />
                      <h4 className="text-purple-400 font-medium">Elite Features</h4>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Telegram Integration:</span>
                      <span className={telegramConfig ? "text-green-400" : "text-gray-400"}>
                        {telegramConfig ? "Configured" : "Not Set"}
                      </span>
                    </div>
                    {!telegramConfig && (
                      <a
                        href="/settings"
                        className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                      >
                        <Settings className="h-3 w-3" />
                        <span>Configure in Settings</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Upgrade Card */}
            {user.plan !== 'elite' && (
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-xl">
                <div className="text-center mb-4">
                  <Crown className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Upgrade to Elite</h3>
                  <p className="text-gray-300 text-sm">
                    Get 15 signals per day and exclusive features
                  </p>
                </div>
                
                <ul className="space-y-2 mb-5">
                  <li className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>15 daily AI-powered signals</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Telegram integration</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>VIP analysis & support</span>
                  </li>
                </ul>
                
                <a
                  href="/plans"
                  className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  View Plans
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Analysis Results Section */}
        {showAnalysisSection && (
          <div ref={analysisRef} id="analysis-section" className="mt-12">
            <div className={`transition-all duration-500 ${analysisVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-10 w-1 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              </div>
              
              <AnalysisDisplay
                analysis={lastRecommendation}
                signal={lastSignal}
                school={schools.find(s => s.id === selectedSchool)?.name || 'Unknown'}
                timestamp={new Date()}
                onSendToTelegram={user?.plan === 'elite' && telegramConfig ? handleSendToTelegram : undefined}
                prompt={createFullPrompt()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;