import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AlertTriangle, ExternalLink, Settings, Database, Shield } from 'lucide-react';

const FirebaseSetupNotification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkFirebaseSetup();
  }, []);

  const checkFirebaseSetup = async () => {
    try {
      // Try to read from a public collection to test basic connectivity
      const testDoc = doc(db, 'plans', 'test');
      await getDoc(testDoc);
      
      // If we get here without permission error, rules are likely set up
      setShowNotification(false);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        // Permission denied indicates rules might not be set up properly
        setShowNotification(true);
      } else if (error.code === 'unavailable') {
        // Service unavailable - might be network or Firestore not enabled
        setShowNotification(true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) return null;

  if (!showNotification) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-start space-x-4">
        <AlertTriangle className="h-6 w-6 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">⚠️ Firebase Setup Required</h3>
          <p className="mb-4">
            Your Firebase project <strong>"test-5e23a"</strong> needs manual configuration. 
            The app can't access Firestore due to missing security rules.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-red-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4" />
                <span className="font-semibold">1. Enable Firestore</span>
              </div>
              <p className="text-sm">Create Firestore database in Firebase Console</p>
            </div>
            
            <div className="bg-red-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4" />
                <span className="font-semibold">2. Deploy Security Rules</span>
              </div>
              <p className="text-sm">Copy rules from FIREBASE_SETUP.md</p>
            </div>
            
            <div className="bg-red-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-4 w-4" />
                <span className="font-semibold">3. Enable Auth</span>
              </div>
              <p className="text-sm">Enable Email/Password authentication</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a
              href="https://console.firebase.google.com/project/test-5e23a"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Firebase Console</span>
            </a>
            
            <button
              onClick={() => window.location.href = '/debug'}
              className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Go to Debug Page
            </button>
            
            <button
              onClick={() => setShowNotification(false)}
              className="bg-red-700/50 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupNotification;
