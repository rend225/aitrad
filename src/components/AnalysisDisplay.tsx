import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Copy, 
  Check, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target,
  BarChart3,
  Clock,
  Percent,
  AlertTriangle,
  Crown,
  Settings,
  ExternalLink,
  MessageSquare,
  FileText,
  Activity,
  Zap,
  DollarSign,
  Shield
} from 'lucide-react'; 

interface AnalysisDisplayProps {
  analysis: string;
  prompt?: string;
  signal?: {
    pair: string;
    type: 'buy' | 'sell' | 'hold';
    entry?: number;
    stopLoss?: number;
    takeProfit1?: number;
    takeProfit2?: number;
    probability?: number;
  };
  school: string;
  timestamp?: Date;
  onSendToTelegram?: (message: string) => Promise<void>;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
  prompt,
  signal,
  school,
  timestamp,
  onSendToTelegram
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [sendingToTelegram, setSendingToTelegram] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'sell': return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'hold': return <Minus className="h-5 w-5 text-yellow-400" />;
      default: return <Target className="h-5 w-5 text-blue-400" />;
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'sell': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'hold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const formatAnalysisForDisplay = (text: string) => {
    // Split analysis into sections for better readability
    const sections = text.split(/\n\n+/);
    
    // Function to check if a section is about ICT Smart Money Logic
    const isICTSection = (text: string) => {
      return /ict|smart money|institutional|order flow/i.test(text);
    };
    
    // Function to check if a section is about Invalidation criteria
    const isInvalidationSection = (text: string) => {
      return /invalidation|no-trade criteria/i.test(text);
    };
    
    // Function to check if a section is about ICT Smart Money Logic
    const isICTSection = (text: string) => {
      return text.toLowerCase().includes('ict smart money') || 
             text.toLowerCase().includes('smart money logic') ||
             text.toLowerCase().includes('institutional order flow');
    };

    // Function to format section titles with custom styling
    const formatSectionTitle = (title: string, content: string) => {
      // Special styling for ICT Smart Money Logic section
      if (isICTSection(title)) {
        return (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 flex items-center space-x-2 border-b border-blue-400/30 pb-3">
              <Zap className="h-6 w-6 md:h-7 md:w-7 text-blue-400" />
              <span>{title.trim().toUpperCase()}</span>
            </h2>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base bg-blue-500/5 p-5 rounded-xl border border-blue-500/20 shadow-inner">
              {content.trim()}
            </div>
          </div>
        );
      }
      
      // Special styling for Invalidation section
      if (title.toLowerCase().includes('invalidation') || title.toLowerCase().includes('no-trade')) {
        return (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4 flex items-center space-x-2 border-b border-red-400/20 pb-3">
              <AlertTriangle className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
              <span>{title.trim().toUpperCase()}</span>
            </h2>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base bg-red-500/5 p-5 rounded-xl border border-red-500/10">
              {content.trim()}
            </div>
          </div>
        );
      }
      
      // Default styling for other sections
      return (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 flex items-center space-x-2 border-b border-blue-400/20 pb-3">
            <BarChart3 className="h-6 w-6 md:h-7 md:w-7 text-blue-400" />
            <span>{title.trim().toUpperCase()}</span>
          </h2>
          <div className="text-gray-200 leading-relaxed text-sm md:text-base">
            {content.trim()}
          </div>
        </div>
      );
    };

    // If there's no text, show a placeholder
    if (!text || text.trim() === '') {
      return (
        <div className="text-gray-400 italic">
          No analysis available. Generate a new signal to see results.
        </div>
      );
    }
    
