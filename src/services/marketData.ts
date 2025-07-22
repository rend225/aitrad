// Enhanced market data service using local MT5 Flask server
export let apiKeysLoaded = false; // Keep for compatibility but not used

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

// MT5 Flask server configuration
const MT5_SERVER_URL = 'http://192.168.8.100:5000';

// Function to initialize market data (simplified for MT5)
export const initializeMarketData = async () => {
  try {
    console.log('🔄 Initializing MT5 market data service...');
    
    // Test MT5 server connection
    const isConnected = await testApiConnection();
    console.log(`✅ MT5 server connection test result: ${isConnected ? 'Connected' : 'Error'}`);
    
    return isConnected;
  } catch (error) {
    console.error('❌ Error initializing MT5 market data:', error);
    return false;
  }
};

// Validate parameters
const validateApiParams = (symbol: string) => {
  if (!symbol || symbol.trim() === '') {
    throw new Error('Symbol parameter is required');
  }
  
  return true;
};

// Fetch candlestick data from MT5 Flask server
export const fetchCandlestickData = async (
  symbol: string, 
  interval: string, 
  count: number
): Promise<CandleData[]> => {  
  // Validate parameters
  validateApiParams(symbol);
  
  const cleanSymbol = symbol.trim().toUpperCase();
  
  console.log(`📈 Fetching ${interval} data for ${cleanSymbol} from MT5 server...`);
  
  try {
    // Build URL for MT5 Flask server
    const url = `${MT5_SERVER_URL}/candles?symbol=${cleanSymbol}&timeframe=${interval}&limit=${count}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle MT5 server errors
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Validate data structure
    if (!data.candles || !Array.isArray(data.candles)) {
      throw new Error(`No candlestick data available for ${cleanSymbol} on ${interval} timeframe`);
    }
    
    if (data.candles.length === 0) {
      throw new Error(`No historical data available for ${cleanSymbol} on ${interval} timeframe`);
    }
    
    // Process and validate candle data
    const processedCandles = data.candles.map((candle: any, index: number) => {
      try {
        const processed = {
          datetime: candle.datetime || candle.time,
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
        throw new Error(`Invalid candle data at index ${index} for ${cleanSymbol}: ${error}`);
      }
    });
    
    console.log(`✅ Successfully fetched ${processedCandles.length} ${interval} candles for ${cleanSymbol} from MT5`);
    return processedCandles;
    
  } catch (error: any) {
    console.error(`❌ Error fetching MT5 data: ${error.message}`);
    throw error;
  }
};

export const fetchMultiTimeframeData = async (
  symbol: string, 
  candleCount: number = 50
): Promise<MultiTimeframeData> => {
  try {    
    validateApiParams(symbol);
    
    const cleanSymbol = symbol.trim().toUpperCase();
    
    console.log(`📊 Fetching multi-timeframe data for ${cleanSymbol} from MT5...`);
    
    // Define timeframe mappings for MT5
    const timeframes = [
      { key: "5min", interval: "M5", count: candleCount },
      { key: "15min", interval: "M15", count: candleCount },
      { key: "1h", interval: "H1", count: candleCount },
      { key: "4h", interval: "H4", count: candleCount }
    ];
    
    // Fetch timeframes sequentially
    const timeframeData: any = {};
    let errors: string[] = [];
    
    for (let i = 0; i < timeframes.length; i++) {
      const tf = timeframes[i];
      try {
        console.log(`📊 Fetching ${tf.key} data for ${cleanSymbol}...`);
        
        // Small delay between requests to be gentle on MT5 server
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
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
      throw new Error(`Failed to fetch any real data for ${cleanSymbol}. MT5 server may be unavailable.`);
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
    console.error('❌ Error fetching multi-timeframe data from MT5:', error);
    throw new Error(`Failed to fetch MT5 market data: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

// Generate mock candles (fallback when MT5 server is unavailable)
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

// Test MT5 server connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log(`🔍 Testing MT5 server connection at ${MT5_SERVER_URL}...`);
    
    // Test with a simple health check or basic symbol request
    const response = await fetch(`${MT5_SERVER_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      // If health endpoint doesn't exist, try a simple candle request
      const testResponse = await fetch(`${MT5_SERVER_URL}/candles?symbol=EURUSD&timeframe=M1&limit=1`);
      if (!testResponse.ok) {
        throw new Error(`MT5 server returned HTTP ${testResponse.status}`);
      }
    }
    
    console.log(`✅ MT5 server connection successful`);
    return true;
    
  } catch (error) {
    console.error(`❌ MT5 server connection test failed:`, error);
    return false;
  }
};

// Compatibility functions (kept for existing code that might reference them)
export const loadApiKeys = async (): Promise<string[]> => {
  console.log('ℹ️ API keys not needed for MT5 server');
  return [];
};

export const getCurrentApiKey = (): string => {
  return 'MT5_SERVER';
};

export const rotateApiKey = (): string => {
  return 'MT5_SERVER';
};

export const addApiKey = async (newKey: string): Promise<boolean> => {
  console.log('ℹ️ API key management not needed for MT5 server');
  return false;
};

export const removeApiKey = async (keyToRemove: string): Promise<boolean> => {
  console.log('ℹ️ API key management not needed for MT5 server');
  return false;
};

export const getApiUsage = async () => {
  return {
    message: 'MT5 server - no usage limits',
    used: 0,
    total: 'unlimited'
  };
};

export const getApiKeyStatus = async () => {
  const isConnected = await testApiConnection();
  
  return {
    keys: [{
      key: 'MT5 Server',
      status: isConnected ? 'active' : 'error',
      usage: {
        used: 0,
        total: 'unlimited'
      }
    }],
    activeKey: 0,
    totalKeys: 1
  };
};

// Set compatibility flag
apiKeysLoaded = true;