import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { loginUser, resendVerificationEmail, checkEmailVerification } from '../services/auth';
import { Mail, Lock, Eye, EyeOff, TrendingUp, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import SocialLoginButtons from '../components/SocialLoginButtons';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationError(false);

    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      if (error.message.includes('verify your email')) {
        setVerificationError(true);
        setError('Email verification required. Please check your inbox and click the verification link.');
      } else {
        setError(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setError('');
    setEmailResent(false);

    try {
      await resendVerificationEmail();
      setEmailResent(true);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        navigate('/dashboard');
      } else {
        setError('Email is still not verified. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-white">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
          {/* Social Login Buttons */}
          <SocialLoginButtons 
            onError={setError} 
            loading={loading} 
            setLoading={setLoading} 
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-300">
                {t('auth.orSignInWith')}
              </span>
            </div>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`border px-4 py-3 rounded-lg text-sm ${
                verificationError 
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-start space-x-2">
                  {verificationError ? (
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{error}</span>
                </div>
              </div>
            )}

            {emailResent && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verification email sent! Check your inbox.</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder={t('auth.email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder={t('auth.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? t('common.loading') : t('auth.signIn')}
            </button>

            {/* Email Verification Actions */}
            {verificationError && (
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2 text-sm">Email Verification Required</h3>
                  <p className="text-gray-300 text-xs mb-3">
                    To access your dashboard, please verify your email address by clicking the link we sent to your inbox.
                  </p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleCheckVerification}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>I've Verified My Email</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 border border-white/20 text-sm flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${resendingEmail ? 'animate-spin' : ''}`} />
                      <span>{resendingEmail ? 'Sending...' : 'Resend Verification Email'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                {t('auth.signUpHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;