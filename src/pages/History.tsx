import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserRecommendations } from '../services/firestore';
import { Recommendation } from '../types';
import { 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Filter,
  Search,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  Activity,
  Target,
  TrendingDown,
  Minus,
  RefreshCw,
  Loader,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

const History: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [recommendations, searchTerm, filterSchool, filterPeriod]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getUserRecommendations(user.uid, 50); // Load more history
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
        rec.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.school.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // School filter
    if (filterSchool !== 'all') {
      filtered = filtered.filter(rec => rec.school === filterSchool);
    }

    // Period filter
    if (filterPeriod !== 'all') {
      const now = new Date();
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

  const getSignalTypeFromText = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('buy') || lowerText.includes('long')) {
      return 'buy';
    } else if (lowerText.includes('sell') || lowerText.includes('short')) {
      return 'sell';
    } else if (lowerText.includes('hold') || lowerText.includes('wait')) {
      return 'hold';
    }
    return 'neutral';
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
    const buySignals = recommendations.filter(rec => getSignalTypeFromText(rec.response) === 'buy').length;
    const sellSignals = recommendations.filter(rec => getSignalTypeFromText(rec.response) === 'sell').length;
    const holdSignals = recommendations.filter(rec => getSignalTypeFromText(rec.response) === 'hold').length;
    
    return { total, buySignals, sellSignals, holdSignals };
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'School', 'Signal Type', 'Analysis'].join(','),
      ...filteredRecommendations.map(rec => [
        format(rec.timestamp.toDate(), 'yyyy-MM-dd HH:mm'),
        rec.school,
        getSignalTypeFromText(rec.response).toUpperCase(),
        `"${rec.response.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your trading history...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Gradient */}
        <div className="mb-10 pb-6 border-b border-gradient-to-r from-blue-500/30 to-purple-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3 flex items-center space-x-3">
                <Clock className="h-9 w-9 text-blue-400" />
                Trading History
              </h1>
              <p className="text-gray-300 text-lg">
                Review and analyze your AI-generated trading signals
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
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Signals</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Buy Signals</p>
                <p className="text-2xl font-bold text-green-400">{stats.buySignals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Sell Signals</p>
                <p className="text-2xl font-bold text-red-400">{stats.sellSignals}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Hold Signals</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.holdSignals}</p>
              </div>
              <Minus className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl mb-8">
            <div className="grid md:grid-cols-3 gap-6">
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
                    placeholder="Search signals..."
                    className="pl-10 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-12 border border-white/10 shadow-xl text-center">
            {recommendations.length === 0 ? (
              <>
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Trading History Yet
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
                  }}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">
                Showing {filteredRecommendations.length} of {recommendations.length} signals
              </p>
            </div>

            {filteredRecommendations.map((rec) => {
              const signalType = getSignalTypeFromText(rec.response);
              const isExpanded = expandedCards.has(rec.id);
              
              return (
                <div key={rec.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl hover:bg-white/5 transition-all">
                  <div className="p-7">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-5">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="bg-blue-500/20 p-3 rounded-xl shadow-inner">
                          <TrendingUp className="h-7 w-7 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {rec.school} Analysis
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(rec.timestamp.toDate(), 'MMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center space-x-2 ${getSignalTypeColor(signalType)} shadow-lg`}>
                          {getSignalTypeIcon(signalType)}
                          <span>{signalType.toUpperCase()}</span>
                        </div>
                        
                        <button
                          onClick={() => toggleCardExpansion(rec.id)}
                          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                        >
                          {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-5 shadow-inner border border-white/5">
                      <h4 className="text-base font-bold text-blue-400 mb-3 border-b border-blue-500/20 pb-2">
                        AI RECOMMENDATION
                      </h4>
                      <div className={`text-gray-200 ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                        {rec.response}
                      </div>
                      
                      {!isExpanded && rec.response.length > 200 && (
                        <button
                          onClick={() => toggleCardExpansion(rec.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm mt-3 flex items-center space-x-1 font-medium"
                        >
                          <span>Show more</span>
                          <Eye className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {rec.confidence && (
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-sm text-gray-300 font-medium">Confidence:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${rec.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white font-medium">
                          {rec.confidence}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;