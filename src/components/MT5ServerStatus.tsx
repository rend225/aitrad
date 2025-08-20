import React, { useState, useEffect } from 'react';
import { testApiConnection } from '../services/marketData';
import { Server, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

const MT5ServerStatus: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [isChecking, setIsChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkServerStatus = async () => {
    setIsChecking(true);
    try {
      const isConnected = await testApiConnection();
      setServerStatus(isConnected ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />;
    
    switch (serverStatus) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'offline':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'checking':
        return 'Checking...';
      case 'online':
        return 'MT5 Server Online';
      case 'offline':
        return 'MT5 Server Offline';
      case 'error':
        return 'MT5 Server Error';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online':
        return 'text-green-400';
      case 'offline':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Server className="h-5 w-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Real-time market data source</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={checkServerStatus}
            disabled={isChecking}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors text-xs underline"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="space-y-3">
            {serverStatus === 'offline' || serverStatus === 'error' ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-red-300 font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  MT5 Server Not Available
                </h4>
                <p className="text-red-200 text-sm mb-3">
                  The MT5 Flask server is not running. Market data features will use demo data.
                </p>
                <div className="text-red-200 text-xs space-y-1">
                  <p><strong>To start MT5 server:</strong></p>
                  <p>1. Ensure Python 3.8+ is installed</p>
                  <p>2. Install requirements: <code className="bg-red-700/30 px-1 rounded">pip install -r requirements.txt</code></p>
                  <p>3. Run server: <code className="bg-red-700/30 px-1 rounded">python mt5_server.py</code></p>
                  <p>4. Ensure MetaTrader 5 is installed and logged in</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  MT5 Server Connected
                </h4>
                <p className="text-green-200 text-sm">
                  Real-time market data is available from MetaTrader 5.
                </p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <a
                href="/debug"
                className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
              >
                <span>Debug Page</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MT5ServerStatus;
