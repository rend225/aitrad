// Enhanced GPT API integration with professional trading prompts
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type AIProvider = 'openrouter' | 'gemini';

export interface TradingAnalysisRequest {
  symbol: string;
  marketData: any;
  schoolPrompt: string;
  provider?: AIProvider;
}

export interface TradingAnalysisResponse {
  analysis: string;
  confidence?: number;
  signalType?: 'buy' | 'sell' | 'hold';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

// Professional trading prompt template
const createTradingPrompt = (schoolPrompt: string, symbol: string, marketData: any): string => {
  const jsonData = JSON.stringify(marketData, null, 2);
  
  return `You are an elite-level financial market analyst and trading assistant, specialized in short-term technical analysis of assets like Gold (XAU/USD), indices, and currencies.

Your task is to generate highly detailed, actionable trade recommendations based on raw candlestick data (OHLC), focusing on the 5-minute and 15-minute timeframes, while considering the context of the 1-hour and 4-hour charts.

The recommendations are for intraday scalping or short-term swings, valid for a few hours unless market structure shifts significantly.

You are allowed to use only ONE indicator: *ATR (Average True Range)* (14-period, on 15m or 5m), strictly for:
- Dynamic stop-loss placement (e.g., 1.5x ATR below demand zone)
- Assessing market volatility (avoid trades in low or extremely high volatility)
- Adjusting risk-to-reward calculations

━━━━━━━━━━━━━━━━━━━━━━
📌 *Strict Trading Rules:*
✅ Only trade setups based on *strong Supply & Demand zones*  
✅ Do *NOT* enter immediately — wait for *clear confirmation* like:
- Bullish/Bearish Engulfing candle
- CHoCH (Change of Character) on 5m
- Internal liquidity sweep or FVG mitigation

🚫 Ignore weak zones or already-mitigated zones.

━━━━━━━━━━━━━━━━━━━━━━
🔶 Definition of a "Strong Zone":
- Fresh and untouched (unmitigated)
- Originated from an aggressive move away (impulsive)
- Clearly visible on 1H or 4H charts
- Contains FVG or internal/external liquidity sweep
- Aligned with higher timeframe market structure

━━━━━━━━━━━━━━━━━━━━━━
📊 1. Multi-Timeframe Context (4H & 1H)
- What is the overall market structure and trend?
- Are we approaching any strong institutional Supply/Demand zones?
- Is there unmitigated imbalance or liquidity above/below?
- What is the current ATR value and what does it imply?

━━━━━━━━━━━━━━━━━━━━━━
📈 2. Execution Timeframes (15M & 5M)
- Detect CHoCH / BOS / liquidity traps
- Look for price action confirmations: Engulfing candle, FVG tap, etc.
- Check if ATR conditions support a clean entry
- Validate that the zone has not been touched

━━━━━━━━━━━━━━━━━━━━━━
🎯 3. Trade Setup Recommendation
- Direction: Buy / Sell / No Trade
- Entry Price: After confirmation only
- Stop Loss: Below/above structure or zone using 1.5x ATR
- TP1 & TP2: Defined profit targets
- Risk-to-Reward Ratio: To TP1 and TP2
- Trade Type: Momentum / Reversal / Liquidity Sweep
- ATR Notes: Include value and how it influenced SL or trade filtering

━━━━━━━━━━━━━━━━━━━━━━
🧠 4. Justification & Reasoning
- Why this zone specifically?
- What confirmation was used?
- How does this align with higher timeframe context?
- How did ATR and structure support this setup?

━━━━━━━━━━━━━━━━━━━━━━
⚠ 5. Invalidation / No-Trade Criteria
- Zone has already been touched or broken
- ATR is too high or too low (causing poor RR)
- No valid confirmation appears near the zone
- Sudden market structure shift or BOS in the opposite direction

IMPORTANT: At the end of your analysis, provide a structured summary in this exact format:

SIGNAL SUMMARY:
Pair: [SYMBOL]
Type: [BUY/SELL/HOLD]
Entry: [price or "Wait for confirmation"]
Stop Loss: [price]
Take Profit 1: [price]
Take Profit 2: [price]
Probability: [percentage]%

📝 Format your analysis like a professional trader's briefing note — clean, structured, and concise — as if you're advising a prop trading firm.
Be as brief as possible in your answer and give me only the important points such as the recommendation, the reason for entering and its success rate.

TRADING SCHOOL METHODOLOGY:
${schoolPrompt}

SYMBOL: ${symbol}

Here is the multi-timeframe candlestick data:

${jsonData}`;
};

// Function to extract structured signal data from AI response
export const extractSignalData = (response: string, symbol: string): any => {
  try {
    // Look for the SIGNAL SUMMARY section
    const summaryMatch = response.match(/SIGNAL SUMMARY:([\s\S]*?)(?:\n\n|$)/i);
    if (!summaryMatch) {
      // Fallback: try to extract basic signal type
      const lowerResponse = response.toLowerCase();
      let type: 'buy' | 'sell' | 'hold' = 'hold';
      
      if (lowerResponse.includes('buy') || lowerResponse.includes('long')) {
        type = 'buy';
      } else if (lowerResponse.includes('sell') || lowerResponse.includes('short')) {
        type = 'sell';
      }
      
      return {
        pair: symbol,
        type,
        entry: null,
        stopLoss: null,
        takeProfit1: null,
        takeProfit2: null,
        probability: null
      };
    }
    
    const summaryText = summaryMatch[1];
    
    // Extract each field
    const extractField = (fieldName: string): string | null => {
      const regex = new RegExp(`${fieldName}:\\s*([^\\n]+)`, 'i');
      const match = summaryText.match(regex);
      return match ? match[1].trim() : null;
    };
    
    const extractPrice = (value: string | null): number | null => {
      if (!value) return null;
      const numMatch = value.match(/[\d,]+\.?\d*/);
      return numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : null;
    };
    
    const extractPercentage = (value: string | null): number | null => {
      if (!value) return null;
      const numMatch = value.match(/(\d+(?:\.\d+)?)/);
      return numMatch ? parseFloat(numMatch[1]) : null;
    };
    
    const pair = extractField('Pair') || symbol;
    const typeStr = extractField('Type')?.toUpperCase();
    const type: 'buy' | 'sell' | 'hold' = 
      typeStr === 'BUY' ? 'buy' : 
      typeStr === 'SELL' ? 'sell' : 'hold';
    
    const entry = extractPrice(extractField('Entry'));
    const stopLoss = extractPrice(extractField('Stop Loss'));
    const takeProfit1 = extractPrice(extractField('Take Profit 1'));
    const takeProfit2 = extractPrice(extractField('Take Profit 2'));
    const probability = extractPercentage(extractField('Probability'));
    
    return {
      pair,
      type,
      entry,
      stopLoss,
      takeProfit1,
      takeProfit2,
      probability
    };
  } catch (error) {
    console.error('Error extracting signal data:', error);
    return {
      pair: symbol,
      type: 'hold',
      entry: null,
      stopLoss: null,
      takeProfit1: null,
      takeProfit2: null,
      probability: null
    };
  }
};

export const generateTradingSignalWithRealData = async ({
  symbol,
  marketData,
  schoolPrompt,
  provider = 'openrouter'
}: TradingAnalysisRequest): Promise<{ analysis: string; signal: any; usedProvider?: AIProvider }> => {
  try {
    const prompt = createTradingPrompt(schoolPrompt, symbol, marketData);
    
    let analysis: string;
    let usedProvider = provider;
    
    if (provider === 'gemini') {
      try {
        analysis = await callGeminiAPI(prompt);
      } catch (error: any) {
        console.warn('Gemini API failed, falling back to OpenRouter:', error.message);
        
        // Check if it's a quota/rate limit error
        if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
          console.log('Quota exceeded for Gemini, automatically switching to OpenRouter');
          analysis = await callOpenRouterAPI(prompt);
          usedProvider = 'openrouter';
        } else {
          throw error; // Re-throw if it's not a quota issue
        }
      }
    } else {
      analysis = await callOpenRouterAPI(prompt);
    }
    
    // Extract structured signal data
    const signal = extractSignalData(analysis, symbol);
    
    return { analysis, signal, usedProvider };
  } catch (error) {
    console.error('Error generating trading signal:', error);
    throw new Error(`Failed to generate trading signal: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const callOpenRouterAPI = async (prompt: string): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured. Please check your environment variables.');
  }
  
  try {
    console.log('Calling OpenRouter API...');
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Trading Signals'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading analyst. Provide clear, actionable trading recommendations based on the candlestick data provided. Include confidence level, signal type (buy/sell/hold), and reasoning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response received successfully');
    return data.choices[0]?.message?.content || 'No recommendation generated';
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }
  
  try {
    console.log('Calling Gemini API...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0, 
          topK: 1, 
          maxOutputTokens: 4096 
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || JSON.stringify(errorData);
      
      // Enhanced error handling for specific Gemini API errors
      if (response.status === 429) {
        throw new Error(`Gemini API quota exceeded (429): ${errorMessage}. Please check your Google Cloud Console for quota limits and billing details.`);
      } else if (response.status === 403) {
        throw new Error(`Gemini API access forbidden (403): ${errorMessage}. Please verify your API key and permissions.`);
      } else {
        throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
      }
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No recommendation generated';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const generateTradingSignal = async (prompt: string, candlestickData: any) => {
  const result = await generateTradingSignalWithRealData({
    symbol: 'UNKNOWN',
    marketData: candlestickData,
    schoolPrompt: prompt,
    provider: 'openrouter'
  });
  return result.analysis;
};

// Generate mock candlestick data (keeping for fallback)
export const generateMockCandlestickData = () => {
  const data = [];
  const basePrice = 100;
  let currentPrice = basePrice;
  
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * 4;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      timestamp: new Date(Date.now() - (19 - i) * 60 * 60 * 1000).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000
    });
    
    currentPrice = close;
  }
  
  return data;
};