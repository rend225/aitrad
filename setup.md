# AI Trading SaaS Platform - Complete Setup Guide

This guide will walk you through setting up the complete AI Trading SaaS platform from scratch. Follow these steps carefully to ensure everything works together seamlessly.

## 📋 System Requirements

### Software Requirements
- **Node.js**: 18+ (LTS recommended)
- **Python**: 3.7+ with pip
- **Git**: Latest version
- **MetaTrader 5**: Installed and configured
- **Code Editor**: VS Code recommended

### Accounts Required
- Firebase account (Google)
- PayPal developer account
- OpenRouter API account
- Google Cloud Console (for Gemini API)
- MetaTrader 5 broker account (demo or live)

---

## 🚀 Part 1: Frontend Setup (React + TypeScript)

### 1.1 Clone and Install Dependencies

```bash
# Clone the repository
git clone [your-repo-url]
cd ai-trading-saas

# Install dependencies
npm install

# Verify installation
npm run dev
```

### 1.2 Project Structure Overview
```
ai-trading-saas/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API and business logic
│   ├── config/             # Configuration files
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── mt5_server.py          # MT5 Flask server
├── requirements.txt       # Python dependencies
└── firebase.json          # Firebase configuration
```

---

## 🔥 Part 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ai-trading-saas`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (add your domain)
4. Optional: Enable **Facebook** (requires app setup)

### 2.3 Create Firestore Database

1. Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location closest to your users
5. Apply security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Users can read/write their own recommendations
    match /recommendations/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Public read access for plans and schools
    match /plans/{document} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /schools/{document} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 2.4 Get Firebase Configuration

1. Project Settings → General → Your apps
2. Click "Add app" → Web app
3. Register app name: `ai-trading-frontend`
4. Copy the config object

### 2.5 Initialize Firestore Collections

Run the setup script:
```bash
npm run setup-firestore
```

Or manually create these collections in Firestore:
- `users` (will be populated on user registration)
- `schools` (trading methodologies)
- `plans` (subscription plans)
- `recommendations` (user trading signals)

---

## 🐍 Part 3: MT5 Flask Server Setup

### 3.1 Install Python Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3.2 Verify MT5 Installation

```python
# Test script - save as test_mt5.py
import MetaTrader5 as mt5

if not mt5.initialize():
    print("❌ MT5 initialization failed")
    print(f"Error: {mt5.last_error()}")
else:
    print("✅ MT5 initialized successfully")
    account_info = mt5.account_info()
    if account_info:
        print(f"Account: {account_info.login}")
        print(f"Server: {account_info.server}")
    
    # Test symbol data
    symbol = "EURUSD"
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info:
        print(f"✅ Symbol {symbol} is available")
    else:
        print(f"❌ Symbol {symbol} not found")
    
    mt5.shutdown()
```

### 3.3 Configure MT5 Terminal

