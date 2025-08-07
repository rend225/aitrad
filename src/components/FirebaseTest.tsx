import React, { useState, useEffect } from 'react';
import { auth, db, validateFirebaseConfig, firebaseConfig } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

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
          error: error.message || error.toString() 
        } 
      }));
      throw error;
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestResults({});

    try {
      // Test 1: Configuration validation
      await runTest('config', async () => {
        validateFirebaseConfig();
        return 'Configuration valid';
      });

      // Test 2: Firebase Auth availability
      await runTest('auth', async () => {
        if (!auth) throw new Error('Auth not initialized');
        return 'Auth service available';
      });

      // Test 3: Firestore availability
      await runTest('firestore', async () => {
        if (!db) throw new Error('Firestore not initialized');
        return 'Firestore service available';
      });

      // Test 4: Network connectivity to Firebase
      await runTest('connectivity', async () => {
        // Try to read from a public collection
        const testDoc = doc(db, 'plans', 'test');
        try {
          await getDoc(testDoc);
          return 'Network connectivity OK';
        } catch (error: any) {
          if (error.code === 'permission-denied') {
            return 'Network OK (permission denied is expected for test doc)';
          }
          throw error;
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Firebase Connectivity Test</h2>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {/* Configuration Display */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Configuration</h3>
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
        <h3 className="text-lg font-semibold text-white">Test Results</h3>
        
        {Object.entries(testResults).map(([testName, result]: [string, any]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <span className="font-medium capitalize">{testName} Test</span>
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
              </div>
            )}
          </div>
        ))}

        {Object.keys(testResults).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No tests run yet. Click "Run Tests" to start.
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-300 font-semibold mb-2">🔧 Troubleshooting</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• If config test fails: Check environment variables are set correctly</li>
          <li>• If connectivity fails: Check network connection and firewall settings</li>
          <li>• If permission denied: This is normal for Firestore tests without proper auth</li>
          <li>• For auth/network-request-failed: Try refreshing the page or checking DNS</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
