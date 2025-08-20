import React, { useState, useEffect } from 'react';
import { auth, db, validateFirebaseConfig, firebaseConfig, testFirebaseConnectivity } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertCircle, Loader, Wifi, WifiOff, Globe, Server, Database, Key } from 'lucide-react';

const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [connectivityStatus, setConnectivityStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: { status: 'running' } }));
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: { status: 'success', result } }));
      return result;
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          error: error.message || error.toString(),
          code: error.code
        } 
      }));
      throw error;
    }
  };

  const checkNetworkConnectivity = async () => {
    try {
      // Test basic internet connectivity
      const response = await fetch('https://www.google.com/favicon.ico', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      setConnectivityStatus('online');
      return true;
    } catch (error) {
      setConnectivityStatus('offline');
      return false;
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestResults({});

    try {
      // Test 1: Network connectivity
      await runTest('network', async () => {
        const isOnline = await checkNetworkConnectivity();
        if (!isOnline) throw new Error('No internet connection detected');
        return 'Internet connection available';
      });

      // Test 2: Configuration validation
      await runTest('config', async () => {
        validateFirebaseConfig();
        return 'Configuration is valid';
      });

      // Test 3: Firebase Auth availability
      await runTest('auth_service', async () => {
        if (!auth) throw new Error('Auth service not initialized');
        return 'Firebase Auth service available';
      });

      // Test 4: Firestore availability
      await runTest('firestore_service', async () => {
        if (!db) throw new Error('Firestore service not initialized');
        return 'Firestore service available';
      });

      // Test 5: Firebase connectivity
      await runTest('firebase_connectivity', async () => {
        const isConnected = await testFirebaseConnectivity();
        if (!isConnected) throw new Error('Cannot reach Firebase servers');
        return 'Firebase servers are reachable';
      });

      // Test 6: Try reading from Firestore
      await runTest('firestore_read', async () => {
        try {
          const testDoc = doc(db, 'plans', 'test');
          await getDoc(testDoc);
          return 'Firestore read operation successful';
        } catch (error: any) {
          if (error.code === 'permission-denied') {
            return 'Firestore connection OK (permission denied is expected)';
          } else if (error.code === 'unavailable') {
            throw new Error('Firestore service unavailable');
          }
          throw error;
        }
      });

      // Test 7: DNS resolution
      await runTest('dns_resolution', async () => {
        try {
          const response = await fetch(`https://identitytoolkit.googleapis.com/`, { 
            method: 'HEAD',
            mode: 'no-cors'
          });
          return 'Firebase domains resolve correctly';
        } catch (error) {
          throw new Error('DNS resolution failed for Firebase domains');
        }
      });

      console.log('✅ All Firebase tests completed');
    } catch (error) {
      console.error('❌ Firebase test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'running':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    }
  };

  const getTestIcon = (testName: string) => {
    switch (testName) {
      case 'network':
        return connectivityStatus === 'online' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
      case 'config':
        return <Key className="h-4 w-4" />;
      case 'auth_service':
        return <Server className="h-4 w-4" />;
      case 'firestore_service':
        return <Database className="h-4 w-4" />;
      case 'firebase_connectivity':
        return <Globe className="h-4 w-4" />;
      case 'firestore_read':
        return <Database className="h-4 w-4" />;
      case 'dns_resolution':
        return <Globe className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTestDisplayName = (testName: string) => {
    const names = {
      'network': 'Internet Connection',
      'config': 'Firebase Configuration',
      'auth_service': 'Auth Service',
      'firestore_service': 'Firestore Service',
      'firebase_connectivity': 'Firebase Connectivity',
      'firestore_read': 'Firestore Access',
      'dns_resolution': 'DNS Resolution'
    };
    return names[testName as keyof typeof names] || testName;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Firebase Connectivity Diagnostics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {connectivityStatus === 'online' ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : connectivityStatus === 'offline' ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-500" />
            )}
            <span className="text-sm text-gray-300">
              {connectivityStatus === 'online' ? 'Online' : 
               connectivityStatus === 'offline' ? 'Offline' : 'Unknown'}
            </span>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            {isRunning ? 'Running Tests...' : 'Rerun Tests'}
          </button>
        </div>
      </div>

      {/* Configuration Display */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Configuration Status</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Project ID:</span>
            <span className="text-white ml-2">{firebaseConfig.projectId || 'Not set'}</span>
          </div>
          <div>
            <span className="text-gray-400">Auth Domain:</span>
            <span className="text-white ml-2">{firebaseConfig.authDomain || 'Not set'}</span>
          </div>
          <div>
            <span className="text-gray-400">API Key:</span>
            <span className="text-white ml-2">
              {firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Not set'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">App ID:</span>
            <span className="text-white ml-2">
              {firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Diagnostic Results</h3>
        
        {Object.entries(testResults).map(([testName, result]: [string, any]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTestIcon(testName)}
                {getStatusIcon(result.status)}
                <span className="font-medium">{getTestDisplayName(testName)}</span>
              </div>
              <span className="text-sm opacity-75">
                {result.status === 'success' && result.result}
                {result.status === 'error' && 'Failed'}
                {result.status === 'running' && 'Running...'}
              </span>
            </div>
            {result.error && (
              <div className="mt-2 text-sm opacity-90">
                <strong>Error:</strong> {result.error}
                {result.code && <span className="ml-2 opacity-70">({result.code})</span>}
              </div>
            )}
          </div>
        ))}

        {Object.keys(testResults).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No tests run yet. Click "Rerun Tests" to start diagnostics.
          </div>
        )}
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-300 font-semibold mb-3">🔧 Troubleshooting Guide</h4>
        <div className="space-y-3 text-blue-200 text-sm">
          <div>
            <strong>Network Request Failed:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Check internet connection</li>
              <li>• Verify firewall settings</li>
              <li>• Try different network/disable VPN</li>
              <li>• Check DNS resolution</li>
            </ul>
          </div>
          <div>
            <strong>Configuration Issues:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Verify Firebase project ID is correct</li>
              <li>• Check API key restrictions in Firebase Console</li>
              <li>• Ensure auth domain matches your deployment URL</li>
            </ul>
          </div>
          <div>
            <strong>Permission Denied:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Normal for public collections without auth</li>
              <li>• Check Firestore security rules</li>
              <li>• Ensure user is properly authenticated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Environment Info */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-gray-600">
        <h4 className="text-white font-semibold mb-2">Environment Information</h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
          <div>Environment: {import.meta.env.MODE}</div>
          <div>Development: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
          <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
          <div>Online Status: {navigator.onLine ? 'Online' : 'Offline'}</div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
