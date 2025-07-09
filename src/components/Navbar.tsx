import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { logoutUser } from '../services/auth';
import { TrendingUp, User, Settings, LogOut, Shield, BarChart3, Menu, X, DollarSign, Info } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Trader</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Public Navigation Links */}
            <Link
              to="/plans"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-1"
            >
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </Link>
            
            <Link
              to="/about"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-1"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/signals"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{t('nav.signals')}</span>
                </Link>
                <Link
                  to="/history"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {t('nav.history')}
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-1"
                  >
                    <Shield className="h-4 w-4" />
                    <span>{t('nav.admin')}</span>
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email}
                      className="h-8 w-8 rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <Link
                    to="/settings"
                    className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    title={t('nav.settings')}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    title={t('nav.logout')}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
            
            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="space-y-2">
              {/* Public Links */}
              <Link
                to="/plans"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              
              <Link
                to="/about"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>

              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 border-b border-white/10 mb-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className="h-10 w-10 rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium text-sm">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-gray-400 text-xs capitalize">{user.plan} Plan</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/signals"
                    className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.signals')}
                  </Link>
                  <Link
                    to="/history"
                    className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.history')}
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.settings')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors mx-3"
                    onClick={closeMobileMenu}
                  >
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;