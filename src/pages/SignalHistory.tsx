import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserRecommendations } from '../services/firestore';
import { Recommendation } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target,
  Calendar, 
  Filter,
  Search,
  Download,
  RefreshCw,
  Loader,
  AlertCircle,
  Activity,
  BarChart3,
  ChevronDown,
  Eye,
  EyeOff,
  DollarSign,
  Percent
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

const SignalHistory: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [recommendations, searchTerm, filterSchool, filterPeriod, filterType]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserRecommendations(user.uid, 100);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recommendations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rec => 
        rec.signal?.pair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.response.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // School filter
    if (filterSchool !== 'all') {
      filtered = filtered.filter(rec => rec.school === filterSchool);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(rec => rec.signal?.type === filterType);
    }

    // Period filter
    if (filterPeriod !== 'all') {
      filtered = filtered.filter(rec => {
        const recDate = rec.timestamp.toDate();
        switch (filterPeriod) {
          case 'today':
            return isToday(recDate);
          case 'yesterday':
            return isYesterday(recDate);
          case 'week':
            return isThisWeek(recDate);
          case 'month':
            return isThisMonth(recDate);
          default:
            return true;
        }
      });
    }

    setFilteredRecommendations(filtered);
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'sell': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'hold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4" />;
      case 'sell': return <TrendingDown className="h-4 w-4" />;
      case 'hold': return <Minus className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getUniqueSchools = () => {
    const schools = [...new Set(recommendations.map(rec => rec.school))];
    return schools.sort();
  };

  const getStats = () => {
    const total = recommendations.length;
    const withSignals = recommendations.filter(rec => rec.signal).length;
    const buySignals = recommendations.filter(rec => rec.signal?.type === 'buy').length;
    const sellSignals = recommendations.filter(rec => rec.signal?.type === 'sell').length;
    const holdSignals = recommendations.filter(rec => rec.signal?.type === 'hold').length;
    
    return { total, withSignals, buySignals, sellSignals, holdSignals };
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Pair', 'Type', 'Entry', 'Stop Loss', 'TP1', 'TP2', 'Probability', 'School'].join(','),
      ...filteredRecommendations.map(rec => [
        format(rec.timestamp.toDate(), 'yyyy-MM-dd HH:mm'),
        rec.signal?.pair || 'N/A',
        rec.signal?.type?.toUpperCase() || 'N/A',
        rec.signal?.entry || 'N/A',
        rec.signal?.stopLoss || 'N/A',
        rec.signal?.takeProfit1 || 'N/A',
        rec.signal?.takeProfit2 || 'N/A',
        rec.signal?.probability ? `${rec.signal.probability}%` : 'N/A',
        rec.school
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-signals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your signal history...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Signal History
              </h1>
              <p className="text-gray-300">
                Quick overview of your AI-generated trading signals
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button
                onClick={loadRecommendations}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              {filteredRecommendations.length > 0 && (
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Signals</p>
                <p className="text-2xl font-bold text-white">{stats.withSignals}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Buy Signals</p>
                <p className="text-2xl font-bold text-green-400">{stats.buySignals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Sell Signals</p>
                <p className="text-2xl font-bold text-red-400">{stats.sellSignals}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Hold Signals</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.holdSignals}</p>
              </div>
              <Minus className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.withSignals > 0 ? Math.round((stats.buySignals + stats.sellSignals) / stats.withSignals * 100) : 0}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search pairs, schools..."
                    className="pl-10 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Signal Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-gray-800">All Types</option>
                  <option value="buy" className="bg-gray-800">Buy</option>
                  <option value="sell" className="bg-gray-800">Sell</option>
                  <option value="hold" className="bg-gray-800">Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trading School
                </label>
                <select
                  value={filterSchool}
                  onChange={(e) => setFilterSchool(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-gray-800">All Schools</option>
                  {getUniqueSchools().map(school => (
                    <option key={school} value={school} className="bg-gray-800">
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-gray-800">All Time</option>
                  <option value="today" className="bg-gray-800">Today</option>
                  <option value="yesterday" className="bg-gray-800">Yesterday</option>
                  <option value="week" className="bg-gray-800">This Week</option>
                  <option value="month" className="bg-gray-800">This Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filteredRecommendations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-white/20 text-center">
            {recommendations.length === 0 ? (
              <>
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Signals Yet
                </h3>
                <p className="text-gray-300 mb-6">
                  Generate your first trading signal to see it appear here
                </p>
                <a
                  href="/dashboard"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Generate Signal
                </a>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-300 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterSchool('all');
                    setFilterPeriod('all');
                    setFilterType('all');
                  }}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">
                Showing {filteredRecommendations.length} of {recommendations.length} signals
              </p>
            </div>

            {/* Signal Cards */}
            <div className="grid gap-4">
              {filteredRecommendations.map((rec) => {
                const signal = rec.signal;
                const isExpanded = expandedCards.has(rec.id);
                
                if (!signal) {
                  return null; // Skip recommendations without structured signal data
                }
                
                return (
                  <div
                    key={rec.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getSignalTypeColor(signal.type)}`}>
                            {getSignalTypeIcon(signal.type)}
                            <span>{signal.type.toUpperCase()}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {signal.pair}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(rec.timestamp.toDate(), 'MMM d, yyyy • h:mm a')}
                              </span>
                              <span>•</span>
                              <span>{rec.school}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleCardExpansion(rec.id)}
                          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                        >
                          {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Signal Data Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                        {signal.entry && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Entry</p>
                            <p className="text-white font-bold">{signal.entry}</p>
                          </div>
                        )}
                        
                        {signal.stopLoss && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Stop Loss</p>
                            <p className="text-red-400 font-bold">{signal.stopLoss}</p>
                          </div>
                        )}
                        
                        {signal.takeProfit1 && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">TP1</p>
                            <p className="text-green-400 font-bold">{signal.takeProfit1}</p>
                          </div>
                        )}
                        
                        {signal.takeProfit2 && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">TP2</p>
                            <p className="text-green-400 font-bold">{signal.takeProfit2}</p>
                          </div>
                        )}
                        
                        {signal.probability && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Probability</p>
                            <p className="text-blue-400 font-bold">{signal.probability}%</p>
                          </div>
                        )}
                        
                        {signal.entry && signal.stopLoss && (
                          <div className="bg-black/20 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Risk</p>
                            <p className="text-orange-400 font-bold">
                              {Math.abs(signal.entry - signal.stopLoss).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Full Analysis (Expandable) */}
                      {isExpanded && (
                        <div className="bg-black/20 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Full Analysis:
                          </h4>
                          <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                            {rec.response}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalHistory;