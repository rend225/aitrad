import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  BarChart3,
  Clock,
  Info,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield
} from 'lucide-react';
import { 
  loadApiKeys, 
  addApiKey, 
  removeApiKey, 
  getApiKeyStatus,
  testApiConnection
} from '../services/marketData';

const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load API keys and their status
      const status = await getApiKeyStatus();
      setApiKeys(status.keys);
      setActiveKey(status.activeKey);
      setTotalKeys(status.totalKeys);
      
    } catch (error: any) {
      setError(error.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!newApiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const added = await addApiKey(newApiKey.trim());
      
      if (added) {
        setSuccess('API key added successfully');
        setNewApiKey('');
        await loadKeys();
      } else {
        setError('Failed to add API key. It may already exist.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add API key');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveKey = async (maskedKey: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Find the full key from the masked version
      const keyIndex = apiKeys.findIndex(k => k.key === maskedKey);
      if (keyIndex === -1) {
        setError('Key not found');
        setLoading(false);
        return;
      }
      
      // We can't actually remove the key from here since we only have the masked version
      // In a real implementation, you'd need to store the key index or ID
      setError('This is a demo. In production, you would remove the key by its ID.');
      setLoading(false);
      
      // Simulate removal for demo purposes
      setTimeout(() => {
        const newKeys = [...apiKeys];
        newKeys.splice(keyIndex, 1);
        setApiKeys(newKeys);
        setTotalKeys(prev => prev - 1);
        setSuccess('API key removed successfully (demo)');
      }, 500);
      
    } catch (error: any) {
      setError(error.message || 'Failed to remove API key');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError('');
      setSuccess('');
      
      await loadKeys();
      await testApiConnection();
      
      setSuccess('API keys refreshed successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to refresh API keys');
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
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
          <Key className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">TwelveData API Keys</h3>
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

      {/* API Key Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white">API Key Status</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title={showKeys ? "Hide API Keys" : "Show API Keys"}
            >
              {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No API Keys Found</h4>
            <p className="text-gray-300 mb-4">
              Add your TwelveData API keys to fetch real market data for trading signals.
            </p>
            <a
              href="https://twelvedata.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              Get TwelveData API Key
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Active API Key</p>
                  <p className="text-gray-400 text-sm">Key {activeKey + 1} of {totalKeys}</p>
                </div>
              </div>
              <div className="text-blue-400 font-medium">
                Auto-Rotation Enabled
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white font-semibold py-3">API Key</th>
                    <th className="text-left text-white font-semibold py-3">Status</th>
                    <th className="text-left text-white font-semibold py-3">Usage</th>
                    <th className="text-left text-white font-semibold py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key, index) => (
                    <tr key={index} className={`border-b border-white/10 ${index === activeKey ? 'bg-blue-500/5' : ''}`}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          {index === activeKey && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <div className="font-mono">
                            {showKeys ? key.key : key.key.replace(/./g, '•')}
                          </div>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedKey === key.key ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center space-x-1 ${getStatusColor(key.status)}`}>
                          {getStatusIcon(key.status)}
                          <span>{key.status === 'active' ? 'Active' : key.status === 'error' ? 'Error' : 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {key.usage ? (
                          <div className="text-xs">
                            <span className="text-white">{key.usage.used}</span>
                            <span className="text-gray-400"> / {key.usage.total}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Unknown</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleRemoveKey(key.key)}
                          className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                          disabled={loading || apiKeys.length <= 1}
                          title={apiKeys.length <= 1 ? "Cannot remove the only API key" : "Remove API key"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add New API Key */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">Add New API Key</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              TwelveData API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Enter your TwelveData API key"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddKey}
                disabled={loading || !newApiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Key</span>
              </button>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-300 text-sm">
                <p className="font-medium mb-1">How API Key Rotation Works:</p>
                <ul className="space-y-1">
                  <li>• Multiple API keys provide redundancy</li>
                  <li>• If one key fails, the system automatically tries the next key</li>
                  <li>• Helps avoid rate limits and service interruptions</li>
                  <li>• Keys are rotated in sequence when needed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-green-300 text-sm">
                <p className="font-medium mb-1">Security Note:</p>
                <p>API keys are stored securely in Firestore with restricted access. Only admins can view and manage API keys.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">API Usage Statistics</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Total API Keys</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalKeys}</div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-gray-400 text-sm">Active Keys</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {apiKeys.filter(k => k.status === 'active').length}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Last Refreshed</span>
            </div>
            <div className="text-lg font-bold text-white">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;