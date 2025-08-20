# MT5 Flask Server Setup Guide

This guide will help you set up the MT5 Flask server to provide real-time market data for your AI Trading SaaS platform.

## Prerequisites

1. **MetaTrader 5 Terminal**
   - Download and install from [MetaTrader 5](https://www.metatrader5.com/)
   - Open a demo or live trading account
   - Ensure the terminal is running and logged in

2. **Python 3.7+**
   - Download from [Python.org](https://www.python.org/)
   - Ensure `pip` is installed

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

The requirements.txt includes:
- Flask==2.3.3
- Flask-CORS==4.0.0
- MetaTrader5==5.0.45
- Werkzeug==2.3.7

### 2. Verify MT5 Installation

Open Python and test the MT5 connection:

```python
import MetaTrader5 as mt5

# Initialize MT5
if not mt5.initialize():
    print("MT5 initialization failed")
    print(f"Error: {mt5.last_error()}")
else:
    print("MT5 initialized successfully")
    account_info = mt5.account_info()
    if account_info:
        print(f"Account: {account_info.login}")
        print(f"Server: {account_info.server}")
    mt5.shutdown()
```

## Running the Server

### 1. Start the Flask Server

```bash
python mt5_server.py
```

You should see output like:
```
🚀 Starting MT5 Flask Server...
✅ MT5 initialized successfully
🌐 Starting Flask server on http://0.0.0.0:5000
📡 CORS enabled for frontend access
```

### 2. Test Server Endpoints

Once running, you can test the server:

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Multi-timeframe Data:**
```bash
curl "http://localhost:5000/multi_timeframe?symbol=EURUSD&limit=50"
```

**Get Candlestick Data:**
```bash
curl "http://localhost:5000/candles?symbol=EURUSD&timeframe=M5&limit=100"
```

## Available Endpoints

### `/health` (GET)
Health check endpoint that verifies MT5 connection.

**Response:**
```json
{
  "status": "healthy",
  "mt5_connected": true,
  "terminal_info": {
    "build": 3615,
    "connected": true
  }
}
```

### `/multi_timeframe` (GET)
Main endpoint used by the SaaS frontend.

**Parameters:**
- `symbol` (string): Trading symbol (e.g., "BTCUSDm", "EURUSD")
- `limit` (int): Number of candles to fetch (default: 100)

**Response:**
```json
{
  "symbol": "BTCUSDm",
  "timeframes": {
    "5min": [...],
    "15min": [...],
    "1h": [...],
    "4h": [...]
  }
}
```

### `/candles` (GET)
Get candlestick data for a single timeframe.

**Parameters:**
- `symbol` (string): Trading symbol
- `timeframe` (string): MT5 timeframe (M1, M5, M15, M30, H1, H4, D1, W1, MN1)
- `limit` (int): Number of candles

### `/symbols` (GET)
Get all available symbols from MT5.

### `/symbol_info/<symbol>` (GET)
Get detailed information about a specific symbol.

## MT5 Symbol Examples

The server works with standard MT5 symbols:

**Forex:**
- EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD

**Metals:**
- XAUUSDm (Gold), XAGUSDm (Silver)

**Indices:**
- US500m (S&P 500), NAS100m (NASDAQ), US30m (Dow Jones)

**Crypto (if available on your broker):**
- BTCUSDm, ETHUSDm

## Configuration

### Update SaaS Frontend

Set the MT5 server URL in your environment variables:

```env
VITE_MT5_SERVER_URL=http://localhost:5000
```

Or for production with a remote server:
```env
VITE_MT5_SERVER_URL=http://your-vps-ip:5000
```

## Deployment Options

### Local Development
Run the server on your local machine alongside MT5 terminal.

### VPS Deployment
1. Set up a Windows VPS
2. Install MetaTrader 5 and Python
3. Run the Flask server
4. Update firewall rules to allow port 5000
5. Use the VPS IP in your frontend configuration

### Production Considerations

1. **Security:**
   - Use HTTPS in production
   - Implement authentication if needed
   - Restrict access by IP if possible

2. **Monitoring:**
   - Set up health checks
   - Monitor MT5 connection status
   - Log server activities

3. **Reliability:**
   - Use a process manager (e.g., PM2, systemd)
   - Set up automatic restart on failure
   - Monitor MT5 terminal uptime

## Troubleshooting

### Common Issues

**"MT5 initialization failed"**
- Ensure MT5 terminal is running and logged in
- Check if MT5 allows algorithm trading (Tools → Options → Expert Advisors)
- Verify account credentials

**"Connection refused"**
- Check if Flask server is running
- Verify port 5000 is not blocked by firewall
- Ensure correct IP address in frontend configuration

**"No data for symbol"**
- Verify symbol name is correct for your broker
- Check if symbol is available in Market Watch
- Some symbols may have different naming conventions

**CORS errors**
- Ensure Flask-CORS is installed and configured
- Check frontend URL is allowed in CORS settings

### Testing Connection

You can test the integration from the SaaS admin panel:
1. Go to Admin Dashboard
2. Open API Key Manager
3. Check MT5 Server Configuration section
4. Use the refresh button to test connection

## Support

For MT5-specific issues, consult:
- [MetaTrader 5 Documentation](https://www.mql5.com/en/docs)
- [Python MetaTrader5 Package](https://pypi.org/project/MetaTrader5/)

For Flask server issues, check the server logs for detailed error messages.