    return sections.map((section, index) => {
      // Check if section is a header (contains specific keywords)
      const isHeader = /^(SIGNAL SUMMARY|MARKET ANALYSIS|RECOMMENDATION|CONCLUSION|RISK ASSESSMENT|TECHNICAL ANALYSIS|FUNDAMENTAL ANALYSIS|MULTI-TIMEFRAME CONTEXT|EXECUTION TIMEFRAMES|TRADE SETUP|JUSTIFICATION|INVALIDATION|MARKET STRUCTURE|ICT SMART MONEY|SMART MONEY LOGIC):/i.test(section);
      
      if (isHeader) {
        const [title, ...content] = section.split(':');
        
        // Special styling for ICT Smart Money Logic section
        if (isICTSection(title)) {
          return (
            <div key={index} className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 flex items-center space-x-2 border-b border-blue-400/30 pb-3">
                <Zap className="h-6 w-6 md:h-7 md:w-7 text-blue-400" />
                <span>{title.trim()}</span>
              </h2>
              <div className="text-gray-200 leading-relaxed text-sm md:text-base bg-blue-500/5 p-5 rounded-xl border border-blue-500/20">
                {content.join(':').trim()}
              </div>
            </div>
          );
        }
        
        // Special styling for Invalidation section
        if (isInvalidationSection(title)) {
          return (
            <div key={index} className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-4 flex items-center space-x-2 border-b border-red-400/20 pb-3">
                <AlertTriangle className="h-6 w-6 md:h-7 md:w-7 text-red-400" />
                <span>{title.trim()}</span>
              </h2>
              <div className="text-gray-200 leading-relaxed text-sm md:text-base bg-red-500/5 p-5 rounded-xl border border-red-500/10">
                {content.join(':').trim()}
              </div>
            </div>
          );
        }
        
        // Default styling for other sections
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 flex items-center space-x-2 border-b border-blue-400/20 pb-3">
              <BarChart3 className="h-6 w-6 md:h-7 md:w-7 text-blue-400" />
              <span>{title.trim()}</span>
            </h2>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {content.join(':').trim()}
            </div>
          </div>
        );
      }
      
      // Check for sub-headers (numbered sections or bullet points)
      const isSubHeader = /^(\d+\.|•|\-)\s*[A-Z][^.]*:/.test(section.trim());

      if (isSubHeader) {
        const lines = section.split('\n');
        const headerLine = lines[0];
        const contentLines = lines.slice(1);
        
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-3 flex items-center space-x-2">
              <Activity className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              <span>{headerLine.trim()}</span>
            </h3>
            <div className="text-gray-200 leading-relaxed ml-6 text-sm md:text-base bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
              {contentLines.join('\n').trim()}
            </div>
          </div>
        );
      }
      
      // Check for indicator sections
      const isIndicatorSection = /^🎯\s*Indicator Use|^📌\s*Strict Trading Rules|^🔶\s*Definition of a "Strong Zone"|^📊\s*Multi-Timeframe Context|^📈\s*Execution Timeframes|^🎯\s*Trade Setup|^🧠\s*Justification|^⚠\s*Invalidation|^✅\s*Final Output Format/i.test(section.trim());
      
      // Check for ICT Smart Money Logic sections
      const isICTSmartMoneySection = isICTSection(section);
      
