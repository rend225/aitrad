# Firestore Collections Setup Guide

## 1. Plans Collection (`/plans`)

Create these documents in your Firestore console:

### Document ID: `free`
```json
{
  "name": "Free",
  "price": 0,
  "recommendations_per_day": 1,
  "features": [
    "1 signal per day",
    "Basic analysis", 
    "Email support"
  ],
  "paypal_plan_id": "",
  "popular": false
}
```

### Document ID: `pro`
```json
{
  "name": "Pro", 
  "price": 29,
  "recommendations_per_day": 5,
  "features": [
    "5 signals per day",
    "Advanced analysis",
    "Priority support", 
    "Historical data"
  ],
  "paypal_plan_id": "P-YOUR-PAYPAL-PLAN-ID",
  "popular": true
}
```

### Document ID: `elite`
```json
{
  "name": "Elite",
  "price": 99, 
  "recommendations_per_day": 15,
  "features": [
    "15 signals per day",
    "VIP analysis",
    "24/7 support",
    "Custom strategies",
    "API access"
  ],
  "paypal_plan_id": "P-YOUR-PAYPAL-PLAN-ID",
  "popular": false
}
```

## 2. Schools Collection (`/schools`)

### Document ID: `technical`
```json
{
  "name": "Technical Analysis",
  "prompt": "Analyze the following candlestick data using technical analysis principles. Look for patterns, support/resistance levels, and momentum indicators. Provide a clear buy/sell/hold recommendation with confidence level.",
  "active": true
}
```

### Document ID: `fundamental`
```json
{
  "name": "Fundamental Analysis", 
  "prompt": "Based on the market data provided, perform a fundamental analysis considering market trends, volume, and price action. Provide actionable trading advice with risk assessment.",
  "active": true
}
```

### Document ID: `momentum`
```json
{
  "name": "Momentum Trading",
  "prompt": "Focus on momentum indicators and price velocity in the candlestick data. Identify breakout opportunities and trend continuation patterns. Provide timing-focused trading recommendations.",
  "active": true
}
```

## Field Types Reference:

- `name`: **string**
- `price`: **number** 
- `recommendations_per_day`: **number**
- `features`: **array of strings** ← This is what you asked about
- `paypal_plan_id`: **string**
- `popular`: **boolean**
- `prompt`: **string**
- `active`: **boolean**

## How to Add Data in Firebase Console:

1. Go to Firebase Console → Firestore Database
2. Click "Start collection" 
3. Collection ID: `plans` (or `schools`)
4. Click "Next"
5. Document ID: `free` (or other IDs as shown above)
6. Add each field with the correct type:
   - For `features`: Select "array" type, then add each string item
   - For `price`: Select "number" type
   - For `popular`: Select "boolean" type
   - For other fields: Select "string" type

## Important Notes:

- Make sure `features` is set as **array** type in Firestore
- Each item in the features array should be a **string**
- Don't forget to set the correct data types for each field
- The `paypal_plan_id` can be empty string for now until you set up PayPal plans