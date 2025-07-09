import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { checkEmailVerification, resendVerificationEmail } from '../services/auth';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    setCheckingVerification(true);
    try {
      const isVerified = await checkEmailVerification();
      setEmailVerified(isVerified);
    } catch (error) {
      console.error('Error checking verification:', error);
      setEmailVerified(false);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setEmailResent(false);

    try {
      await resendVerificationEmail();
      setEmailResent(true);
    } catch (error: any) {
      console.error('Error resending verification:', error);
    } finally {
      setResendingEmail(false);
    }
  };

  if (loading || checkingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check email verification for email/password users
  if (user.provider === 'email' && emailVerified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-yellow-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Email Verification Required
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Please verify your email to access your dashboard
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
            <div className="space-y-6">
              {emailResent && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verification email sent! Check your inbox.</span>
                  </div>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-sm">
                    <p className="font-medium mb-2">To access your dashboard:</p>
                    <ol className="space-y-1 text-xs">
                      <li>1. Check your email inbox for a verification message</li>
                      <li>2. Click the verification link in the email</li>
                      <li>3. Return here and refresh the page</li>
                    </ol>
                    <p className="mt-2 text-xs">
                      <strong>Note:</strong> Check your spam/junk folder if you don't see the email
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={checkVerificationStatus}
                  disabled={checkingVerification}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{checkingVerification ? 'Checking...' : 'I\'ve Verified My Email'}</span>
                </button>

                <button
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 border border-white/20 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>{resendingEmail ? 'Sending...' : 'Resend Verification Email'}</span>
                </button>

                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;