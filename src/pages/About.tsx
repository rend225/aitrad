import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Target, 
  Award, 
  Globe,
  CheckCircle,
  ArrowRight,
  Brain,
  Cpu,
  Database,
  Clock,
  Star,
  Heart,
  Lightbulb,
  Rocket
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Advanced AI Technology",
      description: "Powered by GPT-4 and cutting-edge machine learning algorithms for precise market analysis and signal generation."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Multiple Trading Schools",
      description: "Choose from technical analysis, fundamental analysis, momentum trading, and swing trading methodologies."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Real-Time Signals",
      description: "Get instant trading signals based on live market data and multi-timeframe analysis."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime and secure PayPal payment processing."
    }
  ];

  const stats = [
    { label: 'Active Traders', value: '10,000+', icon: <Users className="h-6 w-6" /> },
    { label: 'Signals Generated', value: '50,000+', icon: <Target className="h-6 w-6" /> },
    { label: 'Success Rate', value: '87%', icon: <Award className="h-6 w-6" /> },
    { label: 'Countries', value: '120+', icon: <Globe className="h-6 w-6" /> }
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Former Goldman Sachs quantitative analyst with 15+ years in algorithmic trading.",
      avatar: "👨‍💼"
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-Founder",
      bio: "AI researcher from MIT with expertise in machine learning and financial markets.",
      avatar: "👩‍💻"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Trading",
      bio: "Professional trader with 20+ years experience in forex and commodities markets.",
      avatar: "👨‍💼"
    },
    {
      name: "Emily Zhang",
      role: "Head of AI Research",
      bio: "PhD in Computer Science, specializing in natural language processing and market prediction.",
      avatar: "👩‍🔬"
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-400" />,
      title: "User-Centric",
      description: "Every feature we build is designed with our traders' success in mind."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
      title: "Innovation",
      description: "We continuously push the boundaries of AI technology in financial markets."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      title: "Transparency",
      description: "Clear communication about our methods, risks, and performance metrics."
    },
    {
      icon: <Rocket className="h-8 w-8 text-purple-400" />,
      title: "Excellence",
      description: "We strive for the highest quality in everything we deliver to our users."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">About AI Trader</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Revolutionizing Trading with
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {' '}Artificial Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            We're on a mission to democratize professional-grade trading insights by making advanced AI analysis accessible to traders worldwide. Our platform combines cutting-edge technology with proven trading methodologies to help you make smarter trading decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Start Trading Smarter</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/plans"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>View Pricing</span>
            </Link>
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

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Founded in 2023 by a team of former Wall Street analysts and AI researchers, AI Trader was born from a simple observation: the most sophisticated trading tools were only available to institutional investors and hedge funds.
                </p>
                <p>
                  We believed that individual traders deserved access to the same level of analysis and insights. By combining our deep expertise in quantitative finance with cutting-edge artificial intelligence, we created a platform that democratizes professional-grade trading intelligence.
                </p>
                <p>
                  Today, we're proud to serve over 10,000 traders across 120+ countries, helping them make more informed trading decisions with our AI-powered signal generation platform.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Cpu className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
                    <p className="text-gray-300 text-sm">Advanced machine learning algorithms</p>
                  </div>
                  <div className="text-center">
                    <Database className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Data-Driven</h3>
                    <p className="text-gray-300 text-sm">Real-time market data analysis</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">User-Focused</h3>
                    <p className="text-gray-300 text-sm">Built for traders, by traders</p>
                  </div>
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Global Reach</h3>
                    <p className="text-gray-300 text-sm">Serving traders worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our unique combination of advanced AI technology and proven trading methodologies sets us apart in the market.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These core principles guide everything we do and shape how we build products for our trading community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our diverse team combines decades of experience in finance, technology, and artificial intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              To empower every trader with institutional-grade AI analysis, making professional trading insights accessible, affordable, and actionable for everyone.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Accessible</h3>
                <p className="text-gray-300 text-sm">Professional tools for everyone</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Accurate</h3>
                <p className="text-gray-300 text-sm">Precise AI-driven insights</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Actionable</h3>
                <p className="text-gray-300 text-sm">Clear, implementable signals</p>
              </div>
            </div>
            
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Join Our Mission</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who are already using AI Trader to make smarter trading decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/plans"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
          
          <div className="mt-8 text-gray-400">
            <p>Questions? Contact us at <a href="mailto:hello@aitrader.com" className="text-blue-400 hover:text-blue-300">hello@aitrader.com</a></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;