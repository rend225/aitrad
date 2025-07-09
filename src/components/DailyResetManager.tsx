import React, { useState, useEffect } from 'react';
import { 
  manualDailyReset, 
  getResetStatus, 
  checkIfResetNeeded 
} from '../services/dailyReset';
import { 
  RefreshCw, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Zap,
  Shield
} from 'lucide-react';

interface ResetStatus {
  date: string;
  total_users: number;
  reset_today: number;
  reset_completed: boolean;
  next_reset: string;
}

const DailyResetManager: React.FC = () => {
  const [resetStatus, setResetStatus] = useState<ResetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    loadResetStatus();
    
    // Refresh status every minute
    const interval = setInterval(loadResetStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadResetStatus = async () => {
    try {
      const status = await getResetStatus();
      setResetStatus(status);
    } catch (error) {
      console.error('Error loading reset status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualReset = async () => {
    setResetting(true);
    setMessage('');
    setMessageType('');

    try {
      const result = await manualDailyReset();
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        await loadResetStatus(); // Refresh status
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setResetting(false);
    }
  };

  const formatTimeUntilReset = () => {
    if (!resetStatus) return '';
    
    const now = new Date();
    const nextReset = new Date(resetStatus.next_reset);
    const diff = nextReset.getTime() - now.getTime();
    
    if (diff <= 0) return 'Reset due now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
          <span className="text-white">Loading reset status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Daily Usage Reset</h3>
        </div>
        
        <button
          onClick={loadResetStatus}
          disabled={loading}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
          messageType === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      {resetStatus && (
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Users</span>
              </div>
              <div className="text-2xl font-bold text-white">{resetStatus.total_users}</div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">Reset Today</span>
              </div>
              <div className="text-2xl font-bold text-white">{resetStatus.reset_today}</div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Next Reset</span>
              </div>
              <div className="text-lg font-bold text-white">{formatTimeUntilReset()}</div>
            </div>
          </div>

          {/* Reset Status */}
          <div className={`p-4 rounded-lg border ${
            resetStatus.reset_completed
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {resetStatus.reset_completed ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              )}
              <span className={`font-semibold ${
                resetStatus.reset_completed ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {resetStatus.reset_completed ? 'Reset Completed' : 'Reset Pending'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {resetStatus.reset_completed
                ? `All ${resetStatus.total_users} users have been reset for ${resetStatus.date}`
                : `${resetStatus.total_users - resetStatus.reset_today} users still need to be reset`
              }
            </p>
          </div>

          {/* Manual Reset Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleManualReset}
              disabled={resetting}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {resetting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Resetting All Users...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Manual Reset All Users</span>
                </>
              )}
            </button>

            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Shield className="h-4 w-4" />
              <span>This will reset used_today to 0 for all users</span>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">How Daily Reset Works:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Automatically resets at midnight (00:00) local time</li>
              <li>• Sets used_today = 0 for all users</li>
              <li>• Allows users to generate new signals based on their plan limits</li>
              <li>• Manual reset can be triggered by admins if needed</li>
              <li>• Reset status is tracked to prevent duplicate resets</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyResetManager;