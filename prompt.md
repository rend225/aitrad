# Technical Specification: AI Trading SaaS Platform with MT5 Integration

## Project Overview

Develop a comprehensive AI-powered trading signals SaaS platform that integrates real-time market data from MetaTrader 5 (MT5) to generate intelligent trading recommendations using advanced AI analysis.

## System Architecture

### 1. Frontend Application (React/TypeScript)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with gradient UI design
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React hooks and context
- **Deployment**: Firebase Hosting

### 2. MT5 Data Server (Python Flask)
- **Framework**: Flask with CORS support
- **MT5 Integration**: MetaTrader5 Python library
- **Real-time Data**: Direct connection to MT5 terminal
- **API Endpoints**: RESTful JSON API
- **Deployment**: Standalone Python server (VPS/Local)

### 3. AI Analysis Engine
- **Primary AI**: OpenRouter API (GPT-4)
- **Secondary AI**: Google Gemini (fallback)
- **Signal Processing**: Multi-timeframe technical analysis
- **Output Format**: Structured trading recommendations

## Technical Requirements

### MT5 Flask Server Specifications

**File**: `mt5_server.py`

```python
# Core Dependencies
- Flask==2.3.3
- Flask-CORS==4.0.0
- MetaTrader5==5.0.45
- Werkzeug==2.3.7
```

**Required Endpoints**:

1. **Health Check**: `GET /health`
   - Returns MT5 connection status
   - Validates terminal connectivity

2. **Individual Candles**: `GET /candles`
   - Parameters: `symbol`, `timeframe`, `limit`
   - Returns: Array of OHLCV data
   - Format: Direct array response

3. **Multi-Timeframe**: `GET /multi_timeframe`
   - Parameters: `symbol`, `limit`
   - Returns: Object with 4 timeframes (5min, 15min, 1h, 4h)
   - Timeframe mapping: M5, M15, H1, H4

4. **Symbol Information**: `GET /symbols`
   - Returns: Available MT5 symbols
   - Includes symbol metadata

**Critical Requirements**:
- Must run alongside active MT5 terminal
- Handle symbol encoding properly (no special characters)
- Return consistent JSON format
- Implement proper error handling for unavailable symbols
- Support CORS for frontend integration

### Frontend Application Specifications

**Core Features**:

1. **Market Data Integration**
   - Real-time data fetching from MT5 server
   - Multi-timeframe validation (5min, 15min, 1h, 4h)
   - Symbol selection with proper encoding
   - No fallback to demo data - real data only

2. **Trading Signal Generation**
   - AI prompt integration with real market data
   - Professional trading analysis methodology
   - Multiple trading school approaches
   - Structured signal output (entry, stop loss, take profit)

3. **User Management**
   - Firebase authentication
   - Subscription plans (Free, Pro, Elite)
   - Daily usage limits
   - Real-time user statistics

4. **UI/UX Requirements**
   - Responsive design (mobile-first)
   - Real-time status indicators
   - Clear data validation feedback
   - Professional gradient design system

### Data Flow Architecture

```
User Selection → Frontend State → MT5 Server Request → Real Market Data → AI Analysis → Trading Signal
```

**Critical Validation Points**:
1. Selected symbol must be properly passed to MT5 server
2. Market data must be validated before AI analysis
3. Generate button only enabled with real data
4. Clear error messages for data availability issues

### AI Prompt Engineering

**Trading Analysis Prompt Structure**:
- Multi-timeframe context (4H & 1H for trend)
- Execution timeframes (15M & 5M for entry)
- Supply/Demand zone analysis
- ATR-based risk management
- Professional trader briefing format
- Structured signal summary output

**Signal Output Format**:
```json
{
  "pair": "XAUUSD",
  "type": "BUY/SELL/HOLD",
  "entry": "price or 'Wait for confirmation'",
  "stopLoss": "price",
  "takeProfit1": "price",
  "takeProfit2": "price",
  "probability": "percentage"
}
```

## Environment Configuration

### Frontend Environment Variables
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AI API Keys
VITE_OPENROUTER_API_KEY=
VITE_GEMINI_API_KEY=

# PayPal Integration
VITE_PAYPAL_CLIENT_ID=

# MT5 Server
VITE_MT5_SERVER_URL=http://127.0.0.1:5000
```

### MT5 Server Requirements
```
# System Requirements
- Windows VPS/Local machine
- MetaTrader 5 terminal installed
- Valid MT5 trading account (demo/live)
- Python 3.7+ with pip
- Stable internet connection

