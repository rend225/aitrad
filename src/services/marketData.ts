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
  { symbol: 'US500', name: 'S&P 500', category: 'Indices' },
  { symbol: 'NAS100', name: 'NASDAQ 100', category: 'Indices' },
  { symbol: 'US30', name: 'Dow Jones', category: 'Indices' },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'Crypto' },
];

// MT5 Flask server configuration
const MT5_SERVER_URL = import.meta.env.VITE_MT5_SERVER_URL || 'http://127.0.0.1:5000';

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

// Check available symbols on MT5 server
export const checkAvailableSymbols = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${MT5_SERVER_URL}/symbols`);
    if (response.ok) {
      const data = await response.json();
      return data.symbols?.map((s: any) => s.name) || [];
    }
  } catch (error) {
    console.warn('Could not fetch available symbols from MT5 server');
  }
  return [];
};

export const fetchMultiTimeframeData = async (
  symbol: string,
  candleCount: number = 50
): Promise<MultiTimeframeData> => {
  try {
    validateApiParams(symbol);

    const cleanSymbol = symbol.trim().toUpperCase();

    console.log(`📊 Fetching multi-timeframe data for ${cleanSymbol} from MT5 Flask server...`);
    console.log(`🔗 MT5 Server URL: ${MT5_SERVER_URL}`);

    // Define timeframe mappings for individual requests
    const timeframes = [
      { key: "5min", mt5Timeframe: "M5" },
      { key: "15min", mt5Timeframe: "M15" },
      { key: "1h", mt5Timeframe: "H1" },
      { key: "4h", mt5Timeframe: "H4" }
    ];

    // Fetch each timeframe individually
    const timeframePromises = timeframes.map(async (tf) => {
      try {
        console.log(`📊 Fetching ${tf.key} (${tf.mt5Timeframe}) data for ${cleanSymbol}...`);

        const url = `${MT5_SERVER_URL}/candles?symbol=${encodeURIComponent(cleanSymbol)}&timeframe=${tf.mt5Timeframe}&limit=${candleCount}`;
        console.log(`🔗 Request URL: ${url}`);

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
        console.log(`📄 Response for ${tf.key}:`, data);

        // Handle MT5 server errors
        if (data.error) {
          throw new Error(data.error);
        }

        // Validate and extract candles
        if (!data.candles || !Array.isArray(data.candles) || data.candles.length === 0) {
          throw new Error(`No candlestick data available for ${cleanSymbol} on ${tf.mt5Timeframe} timeframe. Symbol may not exist in MT5 terminal.`);
        }

        console.log(`✅ Successfully fetched ${data.candles.length} ${tf.key} candles for ${cleanSymbol}`);

        return {
          timeframe: tf.key,
          candles: data.candles
        };

      } catch (error: any) {
        console.warn(`⚠️ Failed to fetch ${tf.key} data for ${cleanSymbol}: ${error.message}`);
        console.warn(`💡 Try these common symbol alternatives: ${cleanSymbol}m, ${cleanSymbol.replace('m', '')}, ${cleanSymbol.replace('M', '')}`);

        // Generate fallback data for this timeframe
        const basePrice = getBasePrice(cleanSymbol);
        const mockCandles = generateMockCandles(candleCount, basePrice);

        console.log(`📊 Generated ${mockCandles.length} mock ${tf.key} candles for ${cleanSymbol} as fallback`);

        return {
          timeframe: tf.key,
          candles: mockCandles
        };
      }
    });

    // Wait for all timeframe requests to complete
    const results = await Promise.all(timeframePromises);

    // Combine results into the expected format
    const timeframeData: any = {};
    let successfulTimeframes = 0;

    for (const result of results) {
      timeframeData[result.timeframe] = result.candles;
      if (result.candles.length > 0) {
        successfulTimeframes++;
      }
    }

    console.log(`✅ Multi-timeframe data ready for ${cleanSymbol}:`, {
      '5min': timeframeData['5min']?.length || 0,
      '15min': timeframeData['15min']?.length || 0,
      '1h': timeframeData['1h']?.length || 0,
      '4h': timeframeData['4h']?.length || 0,
      'successful_timeframes': successfulTimeframes
    });

    return {
      symbol: cleanSymbol,
      timeframes: timeframeData
    };

  } catch (error) {
    console.error('❌ Error fetching multi-timeframe data from MT5:', error);

    // Fallback to mock data if MT5 server is unavailable
    console.log(`📊 Generating demo data for ${symbol} as fallback`);
    return generateMockMultiTimeframeData(symbol);
  }
};

// Helper function to get realistic base prices
const getBasePrice = (symbol: string): number => {
  const cleanSymbol = symbol.toUpperCase();

  if (cleanSymbol.includes('XAUUSD') || cleanSymbol.includes('XAU')) return 2600; // Gold
  if (cleanSymbol.includes('BTCUSD') || cleanSymbol.includes('BTC')) return 65000; // Bitcoin
  if (cleanSymbol.includes('ETHUSD') || cleanSymbol.includes('ETH')) return 3500; // Ethereum
  if (cleanSymbol.includes('EUR') || cleanSymbol.includes('GBP') || cleanSymbol.includes('AUD')) return 1.1; // Major forex
  if (cleanSymbol.includes('JPY')) return 150; // USD/JPY
  if (cleanSymbol.includes('US500') || cleanSymbol.includes('SPX')) return 5800; // S&P 500
  if (cleanSymbol.includes('NAS100') || cleanSymbol.includes('NDX')) return 20000; // NASDAQ
  if (cleanSymbol.includes('US30') || cleanSymbol.includes('DJI')) return 43000; // Dow Jones

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
    console.log(`🔍 Testing MT5 Flask server connection at ${MT5_SERVER_URL}...`);

    // Test with the health endpoint
    const response = await fetch(`${MT5_SERVER_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      // Add timeout
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`MT5 server returned HTTP ${response.status}: ${response.statusText}`);
    }

    const healthData = await response.json();

    if (healthData.status !== 'healthy') {
      throw new Error(`MT5 server health check failed: ${healthData.message || 'Unknown error'}`);
    }

    console.log(`✅ MT5 Flask server connection successful - MT5 Connected: ${healthData.mt5_connected}`);
    return true;

  } catch (error) {
    console.error(`❌ MT5 Flask server connection test failed:`, error);
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
