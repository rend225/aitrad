import React, { useState, useEffect, useRef } from 'react';
import { loadPayPalSDK, getPayPalPlanConfig } from '../services/paypal';
import { updateUserPlan } from '../services/firestore';
import { CreditCard, Loader, Shield, CheckCircle, AlertCircle, Play, Zap } from 'lucide-react';

interface PayPalButtonProps {
  plan: any; // Full plan object from Firestore
  userEmail: string;
  userId: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  plan,
  userEmail,
  userId,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [loading, setLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    initializePayPal();
  }, []);

  useEffect(() => {
    if (sdkLoaded && paypalRef.current && !buttonsRendered.current) {
      renderPayPalButtons();
    }
  }, [sdkLoaded]);

  const initializePayPal = async () => {
    try {
      console.log(`🔄 Initializing PayPal for ${plan.name} (${plan.id})...`);
      
      // Check if plan is configured
      const planConfig = getPayPalPlanConfig(plan);
      if (!planConfig) {
        console.warn(`⚠️ PayPal plan not configured for: ${plan.name}`);
        console.warn(`PayPal Plan ID: ${plan.paypal_plan_id || 'Not Set'}`);
        setSetupRequired(true);
        setLoading(false);
        return;
      }
      
      console.log(`✅ PayPal plan config found:`, planConfig);
      
      await loadPayPalSDK();
      setSdkLoaded(true);
      
      if (paypalRef.current && !buttonsRendered.current) {
        renderPayPalButtons();
      }
    } catch (error: any) {
      console.error('❌ PayPal initialization failed:', error);
      onError(error.message || 'Failed to load PayPal');
    } finally {
      setLoading(false);
    }
  };

  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalRef.current || buttonsRendered.current) return;

    const planConfig = getPayPalPlanConfig(plan);
    if (!planConfig) {
      onError('PayPal plan not configured for this subscription');
      return;
    }

    buttonsRendered.current = true;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'subscribe',
        height: 45
      },
      createSubscription: function(data: any, actions: any) {
        console.log('🎯 Creating PayPal subscription for:', {
          planId: planConfig.id,
          userEmail,
          amount: `$${plan.price}`
        });

        return actions.subscription.create({
          'plan_id': planConfig.id,
          'subscriber': {
            'email_address': userEmail
          },
          'custom_id': userId,
          'application_context': {
            'brand_name': 'AI Trader',
            'locale': 'en-US',
            'shipping_preference': 'NO_SHIPPING',
            'user_action': 'SUBSCRIBE_NOW',
            'return_url': `${window.location.origin}/dashboard?payment=success`,
            'cancel_url': `${window.location.origin}/plans?payment=cancelled`
          }
        });
      },
      onApprove: async function(data: any, actions: any) {
        try {
          console.log('🎉 PayPal Payment Approved:', data);
          
          // Update user subscription in Firestore with proper plan ID
          await updateUserPlan(userId, plan.id, data.subscriptionID);
          
          onSuccess({
            subscriptionId: data.subscriptionID,
            planId: plan.id,
            planName: plan.name,
            amount: plan.price,
            status: 'approved'
          });
          
        } catch (error: any) {
          console.error('Error processing subscription:', error);
          onError(`Subscription activation failed: ${error.message}`);
        }
      },
      onError: function(err: any) {
        console.error('PayPal Error:', err);
        onError(err.message || 'PayPal payment failed. Please try again.');
      },
      onCancel: function(data: any) {
        console.log('PayPal Payment Cancelled:', data);
        onError('Payment was cancelled. You can try again anytime.');
      }
    }).render(paypalRef.current);
  };

  // Virtual test purchase function
  const handleVirtualTest = async () => {
    try {
      console.log('🧪 Starting virtual test purchase...');
      console.log(`📋 Plan Details:`, {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        recommendations_per_day: plan.recommendations_per_day
      });
      
      setLoading(true);
      
      // Simulate PayPal approval process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSubscriptionId = `TEST_SUB_${Date.now()}`;
      
      console.log(`🔄 Updating user ${userId} to plan ${plan.id} with ${plan.recommendations_per_day} daily recommendations`);
      
      // Update user plan in Firestore
      await updateUserPlan(userId, plan.id, mockSubscriptionId);
      
      onSuccess({
        subscriptionId: mockSubscriptionId,
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        status: 'approved',
        testMode: true
      });
      
      console.log('✅ Virtual test purchase completed successfully!');
    } catch (error: any) {
      console.error('❌ Virtual test failed:', error);
      onError(`Virtual test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Loader className="h-4 w-4 text-blue-400 animate-spin" />
            <span className="text-blue-300 text-sm">Loading PayPal...</span>
          </div>
        </div>
      </div>
    );
  }

  if (setupRequired) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-300">
              <p className="font-medium mb-1">PayPal Setup Required</p>
              <p>Plan "{plan.name}" needs a PayPal Plan ID.</p>
              <p className="mt-2">Current PayPal Plan ID: {plan.paypal_plan_id || 'Not Set'}</p>
              <p className="mt-2">Steps to fix:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Create PayPal subscription plan</li>
                <li>Update paypal_plan_id in Firestore</li>
                <li>Add PayPal Client ID to .env</li>
              </ol>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => window.open('https://developer.paypal.com', '_blank')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <span>Setup PayPal Integration</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    );
  }

  if (!sdkLoaded) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">PayPal failed to load</span>
          </div>
        </div>
        <button
          onClick={initializePayPal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
        >
          Retry PayPal Setup
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Virtual Test Button */}
      <button
        onClick={handleVirtualTest}
        disabled={disabled || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 mb-4"
      >
        {loading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Processing Virtual Test...</span>
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            <span>Test Purchase (Virtual)</span>
          </>
        )}
      </button>

      {/* Payment Security Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-300">
            <p className="font-medium mb-1">Secure Payment via PayPal:</p>
            <p>• Buyer protection and secure checkout</p>
            <p>• Multiple payment methods supported</p>
            <p>• Cancel anytime from your dashboard</p>
          </div>
        </div>
      </div>

      {/* PayPal Button Container */}
      <div 
        ref={paypalRef} 
        id="paypal-button-container"
        className={disabled ? 'opacity-50 pointer-events-none' : ''}
      />

      {/* Supported Payment Methods */}
      <div className="text-center">
        <p className="text-xs text-gray-400 mb-2">Powered by PayPal</p>
        <div className="flex justify-center space-x-2 text-xs text-gray-500">
          <span>💳 Cards</span>
          <span>•</span>
          <span>🏦 Bank Transfer</span>
          <span>•</span>
          <span>📱 PayPal Balance</span>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
        <p className="text-gray-400 text-xs font-medium mb-1">💡 Testing Instructions:</p>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Click "Test Purchase (Virtual)" for instant testing</li>
          <li>• Or use PayPal button with sandbox account</li>
          <li>• Your plan will be updated immediately</li>
          <li>• Check dashboard for new signal limits</li>
        </ul>
      </div>
    </div>
  );
};

export default PayPalButton;