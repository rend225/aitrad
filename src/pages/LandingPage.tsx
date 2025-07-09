import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getFeaturedSignals } from '../services/firestore';
import ChatSupport from '../components/ChatSupport';
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Award,
  Globe,
  BarChart3,
  Clock,
  Target,
  TrendingDown,
  Minus,
  Play,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Percent,
  Activity,
  Mail,
  MessageCircle,
  Phone
} from 'lucide-react';

interface FeaturedSignal {
  id: string;
  pair: string;
  type: 'buy' | 'sell' | 'hold';
  entry: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  probability: number;
  result: 'profit' | 'loss' | 'pending';
  profitPips?: number;
  date: string;
  school: string;
  featured: boolean;
}

const LandingPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [featuredSignals, setFeaturedSignals] = useState<FeaturedSignal[]>([]);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const liveChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFeaturedSignals();
  }, []);

  const loadFeaturedSignals = async () => {
    try {
      const signals = await getFeaturedSignals();
      setFeaturedSignals(signals);
    } catch (error) {
      console.error('Error loading featured signals:', error);
      // Fallback to demo data
      setFeaturedSignals(getDemoSignals());
    } finally {
      setLoading(false);
    }
  };

  const getDemoSignals = (): FeaturedSignal[] => [
    {
      id: '1',
      pair: 'XAUUSD',
      type: 'buy',
      entry: 2045.50,
      stopLoss: 2035.00,
      takeProfit1: 2055.00,
      takeProfit2: 2065.00,
      probability: 87,
      result: 'profit',
      profitPips: 950,
      date: '2024-01-15',
      school: 'Technical Analysis',
      featured: true
    },
    {
      id: '2',
      pair: 'EURUSD',
      type: 'sell',
      entry: 1.0850,
      stopLoss: 1.0880,
      takeProfit1: 1.0820,
      takeProfit2: 1.0790,
      probability: 92,
      result: 'profit',
      profitPips: 300,
      date: '2024-01-14',
      school: 'Momentum Trading',
      featured: true
    },
    {
      id: '3',
      pair: 'GBPUSD',
      type: 'buy',
      entry: 1.2650,
      stopLoss: 1.2620,
      takeProfit1: 1.2680,
      takeProfit2: 1.2710,
      probability: 85,
      result: 'profit',
      profitPips: 300,
      date: '2024-01-13',
      school: 'Fundamental Analysis',
      featured: true
    }
  ];

  const nextSignal = () => {
    setCurrentSignalIndex((prev) => (prev + 1) % featuredSignals.length);
  };

  const prevSignal = () => {
    setCurrentSignalIndex((prev) => (prev - 1 + featuredSignals.length) % featuredSignals.length);
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'sell': return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'hold': return <Minus className="h-5 w-5 text-yellow-400" />;
      default: return <Target className="h-5 w-5 text-blue-400" />;
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

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('landing.features.ai.title'),
      description: t('landing.features.ai.desc'),
      stats: '95% Accuracy'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('landing.features.secure.title'),
      description: t('landing.features.secure.desc'),
      stats: '99.9% Uptime'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('landing.features.schools.title'),
      description: t('landing.features.schools.desc'),
      stats: '4 Strategies'
    }
  ];

  const stats = [
    { label: 'Active Traders', value: '10,000+', icon: <Users className="h-6 w-6" /> },
    { label: 'Signals Generated', value: '50,000+', icon: <BarChart3 className="h-6 w-6" /> },
    { label: 'Success Rate', value: '87%', icon: <Target className="h-6 w-6" /> },
    { label: 'Countries', value: '120+', icon: <Globe className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Professional Trader',
      content: 'AI Trader has revolutionized my trading strategy. The signals are incredibly accurate and have significantly improved my profitability.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Investment Manager',
      content: 'The technical analysis provided by AI Trader is top-notch. It\'s like having a team of expert analysts at your fingertips.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Day Trader',
      content: 'I\'ve been using AI Trader for 6 months and my win rate has increased by 40%. The Elite plan is worth every penny.',
      rating: 5,
      avatar: '👩‍💻'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      originalPrice: null,
      features: ['1 signal per day', 'Basic analysis', 'Email support'],
      popular: false,
      badge: null
    },
    {
      name: 'Pro',
      price: '$19.99',
      originalPrice: '$29',
      features: ['5 signals per day', 'Advanced analysis', 'Priority support', 'Historical data'],
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Elite',
      price: '$99',
      originalPrice: '$149',
      features: ['15 signals per day', 'VIP analysis', '24/7 support', 'Custom strategies', 'API access'],
      popular: false,
      badge: 'Best Value'
    }
  ];

  // Contact section handlers
  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@aitrader.com?subject=Support Request';
  };

  const handleStartChat = () => {
    // Open the live chat widget
    const chatButton = document.querySelector('.fixed.bottom-6.right-6') as HTMLElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+15551234567';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-blue-400 font-semibold">Trusted by 10,000+ Traders Worldwide</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Trading Signals
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl"
              >
                <span>{t('landing.hero.startTrial')}</span>
                <ArrowRight className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/plans"
                className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-400" />
                <span>Award-Winning Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Real-Time Signals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 mx-auto">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trading Signals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-6">
              <Award className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">Proven Results</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Recent Winning Signals
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See real examples of profitable trades generated by our AI system. These signals were curated by our admin team to showcase our platform's capabilities.
            </p>
          </div>

          {!loading && featuredSignals.length > 0 && (
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getSignalTypeColor(featuredSignals[currentSignalIndex].type)}`}>
                      {getSignalTypeIcon(featuredSignals[currentSignalIndex].type)}
                      <span className="uppercase">{featuredSignals[currentSignalIndex].type}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {featuredSignals[currentSignalIndex].pair}
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      +{featuredSignals[currentSignalIndex].profitPips} pips
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevSignal}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-gray-400 text-sm">
                      {currentSignalIndex + 1} / {featuredSignals.length}
                    </span>
                    <button
                      onClick={nextSignal}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Entry Price</p>
                    <p className="text-white font-bold text-lg">{featuredSignals[currentSignalIndex].entry}</p>
                  </div>
                  
                  {featuredSignals[currentSignalIndex].stopLoss && (
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Stop Loss</p>
                      <p className="text-red-400 font-bold text-lg">{featuredSignals[currentSignalIndex].stopLoss}</p>
                    </div>
                  )}
                  
                  {featuredSignals[currentSignalIndex].takeProfit1 && (
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Take Profit</p>
                      <p className="text-green-400 font-bold text-lg">{featuredSignals[currentSignalIndex].takeProfit1}</p>
                    </div>
                  )}
                  
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Probability</p>
                    <p className="text-blue-400 font-bold text-lg">{featuredSignals[currentSignalIndex].probability}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredSignals[currentSignalIndex].date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>{featuredSignals[currentSignalIndex].school}</span>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    PROFITABLE
                  </div>
                </div>
              </div>

              {/* Signal Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {featuredSignals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSignalIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSignalIndex ? 'bg-blue-500' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="text-blue-400 font-semibold">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              What Our Traders Say
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of successful traders who trust AI Trader
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('landing.pricing.subtitle')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/20' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-6 py-2 rounded-full text-sm font-semibold text-white ${
                      plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-gray-400 line-through text-lg mt-1">
                        {plan.originalPrice}/month
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all text-center block ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  }`}
                >
                  {t('landing.pricing.getStarted')}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <div ref={liveChatRef}>
        <ChatSupport 
          onEmailSupport={handleEmailSupport}
          onStartChat={handleStartChat}
          onCallSupport={handleCallSupport}
        />
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/30">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>{t('landing.cta.startTrial')}</span>
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/plans"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
              >
                View All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;