# AI Trading Signals SaaS Platform

A complete SaaS web application built with React and TypeScript for AI-powered trading signal recommendations.

## Features

### 🔐 Authentication
- Firebase Authentication with email/password
- User registration with automatic profile creation
- Secure login/logout functionality

### 📊 Subscription Plans
- **Free Plan**: 1 signal per day
- **Pro Plan**: 5 signals per day 
- **Elite Plan**: 15 signals per day + VIP features
- PayPal subscription integration

### 🤖 AI Signal Generation
- Integration with OpenRouter API for GPT-4 analysis
- Multiple trading school methodologies
- Real-time candlestick data analysis
- Usage tracking and daily limits

### 👨‍💼 Admin Panel (Coming Soon)
- User management
- Plan configuration
- Trading school management
- Usage analytics and reports

### 📱 Responsive Design
- Mobile-first responsive design
- Modern gradient UI with glassmorphism effects
- Smooth animations and micro-interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Payments**: PayPal Subscriptions
- **AI**: OpenRouter API (GPT-4)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project
- PayPal developer account
- OpenRouter API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-trading-saas
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your Firebase, PayPal, and OpenRouter credentials in the `.env` file.

4. Configure Firebase
- Create a new Firebase project
- Enable Authentication (Email/Password)
- Create a Firestore database
- Update the Firebase config in `src/config/firebase.ts`

5. Set up Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /recommendations/{userId}/{doc} {
      allow read, write: if request.auth.uid == userId;
    }
    match /plans/{doc}, /schools/{doc} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /admin/{doc} {
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

6. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# PayPal
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# OpenRouter
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

2. Build the project
```bash
npm run build
```

3. Initialize Firebase hosting
```bash
firebase init hosting
```

4. Deploy
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details