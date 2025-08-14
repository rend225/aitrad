import React from 'react';
import FirebaseTest from '../components/FirebaseTest';
import FirebaseSetupHelper from '../components/FirebaseSetupHelper';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Debug: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Firebase Debug Panel</h1>
          <p className="text-gray-300">
            Debug Firebase connectivity and configuration issues
          </p>
        </div>

        {/* Firebase Test Component */}
        <FirebaseTest />

        {/* Firebase Setup Helper */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Firebase Setup</h2>
          <FirebaseSetupHelper />
        </div>

        {/* Additional Debug Information */}
        <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Common Issues & Solutions</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">🔥 auth/network-request-failed</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Check internet connection</li>
                <li>Verify Firebase project settings</li>
                <li>Ensure API keys are correctly set</li>
                <li>Check for firewall/DNS issues</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">🔒 permission-denied (Firestore)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>User not authenticated</li>
                <li>Firestore security rules too restrictive</li>
                <li>User document doesn't exist</li>
                <li>Admin permissions not set</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">⚙️ Configuration Issues</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Missing environment variables</li>
                <li>Incorrect Firebase project ID</li>
                <li>Wrong auth domain</li>
                <li>Invalid API key format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;
