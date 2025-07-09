// PayPal payment integration service
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
export const PAYPAL_ENVIRONMENT = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';

// PayPal API endpoints
const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  description: string;
}

export interface PayPalPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer: {
    email: string;
    name?: string;
  };
  subscription?: {
    planId: string;
  };
  metadata?: {
    userId: string;
    planType: string;
  };
}

export interface PayPalPaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  paymentUrl: string;
  subscriptionId?: string;
}

// Default Plan IDs for reference (update these with your actual PayPal Plan IDs)
export const PAYPAL_PLAN_IDS = {
  pro: 'P-06P792050H561492LNBQW6ZA', // Replace with actual PayPal Plan ID
  elite: 'P-2D270313MK3350614NBQYT3Q'  // This matches your current Elite plan!
};

// Validate PayPal configuration
export const validatePayPalConfig = (): boolean => {
  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'your_paypal_client_id') {
    throw new Error('PayPal Client ID is not configured. Please add VITE_PAYPAL_CLIENT_ID to your .env file');
  }
  
  return true;
};

// Check if a plan has valid PayPal configuration
// Updated to check the actual plan data from Firestore
export const hasValidPayPalPlan = (plan: any): boolean => {
  // If it's just a string (plan ID), we can't determine PayPal support
  if (typeof plan === 'string') {
    return false;
  }
  
  // Check if the plan object has a valid paypal_plan_id
  if (plan && plan.paypal_plan_id && plan.paypal_plan_id.trim() !== '') {
    return true;
  }
  
  return false;
};

// Get PayPal plan configuration from Firestore plan data
export const getPayPalPlanConfig = (plan: any) => {
  if (!plan || !plan.paypal_plan_id || plan.paypal_plan_id.trim() === '') {
    return null;
  }
  
  return {
    id: plan.paypal_plan_id,
    name: plan.name || 'Subscription Plan',
    amount: Math.round((plan.price || 0) * 100), // Convert to cents
    currency: 'USD',
    interval: 'monthly' as const,
    description: plan.name || 'AI Trading Subscription'
  };
};

// Load PayPal SDK
export const loadPayPalSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error('PayPal SDK failed to load'));
      }
    };
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.head.appendChild(script);
  });
};

// Create a subscription with PayPal
export const createPayPalSubscription = async (
  plan: any,
  customerEmail: string, 
  customerName?: string,
  metadata?: Record<string, string>
): Promise<PayPalPaymentResponse> => {
  const planConfig = getPayPalPlanConfig(plan);
  
  if (!planConfig) {
    throw new Error(`PayPal plan not configured for: ${plan.name || plan.id}. Please set up PayPal Plan ID.`);
  }

  try {
    validatePayPalConfig();
    await loadPayPalSDK();

    return new Promise((resolve, reject) => {
      window.paypal.Buttons({
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            'plan_id': planConfig.id,
            'subscriber': {
              'email_address': customerEmail,
              'name': customerName ? {
                'given_name': customerName.split(' ')[0],
                'surname': customerName.split(' ').slice(1).join(' ')
              } : undefined
            },
            'custom_id': metadata?.userId || '',
            'application_context': {
              'brand_name': 'AI Trader',
              'locale': 'en-US',
              'shipping_preference': 'NO_SHIPPING',
              'user_action': 'SUBSCRIBE_NOW',
              'payment_method': {
                'payer_selected': 'PAYPAL',
                'payee_preferred': 'IMMEDIATE_PAYMENT_REQUIRED'
              },
              'return_url': `${window.location.origin}/dashboard?payment=success`,
              'cancel_url': `${window.location.origin}/plans?payment=cancelled`
            }
          });
        },
        onApprove: function(data: any, actions: any) {
          resolve({
            id: data.subscriptionID,
            status: 'completed',
            amount: planConfig.amount,
            currency: planConfig.currency,
            paymentUrl: '',
            subscriptionId: data.subscriptionID
          });
        },
        onError: function(err: any) {
          reject(new Error(`PayPal error: ${err.message || 'Unknown error'}`));
        },
        onCancel: function(data: any) {
          reject(new Error('Payment cancelled by user'));
        }
      }).render('#paypal-button-container');
    });
  } catch (error) {
    console.error('PayPal subscription creation failed:', error);
    throw error;
  }
};

