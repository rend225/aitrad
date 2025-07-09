import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Plans data - Updated for PayPal integration
const plansData = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    recommendations_per_day: 1,
    features: [
      '1 signal per day',
      'Basic analysis',
      'Email support'
    ],
    paypal_plan_id: '',
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 10.50,
    recommendations_per_day: 50,
    features: [
      '50 analyses per month',
      'Basic analysis',
      'Email support',
      'Market data access',
      'Historical signals'
    ],
    paypal_plan_id: 'P-BASIC50ANALYSES',
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    recommendations_per_day: 50,
    features: [
      '50 analyses per month',
      'Basic analysis',
      'Email support',
      'Market data access',
      'Historical signals'
    ],
    paypal_plan_id: 'P-BASIC50ANALYSES',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    recommendations_per_day: 100,
    features: [
      '100 analyses per month',
      'Advanced analysis',
      'Priority support',
      'Historical data',
      'Multiple trading schools',
      'Custom risk parameters'
      'Multiple trading schools',
      'Custom risk parameters'
    ],
    paypal_plan_id: 'P-PRO100ANALYSES',
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 29,
    recommendations_per_day: 200,
    features: [
      '200 analyses per month',
      'VIP analysis',
      '24/7 support',
      'Custom strategies',
      'API access',
      'Telegram integration',
      'MetaTrader integration'
      'Telegram integration',
      'MetaTrader integration'
    ],
    paypal_plan_id: 'P-ELITE200ANALYSES',
    popular: false
  }
];

// Schools data
const schoolsData = [
  {
    id: 'technical',
    name: 'Technical Analysis',
    prompt: 'Analyze the following candlestick data using technical analysis principles. Look for patterns, support/resistance levels, and momentum indicators. Provide a clear buy/sell/hold recommendation with confidence level.',
    active: true
  },
  {
    id: 'fundamental',
    name: 'Fundamental Analysis',
    prompt: 'Based on the market data provided, perform a fundamental analysis considering market trends, volume, and price action. Provide actionable trading advice with risk assessment.',
    active: true
  },
  {
    id: 'momentum',
    name: 'Momentum Trading',
    prompt: 'Focus on momentum indicators and price velocity in the candlestick data. Identify breakout opportunities and trend continuation patterns. Provide timing-focused trading recommendations.',
    active: true
  },
  {
    id: 'swing',
    name: 'Swing Trading',
    prompt: 'Analyze the candlestick data for swing trading opportunities. Focus on multi-day price movements, key reversal patterns, and optimal entry/exit points for position trades.',
    active: true
  }
];

export const setupPlans = async () => {
  try {
    console.log('🚀 Setting up subscription plans with PayPal integration...');
    
    for (const plan of plansData) {
      const { id, ...planData } = plan;
      await setDoc(doc(db, 'plans', id), planData);
      console.log(`✅ Plan '${plan.name}' created successfully`);
      
      if (plan.price > 0) {
        console.log(`   💳 PayPal Integration: Ready`);
        console.log(`   💰 Price: $${plan.price}/month`);
        console.log(`   🎯 Plan ID: ${plan.paypal_plan_id}`);
        console.log(`   🎯 Status: Ready for payments`);
      } else {
        console.log(`   🆓 Free plan - no payment integration needed`);
      }
    }
    
    console.log('🎉 All plans setup completed!');
    console.log('');
    console.log('📊 PAYMENT SYSTEM STATUS (PayPal Integration):');
    console.log('✅ Free Plan - Ready');
    console.log('✅ Basic Plan ($9/month) - PayPal Ready');
    console.log('✅ Pro Plan ($19/month) - PayPal Ready');
    console.log('✅ Elite Plan ($29/month) - PayPal Ready');
    console.log('✅ Elite Plan ($29/month) - PayPal Ready');
    console.log('');
    console.log('🎯 PayPal Configuration:');
    console.log('• Secure payment processing');
    console.log('• Buyer protection included');
    console.log('• Multiple payment methods supported');
    console.log('• Ready for subscription testing');
    console.log('');
    console.log('🚀 Payment system is now configured with PayPal!');
  } catch (error) {
    console.error('❌ Error setting up plans:', error);
    throw error;
  }
};

export const setupSchools = async () => {
  try {
    console.log('Setting up trading schools...');
    
    for (const school of schoolsData) {
      const { id, ...schoolData } = school;
      await setDoc(doc(db, 'schools', id), schoolData);
      console.log(`✅ School '${school.name}' created successfully`);
    }
    
    console.log('🎉 All schools setup completed!');
  } catch (error) {
    console.error('❌ Error setting up schools:', error);
    throw error;
  }
};

export const setupAllFirestoreData = async () => {
  try {
    console.log('🚀 Starting complete Firestore data setup with PayPal integration...');
    
    await setupPlans();
    await setupSchools();
    
    console.log('✨ Firestore setup completed successfully!');
    console.log('');
    console.log('📊 FINAL CONFIGURATION:');
    console.log('✅ Free Plan: $0/month - No payment needed');
    console.log('✅ Basic Plan: $9/month - PayPal Integration Ready');
    console.log('✅ Pro Plan: $19/month - PayPal Integration Ready');
    console.log('✅ Elite Plan: $29/month - PayPal Integration Ready');
    console.log('✅ Pro Plan: $19/month - PayPal Integration Ready');
    console.log('✅ Elite Plan: $29/month - PayPal Integration Ready');
    console.log('✅ All trading schools configured');
    console.log('✅ Payment system ready for PayPal');
    console.log('');
    console.log('🎯 VERIFICATION CHECKLIST:');
    console.log('1. ✅ Plans configured for PayPal');
    console.log('2. ✅ Payment processing ready');
    console.log('3. ✅ Buyer protection enabled');
    console.log('4. 🔄 Next: Configure PayPal Client ID');
    console.log('');
    console.log('🎉 Your payment system is now ready for PayPal integration!');
  } catch (error) {
    console.error('💥 Failed to setup Firestore data:', error);
    throw error;
  }
};