// Enhanced market data service with better error handling and API connection
import { getSetting, updateSetting } from './firestore';

// API key management
let currentApiKeyIndex = 0;
let apiKeys: string[] = [];

// Initialize with the default key
const DEFAULT_API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY || "6a49114a1cf942fe994ac33328d6c2c8";

export interface CandleData {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MultiTimeframeData {
  symbol: string;
  timeframes: {
    "5min": CandleData[];
    "15min": CandleData[];
    "1h": CandleData[];
    "4h": CandleData[];
  };
}

export const TRADING_PAIRS = [
  { symbol: 'XAUUSD', name: 'Gold (XAU/USD)', category: 'Metals' },
  { symbol: 'EURUSD', name: 'EUR/USD', category: 'Forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', category: 'Forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', category: 'Forex' },
  { symbol: 'USDCHF', name: 'USD/CHF', category: 'Forex' },
  { symbol: 'AUDUSD', name: 'AUD/USD', category: 'Forex' },
  { symbol: 'USDCAD', name: 'USD/CAD', category: 'Forex' },
  { symbol: 'NZDUSD', name: 'NZD/USD', category: 'Forex' },
  { symbol: 'SPX', name: 'S&P 500', category: 'Indices' },
  { symbol: 'NDX', name: 'NASDAQ 100', category: 'Indices' },
  { symbol: 'DJI', name: 'Dow Jones', category: 'Indices' },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'Crypto' },
];

// Symbol mapping for TwelveData API compatibility
const SYMBOL_MAPPING: { [key: string]: string } = {
  'XAUUSD': 'XAU/USD',
  'EURUSD': 'EUR/USD',
  'GBPUSD': 'GBP/USD',
  'USDJPY': 'USD/JPY',
  'USDCHF': 'USD/CHF',
  'AUDUSD': 'AUD/USD',
  'USDCAD': 'USD/CAD',
  'NZDUSD': 'NZD/USD',
  'SPX': 'SPX',
  'NDX': 'NDX',
  'DJI': 'DJI',
  'BTCUSD': 'BTC/USD',
  'ETHUSD': 'ETH/USD'
};

// Get the correct symbol format for TwelveData API
const getApiSymbol = (symbol: string): string => {
  return SYMBOL_MAPPING[symbol.toUpperCase()] || symbol;
};

// Load API keys from Firestore
export const loadApiKeys = async (): Promise<string[]> => {
  try {
    const apiSettings = await getSetting('marketData');
    if (apiSettings && apiSettings.apiKeys && Array.isArray(apiSettings.apiKeys)) {
      apiKeys = apiSettings.apiKeys.filter(key => key && key.trim() !== '');
      
      // Always ensure the default key is included if not already present
      if (DEFAULT_API_KEY && !apiKeys.includes(DEFAULT_API_KEY)) {
        apiKeys.unshift(DEFAULT_API_KEY);
      }
      
      console.log(`✅ Loaded ${apiKeys.length} API keys for market data`);
    } else {
      // If no keys in Firestore, use the default key
      apiKeys = [DEFAULT_API_KEY];
      console.log('ℹ️ Using default API key for market data');
    }
    
    return apiKeys;
  } catch (error) {
    console.error('❌ Error loading API keys:', error);
    // Fallback to default key
    apiKeys = [DEFAULT_API_KEY];
    return apiKeys;
  }
};

// Get the current API key
export const getCurrentApiKey = (): string => {
  if (apiKeys.length === 0) {
    return DEFAULT_API_KEY;
  }
  return apiKeys[currentApiKeyIndex];
};

// Rotate to the next API key - now used proactively, not just on errors
export const rotateApiKey = (): string => {
  if (apiKeys.length <= 1) {
    return getCurrentApiKey();
  }
  
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
  const newKey = getCurrentApiKey();
  console.log(`🔄 Rotating to API key ${currentApiKeyIndex + 1}/${apiKeys.length}`);
  return newKey;
};