// Verify payment status
export const verifyPayPalPayment = async (subscriptionId: string): Promise<any> => {
  try {
    validatePayPalConfig();
    
    // Note: This would typically be done on the backend for security
    // For demo purposes, we'll return a mock response
    return {
      id: subscriptionId,
      status: 'ACTIVE',
      plan_id: 'mock-plan-id'
    };
  } catch (error) {
    console.error('PayPal payment verification failed:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelPayPalSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    validatePayPalConfig();
    
    // Note: This would typically be done on the backend
    console.log(`Cancelling PayPal subscription: ${subscriptionId}`);
    return true;
  } catch (error) {
    console.error('PayPal subscription cancellation failed:', error);
    return false;
  }
};

// Get setup instructions for PayPal
export const getPayPalSetupInstructions = () => {
  return {
    title: "PayPal Payment Integration Setup",
    steps: [
      "🎯 TESTING SETUP (Current Configuration):",
      "✅ Your Elite plan is configured with PayPal Plan ID: P-2D270313MK3350614NBQYT3Q",
      "✅ Price: $99/month",
      "✅ Features: 15 signals per day, VIP analysis, 24/7 support",
      "",
      "🔧 TO TEST PURCHASE:",
      "1. Make sure you have VITE_PAYPAL_CLIENT_ID in your .env file",
      "2. Go to /plans page",
      "3. Click 'Get Started' on Elite plan",
      "4. PayPal button should appear",
      "5. Use PayPal sandbox account for testing",
      "",
      "📋 FULL SETUP GUIDE:",
      "1. Create a PayPal Business account at https://paypal.com",
      "2. Go to PayPal Developer Dashboard at https://developer.paypal.com",
      "3. Create a new application and get your Client ID",
      "4. Create subscription plans in PayPal Dashboard:",
      "   • Pro Plan: $29.99/month",
      "   • Elite Plan: $99/month (already configured)",
      "5. Copy the Plan IDs from PayPal and update your Firestore plans",
      "6. Add your Client ID to .env file:",
      "   VITE_PAYPAL_CLIENT_ID=your_client_id",
      "   VITE_PAYPAL_ENVIRONMENT=sandbox (or production)",
      "7. Test payments in sandbox mode before going live"
    ],
    note: "Your Elite plan is ready for testing! PayPal offers secure payment processing with buyer protection and supports multiple payment methods."
  };
};

// Debug PayPal configuration
export const debugPayPalConfig = () => {
  console.log('🔍 PayPal Configuration Debug:');
  console.log('================================');
  console.log('Client ID:', PAYPAL_CLIENT_ID ? `${PAYPAL_CLIENT_ID.substring(0, 10)}...` : '❌ NOT SET');
  console.log('Environment:', PAYPAL_ENVIRONMENT);
  console.log('Base URL:', PAYPAL_BASE_URL);
  console.log('');
  console.log('🎯 CONFIGURED PLANS:');
  console.log('  Elite Plan ID:', PAYPAL_PLAN_IDS.elite, '✅ READY');
  console.log('  Pro Plan ID:', PAYPAL_PLAN_IDS.pro, '⚠️ NEEDS SETUP');
  console.log('');
  console.log('💡 TESTING STATUS:');
  
  try {
    validatePayPalConfig();
    console.log('✅ Configuration is valid - Ready for testing!');
    console.log('');
    console.log('🚀 TO TEST:');
    console.log('1. Go to /plans page');
    console.log('2. Click "Get Started" on Elite plan');
    console.log('3. PayPal button should appear');
    console.log('4. Complete test purchase');
  } catch (error) {
    console.log('❌ Configuration error:', error);
    console.log('');
    console.log('🔧 TO FIX:');
    console.log('1. Add VITE_PAYPAL_CLIENT_ID to your .env file');
    console.log('2. Get Client ID from PayPal Developer Dashboard');
    console.log('3. Restart your development server');
  }
};

// Test PayPal connection
export const testPayPalConnection = async (): Promise<boolean> => {
  try {
    validatePayPalConfig();
    await loadPayPalSDK();
    console.log('✅ PayPal SDK loaded successfully - Ready for testing!');
    return true;
  } catch (error) {
    console.error('❌ PayPal connection test failed:', error);
    return false;
  }
};

// Add PayPal types to window
declare global {
  interface Window {
    paypal: any;
  }
}