      if (isICTSmartMoneySection) {
        return (
          <div key={index} className="mb-6 bg-blue-500/10 p-5 rounded-xl border border-blue-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-blue-500/30 pb-2">
              ICT SMART MONEY LOGIC
            </h3>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim().split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line.trim()}</p>
              ))}
            </div>
          </div>
        );
      }

      // Special styling for Invalidation sections
      const isInvalidationSection = /^⚠\s*Invalidation|No-Trade Criteria/i.test(section.trim());
      
      if (isInvalidationSection) {
        return (
          <div key={index} className="mb-6 bg-red-500/5 p-5 rounded-xl border border-red-500/10 shadow-lg">
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim().split('\n').map((line, i) => {
                // Bold and color the invalidation criteria
                if (line.includes('❌')) {
                  return (
                    <p key={i} className="mb-2 font-bold text-red-400">
                      {line.trim()}
                    </p>
                  );
                }
                return <p key={i} className="mb-2">{line.trim()}</p>;
              })}
            </div>
          </div>
        );
      }
      
      if (isIndicatorSection) {
        return (
          <div key={index} className="mb-6 bg-blue-500/5 p-5 rounded-xl border border-blue-500/10">
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim()}
            </div>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-5 text-gray-300 leading-relaxed text-sm md:text-base">
          {section.trim().split('\n').map((line, i) => {
            // Bold any text between ** or that starts with "Invalidation:"
            if (line.includes('**') || line.toLowerCase().includes('invalidation:') || line.toLowerCase().includes('ict smart money')) {
              return (
                <p key={i} className="mb-2 font-bold text-white">
                  {line.trim().replace(/\*\*/g, '')}
                </p>
              );
      // Check for ICT Smart Money Logic sections
      if (isICTSection(section)) {
        return (
          <div key={index} className="mb-6 bg-blue-500/10 p-5 rounded-xl border border-blue-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-blue-500/30 pb-2">
              ICT SMART MONEY LOGIC
            </h3>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim().split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line.trim()}</p>
              ))}
            </div>
          </div>
        );
      }

      // Special styling for Invalidation sections
      if (isInvalidationSection(section)) {
        return (
          <div key={index} className="mb-6 bg-red-500/5 p-5 rounded-xl border border-red-500/10 shadow-lg">
            <h3 className="text-xl font-bold text-red-400 mb-3 border-b border-red-400/20 pb-2">
              INVALIDATION CRITERIA
            </h3>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim().split('\n').map((line, i) => {
                // Bold and color the invalidation criteria
                if (line.includes('❌')) {
                  return (
                    <p key={i} className="mb-2 font-bold text-red-400">
                      {line.trim()}
                    </p>
                  );
                }
                return <p key={i} className="mb-2">{line.trim()}</p>;
              })}
            </div>
          </div>
        );
      }
      
      // Check for Market Structure & Bias sections
      if (/market structure|bias/i.test(section)) {
        return (
          <div key={index} className="mb-6 bg-green-500/5 p-5 rounded-xl border border-green-500/10 shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-3 border-b border-green-400/20 pb-2">
              MARKET STRUCTURE & BIAS
            </h3>
            <div className="text-gray-200 leading-relaxed text-sm md:text-base">
              {section.trim().split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line.trim()}</p>
              ))}
            </div>
          </div>
        );
      }
      
      // Default styling for regular paragraphs
      return (
        <div key={index} className="mb-5 text-gray-300 leading-relaxed text-sm md:text-base">
          {section.trim().split('\n').map((line, i) => {
            // Bold any text between ** or that starts with "Invalidation:"
            if (line.includes('**') || line.toLowerCase().includes('invalidation:')) {
              return (
                <p key={i} className="mb-2 font-bold text-white">
                  {line.trim().replace(/\*\*/g, '')}
                </p>
              );
            }
            return <p key={i} className="mb-2">{line.trim()}</p>;
          })}
        </div>
      );
    });
  };

  const formatTelegramMessage = () => {
    const timestamp = new Date().toLocaleString();
    let message = `🤖 *AI Trading Signal*\n\n`;
    
    if (signal) {
      const typeEmoji = signal.type === 'buy' ? '🟢' : signal.type === 'sell' ? '🔴' : '🟡';
      message += `${typeEmoji} *${signal.type.toUpperCase()}* ${signal.pair}\n\n`;
      
      if (signal.entry) message += `📍 *Entry:* ${signal.entry}\n`;
      if (signal.stopLoss) message += `🛑 *Stop Loss:* ${signal.stopLoss}\n`;
      if (signal.takeProfit1) message += `🎯 *TP1:* ${signal.takeProfit1}\n`;
      if (signal.takeProfit2) message += `🎯 *TP2:* ${signal.takeProfit2}\n`;
      if (signal.probability) message += `📊 *Probability:* ${signal.probability}%\n`;
      
      message += `\n📚 *Analysis Method:* ${school}\n`;
      message += `⏰ *Generated:* ${timestamp}\n\n`;
    }
    
    message += `📋 *Full Analysis:*\n${analysis.replace(/\*\*/g, '*')}\n\n`;
    message += `⚠️ *Risk Warning:* Trading involves substantial risk. This is for educational purposes only.\n\n`;
    message += `🔗 Generated by AI Trader Platform`;
    
    return message;
  };

  const copyToClipboard = async () => {
    try {
      const fullText = `AI Trading Analysis - ${timestamp?.toLocaleString() || new Date().toLocaleString()}\n\n` +
        `Trading Pair: ${signal?.pair || 'N/A'}\n` +
        `Signal Type: ${signal?.type?.toUpperCase() || 'N/A'}\n` +
        `School: ${school}\n\n` +
        (signal ? `SIGNAL DETAILS:\n` +
          `Entry: ${signal.entry || 'N/A'}\n` +
          `Stop Loss: ${signal.stopLoss || 'N/A'}\n` +
          `Take Profit 1: ${signal.takeProfit1 || 'N/A'}\n` +
          `Take Profit 2: ${signal.takeProfit2 || 'N/A'}\n` +
          `Probability: ${signal.probability || 'N/A'}%\n\n` : '') +
        `FULL ANALYSIS:\n${analysis}\n\n` +
        `Generated by AI Trader Platform`;
      
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const copyPromptToClipboard = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const sendToTelegram = async () => {
    if (!onSendToTelegram) return;
    
    setSendingToTelegram(true);
    try {
      const message = formatTelegramMessage();
      await onSendToTelegram(message);
      setTelegramSent(true);
      setTimeout(() => setTelegramSent(false), 3000);
    } catch (error) {
      console.error('Failed to send to Telegram:', error);
    } finally {
      setSendingToTelegram(false);
    }
  };

  const calculateRiskReward = () => {
    if (!signal?.entry || !signal?.stopLoss || !signal?.takeProfit1) return null;
    
    const risk = Math.abs(signal.entry - signal.stopLoss);
    const reward = Math.abs(signal.takeProfit1 - signal.entry);
    const ratio = reward / risk;
    
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: ratio.toFixed(2)
    };
  };

  const riskReward = calculateRiskReward();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Signal Summary Card */}
      {signal && signal.pair && (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border border-white/20 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
              <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center justify-center space-x-2 ${getSignalTypeColor(signal.type)} w-fit shadow-lg`}>
                {getSignalTypeIcon(signal.type)}
                <span className="uppercase font-bold">{signal.type}</span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{signal.pair}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm text-gray-300 mt-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{timestamp?.toLocaleString()}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-center sm:text-left">{school}</span>
                </div>
              </div>
            </div>
            
            {signal.probability && (
              <div className="text-center lg:text-right">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{signal.probability}%</div>
                <div className="text-gray-400 text-sm font-medium">Confidence</div>
              </div>
            )}
          </div>

          {/* Signal Metrics Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-6 md:mb-8">
            {signal.entry && (
              <div className="bg-black/30 rounded-xl p-4 md:p-5 text-center shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-2">Entry Price</div>
                <div className="text-white font-bold text-lg md:text-xl">{signal.entry}</div>
              </div>
            )}
            
            {signal.stopLoss && (
              <div className="bg-black/30 rounded-xl p-4 md:p-5 text-center shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-2">Stop Loss</div>
                <div className="text-red-400 font-bold text-lg md:text-xl">{signal.stopLoss}</div>
              </div>
            )}
            
            {signal.takeProfit1 && (
              <div className="bg-black/30 rounded-xl p-4 md:p-5 text-center shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-2">Take Profit 1</div>
                <div className="text-green-400 font-bold text-lg md:text-xl">{signal.takeProfit1}</div>
              </div>
            )}
            
            {signal.takeProfit2 && (
              <div className="bg-black/30 rounded-xl p-4 md:p-5 text-center shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-2">Take Profit 2</div>
                <div className="text-green-400 font-bold text-lg md:text-xl">{signal.takeProfit2}</div>
              </div>
            )}
            
            {riskReward && (
              <div className="bg-black/30 rounded-xl p-4 md:p-5 text-center shadow-inner border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-2">Risk:Reward</div>
                <div className="text-purple-400 font-bold text-lg md:text-xl">1:{riskReward.ratio}</div>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {riskReward && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <span className="text-purple-400 font-bold">Risk Assessment</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-sm block mb-1">Risk</span>
                  <span className="text-red-400 font-bold">{riskReward.risk} pips</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-sm block mb-1">Reward</span>
                  <span className="text-green-400 font-bold">{riskReward.reward} pips</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-sm block mb-1">R:R Ratio</span>
                  <span className="text-purple-400 font-bold">1:{riskReward.ratio}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Professional Analysis Display */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border border-white/20 p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 border-b border-blue-500/30 pb-2 w-full sm:w-auto">
            <BarChart3 className="h-7 w-7 text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Professional Analysis</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Copy Analysis Button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Copy Prompt Button */}
            {prompt && (
              <button
                onClick={copyPromptToClipboard}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Prompt</span>
                  </>
                )}
              </button>
            )}

            {/* Telegram Button - Elite Only */}
            {user?.plan === 'elite' && onSendToTelegram && (
              <button
                onClick={sendToTelegram}
                disabled={sendingToTelegram}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 text-sm shadow-md hover:shadow-lg"
              >
                {sendingToTelegram ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Sending...</span>
                  </>
                ) : telegramSent ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Telegram</span>
                  </>
                )}
              </button>
            )}

            {/* Elite Feature Badge */}
            {user?.plan !== 'elite' && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <Crown className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-xs font-medium hidden sm:inline">Elite Feature</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Content with Professional Typography */}
        <div className="bg-black/30 rounded-xl p-5 md:p-7 shadow-inner border border-white/5 overflow-auto max-h-[800px]">
          <div className="prose prose-invert max-w-none">
            {formatAnalysisForDisplay(analysis)}
          </div>
        </div>

        {/* Analysis Metadata */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Generated: {timestamp?.toLocaleString() || new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Method: {school}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-400">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telegram Setup Notice for Elite Users */}
      {user?.plan === 'elite' && !onSendToTelegram && analysis && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5 md:p-7 shadow-lg">
          <div className="flex items-start space-x-3">
            <Crown className="h-7 w-7 text-purple-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Elite Feature: Telegram Integration</h3>
              <p className="text-gray-300 mb-4">
                As an Elite user, you can send analysis directly to your Telegram channel. Configure your Telegram settings to enable this feature.
              </p>
              <a
                href="/settings"
                className="inline-flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Settings className="h-4 w-4" />
                <span>Configure Telegram Settings</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 shadow-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-yellow-300 text-sm">
            <p className="font-bold mb-2">Risk Disclaimer:</p>
            <p>This analysis is for educational purposes only and should not be considered as financial advice. Trading involves substantial risk of loss. Always conduct your own research and consider consulting with qualified financial professionals before making trading decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;