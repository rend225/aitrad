import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { registerUser } from '../services/auth';
import { Mail, Lock, Eye, EyeOff, TrendingUp, User, CheckCircle, AlertCircle } from 'lucide-react';
import SocialLoginButtons from '../components/SocialLoginButtons';

const Register: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser(email, password, fullName.trim());
      setRegistrationSuccess(true);
      
      // Don't navigate immediately - show verification message
      console.log('✅ Registration successful. User needs to verify email.');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // If registration was successful, show verification message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              We've sent a verification link to your email address
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20">
            <div className="text-center space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  Email Verification Required
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  To complete your registration and access your dashboard, please:
                </p>
                <ol className="text-gray-300 text-sm mt-3 space-y-1 text-left">
                  <li>1. Check your email inbox for a verification message</li>
                  <li>2. Click the verification link in the email</li>
                  <li>3. Return here and log in to access your account</li>
                </ol>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-xs text-left">
                    <p className="font-medium mb-1">Important:</p>
                    <p>• Check your spam/junk folder if you don't see the email</p>
                    <p>• The verification link expires in 24 hours</p>
                    <p>• You cannot access your dashboard until email is verified</p>
                  </div>
                </div>
              </div>

              {selectedPlan && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    <strong>Selected Plan:</strong> {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    After verification, you can upgrade to this plan from your dashboard
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all block text-center"
                >
                  Go to Login Page
                </Link>
                
                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all border border-white/20"
                >
                  Register Different Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-white">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {t('auth.register.subtitle')}
          </p>
          {selectedPlan && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                Selected: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
              </span>
            </div>
          )}
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
                {t('auth.orCreateWith')}
              </span>
            </div>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.email')} *
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
                {t('auth.password')} *
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.confirmPassword')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder={t('auth.confirmPassword')}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-400 text-xs font-medium mb-2">Password Requirements:</p>
              <ul className="text-gray-300 text-xs space-y-1">
                <li className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-green-400' : ''}`}>
                  <CheckCircle className={`h-3 w-3 ${password.length >= 6 ? 'text-green-400' : 'text-gray-400'}`} />
                  <span>At least 6 characters</span>
                </li>
                <li className={`flex items-center space-x-2 ${password === confirmPassword && password ? 'text-green-400' : ''}`}>
                  <CheckCircle className={`h-3 w-3 ${password === confirmPassword && password ? 'text-green-400' : 'text-gray-400'}`} />
                  <span>Passwords match</span>
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? t('common.loading') : t('auth.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                {t('auth.signInHere')}
              </Link>
            </p>
          </div>

          {/* Email Verification Notice */}
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Mail className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-300 text-xs">
                <p className="font-medium mb-1">Email Verification Required</p>
                <p>After registration, you'll need to verify your email address before accessing your dashboard. Check your inbox for the verification link.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;