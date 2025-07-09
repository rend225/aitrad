import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LiveChat from './components/LiveChat';
import SEOHead from './components/SEOHead';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import About from './pages/About';

// Legal pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';

// Protected pages
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import SignalHistory from './pages/SignalHistory';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

// Setup pages
import FirestoreSetup from './components/FirestoreSetup';
import AdminMaker from './components/AdminMaker';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <SEOHead />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="plans" element={<Plans />} />
            <Route path="about" element={<About />} />
            <Route path="setup" element={<FirestoreSetup />} />
            <Route path="make-admin" element={<AdminMaker />} />
            
            {/* Legal pages */}
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="cookies" element={<CookiePolicy />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            
            {/* Protected routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="signals"
              element={
                <ProtectedRoute>
                  <SignalHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        
        {/* Live Chat Component - Available on all pages */}
        <LiveChat />
      </Router>
    </LanguageProvider>
  );
}

export default App;