// Add a new API key
export const addApiKey = async (newKey: string): Promise<boolean> => {
  if (!newKey || newKey.trim() === '') {
    return false;
  }
  
  // Don't add duplicates
  if (apiKeys.includes(newKey)) {
    return false;
  }
  
  try {
    // Add to local array
    apiKeys.push(newKey);
    
    // Save to Firestore
    await updateSetting('marketData', { apiKeys });
    
    console.log(`✅ Added new API key. Total keys: ${apiKeys.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error adding API key:', error);
    return false;
  }
};

// Remove an API key
export const removeApiKey = async (keyToRemove: string): Promise<boolean> => {
  if (!keyToRemove || apiKeys.length <= 1) {
    return false;
  }
  
  try {
    // Remove from local array
    apiKeys = apiKeys.filter(key => key !== keyToRemove);
    
    // Reset index if needed
    if (currentApiKeyIndex >= apiKeys.length) {
      currentApiKeyIndex = 0;
    }
    
    // Save to Firestore
    await updateSetting('marketData', { apiKeys });
    
    console.log(`✅ Removed API key. Total keys: ${apiKeys.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error removing API key:', error);
    return false;
  }
};

// Validate API key and symbol
const validateApiParams = (symbol: string) => {
  if (apiKeys.length === 0) {
    throw new Error('No TwelveData API keys configured');
  }
  
  if (!symbol || symbol.trim() === '') {
    throw new Error('Symbol parameter is required');
  }
  
  return true;
};

// Fetch candlestick data with sequential API key rotation
export const fetchCandlestickData = async (
  symbol: string, 
  interval: string, 
  count: number,
  maxRetries: number = 3
): Promise<CandleData[]> => {
  // Load API keys if not already loaded
  if (apiKeys.length === 0) {
    await loadApiKeys();
  }
  
  // Validate parameters
  validateApiParams(symbol);
  
  // Get the correct API symbol format
  const apiSymbol = getApiSymbol(symbol);
  
  // Rotate API key for each new request - sequential rotation
  const currentKey = rotateApiKey();
  
  console.log(`🔄 Fetching ${interval} data for ${apiSymbol} (${symbol}) with API key ${currentApiKeyIndex + 1}/${apiKeys.length}...`);
  
  try {
    // Build URL with proper encoding
    const params = new URLSearchParams({
      symbol: apiSymbol,
      interval: interval,
      outputsize: count.toString(),
      apikey: currentKey,
      format: 'json'
    });
    
    const url = `https://api.twelvedata.com/time_series?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Trading-Platform/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data.status === 'error') {
      throw new Error(data.message || 'API returned error status');
    }
    
    if (data.code) {
      if (data.code === 400) {
        throw new Error(`Invalid symbol or parameters: ${data.message}`);
      } else if (data.code === 401) {
        throw new Error('Invalid API key');
      } else if (data.code === 429) {
        throw new Error('API rate limit exceeded');
      } else {
        throw new Error(`API Error ${data.code}: ${data.message}`);
      }
    }
    
    // Check for rate limiting message
    if (data.message && data.message.includes('API calls quota')) {
      throw new Error('API rate limit exceeded');
    }
    
    // Validate data structure
    if (!data.values || !Array.isArray(data.values)) {
      // Sometimes the API returns different structure for different symbols
      if (data.price) {
        // Single price point - convert to candle format
        const now = new Date().toISOString();
        return [{
          datetime: now,
          open: parseFloat(data.price),
          high: parseFloat(data.price),
          low: parseFloat(data.price),
          close: parseFloat(data.price),
          volume: 1000
        }];
      }
      
      throw new Error(`No candlestick data available for ${apiSymbol}. This symbol might not support the ${interval} timeframe.`);
    }
    
    if (data.values.length === 0) {
      throw new Error(`No historical data available for ${apiSymbol} on ${interval} timeframe`);
    }
    
    // Process and validate candle data
    const processedCandles = data.values.reverse().map((candle: any, index: number) => {
      try {
        const processed = {
          datetime: candle.datetime,
          open: parseFloat(candle.open),
          high: parseFloat(candle.high),
          low: parseFloat(candle.low),
          close: parseFloat(candle.close),
          volume: candle.volume ? parseFloat(candle.volume) : Math.floor(Math.random() * 10000) + 1000
        };
        
        // Validate numbers
        if (isNaN(processed.open) || isNaN(processed.high) || isNaN(processed.low) || isNaN(processed.close)) {
          throw new Error(`Invalid price data`);
        }
        
        return processed;
      } catch (error) {
        throw new Error(`Invalid candle data at index ${index} for ${apiSymbol}: ${error}`);
      }
    });
    
    console.log(`✅ Successfully fetched ${processedCandles.length} ${interval} candles for ${apiSymbol}`);
    return processedCandles;
    
  } catch (error: any) {
    console.error(`❌ Error fetching data with API key ${currentApiKeyIndex + 1}/${apiKeys.length}: ${error.message}`);
    
    // If we have more API keys and retries left, try with the next key
    if (apiKeys.length > 1 && maxRetries > 0) {
      console.log(`🔄 Retrying with next API key (${maxRetries} retries left)...`);
      return fetchCandlestickData(symbol, interval, count, maxRetries - 1);
    }
    
    throw error;
  }
};

export const fetchMultiTimeframeData = async (
  symbol: string, 
  candleCount: number = 50
): Promise<MultiTimeframeData> => {
  try {
    // Load API keys if not already loaded
    if (apiKeys.length === 0) {
      await loadApiKeys();
    }
    
    validateApiParams(symbol);
    
    const cleanSymbol = symbol.trim().toUpperCase();
    const apiSymbol = getApiSymbol(cleanSymbol);
    
    console.log(`🔄 Fetching multi-timeframe data for ${apiSymbol} (${cleanSymbol})...`);
    
    // Define timeframe mappings for TwelveData API
    const timeframes = [
      { key: "5min", interval: "5min", count: Math.min(candleCount, 50) }, // Limit to avoid quota issues
      { key: "15min", interval: "15min", count: Math.min(candleCount, 50) },
      { key: "1h", interval: "1h", count: Math.min(candleCount, 50) },
      { key: "4h", interval: "4h", count: Math.min(candleCount, 50) }
    ];
    
    // Fetch timeframes with proper delay to avoid rate limiting
    const timeframeData: any = {};
    const errors: string[] = [];
    
    for (let i = 0; i < timeframes.length; i++) {
      const tf = timeframes[i];
      try {
        console.log(`📊 Fetching ${tf.key} data for ${apiSymbol}...`);
        
        // Add delay between requests (TwelveData free tier has rate limits)
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 second delay
        }
        
        timeframeData[tf.key] = await fetchCandlestickData(cleanSymbol, tf.interval, tf.count);
        
      } catch (error: any) {
        console.warn(`⚠️ Failed to fetch ${tf.interval} data: ${error.message}`);
        errors.push(`${tf.key}: ${error.message}`);
        
        // Generate fallback data for this timeframe
        timeframeData[tf.key] = generateMockCandles(tf.count, getBasePrice(cleanSymbol));
      }
    }
    
    // Check if we have at least some real data
    const successfulTimeframes = Object.keys(timeframeData).filter(key => 
      timeframeData[key].length > 0 && !errors.some(e => e.startsWith(key))
    );
    
    if (successfulTimeframes.length === 0) {
      console.warn(`⚠️ All timeframes failed for ${cleanSymbol}, using demo data`);
      throw new Error(`Failed to fetch any real data for ${cleanSymbol}. Using demo data instead.`);
    }
    
    // Log success/failure summary
    if (errors.length > 0) {
      console.warn(`⚠️ Some timeframes failed for ${cleanSymbol}:`, errors);
    }
    
    console.log(`✅ Multi-timeframe data ready for ${cleanSymbol}:`, {
      '5min': timeframeData['5min'].length,
      '15min': timeframeData['15min'].length,
      '1h': timeframeData['1h'].length,
      '4h': timeframeData['4h'].length,
      'real_data_timeframes': successfulTimeframes.length,
      'fallback_timeframes': errors.length
    });
    
    return {
      symbol: cleanSymbol,
      timeframes: timeframeData
    };
    
  } catch (error) {
    console.error('❌ Error fetching multi-timeframe data:', error);
    throw new Error(`Failed to fetch market data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to get realistic base prices
const getBasePrice = (symbol: string): number => {
  const cleanSymbol = symbol.toUpperCase();
  
  if (cleanSymbol.includes('XAU')) return 2000; // Gold
  if (cleanSymbol.includes('BTC')) return 45000; // Bitcoin
  if (cleanSymbol.includes('ETH')) return 3000; // Ethereum
  if (cleanSymbol.includes('EUR') || cleanSymbol.includes('GBP') || cleanSymbol.includes('AUD')) return 1.1; // Major forex
  if (cleanSymbol.includes('JPY')) return 150; // USD/JPY
  if (cleanSymbol.includes('SPX')) return 4500; // S&P 500
  if (cleanSymbol.includes('NDX')) return 15000; // NASDAQ
  if (cleanSymbol.includes('DJI')) return 35000; // Dow Jones
  
  return 100; // Default
};

// Generate mock candles
const generateMockCandles = (count: number, basePrice: number = 100): CandleData[] => {
  const candles: CandleData[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.02); // 2% max change
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
    
    candles.push({
      datetime: new Date(Date.now() - (count - i) * 5 * 60 * 1000).toISOString(), // 5 min intervals
      open: Number(open.toFixed(basePrice > 100 ? 2 : 4)),
      high: Number(high.toFixed(basePrice > 100 ? 2 : 4)),
      low: Number(low.toFixed(basePrice > 100 ? 2 : 4)),
      close: Number(close.toFixed(basePrice > 100 ? 2 : 4)),
      volume: Math.floor(Math.random() * 10000) + 1000
    });
    
    currentPrice = close;
  }
  
  return candles;
};

// Generate complete mock multi-timeframe data
export const generateMockMultiTimeframeData = (symbol: string): MultiTimeframeData => {
  const cleanSymbol = symbol.toUpperCase();
  const basePrice = getBasePrice(cleanSymbol);
  
  console.log(`📊 Generating demo data for ${cleanSymbol} with base price ${basePrice}`);
  
  return {
    symbol: cleanSymbol,
    timeframes: {
      "5min": generateMockCandles(50, basePrice),
      "15min": generateMockCandles(50, basePrice),
      "1h": generateMockCandles(50, basePrice),
      "4h": generateMockCandles(50, basePrice)
    }
  };
};

// Test API connection with better error handling
export const testApiConnection = async (): Promise<boolean> => {
  // Load API keys if not already loaded
  if (apiKeys.length === 0) {
    await loadApiKeys();
  }
  
  // If no valid API keys are available, return false immediately
  if (apiKeys.length === 0 || (apiKeys.length === 1 && (apiKeys[0] === 'your_api_key' || !apiKeys[0]))) {
    console.error('❌ No valid TwelveData API keys configured');
    return false;
  }
  
  let success = false;
  let attempts = 0;
  
  // Try each API key until one works
  while (!success && attempts < apiKeys.length) {
    const currentKey = getCurrentApiKey();
    
    try {
      if (!currentKey || currentKey === 'your_api_key') {
        console.error('❌ TwelveData API key not configured');
        rotateApiKey();
        attempts++;
        continue;
      }
      
      // Test with a simple, reliable symbol
      const params = new URLSearchParams({
        symbol: 'EUR/USD',
        interval: '1h',
        outputsize: '1',
        apikey: currentKey,
        format: 'json'
      });
      
      const url = `https://api.twelvedata.com/time_series?${params.toString()}`;
      
      console.log(`🔍 Testing TwelveData API connection with key ${currentApiKeyIndex + 1}/${apiKeys.length}...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Trading-Platform/1.0'
        }
      });
      
      if (!response.ok) {
        console.error(`❌ API Test Failed: HTTP ${response.status}`);
        rotateApiKey();
        attempts++;
        continue;
      }
      
      const data = await response.json();
      
      if (data.status === 'error' || data.code) {
        console.error('❌ API Test Failed:', data.message || `Error code: ${data.code}`);
        rotateApiKey();
        attempts++;
        continue;
      }
      
      if (!data.values && !data.price) {
        console.error('❌ API Test Failed: No data returned');
        rotateApiKey();
        attempts++;
        continue;
      }
      
      console.log(`✅ TwelveData API connection successful with key ${currentApiKeyIndex + 1}`);
      success = true;
      
    } catch (error) {
      console.error(`❌ API Test Failed with key ${currentApiKeyIndex + 1}:`, error);
      rotateApiKey();
      attempts++;
    }
  }
  
  if (!success) {
    console.error(`❌ All API keys failed the connection test`);
  }
  
  return success;
};

// Get API usage info (if available)
export const getApiUsage = async (): Promise<any> => {
  // Load API keys if not already loaded
  if (apiKeys.length === 0) {
    await loadApiKeys();
  }
  
  try {
    const currentKey = getCurrentApiKey();
    const response = await fetch(`https://api.twelvedata.com/usage?apikey=${currentKey}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Could not fetch API usage info:', error);
  }
  return null;
};

// Get all API keys and their status
export const getApiKeyStatus = async (): Promise<{
  keys: { key: string; status: 'active' | 'error' | 'unknown'; usage?: any }[];
  activeKey: number;
  totalKeys: number;
}> => {
  // Load API keys if not already loaded
  if (apiKeys.length === 0) {
    await loadApiKeys();
  }
  
  const keyStatus = [];
  
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    let status: 'active' | 'error' | 'unknown' = 'unknown';
    let usage = null;
    
    try {
      // Test key with a simple request
      const params = new URLSearchParams({
        symbol: 'EUR/USD',
        interval: '1h',
        outputsize: '1',
        apikey: key,
        format: 'json'
      });
      
      const url = `https://api.twelvedata.com/time_series?${params.toString()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (!data.status && !data.code && (data.values || data.price)) {
          status = 'active';
          
          // Try to get usage info
          try {
            const usageResponse = await fetch(`https://api.twelvedata.com/usage?apikey=${key}`);
            if (usageResponse.ok) {
              usage = await usageResponse.json();
            }
          } catch (e) {
            // Ignore usage fetch errors
          }
        } else {
          status = 'error';
        }
      } else {
        status = 'error';
      }
    } catch (error) {
      status = 'error';
    }
    
    // Mask the API key for security
    const maskedKey = key.substring(0, 4) + '...' + key.substring(key.length - 4);
    
    keyStatus.push({
      key: maskedKey,
      status,
      usage
    });
  }
  
  return {
    keys: keyStatus,
    activeKey: currentApiKeyIndex,
    totalKeys: apiKeys.length
  };
};

// Initialize by loading API keys
loadApiKeys();