import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Search, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  ExternalLink, 
  Copy, 
  Check,
  BookOpen,
  BarChart3,
  Zap,
  Shield,
  Target,
  TrendingUp,
  FileText,
  Code,
  Smartphone,
  Clock,
  Link as LinkIcon,
  RefreshCw,
  Download,
  Eye,
  Settings,
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SEOSettings {
  googleVerification?: string;
  bingVerification?: string;
  yandexVerification?: string;
  googleAnalyticsId?: string;
  lastUpdated?: any;
}

const SEOManager: React.FC = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['seo-basics']));

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      setLoading(true);
      const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
      if (seoDoc.exists()) {
        setSeoSettings(seoDoc.data() as SEOSettings);
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      setError('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSEOSettings = async () => {
    try {
      setSaving(true);
      setError('');
      
      await setDoc(doc(db, 'settings', 'seo'), {
        ...seoSettings,
        lastUpdated: serverTimestamp()
      });
      
      setSuccess('SEO settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setError('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aitrader.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aitrader.com/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://aitrader.com/plans</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://aitrader.com/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://aitrader.com/register</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://aitrader.com/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://aitrader.com/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://aitrader.com/disclaimer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateRobotsTxt = () => {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://aitrader.com/sitemap.xml

# Disallow admin and private areas
Disallow: /admin
Disallow: /dashboard
Disallow: /settings
Disallow: /api/

# Allow important pages
Allow: /
Allow: /about
Allow: /plans
Allow: /login
Allow: /register
Allow: /privacy
Allow: /terms
Allow: /disclaimer

# Crawl delay (optional)
Crawl-delay: 1`;

    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const seoSections = [
    {
      id: 'seo-basics',
      title: 'SEO Fundamentals',
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-blue-400 font-semibold mb-3">What is SEO?</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Search Engine Optimization (SEO) is the practice of improving your website's visibility in search engine results. 
              For AI Trader, good SEO means more potential traders will discover our platform when searching for trading signals, 
              AI trading tools, or forex analysis.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Why SEO Matters</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Increases organic traffic</li>
                  <li>• Builds brand credibility</li>
                  <li>• Cost-effective marketing</li>
                  <li>• Long-term growth</li>
                </ul>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Key Benefits</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Higher search rankings</li>
                  <li>• More qualified leads</li>
                  <li>• Better user experience</li>
                  <li>• Competitive advantage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'keywords',
      title: 'Keyword Strategy',
      icon: <Target className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold mb-3">Recommended Keywords for AI Trader</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Primary Keywords</h4>
                <div className="space-y-2">
                  {[
                    'AI trading signals',
                    'Automated trading platform',
                    'Forex AI signals',
                    'Trading bot signals',
                    'AI market analysis'
                  ].map((keyword, index) => (
                    <div key={index} className="bg-black/20 rounded px-3 py-2 text-sm text-gray-300">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Long-tail Keywords</h4>
                <div className="space-y-2">
                  {[
                    'Best AI trading signals 2025',
                    'Automated forex trading platform',
                    'AI-powered trading recommendations',
                    'Machine learning trading signals',
                    'Professional trading AI software'
                  ].map((keyword, index) => (
                    <div key={index} className="bg-black/20 rounded px-3 py-2 text-sm text-gray-300">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-yellow-400 font-medium mb-2">Keyword Research Tips</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use Google Keyword Planner for search volume data</li>
                <li>• Analyze competitor keywords with tools like SEMrush</li>
                <li>• Focus on keywords with commercial intent</li>
                <li>• Include location-based keywords if targeting specific regions</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'on-page',
      title: 'On-Page SEO',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-purple-400 font-semibold mb-3">On-Page Optimization Checklist</h3>
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Title Tags</span>
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Each page should have a unique, descriptive title under 60 characters.
                </p>
                <div className="bg-gray-800 rounded p-3 text-sm font-mono text-green-400">
                  &lt;title&gt;AI Trading Signals - Automated Forex & Crypto Analysis | AI Trader&lt;/title&gt;
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Meta Descriptions</span>
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Compelling descriptions under 160 characters that encourage clicks.
                </p>
                <div className="bg-gray-800 rounded p-3 text-sm font-mono text-green-400">
                  &lt;meta name="description" content="Get intelligent trading recommendations powered by advanced AI analysis. Make smarter trading decisions with our cutting-edge signal generation platform."&gt;
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Header Structure</span>
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Use H1, H2, H3 tags properly to create content hierarchy.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded p-2 text-sm font-mono text-blue-400">H1: AI-Powered Trading Signals</div>
                  <div className="bg-gray-800 rounded p-2 text-sm font-mono text-blue-400 ml-4">H2: How Our AI Works</div>
                  <div className="bg-gray-800 rounded p-2 text-sm font-mono text-blue-400 ml-8">H3: Technical Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'paypal-compliance',
      title: 'PayPal Policy Compliance',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-3">Required Disclaimers for PayPal Compliance</h3>
            <p className="text-gray-300 text-sm mb-4">
              To comply with PayPal's policies for financial services, your website must include clear disclaimers 
              about trading risks and educational purposes.
            </p>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Risk Disclaimer (Required on all pages)</h4>
                <div className="bg-gray-800 rounded p-3 text-sm text-gray-300">
                  "Trading involves substantial risk of loss and is not suitable for all investors. 
                  This platform is for educational purposes only and does not guarantee profits. 
                  Past performance is not indicative of future results."
                </div>
                <button
                  onClick={() => copyToClipboard(
                    "Trading involves substantial risk of loss and is not suitable for all investors. This platform is for educational purposes only and does not guarantee profits. Past performance is not indicative of future results.",
                    'risk-disclaimer'
                  )}
                  className="mt-2 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  {copiedCode === 'risk-disclaimer' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode === 'risk-disclaimer' ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Educational Purpose Statement</h4>
                <div className="bg-gray-800 rounded p-3 text-sm text-gray-300">
                  "All trading signals and analysis provided by AI Trader are for educational and informational 
                  purposes only. We are not licensed financial advisors and do not provide investment advice. 
                  Users should conduct their own research and consult with qualified professionals before making trading decisions."
                </div>
                <button
                  onClick={() => copyToClipboard(
                    "All trading signals and analysis provided by AI Trader are for educational and informational purposes only. We are not licensed financial advisors and do not provide investment advice. Users should conduct their own research and consult with qualified professionals before making trading decisions.",
                    'educational-disclaimer'
                  )}
                  className="mt-2 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  {copiedCode === 'educational-disclaimer' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode === 'educational-disclaimer' ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">No Guarantee Statement</h4>
                <div className="bg-gray-800 rounded p-3 text-sm text-gray-300">
                  "AI Trader makes no representations or warranties about the accuracy or completeness of trading signals. 
                  We do not guarantee any specific results or profits. All trading decisions are made at your own risk."
                </div>
                <button
                  onClick={() => copyToClipboard(
                    "AI Trader makes no representations or warranties about the accuracy or completeness of trading signals. We do not guarantee any specific results or profits. All trading decisions are made at your own risk.",
                    'no-guarantee'
                  )}
                  className="mt-2 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  {copiedCode === 'no-guarantee' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode === 'no-guarantee' ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-yellow-400 font-medium mb-2">Implementation Notes</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Add disclaimers to footer of all pages</li>
                <li>• Include prominent risk warning on signup/payment pages</li>
                <li>• Create dedicated disclaimer page with comprehensive terms</li>
                <li>• Ensure disclaimers are visible and not hidden</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical-seo',
      title: 'Technical SEO',
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-blue-400 font-semibold mb-3">Technical SEO Implementation</h3>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Sitemap.xml</h4>
                <p className="text-gray-300 text-sm mb-3">
                  A sitemap helps search engines discover and index your pages.
                </p>
                <button
                  onClick={generateSitemap}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Sitemap.xml</span>
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Robots.txt</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Controls which pages search engines can crawl.
                </p>
                <button
                  onClick={generateRobotsTxt}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Robots.txt</span>
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Site Speed Optimization</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Optimize images (WebP format, lazy loading)</li>
                  <li>• Minimize CSS and JavaScript</li>
                  <li>• Use CDN for static assets</li>
                  <li>• Enable gzip compression</li>
                  <li>• Implement browser caching</li>
                </ul>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Mobile Responsiveness</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use responsive design principles</li>
                  <li>• Test on multiple device sizes</li>
                  <li>• Ensure touch-friendly interface</li>
                  <li>• Optimize for mobile page speed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'content-strategy',
      title: 'Content Strategy',
      icon: <TrendingUp className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold mb-3">Content Optimization Strategy</h3>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Internal Linking</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Link related pages to help users navigate and improve SEO.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Link from homepage to key pages (About, Plans, Features)</li>
                  <li>• Add contextual links within content</li>
                  <li>• Use descriptive anchor text</li>
                  <li>• Create topic clusters around main themes</li>
                </ul>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Content Updates</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Regular content updates signal freshness to search engines.
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Update trading performance statistics</li>
                  <li>• Add new featured signals regularly</li>
                  <li>• Publish trading education content</li>
                  <li>• Update market analysis and insights</li>
                </ul>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Content Ideas for AI Trader</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• "How AI Trading Signals Work"</li>
                  <li>• "Best Practices for Forex Trading"</li>
                  <li>• "Understanding Technical Analysis"</li>
                  <li>• "Risk Management in Trading"</li>
                  <li>• "AI vs Human Trading Analysis"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const tabs = [
    { id: 'overview', label: 'SEO Guide', icon: BookOpen },
    { id: 'verification', label: 'Search Console', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'SEO Tools', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl flex items-center space-x-3">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
        <div className="flex flex-wrap border-b border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeSection === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Comprehensive SEO Guide</h2>
                <p className="text-gray-300">
                  Everything you need to optimize AI Trader for search engines and improve visibility
                </p>
              </div>

              {/* SEO Sections */}
              <div className="space-y-4">
                {seoSections.map((section) => (
                  <div key={section.id} className="bg-white/5 rounded-lg border border-white/10">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-400">
                          {section.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has(section.id) && (
                      <div className="px-4 pb-4">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'verification' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Search Engine Verification</h3>
              
              <div className="grid gap-6">
                {/* Google Search Console */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">Google Search Console</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Google Verification Code
                      </label>
                      <input
                        type="text"
                        value={seoSettings.googleVerification || ''}
                        onChange={(e) => setSeoSettings({...seoSettings, googleVerification: e.target.value})}
                        placeholder="Enter Google verification meta tag content"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        Get this from Google Search Console → Settings → Ownership verification
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h5 className="text-blue-400 font-medium mb-2">Setup Instructions:</h5>
                      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Search Console</a></li>
                        <li>Click "Add Property" and enter your domain</li>
                        <li>Choose "HTML tag" verification method</li>
                        <li>Copy the content value from the meta tag</li>
                        <li>Paste it in the field above and save</li>
                        <li>Return to Google Search Console and click "Verify"</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Bing Webmaster Tools */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="h-6 w-6 text-orange-400" />
                    <h4 className="text-lg font-semibold text-white">Bing Webmaster Tools</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bing Verification Code
                      </label>
                      <input
                        type="text"
                        value={seoSettings.bingVerification || ''}
                        onChange={(e) => setSeoSettings({...seoSettings, bingVerification: e.target.value})}
                        placeholder="Enter Bing verification meta tag content"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h5 className="text-orange-400 font-medium mb-2">Setup Instructions:</h5>
                      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">Bing Webmaster Tools</a></li>
                        <li>Sign in with Microsoft account</li>
                        <li>Click "Add a site" and enter your URL</li>
                        <li>Choose "Add a meta tag" verification</li>
                        <li>Copy the content value from the meta tag</li>
                        <li>Paste it above and save</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Yandex Webmaster */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="h-6 w-6 text-red-400" />
                    <h4 className="text-lg font-semibold text-white">Yandex Webmaster</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Yandex Verification Code
                      </label>
                      <input
                        type="text"
                        value={seoSettings.yandexVerification || ''}
                        onChange={(e) => setSeoSettings({...seoSettings, yandexVerification: e.target.value})}
                        placeholder="Enter Yandex verification meta tag content"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h5 className="text-red-400 font-medium mb-2">Setup Instructions:</h5>
                      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://webmaster.yandex.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">Yandex Webmaster</a></li>
                        <li>Sign in with Yandex account</li>
                        <li>Add your site URL</li>
                        <li>Choose "Meta tag" verification method</li>
                        <li>Copy the verification code</li>
                        <li>Paste it above and save</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={saveSEOSettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Verification Codes</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Google Analytics Integration</h3>
              
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                  <h4 className="text-lg font-semibold text-white">Google Analytics 4</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Google Analytics Measurement ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.googleAnalyticsId || ''}
                      onChange={(e) => setSeoSettings({...seoSettings, googleAnalyticsId: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Format: G-XXXXXXXXXX (Google Analytics 4 property)
                    </p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h5 className="text-green-400 font-medium mb-2">Setup Instructions:</h5>
                    <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                      <li>Go to <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">Google Analytics</a></li>
                      <li>Click "Admin" in the bottom left</li>
                      <li>Create a new property if needed</li>
                      <li>Go to "Data Streams" → "Web"</li>
                      <li>Add your website URL</li>
                      <li>Copy the Measurement ID (G-XXXXXXXXXX)</li>
                      <li>Paste it above and save</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h5 className="text-blue-400 font-medium mb-2">Implementation:</h5>
                    <p className="text-gray-300 text-sm mb-3">
                      The Google Analytics tracking code is automatically added to all pages when you save the Measurement ID.
                      Our SEOHead component handles the integration.
                    </p>
                    <div className="bg-gray-800 rounded p-3 text-sm font-mono text-green-400">
                      {`<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={saveSEOSettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Analytics Settings</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeSection === 'tools' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">SEO Tools & Resources</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-white">Performance Testing</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href="https://pagespeed.web.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Google PageSpeed Insights</p>
                          <p className="text-gray-400 text-xs">Performance, accessibility, SEO scores</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://search.google.com/test/mobile-friendly" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Mobile-Friendly Test</p>
                          <p className="text-gray-400 text-xs">Test mobile responsiveness</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.webpagetest.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">WebPageTest</p>
                          <p className="text-gray-400 text-xs">Detailed performance analysis</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <LinkIcon className="h-6 w-6 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">SEO Analysis Tools</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href="https://ahrefs.com/website-checker" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="h-5 w-5 text-orange-400" />
                        <div>
                          <p className="text-white font-medium">Ahrefs Website Checker</p>
                          <p className="text-gray-400 text-xs">Backlink and keyword analysis</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://moz.com/free-seo-tools" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Moz Free SEO Tools</p>
                          <p className="text-gray-400 text-xs">Domain authority and link explorer</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://search.google.com/search-console" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Google Search Console</p>
                          <p className="text-gray-400 text-xs">Performance monitoring and indexing</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="h-6 w-6 text-purple-400" />
                  <h4 className="text-lg font-semibold text-white">Official Documentation</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href="https://developers.google.com/search/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <p className="text-white font-medium">Google Search Central</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  
                  <a 
                    href="https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-orange-400" />
                      <p className="text-white font-medium">Bing Webmaster Guidelines</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  
                  <a 
                    href="https://yandex.com/support/webmaster/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-red-400" />
                      <p className="text-white font-medium">Yandex Webmaster Help</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  
                  <a 
                    href="https://support.google.com/analytics/answer/9304153" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-400" />
                      <p className="text-white font-medium">Google Analytics 4 Guide</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOManager;