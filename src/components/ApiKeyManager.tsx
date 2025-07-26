import React, { useState, useEffect } from 'react';
import { 
  Server, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  BarChart3,
  Clock,
  Info,
  Shield,
  ExternalLink,
  Activity
} from 'lucide-react';
import { 
  testApiConnection,
  getApiKeyStatus
} from '../services/marketData';

const ApiKeyManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [mt5ServerUrl, setMt5ServerUrl] = useState(import.meta.env.VITE_MT5_SERVER_URL || 'http://localhost:5000');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Test MT5 server connection
      const isConnected = await testApiConnection();
      const status = await getApiKeyStatus();
      
      setServerStatus({
        connected: isConnected,
        status: status.keys[0]?.status || 'unknown',
        url: mt5ServerUrl
      });
      
    } catch (error: any) {
      setError(error.message || 'Failed to check MT5 server status');
      setServerStatus({
        connected: false,
        status: 'error',
        url: mt5ServerUrl
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError('');
      setSuccess('');
      
      await checkServerStatus();
      
      setSuccess('MT5 server status refreshed successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to refresh server status');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Server className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">MT5 Server Configuration</h3>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>{success}</span>
          <button 
            onClick={() => setSuccess('')}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Server Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white">Server Status</h4>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : !serverStatus ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Server Status Unknown</h4>
            <p className="text-gray-300 mb-4">
              Unable to determine MT5 server status. Please check your configuration.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`border rounded-lg p-4 flex items-center justify-between ${
              serverStatus.connected 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-center space-x-3">
                <Activity className={`h-5 w-5 ${serverStatus.connected ? 'text-green-400' : 'text-red-400'}`} />
                <div>
                  <p className="text-white font-medium">MT5 Flask Server</p>
                  <p className="text-gray-400 text-sm">{serverStatus.url}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center space-x-1 ${getStatusColor(serverStatus.status)}`}>
                {getStatusIcon(serverStatus.status)}
                <span>{serverStatus.connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Server URL</h5>
                  <p className="text-gray-400 text-sm font-mono">{serverStatus.url}</p>
                </div>
                <a
                  href={`${serverStatus.url}/health`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">MT5 Server Setup</h4>
        
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-300 text-sm">
                <p className="font-medium mb-2">To set up the MT5 Flask server:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Install Python dependencies: <code className="bg-black/20 px-1 rounded">pip install -r requirements.txt</code></li>
                  <li>Ensure MetaTrader 5 is running and logged in</li>
                  <li>Run the Flask server: <code className="bg-black/20 px-1 rounded">python mt5_server.py</code></li>
                  <li>Server will start on port 5000 by default</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-green-300 text-sm">
                <p className="font-medium mb-1">Benefits of MT5 Integration:</p>
                <ul className="space-y-1">
                  <li>• Free and unlimited market data</li>
                  <li>• Real-time data directly from MT5 terminal</li>
                  <li>• No API key management required</li>
                  <li>• Full control over data source</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-300 text-sm">
                <p className="font-medium mb-1">Requirements:</p>
                <ul className="space-y-1">
                  <li>• MetaTrader 5 terminal installed and running</li>
                  <li>• Valid MT5 trading account (demo or live)</li>
                  <li>• Python 3.7+ with MetaTrader5 module</li>
                  <li>• Flask server accessible from this application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">Connection Statistics</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Data Source</span>
            </div>
            <div className="text-lg font-bold text-white">MT5 Server</div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-gray-400 text-sm">Status</span>
            </div>
            <div className="text-lg font-bold text-white">
              {serverStatus?.connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Last Checked</span>
            </div>
            <div className="text-sm font-bold text-white">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
