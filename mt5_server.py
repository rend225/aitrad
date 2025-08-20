#!/usr/bin/env python3
"""
Flask server for MetaTrader 5 data integration
Provides REST API endpoints for retrieving MT5 market data
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import MetaTrader5 as mt5
from datetime import datetime
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# MT5 timeframe mapping
TIMEFRAME_MAP = {
    "M1": mt5.TIMEFRAME_M1,
    "M5": mt5.TIMEFRAME_M5,
    "M15": mt5.TIMEFRAME_M15,
    "M30": mt5.TIMEFRAME_M30,
    "H1": mt5.TIMEFRAME_H1,
    "H4": mt5.TIMEFRAME_H4,
    "D1": mt5.TIMEFRAME_D1,
    "W1": mt5.TIMEFRAME_W1,
    "MN1": mt5.TIMEFRAME_MN1
}

def initialize_mt5():
    """Initialize MT5 connection"""
    if not mt5.initialize():
        logger.error("❌ MT5 initialization failed")
        logger.error(f"Error code: {mt5.last_error()}")
        return False
    
    # Get MT5 info
    account_info = mt5.account_info()
    if account_info is None:
        logger.warning("⚠️ Could not get account info, but MT5 is initialized")
    else:
        logger.info(f"✅ MT5 initialized - Account: {account_info.login}, Server: {account_info.server}")
    
    return True

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check if MT5 is still connected
        if not mt5.terminal_info():
            return jsonify({"status": "error", "message": "MT5 terminal not connected"}), 500
        
        return jsonify({
            "status": "healthy",
            "mt5_connected": True,
            "terminal_info": {
                "build": mt5.terminal_info().build,
                "connected": mt5.terminal_info().connected
            }
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/candles', methods=['GET'])
def get_candles():
    """Get candlestick data for a single timeframe"""
    try:
        symbol = request.args.get('symbol', 'EURUSD')
        timeframe = request.args.get('timeframe', 'M5')
        limit = int(request.args.get('limit', 100))
        
        logger.info(f"📊 Fetching {limit} {timeframe} candles for {symbol}")
        
        # Validate timeframe
        if timeframe not in TIMEFRAME_MAP:
            return jsonify({"error": f"Invalid timeframe: {timeframe}"}), 400
        
        # Get MT5 timeframe constant
        mt5_timeframe = TIMEFRAME_MAP[timeframe]
        
        # Fetch rates from MT5
        rates = mt5.copy_rates_from_pos(symbol, mt5_timeframe, 0, limit)
        
        if rates is None:
            error_msg = f"Failed to get data for {symbol} {timeframe}"
            logger.error(error_msg)
            return jsonify({"error": error_msg}), 404
        
        # Convert to our format
        candles = []
        for rate in rates:
            candles.append({
                "datetime": datetime.fromtimestamp(rate['time']).isoformat(),
                "open": float(rate['open']),
                "high": float(rate['high']),
                "low": float(rate['low']),
                "close": float(rate['close']),
                "volume": int(rate['tick_volume'])
            })
        
        logger.info(f"✅ Successfully fetched {len(candles)} candles for {symbol} {timeframe}")
        
        return jsonify({
            "symbol": symbol,
            "timeframe": timeframe,
            "candles": candles
        })
        
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {e}"}), 400
    except Exception as e:
        logger.error(f"Error fetching candles: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/multi_timeframe', methods=['GET'])
def get_multi_timeframe():
    """Get multi-timeframe data (main endpoint for the SaaS)"""
    try:
        symbol = request.args.get('symbol', 'BTCUSDm')
        limit = int(request.args.get('limit', 100))
        
        logger.info(f"📊 Fetching multi-timeframe data for {symbol} (limit: {limit})")
        
        # Define timeframes to fetch
        timeframes_to_fetch = {
            "5min": mt5.TIMEFRAME_M5,
            "15min": mt5.TIMEFRAME_M15,
            "1h": mt5.TIMEFRAME_H1,
            "4h": mt5.TIMEFRAME_H4
        }
        
        data = {"symbol": symbol, "timeframes": {}}
        
        # Fetch data for each timeframe
        for name, tf in timeframes_to_fetch.items():
            try:
                rates = mt5.copy_rates_from_pos(symbol, tf, 0, limit)
                candles = []
                
                if rates is not None:
                    for rate in rates:
                        candles.append({
                            "datetime": datetime.fromtimestamp(rate['time']).isoformat(),
                            "open": float(rate['open']),
                            "high": float(rate['high']),
                            "low": float(rate['low']),
                            "close": float(rate['close']),
                            "volume": int(rate['tick_volume'])
                        })
                    logger.info(f"✅ Fetched {len(candles)} candles for {symbol} {name}")
                else:
                    logger.warning(f"⚠️ No data for {symbol} {name}")
                
                data["timeframes"][name] = candles
                
            except Exception as e:
                logger.error(f"❌ Error fetching {name} for {symbol}: {e}")
                data["timeframes"][name] = []
        
        logger.info(f"✅ Multi-timeframe data ready for {symbol}")
        return jsonify(data)
        
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {e}"}), 400
    except Exception as e:
        logger.error(f"Error fetching multi-timeframe data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/symbols', methods=['GET'])
def get_symbols():
    """Get available symbols from MT5"""
    try:
        symbols = mt5.symbols_get()
        if symbols is None:
            return jsonify({"error": "Failed to get symbols"}), 500
        
        symbol_list = []
        for symbol in symbols:
            symbol_list.append({
                "name": symbol.name,
                "description": symbol.description,
                "category": symbol.path,
                "visible": symbol.visible
            })
        
        return jsonify({"symbols": symbol_list})
        
    except Exception as e:
        logger.error(f"Error fetching symbols: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/symbol_info/<symbol>', methods=['GET'])
def get_symbol_info(symbol):
    """Get detailed information about a specific symbol"""
    try:
        symbol_info = mt5.symbol_info(symbol)
        if symbol_info is None:
            return jsonify({"error": f"Symbol {symbol} not found"}), 404
        
        return jsonify({
            "symbol": symbol,
            "description": symbol_info.description,
            "category": symbol_info.path,
            "currency_base": symbol_info.currency_base,
            "currency_profit": symbol_info.currency_profit,
            "digits": symbol_info.digits,
            "point": symbol_info.point,
            "spread": symbol_info.spread,
            "visible": symbol_info.visible
        })
        
    except Exception as e:
        logger.error(f"Error fetching symbol info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting MT5 Flask Server...")
    
    # Initialize MT5
    if not initialize_mt5():
        print("❌ Failed to initialize MT5. Please ensure:")
        print("   1. MetaTrader 5 is installed and running")
        print("   2. You are logged in to a trading account")
        print("   3. Python has access to MT5 terminal")
        sys.exit(1)
    
    print("✅ MT5 initialized successfully")
    print("🌐 Starting Flask server on http://0.0.0.0:5000")
    print("📡 CORS enabled for frontend access")
    print("🔗 Available endpoints:")
    print("   GET /health - Health check")
    print("   GET /candles?symbol=EURUSD&timeframe=M5&limit=100")
    print("   GET /multi_timeframe?symbol=BTCUSDm&limit=100")
    print("   GET /symbols - List all available symbols")
    print("   GET /symbol_info/<symbol> - Get symbol details")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
    finally:
        # Cleanup MT5 connection
        mt5.shutdown()
        print("🔌 MT5 connection closed")
