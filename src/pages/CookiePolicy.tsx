import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cookie, Settings, BarChart3, Shield, Eye, Mail } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6">
            <Cookie className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-300">
            Learn about how we use cookies and similar technologies to enhance your experience.
          </p>
          <p className="text-gray-400 mt-2">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            {/* What Are Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Cookie className="h-6 w-6 text-orange-400" />
                <span>What Are Cookies?</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our service.
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Types of Technologies We Use</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• <strong>Cookies:</strong> Small text files stored on your device</li>
                  <li>• <strong>Local Storage:</strong> Data stored in your browser</li>
                  <li>• <strong>Session Storage:</strong> Temporary data for your current session</li>
                  <li>• <strong>Web Beacons:</strong> Small images that track user behavior</li>
                </ul>
              </div>
            </section>

            {/* Types of Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Essential Cookies</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Required for the website to function properly. Cannot be disabled.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Authentication and security</li>
                    <li>• Session management</li>
                    <li>• Load balancing</li>
                    <li>• CSRF protection</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Analytics Cookies</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Help us understand how visitors interact with our website.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Page views and traffic analysis</li>
                    <li>• User behavior patterns</li>
                    <li>• Performance monitoring</li>
                    <li>• Error tracking</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Settings className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Functional Cookies</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Enable enhanced functionality and personalization.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Language preferences</li>
                    <li>• Theme settings</li>
                    <li>• Trading preferences</li>
                    <li>• Dashboard customization</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Marketing Cookies</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Used to deliver relevant advertisements and track campaigns.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Targeted advertising</li>
                    <li>• Campaign effectiveness</li>
                    <li>• Social media integration</li>
                    <li>• Conversion tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p className="text-gray-300 mb-6">
                We use several third-party services that may set their own cookies:
              </p>
              
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Google Analytics</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Helps us analyze website traffic and user behavior to improve our service.
                  </p>
                  <p className="text-blue-400 text-sm">
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                      Google Privacy Policy
                    </a>
                  </p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">PayPal</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Processes payments and may set cookies for fraud prevention and security.
                  </p>
                  <p className="text-blue-400 text-sm">
                    <a href="https://www.paypal.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                      PayPal Privacy Policy
                    </a>
                  </p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Firebase (Google)</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Provides authentication, database, and hosting services.
                  </p>
                  <p className="text-blue-400 text-sm">
                    <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                      Firebase Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-400" />
                <span>Managing Your Cookie Preferences</span>
              </h2>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Browser Settings</h3>
                <p className="text-gray-300 text-sm mb-3">
                  You can control cookies through your browser settings. Here's how:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Chrome</h4>
                    <p className="text-gray-300">Settings → Privacy and Security → Cookies</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Firefox</h4>
                    <p className="text-gray-300">Options → Privacy & Security → Cookies</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Safari</h4>
                    <p className="text-gray-300">Preferences → Privacy → Cookies</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Edge</h4>
                    <p className="text-gray-300">Settings → Privacy → Cookies</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Important Note</h3>
                <p className="text-gray-300 text-sm">
                  Disabling certain cookies may affect the functionality of our website. Essential cookies cannot be disabled as they are necessary for the website to function properly.
                </p>
              </div>
            </section>

            {/* Cookie Consent */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookie Consent</h2>
              <p className="text-gray-300 mb-4">
                When you first visit our website, we'll ask for your consent to use non-essential cookies. You can:
              </p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Accept all cookies for the full experience</li>
                <li>• Customize your preferences by cookie type</li>
                <li>• Reject non-essential cookies (some features may be limited)</li>
                <li>• Change your preferences at any time</li>
              </ul>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Your Rights</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Right to be informed about cookie usage</li>
                  <li>• Right to give or withdraw consent</li>
                  <li>• Right to access information about cookies</li>
                  <li>• Right to object to certain cookie types</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookie Retention Periods</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white font-semibold py-3">Cookie Type</th>
                      <th className="text-left text-white font-semibold py-3">Retention Period</th>
                      <th className="text-left text-white font-semibold py-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/10">
                      <td className="py-3">Session Cookies</td>
                      <td className="py-3">Until browser closes</td>
                      <td className="py-3">Authentication, security</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3">Persistent Cookies</td>
                      <td className="py-3">1-24 months</td>
                      <td className="py-3">Preferences, analytics</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3">Analytics Cookies</td>
                      <td className="py-3">2 years</td>
                      <td className="py-3">Usage analysis</td>
                    </tr>
                    <tr>
                      <td className="py-3">Marketing Cookies</td>
                      <td className="py-3">30-90 days</td>
                      <td className="py-3">Advertising, campaigns</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Mail className="h-6 w-6 text-blue-400" />
                <span>Contact Us</span>
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-white">Email:</strong> cookies@aitrader.com</p>
                  <p><strong className="text-white">Address:</strong> AI Trader Cookie Team, 123 Trading Street, Financial District, NY 10001</p>
                  <p><strong className="text-white">Privacy Officer:</strong> privacy@aitrader.com</p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/" className="hover:text-white transition-colors">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;