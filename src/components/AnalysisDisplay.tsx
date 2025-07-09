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
  DollarSign,
  Percent,
  AlertTriangle,
  Crown,
  Settings,
  ExternalLink,
  MessageSquare,
  FileText,
  Activity,
  Zap,
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
  const [copiedShort, setCopiedShort] = useState(false);
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

  // Format section title based on content
  const formatSectionTitle = (title: string, content: string) => {
    const cleanTitle = title.trim().toUpperCase();
    const cleanContent = content.trim();
    
    // Determine section type for styling
    const isICT = cleanTitle.includes('ICT') || cleanTitle.includes('SMART MONEY');
    const isInvalidation = cleanTitle.includes('INVALIDATION') || cleanTitle.includes('NO-TRADE');
    const isMarketStructure = cleanTitle.includes('MARKET STRUCTURE') || cleanTitle.includes('BIAS');
    const isSignalSummary = cleanTitle.includes('SIGNAL SUMMARY');
    
    let titleClass = "text-xl md:text-2xl font-bold text-blue-400 mb-3 flex items-center space-x-2 border-b border-blue-400/20 pb-2";
    let icon = <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />;
    let contentClass = "bg-black/20 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed";
    
    if (isICT) {
      titleClass = "text-xl md:text-2xl font-extrabold text-blue-400 mb-3 flex items-center space-x-2 border-b border-blue-400/30 pb-2";
      icon = <Zap className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />;
      contentClass = "bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed";
    } else if (isInvalidation) {
      titleClass = "text-xl md:text-2xl font-extrabold text-red-400 mb-3 flex items-center space-x-2 border-b border-red-400/30 pb-2";
      icon = <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-400" />;
      contentClass = "bg-red-500/5 border border-red-500/10 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed";
    } else if (isMarketStructure) {
      titleClass = "text-xl md:text-2xl font-extrabold text-green-400 mb-3 flex items-center space-x-2 border-b border-green-400/30 pb-2";
      icon = <Activity className="h-5 w-5 md:h-6 md:w-6 text-green-400" />;
      contentClass = "bg-green-500/5 border border-green-500/10 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed";
    } else if (isSignalSummary) {
      titleClass = "text-xl md:text-2xl font-extrabold text-yellow-400 mb-3 flex items-center space-x-2 border-b border-yellow-400/30 pb-2";
      icon = <Target className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />;
      contentClass = "bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed";
    }
    
    return (
      <div key={cleanTitle} className="mb-6 md:mb-8">
        <h2 className={titleClass}>
          {icon}
          <span>{cleanTitle}</span>
        </h2>
        <div className={contentClass}>
          {formatContentWithHighlights(cleanContent)}
        </div>
      </div>
    );
  };

  // Format ICT Smart Money Logic section
  const formatICTSection = (section: string, index: number) => {
    return (
      <div key={index} className="mb-6 md:mb-8 ict-section">
        <h2 className="text-xl md:text-2xl font-extrabold text-blue-400 mb-3 flex items-center space-x-2 border-b border-blue-400/30 pb-2">
          <Zap className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
          <span>ICT SMART MONEY LOGIC</span>
        </h2>
        <div className="text-gray-200 leading-relaxed">
          {formatContentWithHighlights(section)}
        </div>
      </div>
    );
  };

  // Format Invalidation section
  const formatInvalidationSection = (section: string, index: number) => {
    return (
      <div key={index} className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-extrabold text-red-400 mb-3 flex items-center space-x-2 border-b border-red-400/30 pb-2">
          <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
          <span>INVALIDATION / NO-TRADE CRITERIA</span>
        </h2>
        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 md:p-5 text-gray-200 leading-relaxed">
          {formatContentWithHighlights(section)}
        </div>
      </div>
    );
  };

  // Format default section
  const formatDefaultSection = (section: string, index: number) => {
    // Check if section is a sub-header (numbered sections or bullet points)
    const isSubHeader = /^(\d+\.|•|\-)\s*[A-Z][^.]*:/.test(section.trim());
    
    if (isSubHeader) {
      const lines = section.split('\n');
      const headerLine = lines[0];
      const contentLines = lines.slice(1);
      
      return (
        <div key={index} className="mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center space-x-2">
            <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
            <span>{headerLine.trim()}</span>
          </h3>
          <div className="text-gray-300 leading-relaxed ml-6">
            {formatContentWithHighlights(contentLines.join('\n').trim())}
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className="mb-4 md:mb-6 text-gray-300 leading-relaxed">
        {formatContentWithHighlights(section.trim())}
      </div>
    );
  };

  // Format content with highlights for special terms
  const formatContentWithHighlights = (text: string) => {
    if (!text) return null;
    
    // Split by markdown-style bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            
            // Determine color based on content
            let colorClass = 'text-blue-400';
            const lower = content.toLowerCase();
            
            if (lower.includes('buy') || lower.includes('long')) {
              colorClass = 'text-green-400';
            } else if (lower.includes('sell') || lower.includes('short')) {
              colorClass = 'text-red-400';
            } else if (lower.includes('hold') || lower.includes('wait')) {
              colorClass = 'text-yellow-400';
            } else if (lower.includes('entry') || lower.includes('price')) {
              colorClass = 'text-blue-400';
            } else if (lower.includes('stop') || lower.includes('sl')) {
              colorClass = 'text-red-400';
            } else if (lower.includes('take profit') || lower.includes('tp')) {
              colorClass = 'text-green-400';
            } else if (lower.includes('invalidation') || lower.includes('caution')) {
              colorClass = 'text-red-400';
            } else if (lower.includes('ict') || lower.includes('smart money')) {
              colorClass = 'text-blue-400';
            }
            
            return <span key={i} className={`font-bold ${colorClass}`}>{content}</span>;
          }
          
          // Process bullet points with special formatting
          if (part.includes('❌')) {
            return (
              <div key={i} className="invalidation-criteria">
                {part}
              </div>
            );
          }
          
          // Handle markdown headers (###)
          if (part.startsWith('### ')) {
            const headerText = part.replace(/^### /, '');
            return (
              <h3 key={i} className="text-blue-200 font-extrabold uppercase text-lg tracking-widest mt-6 mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>{headerText}</span>
              </h3>
            );
          }
          
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  const formatShortSignal = () => {
    if (!signal) {
      return `AI Trading Signal - ${timestamp?.toLocaleString() || new Date().toLocaleString()}\n\n` +
        `No structured signal data available.\n\n` +
        `Generated by AI Trader Platform`;
    }

    const typeEmoji = signal.type === 'buy' ? '🟢' : signal.type === 'sell' ? '🔴' : '🟡';
    let shortText = `${typeEmoji} ${signal.type.toUpperCase()} ${signal.pair}\n\n`;
    
    if (signal.entry) shortText += `📍 Entry: ${signal.entry}\n`;
    if (signal.stopLoss) shortText += `🛑 SL: ${signal.stopLoss}\n`;
    if (signal.takeProfit1) shortText += `🎯 TP1: ${signal.takeProfit1}\n`;
    if (signal.takeProfit2) shortText += `🎯 TP2: ${signal.takeProfit2}\n`;
    if (signal.probability) shortText += `📊 Probability: ${signal.probability}%\n`;
    
    // Calculate Risk:Reward if possible
    if (signal.entry && signal.stopLoss && signal.takeProfit1) {
      const risk = Math.abs(signal.entry - signal.stopLoss);
      const reward = Math.abs(signal.takeProfit1 - signal.entry);
      const ratio = (reward / risk).toFixed(2);
      shortText += `⚖️ R:R: 1:${ratio}\n`;
    }
    
    shortText += `\n📚 Method: ${school}\n`;
    shortText += `⏰ ${timestamp?.toLocaleString() || new Date().toLocaleString()}\n\n`;
    shortText += `🔗 AI Trader Platform`;
    
    return shortText;
  };

  const copyShortSignal = async () => {
    try {
      const shortText = formatShortSignal();
      await navigator.clipboard.writeText(shortText);
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    } catch (error) {
      console.error('Failed to copy short signal:', error);
    }
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

  // Format analysis for display by parsing sections
  const formatAnalysisForDisplay = (text: string) => {
    if (!text) return null;
    
    // Split by the separator used in the analysis
    const sections = text.split('━━━━━━━━━━━━━━━━━━━━━━').filter(section => section.trim());
    
    if (sections.length > 0) {
      return sections.map((section, index) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return null;
        
        // Try to extract title from first line
        const lines = trimmedSection.split('\n');
        const firstLine = lines[0].trim();
        
        // Check if this looks like a titled section
        if (firstLine.includes('📌') || firstLine.includes('🔶') || firstLine.includes('📊') || 
            firstLine.includes('📈') || firstLine.includes('🎯') || firstLine.includes('🧠') || 
            firstLine.includes('⚠') || firstLine.toUpperCase().includes('ICT') ||
            firstLine.toUpperCase().includes('INVALIDATION') || 
            firstLine.toUpperCase().includes('MARKET STRUCTURE') ||
            firstLine.toUpperCase().includes('SIGNAL SUMMARY')) {
          
          const title = firstLine.replace(/[📌🔶📊📈🎯🧠⚠]/g, '').trim();
          const content = lines.slice(1).join('\n').trim();
          
          return formatSectionTitle(title, content);
        }
        
        // Check for ICT section
        if (trimmedSection.toUpperCase().includes('ICT') || trimmedSection.toUpperCase().includes('SMART MONEY')) {
          return formatICTSection(trimmedSection, index);
        }
        
        // Check for invalidation section
        if (trimmedSection.toUpperCase().includes('INVALIDATION') || trimmedSection.toUpperCase().includes('NO-TRADE')) {
          return formatInvalidationSection(trimmedSection, index);
        }
        
        // Default section formatting
        return formatDefaultSection(trimmedSection, index);
      }).filter(Boolean);
    } else {
      // Fallback for text without separators - split by double newlines
      const fallbackSections = text.split(/\n\n+/).filter(section => section.trim());
      
      return fallbackSections.map((section, index) => {
        // Check if section is a header (contains specific keywords)
        const isHeader = /^(SIGNAL SUMMARY|MARKET ANALYSIS|RECOMMENDATION|CONCLUSION|RISK ASSESSMENT|TECHNICAL ANALYSIS|FUNDAMENTAL ANALYSIS):/i.test(section);
        
        if (isHeader) {
          const [title, ...content] = section.split(':');
          return (
            <div key={index} className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-3 flex items-center space-x-2 border-b border-blue-400/20 pb-2">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                <span>{title.trim()}</span>
              </h2>
              <div className="text-gray-300 leading-relaxed text-sm md:text-base">
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
            <div key={index} className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center space-x-2">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                <span>{headerLine.trim()}</span>
              </h3>
              <div className="text-gray-300 leading-relaxed ml-6 text-sm md:text-base">
                {contentLines.join('\n').trim()}
              </div>
            </div>
          );
        }
        
        return (
          <div key={index} className="mb-4 text-gray-300 leading-relaxed text-sm md:text-base">
            {section.trim()}
          </div>
        );
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Signal Summary Card */}
      {signal && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
              <div className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center justify-center space-x-2 shadow-lg ${getSignalTypeColor(signal.type)}`}>
                {getSignalTypeIcon(signal.type)}
                <span className="uppercase">{signal.type}</span>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{signal.pair}</h1>
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
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{signal.probability}%</div>
                <div className="text-gray-400 text-sm">Confidence</div>
              </div>
            )}
          </div>

          {/* Signal Metrics Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {signal.entry && (
              <div className="bg-black/30 rounded-lg p-4 shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Entry Price</div>
                <div className="text-white font-bold text-lg">{signal.entry}</div>
              </div>
            )}
            
            {signal.stopLoss && (
              <div className="bg-black/30 rounded-lg p-4 shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Stop Loss</div>
                <div className="text-red-400 font-bold text-lg">{signal.stopLoss}</div>
              </div>
            )}
            
            {signal.takeProfit1 && (
              <div className="bg-black/30 rounded-lg p-4 shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Take Profit 1</div>
                <div className="text-green-400 font-bold text-lg">{signal.takeProfit1}</div>
              </div>
            )}
            
            {signal.takeProfit2 && (
              <div className="bg-black/30 rounded-lg p-4 shadow-inner border border-white/5">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Take Profit 2</div>
                <div className="text-green-400 font-bold text-lg">{signal.takeProfit2}</div>
              </div>
            )}
            
            {riskReward && (
              <div className="bg-black/30 rounded-lg p-4 shadow-inner border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Risk:Reward</div>
                <div className="text-purple-400 font-bold text-lg">1:{riskReward.ratio}</div>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {riskReward && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 md:p-5">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <span className="text-purple-400 font-semibold">Risk Assessment</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center sm:text-left">
                  <span className="text-gray-400">Risk: </span>
                  <span className="text-red-400 font-semibold">{riskReward.risk} pips</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-gray-400">Reward: </span>
                  <span className="text-green-400 font-semibold">{riskReward.reward} pips</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-gray-400">R:R Ratio: </span>
                  <span className="text-purple-400 font-semibold">1:{riskReward.ratio}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Professional Analysis Display */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Professional Analysis</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Copy Short Signal Button */}
            <button
              onClick={copyShortSignal}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all text-sm shadow-lg"
              title="Copy short signal summary without full analysis"
            >
              {copiedShort ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Copy Signal</span>
                </>
              )}
            </button>

            {/* Copy Full Analysis Button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Analysis</span>
                </>
              )}
            </button>

            {/* Copy Prompt Button */}
            {prompt && user?.isAdmin && (
              <button
                onClick={copyPromptToClipboard}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all text-sm shadow-lg"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Prompt</span>
                  </>
                )}
              </button>
            )}

            {/* Telegram Button - Elite Only */}
            {user?.plan === 'elite' && onSendToTelegram && (
              <button
                onClick={sendToTelegram}
                disabled={sendingToTelegram}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 text-sm shadow-lg"
              >
                {sendingToTelegram ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : telegramSent ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Telegram</span>
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
        <div className="bg-black/30 rounded-xl p-5 md:p-6 shadow-inner border border-white/5">
          <div className="prose prose-invert max-w-none">
            {formatAnalysisForDisplay(analysis)}
          </div>
        </div>

        {/* Analysis Metadata */}
        <div className="mt-6 pt-4 border-t border-white/20">
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

      {/* Copy Button Info */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 md:p-5 shadow-lg">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-orange-400 font-semibold mb-2">Quick Signal Copy</h3>
            <p className="text-gray-300 text-sm">
              Use the <strong>"Copy Signal"</strong> button to copy just the essential signal information (pair, type, entry, SL, TP, probability) without the full analysis. Perfect for quick sharing or notes.
            </p>
          </div>
        </div>
      </div>

      {/* Telegram Setup Notice for Elite Users */}
      {user?.plan === 'elite' && !onSendToTelegram && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 md:p-6 shadow-lg">
          <div className="flex items-start space-x-3">
            <Crown className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-purple-400 font-semibold mb-2">Elite Feature: Telegram Integration</h3>
              <p className="text-gray-300 text-sm mb-4">
                As an Elite user, you can send analysis directly to your Telegram channel. Configure your Telegram settings to enable this feature.
              </p>
              <a
                href="/settings"
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
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
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 md:p-5 shadow-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-yellow-300 text-xs">
            <p className="font-semibold mb-1">Risk Disclaimer:</p>
            <p>This analysis is for educational purposes only and should not be considered as financial advice. Trading involves substantial risk of loss. Always conduct your own research and consider consulting with qualified financial professionals before making trading decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;