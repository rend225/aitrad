import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-gray-400 mt-2">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Eye className="h-6 w-6 text-blue-400" />
                <span>Introduction</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">
                AI Trader ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered trading signals platform and related services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Database className="h-6 w-6 text-green-400" />
                <span>Information We Collect</span>
              </h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Email address and account credentials</li>
                <li>• Name and profile information</li>
                <li>• Payment and billing information</li>
                <li>• Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Trading signal requests and preferences</li>
                <li>• Platform usage patterns and analytics</li>
                <li>• Device information and IP addresses</li>
                <li>• Browser type and operating system</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Trading Data</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Signal generation history</li>
                <li>• Trading preferences and settings</li>
                <li>• Performance metrics and analytics</li>
                <li>• Market data interactions</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Lock className="h-6 w-6 text-purple-400" />
                <span>How We Use Your Information</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Service Provision</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Generate AI trading signals</li>
                    <li>• Manage your account and subscriptions</li>
                    <li>• Process payments and billing</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Improvement & Analytics</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Improve AI algorithms and accuracy</li>
                    <li>• Analyze platform performance</li>
                    <li>• Develop new features</li>
                    <li>• Conduct research and analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Globe className="h-6 w-6 text-yellow-400" />
                <span>Information Sharing</span>
              </h2>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">We Do NOT Sell Your Data</h3>
                <p className="text-gray-300 text-sm">
                  We never sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">Limited Sharing Scenarios</h3>
              <ul className="text-gray-300 space-y-3">
                <li>
                  <strong className="text-white">Service Providers:</strong> Trusted third-party services that help us operate our platform (payment processors, cloud hosting, analytics)
                </li>
                <li>
                  <strong className="text-white">Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety
                </li>
                <li>
                  <strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong className="text-white">Consent:</strong> When you explicitly consent to sharing your information
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-400" />
                <span>Data Security</span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Lock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold mb-1">Encryption</h3>
                  <p className="text-gray-300 text-sm">End-to-end encryption for all data transmission</p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Database className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold mb-1">Secure Storage</h3>
                  <p className="text-gray-300 text-sm">Industry-standard database security</p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 text-center">
                  <Eye className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold mb-1">Access Control</h3>
                  <p className="text-gray-300 text-sm">Strict access controls and monitoring</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Rights</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Access & Control</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Access your personal information</li>
                    <li>• Update or correct your data</li>
                    <li>• Delete your account and data</li>
                    <li>• Export your data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Communication Preferences</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Opt-out of marketing emails</li>
                    <li>• Manage notification settings</li>
                    <li>• Control data sharing preferences</li>
                    <li>• Request data portability</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws, including GDPR and CCPA compliance measures.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Account information: Until account deletion</li>
                <li>• Trading history: 7 years for regulatory compliance</li>
                <li>• Payment records: As required by financial regulations</li>
                <li>• Analytics data: Anonymized after 2 years</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                <p className="text-red-400 font-semibold mb-2">Age Restriction</p>
                <p className="text-gray-300 text-sm">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
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
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-white">Email:</strong> privacy@aitrader.com</p>
                  <p><strong className="text-white">Address:</strong> AI Trader Privacy Team, 123 Trading Street, Financial District, NY 10001</p>
                  <p><strong className="text-white">Data Protection Officer:</strong> dpo@aitrader.com</p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/" className="hover:text-white transition-colors">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;