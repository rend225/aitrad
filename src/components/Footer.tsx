import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Shield,
  FileText,
  Cookie,
  AlertTriangle,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleContactEmail = () => {
    window.location.href = 'mailto:support@aitrader.com?subject=Contact from AI Trader Website';
  };

  const handleContactPhone = () => {
    window.location.href = 'tel:+15551234567';
  };

  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Trader</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Professional AI-powered trading signals platform trusted by thousands of traders worldwide. Get intelligent market analysis and trading recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/signals" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Trading Signals
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Signal History
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <Cookie className="h-4 w-4" />
                  <span>Cookie Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Risk Disclaimer</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handleContactEmail}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>support@aitrader.com</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleContactPhone}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </button>
              </li>
              <li className="flex items-start space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                <span>123 Trading Street<br />Financial District<br />New York, NY 10001</span>
              </li>
              <li>
                <button
                  onClick={() => alert('Live chat feature coming soon!')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <span>Live Chat Support</span>
                </button>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2 text-sm">Business Hours</h4>
              <p className="text-gray-300 text-xs">
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Weekend: Limited support available
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 AI Trader. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
              <span>🔒 SSL Secured</span>
              <span>⚡ 99.9% Uptime</span>
              <span>🌍 Global Service</span>
              <span>📱 Mobile Ready</span>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs leading-relaxed">
              <strong>Risk Warning:</strong> Trading involves substantial risk of loss and is not suitable for all investors. 
              Past performance is not indicative of future results. AI-generated signals are for educational purposes only 
              and should not be considered as financial advice. Please read our full 
              <Link to="/disclaimer" className="underline hover:text-red-300 ml-1">Risk Disclaimer</Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;