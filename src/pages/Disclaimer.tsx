import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, TrendingDown, Shield, BarChart3, DollarSign, Mail } from 'lucide-react';

const Disclaimer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-6">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Risk Disclaimer</h1>
          <p className="text-xl text-gray-300">
            Important information about trading risks and our service limitations.
          </p>
          <p className="text-gray-400 mt-2">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            {/* Main Risk Warning */}
            <section className="mb-8">
              <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8" />
                  <span>HIGH RISK WARNING</span>
                </h2>
                <div className="space-y-4 text-gray-200">
                  <p className="text-lg font-semibold">
                    TRADING FINANCIAL INSTRUMENTS INVOLVES SUBSTANTIAL RISK OF LOSS AND IS NOT SUITABLE FOR ALL INVESTORS.
                  </p>
                  <p>
                    You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources, and other relevant circumstances. You could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.
                  </p>
                  <p className="font-semibold text-red-300">
                    Past performance is not indicative of future results. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Nature */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span>Nature of Our Service</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">What We Provide</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• AI-generated market analysis</li>
                    <li>• Educational trading signals</li>
                    <li>• Technical analysis tools</li>
                    <li>• Market data interpretation</li>
                    <li>• Trading methodology education</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">What We Do NOT Provide</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Investment advice</li>
                    <li>• Financial planning services</li>
                    <li>• Portfolio management</li>
                    <li>• Guaranteed returns</li>
                    <li>• Regulated financial advice</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI Limitations */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">AI Technology Limitations</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Important AI Disclaimers</h3>
                <ul className="text-gray-300 space-y-3 text-sm">
                  <li>
                    <strong className="text-white">No Guarantee of Accuracy:</strong> AI-generated signals are based on historical data and algorithms. Market conditions can change rapidly, making predictions unreliable.
                  </li>
                  <li>
                    <strong className="text-white">Technology Limitations:</strong> AI systems can malfunction, produce errors, or fail to account for unprecedented market events.
                  </li>
                  <li>
                    <strong className="text-white">Data Dependencies:</strong> Our AI relies on third-party market data, which may be delayed, inaccurate, or incomplete.
                  </li>
                  <li>
                    <strong className="text-white">No Human Oversight:</strong> Signals are generated automatically without human verification or approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* Market Risks */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingDown className="h-6 w-6 text-red-400" />
                <span>Market Risks</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Volatility Risk</h3>
                  <p className="text-gray-300 text-sm">
                    Financial markets can be extremely volatile. Prices can move rapidly against your position, resulting in significant losses that may exceed your initial investment.
                  </p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Liquidity Risk</h3>
                  <p className="text-gray-300 text-sm">
                    Some markets may have limited liquidity, making it difficult to execute trades at desired prices or exit positions quickly.
                  </p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Leverage Risk</h3>
                  <p className="text-gray-300 text-sm">
                    If you use leverage or margin trading, small market movements can result in large losses. You may lose more than your initial deposit.
                  </p>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Currency Risk</h3>
                  <p className="text-gray-300 text-sm">
                    Trading in foreign currencies involves exchange rate risk. Currency fluctuations can affect the value of your investments.
                  </p>
                </div>
              </div>
            </section>

            {/* No Financial Advice */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span>Not Financial Advice</span>
              </h2>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <div className="space-y-4 text-gray-300">
                  <p className="font-semibold text-purple-300">
                    AI Trader is NOT a licensed financial advisor, investment advisor, or broker-dealer.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Our signals are for educational and informational purposes only</li>
                    <li>• We do not provide personalized investment advice</li>
                    <li>• All trading decisions are your sole responsibility</li>
                    <li>• You should consult with qualified financial professionals</li>
                    <li>• Consider your financial situation before trading</li>
                  </ul>
                  <p className="text-sm font-semibold text-purple-300">
                    Always conduct your own research and due diligence before making any trading decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* Performance Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                <span>Performance Disclaimers</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">No Guarantee of Profits</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• We make no representations about potential profits or losses</li>
                    <li>• Past performance does not guarantee future results</li>
                    <li>• Hypothetical performance results have inherent limitations</li>
                    <li>• Actual trading may differ significantly from backtested results</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Hypothetical Results</h3>
                  <p className="text-gray-300 text-sm">
                    Any hypothetical performance results shown are for illustrative purposes only and do not represent actual trading results. Hypothetical results do not account for slippage, commissions, or other real-world trading costs.
                  </p>
                </div>
              </div>
            </section>

            {/* Regulatory Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Regulatory Information</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>
                    <strong className="text-white">Jurisdiction:</strong> AI Trader operates under the laws of [Jurisdiction] and is not regulated by financial authorities as an investment advisor.
                  </p>
                  <p>
                    <strong className="text-white">Compliance:</strong> Users are responsible for ensuring compliance with their local laws and regulations regarding trading and investment activities.
                  </p>
                  <p>
                    <strong className="text-white">Tax Implications:</strong> Trading may have tax consequences. Consult with a tax professional regarding your specific situation.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Before Trading</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Assess your risk tolerance</li>
                    <li>• Understand the markets you're trading</li>
                    <li>• Only invest money you can afford to lose</li>
                    <li>• Seek professional advice if needed</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">While Trading</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Monitor your positions actively</li>
                    <li>• Use appropriate risk management</li>
                    <li>• Don't rely solely on our signals</li>
                    <li>• Keep detailed trading records</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                <p className="text-red-400 font-semibold mb-3">IMPORTANT LEGAL NOTICE</p>
                <div className="text-gray-300 space-y-3 text-sm">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI TRADER AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Trading losses or missed opportunities</li>
                    <li>• Damages arising from use of our signals</li>
                    <li>• Technical failures or service interruptions</li>
                    <li>• Inaccurate or delayed market data</li>
                    <li>• Third-party actions or omissions</li>
                  </ul>
                  <p className="font-semibold">
                    You acknowledge that you use our service at your own risk and that we are not responsible for your trading decisions or their outcomes.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Mail className="h-6 w-6 text-blue-400" />
                <span>Questions or Concerns</span>
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions about these disclaimers or our service, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-white">Email:</strong> support@aitrader.com</p>
                  <p><strong className="text-white">Risk Disclosure:</strong> risk@aitrader.com</p>
                  <p><strong className="text-white">Address:</strong> AI Trader Risk Management, 123 Trading Street, Financial District, NY 10001</p>
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
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="/" className="hover:text-white transition-colors">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;