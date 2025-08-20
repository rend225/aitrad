import React, { useState, useEffect } from 'react';
import { WifiOff, Server, AlertTriangle, RefreshCw } from 'lucide-react';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({ children }) => {
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkError(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkError(true);
      setErrorDetails('Internet connection lost');
    };

    // Listen for network events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for unhandled fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error: any) {
        if (error.message?.includes('Failed to fetch')) {
          console.warn('🌐 Network fetch failed:', error);
          // Don't show error for known MT5 server endpoints
          const url = args[0]?.toString() || '';
          if (!url.includes('localhost:5000') && !url.includes('127.0.0.1:5000')) {
            setShowNetworkError(true);
            setErrorDetails('Network connection issue detected');
          }
        }
        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  const handleRetry = () => {
    setShowNetworkError(false);
    window.location.reload();
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 text-center">
          <WifiOff className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No Internet Connection</h2>
          <p className="text-gray-300 mb-6">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* Network Error Toast */}
      {showNetworkError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold">Network Issue</h4>
              <p className="text-sm mt-1">{errorDetails}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleRetry}
                  className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => setShowNetworkError(false)}
                  className="bg-red-600/50 hover:bg-red-700/50 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkErrorHandler;
