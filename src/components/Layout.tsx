import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const { isRTL } = useTranslation();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;