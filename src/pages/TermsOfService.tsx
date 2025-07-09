import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, AlertTriangle, Shield, Scale, Users, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300">
            Please read these terms carefully before using our AI trading platform.
          </p>
          <p className="text-gray-400 mt-2">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            {/* Acceptance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Scale className="h-6 w-6 text-blue-400" />
                <span>Acceptance of Terms</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using AI Trader ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Service Description</h2>
              <p className="text-gray-300 mb-4">
                AI Trader provides AI-powered trading signal recommendations and analysis tools. Our service includes:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• AI-generated trading signals and market analysis</li>
                <li>• Multiple trading school methodologies</li>
                <li>• Real-time market data integration</li>
                <li>• Historical performance tracking</li>
                <li>• Educational content and resources</li>
              </ul>
            </section>

            {/* Important Disclaimer */}
            <section className="mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Trading Risk Disclaimer</span>
                </h2>
                <div className="space-y-3 text-gray-300">
                  <p className="font-semibold text-red-300">
                    TRADING INVOLVES SUBSTANTIAL RISK OF LOSS AND IS NOT SUITABLE FOR ALL INVESTORS.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Past performance is not indicative of future results</li>
                    <li>• AI-generated signals are for informational purposes only</li>
                    <li>• You should never invest money you cannot afford to lose</li>
                    <li>• Always conduct your own research before making trading decisions</li>
                    <li>• Consider seeking advice from qualified financial professionals</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-400" />
                <span>User Responsibilities</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Account Security</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Maintain confidentiality of login credentials</li>
                    <li>• Notify us immediately of unauthorized access</li>
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication when available</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Acceptable Use</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Use the service for lawful purposes only</li>
                    <li>• Do not share or resell our signals</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Do not attempt to reverse engineer our AI</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Prohibited Activities</h2>
              <p className="text-gray-300 mb-4">You agree not to:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Use the service for any illegal or unauthorized purpose</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Distribute malware or engage in harmful activities</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Impersonate others or provide false information</li>
                <li>• Interfere with the proper functioning of the service</li>
                <li>• Copy, modify, or distribute our proprietary content</li>
              </ul>
            </section>

            {/* Subscription Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Subscription and Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">Billing</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Subscriptions are billed monthly in advance</li>
                <li>• Prices are subject to change with 30 days notice</li>
                <li>• All fees are non-refundable unless otherwise stated</li>
                <li>• Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Cancellation</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• You may cancel your subscription at any time</li>
                <li>• Cancellation takes effect at the end of the current billing period</li>
                <li>• No refunds for partial months of service</li>
                <li>• Access continues until the end of the paid period</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All content, features, and functionality of AI Trader, including but not limited to:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• AI algorithms and trading models</li>
                <li>• Software code and architecture</li>
                <li>• Trading signals and analysis</li>
                <li>• Text, graphics, and user interface</li>
                <li>• Trademarks and branding</li>
              </ul>
              <p className="text-gray-300">
                Are owned by AI Trader and protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <p className="text-yellow-400 font-semibold mb-3">IMPORTANT LEGAL NOTICE</p>
                <div className="text-gray-300 space-y-3 text-sm">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI TRADER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Trading losses or missed opportunities</li>
                    <li>• Loss of profits or revenue</li>
                    <li>• Data loss or corruption</li>
                    <li>• Business interruption</li>
                    <li>• Personal injury or property damage</li>
                  </ul>
                  <p>
                    Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
              <p className="text-gray-300 mb-4">
                While we strive to provide reliable service, we do not guarantee:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Uninterrupted or error-free operation</li>
                <li>• Compatibility with all devices or browsers</li>
                <li>• Availability of specific features at all times</li>
                <li>• Accuracy of third-party market data</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We reserve the right to modify, suspend, or discontinue the service with reasonable notice.
              </p>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span>Privacy and Data Protection</span>
              </h2>
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>Learn More:</strong> Please review our <a href="/privacy" className="underline hover:text-blue-300">Privacy Policy</a> for detailed information about how we handle your data.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Violation of these Terms of Service</li>
                <li>• Fraudulent or illegal activity</li>
                <li>• Non-payment of fees</li>
                <li>• Abuse of the service or other users</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Upon termination, your right to use the service will cease immediately, and we may delete your account and data.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law and Disputes</h2>
              <p className="text-gray-300 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-300">
                Any disputes arising from these Terms or your use of the service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by email or through the service. Your continued use of the service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Mail className="h-6 w-6 text-blue-400" />
                <span>Contact Information</span>
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-white">Email:</strong> legal@aitrader.com</p>
                  <p><strong className="text-white">Address:</strong> AI Trader Legal Department, 123 Trading Street, Financial District, NY 10001</p>
                  <p><strong className="text-white">Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/" className="hover:text-white transition-colors">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;