# Network Configuration
- Port 5000 accessible from frontend
- CORS enabled for frontend domain
- Firewall configured appropriately
```

## Symbol Management

**Supported Trading Pairs**:
```javascript
[
  { symbol: 'XAUUSD', name: 'Gold (XAU/USD)', category: 'Metals' },
  { symbol: 'EURUSD', name: 'EUR/USD', category: 'Forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', category: 'Forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', category: 'Forex' },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'US500', name: 'S&P 500', category: 'Indices' },
  // Additional pairs as available in MT5
]
```

**Symbol Handling**:
- Proper URL encoding for API requests
- Case-insensitive symbol processing
- Symbol validation against MT5 availability
- Clear error messages for unavailable symbols

## Security & Performance

### Security Requirements
- Secure API key management
- Firebase security rules implementation
- HTTPS enforcement in production
- Input validation and sanitization
- Rate limiting for API calls

### Performance Considerations
- Parallel timeframe data fetching
- Efficient state management
- Optimized bundle size
- CDN deployment for static assets
- Database query optimization

## Deployment Strategy

### Frontend Deployment
- Firebase Hosting for production
- Automatic builds via GitHub Actions
- Environment-specific configurations
- Custom domain configuration

### MT5 Server Deployment
- VPS deployment with Windows Server
- Process monitoring (PM2 or similar)
- Automatic restart on failure
- Health monitoring and alerts
- Backup and recovery procedures

## Testing & Quality Assurance

### Frontend Testing
- Component unit tests
- Integration tests for API calls
- E2E testing for critical user flows
- Cross-browser compatibility testing

### MT5 Server Testing
- API endpoint testing
- MT5 connection reliability testing
- Symbol availability validation
- Error handling verification

## Documentation Requirements

### Technical Documentation
- API documentation with examples
- Setup and deployment guides
- Troubleshooting documentation
- Architecture decision records

### User Documentation
- User guide for platform features
- Trading methodology explanation
- FAQ and support documentation
- Video tutorials for key features

## Success Criteria

### Functional Requirements
- ✅ Real MT5 data integration without demo fallbacks
- ✅ Accurate symbol selection and data fetching
- ✅ AI-generated trading signals with real market data
- ✅ User authentication and subscription management
- ✅ Responsive UI across all devices

### Performance Requirements
- ⚡ Market data fetch within 5 seconds
- ⚡ AI signal generation within 30 seconds
- ⚡ 99.9% uptime for critical services
- ⚡ Sub-second UI response times

### Quality Requirements
- 🔒 Bank-level security implementation
- 📱 Mobile-first responsive design
- 🌐 Multi-language support
- 📊 Comprehensive error handling and logging

## Current Implementation Status

### ✅ Completed Features
- React + TypeScript frontend with Tailwind CSS
- Firebase authentication and Firestore database
- Multi-language support (English, French, Arabic)
- Subscription plans and payment integration
- Professional gradient UI design
- Real-time user statistics and usage tracking

### 🚧 In Progress
- MT5 Flask server integration
- Real market data validation
- Symbol selection state management
- AI prompt optimization

### ❌ Known Issues to Address
- Symbol selection not properly updating MT5 requests
- URL encoding issues causing strange characters
- Market data validation logic needs refinement
- Generate button state management

## Critical Bug Fixes Required

### 1. Symbol Selection Issue
**Problem**: When selecting Gold (XAUUSD), the system still requests Bitcoin (BTCUSD) data
**Root Cause**: State management or API call parameter passing issue
**Solution**: Debug React state updates and API parameter passing

### 2. URL Encoding Problem
**Problem**: Strange characters (`**%20`) appearing in API requests
**Root Cause**: Improper URL encoding or state corruption
**Solution**: Implement proper URL sanitization and encoding

### 3. Data Validation Logic
**Problem**: Market data fetch succeeds but UI doesn't recognize it
**Root Cause**: Validation function not properly checking data structure
**Solution**: Enhance data validation and state management

## Development Priority

### Phase 1: Critical Bug Fixes (High Priority)
1. Fix symbol selection state management
2. Resolve URL encoding issues
3. Implement proper data validation
4. Ensure MT5 server communication

### Phase 2: Feature Enhancement (Medium Priority)
1. Optimize AI prompt engineering
2. Enhance error handling and user feedback
3. Improve real-time data processing
4. Add comprehensive logging

### Phase 3: Production Readiness (Medium Priority)
1. Implement comprehensive testing
2. Set up monitoring and alerts
3. Optimize performance
4. Deploy to production environment

## Budget & Timeline Considerations

**Development Phases**:
1. **Phase 1**: Critical bug fixes and MT5 integration (1-2 weeks)
2. **Phase 2**: AI optimization and testing (2-3 weeks)
3. **Phase 3**: Production deployment and monitoring (1-2 weeks)
4. **Phase 4**: Documentation and training (1 week)

**Resource Requirements**:
- Senior Full-Stack Developer (React/TypeScript/Python)
- DevOps Engineer (for production deployment)
- QA Engineer (for comprehensive testing)

## Technical Debt

### Code Quality Issues
- Inconsistent error handling patterns
- Missing TypeScript interfaces
- Incomplete logging implementation
- State management complexity

### Infrastructure Concerns
- Single point of failure in MT5 server
- No automated backup procedures
- Limited monitoring and alerting
- Manual deployment processes

This specification provides a complete blueprint for developing and maintaining a professional-grade AI trading SaaS platform with robust MT5 integration and real-time market data analysis capabilities.