1. **Install MetaTrader 5**
   - Download from [MetaTrader 5](https://www.metatrader5.com/)
   - Create demo or live account with your broker

2. **Enable Algo Trading**
   - Tools → Options → Expert Advisors
   - Check "Allow automated trading"
   - Check "Allow DLL imports"

3. **Add Required Symbols**
   - Market Watch → Right-click → Symbols
   - Add symbols you'll trade: EURUSD, XAUUSD, BTCUSD, etc.

### 3.4 Test MT5 Server

```bash
# Start the Flask server
python mt5_server.py

# Test endpoints (in another terminal)
curl http://localhost:5000/health
curl "http://localhost:5000/candles?symbol=EURUSD&timeframe=M5&limit=10"
```

---

## 🤖 Part 4: AI API Configuration

### 4.1 OpenRouter API Setup

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create account and get API key
3. Add credits to your account
4. Test with:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 4.2 Google Gemini API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Gemini API
4. Create API key in Credentials
5. Test with:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

## 💳 Part 5: PayPal Integration

### 5.1 PayPal Developer Setup

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create app in Dashboard
3. Get Client ID from app details
4. Configure webhook endpoints (optional)

### 5.2 Test PayPal Integration

```javascript
// Test in browser console
console.log('PayPal Client ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);
```

---

## 🔧 Part 6: Environment Configuration

### 6.1 Create Environment File

Create `.env` file in root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# AI API Configuration
VITE_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
VITE_GEMINI_API_KEY=your-gemini-api-key

# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id

# MT5 Server Configuration
VITE_MT5_SERVER_URL=http://localhost:5000
```

### 6.2 Security Notes

- **Never commit `.env` to git**
- Use different keys for development/production
- Rotate API keys regularly
- Set up Firebase security rules properly

---

## 🚢 Part 7: Deployment

### 7.1 Production Environment Setup

1. **Update environment variables for production:**
```env
VITE_MT5_SERVER_URL=http://your-vps-ip:5000
```

2. **Build the application:**
```bash
npm run build
```

### 7.2 Firebase Hosting Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

### 7.3 MT5 Server Deployment (VPS)

1. **Set up Windows VPS**
   - Install Python 3.7+
   - Install MetaTrader 5
   - Configure firewall (port 5000)

2. **Deploy Flask server:**
```bash
# Copy files to VPS
scp mt5_server.py requirements.txt user@vps-ip:/path/to/app/

# On VPS
pip install -r requirements.txt
python mt5_server.py
```

3. **Set up process manager (PM2 or Windows Service):**
```bash
# Install PM2 for Windows
npm install -g pm2
pm2 start mt5_server.py --name mt5-server
pm2 startup
pm2 save
```

---

## 🧪 Part 8: Testing Everything

### 8.1 Complete System Test

1. **Test Frontend:**
```bash
npm run dev
# Visit http://localhost:5173
```

2. **Test MT5 Server:**
```bash
curl http://localhost:5000/health
```

3. **Test Authentication:**
   - Register new user
   - Login/logout
   - Check Firestore user creation

4. **Test Trading Signals:**
   - Fetch market data
   - Generate AI signal
   - Save to history

5. **Test Payment Flow:**
   - Navigate to plans page
   - Test PayPal integration (sandbox)

### 8.2 Integration Testing

Create test script `test-integration.js`:
```javascript
// Test all integrations
const tests = [
  { name: 'Firebase Auth', endpoint: '/login' },
  { name: 'MT5 Server', endpoint: 'http://localhost:5000/health' },
  { name: 'AI APIs', test: 'generateSignal' },
  { name: 'PayPal', test: 'paymentFlow' }
];

// Run tests...
```

---

## 🔧 Part 9: Troubleshooting

### 9.1 Common Issues

#### Firebase Connection Issues
```bash
# Check Firebase config
console.log(firebase.apps.length);

# Test Firestore connection
firebase firestore:list --project your-project-id
```

#### MT5 Server Issues
- **"MT5 initialization failed"**
  - Ensure MT5 terminal is running
  - Check account login status
  - Verify algo trading is enabled

- **"Symbol not found"**
  - Add symbols to Market Watch
  - Check symbol naming (XAUUSD vs XAUUSDm)

- **CORS errors**
  - Verify Flask-CORS is installed
  - Check frontend URL in CORS settings

#### API Key Issues
- **OpenRouter "Invalid API key"**
  - Verify key format: `sk-or-v1-...`
  - Check account credits

- **Gemini API errors**
  - Verify API is enabled in Google Cloud
  - Check quota limits

### 9.2 Debug Mode

Enable debug logging:
```javascript
// In main.tsx
if (import.meta.env.DEV) {
  console.log('Debug mode enabled');
  window.DEBUG = true;
}
```

### 9.3 Performance Monitoring

Set up monitoring:
```javascript
// Add to index.html
<script>
  window.performance.mark('app-start');
</script>
```

---

## 📚 Part 10: Maintenance & Updates

### 10.1 Regular Maintenance

- **Weekly:**
  - Check MT5 server uptime
  - Monitor API usage/costs
  - Review Firebase usage

- **Monthly:**
  - Update dependencies
  - Rotate API keys
  - Backup Firestore data

### 10.2 Monitoring Setup

1. **Firebase Monitoring:**
   - Set up alerts for errors
   - Monitor authentication usage
   - Track database reads/writes

2. **MT5 Server Monitoring:**
   - Set up health check endpoint
   - Monitor server logs
   - Alert on MT5 disconnection

3. **Cost Monitoring:**
   - Set billing alerts for APIs
   - Monitor Firebase usage
   - Track PayPal transaction fees

---

## 🎯 Part 11: Going Live Checklist

### Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] Firebase security rules tested
- [ ] MT5 server stable and monitored
- [ ] SSL certificates installed
- [ ] Payment flow tested (sandbox → live)
- [ ] Error monitoring set up
- [ ] Backup procedures in place
- [ ] Load testing completed
- [ ] Documentation updated

### Launch Day

1. **Switch to production APIs**
2. **Update MT5 server URL**
3. **Deploy to Firebase Hosting**
4. **Monitor logs closely**
5. **Test critical user flows**

---

## 🆘 Support & Resources

### Documentation Links
- [Firebase Documentation](https://firebase.google.com/docs)
- [MetaTrader 5 Python Package](https://pypi.org/project/MetaTrader5/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [PayPal Developer Docs](https://developer.paypal.com/docs/)

### Troubleshooting Resources
- Firebase Console → Usage tab
- MT5 terminal → Experts tab → Journal
- Browser developer tools → Console/Network
- Server logs (Flask output)

### Getting Help
1. Check this documentation first
2. Review error logs and console output
3. Test individual components in isolation
4. Contact support for specific service issues

---

## 🎉 Success!

If you've followed this guide completely, you should now have:

✅ **Fully functional AI Trading SaaS platform**  
✅ **Real-time market data from MT5**  
✅ **AI-powered trading signal generation**  
✅ **User authentication and subscription management**  
✅ **Payment processing with PayPal**  
✅ **Mobile-responsive design**  
✅ **Production-ready deployment**  

Your platform is now ready to serve traders with intelligent, AI-powered trading signals!

---

**📧 Need Help?** If you encounter any issues during setup, check the troubleshooting section or review the individual component logs for specific error messages.
