import React, { useState } from 'react';
import { setupAllFirestoreData, setupPlans, setupSchools } from '../scripts/setupFirestore';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const FirestoreSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSetupAll = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await setupAllFirestoreData();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to setup Firestore data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPlans = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await setupPlans();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to setup plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSchools = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await setupSchools();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to setup schools');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Firestore Setup
          </h1>
          <p className="text-gray-300">
            Initialize your Firestore database with plans and trading schools
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Firestore data setup completed successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSetupAll}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5" />
                  <span>Setup All Data</span>
                </>
              )}
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleSetupPlans}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
              >
                Setup Plans Only
              </button>

              <button
                onClick={handleSetupSchools}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
              >
                Setup Schools Only
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">What this will create:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• 3 subscription plans (Free, Pro, Elite)</li>
              <li>• 4 trading schools (Technical, Fundamental, Momentum, Swing)</li>
              <li>• All with proper data types and structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreSetup;