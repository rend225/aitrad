import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { makeUserAdmin } from '../scripts/makeUserAdmin';
import { Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const AdminMaker: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleMakeAdmin = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await makeUserAdmin(user.uid);
      setSuccess(true);
      // Refresh the page to update user state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to make user admin');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-xl">
          Please log in first
        </div>
      </div>
    );
  }

  if (user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-8 py-6 rounded-xl text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">You're already an admin!</h2>
          <p className="mb-4">You can access the admin dashboard.</p>
          <a
            href="/admin"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Make Admin
          </h1>
          <p className="text-gray-300">
            Grant admin privileges to your account
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
              <span>Admin privileges granted! Refreshing page...</span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Current User:</h3>
            <p className="text-gray-300">{user.email}</p>
            <p className="text-gray-400 text-sm">ID: {user.uid}</p>
          </div>

          <button
            onClick={handleMakeAdmin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Granting Admin Access...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Make Me Admin</span>
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important:</h4>
            <p className="text-gray-300 text-sm">
              This will grant full admin privileges to your account. Only do this if you're the system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaker;