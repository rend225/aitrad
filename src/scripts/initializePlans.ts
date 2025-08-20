import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Plan } from '../types';

const initialPlans: Omit<Plan, 'id'>[] = [
  {
    name: 'Free',
    price: 0,
    recommendations_per_day: 5,
    features: [
      '5 AI Trading analyses per month',
      'Basic market insights',
      'Email support',
      'Community access'
    ],
    popular: false,
    paypal_plan_id: null
  },
  {
    name: 'Basic',
    price: 29,
    recommendations_per_day: 50,
    features: [
      '50 AI Trading analyses per month',
      'Advanced market insights',
      'Real-time alerts',
      'Priority email support',
      'Historical data access'
    ],
    popular: false,
    paypal_plan_id: 'P-3RX65613XN908640NM3DIWUA'
  },
  {
    name: 'Pro',
    price: 79,
    recommendations_per_day: 100,
    features: [
      '100 AI Trading analyses per month',
      'Premium market insights',
      'Real-time signals',
      'Priority support',
      'Advanced analytics',
      'Custom alerts',
      'Portfolio tracking'
    ],
    popular: true,
    paypal_plan_id: 'P-0CX65613XN908640NM3DIWUB'
  },
  {
    name: 'Elite',
    price: 199,
    recommendations_per_day: 200,
    features: [
      '200 AI Trading analyses per month',
      'VIP market insights',
      'Real-time trading signals',
      '24/7 VIP support',
      'Advanced analytics',
      'Custom strategies',
      'Telegram integration',
      'MetaTrader integration',
      'API access'
    ],
    popular: false,
    paypal_plan_id: 'P-1DX65613XN908640NM3DIWUC'
  }
];

export const initializePlans = async () => {
  try {
    console.log('🔄 Initializing plans in Firestore...');
    
    for (const plan of initialPlans) {
      const planId = plan.name.toLowerCase();
      await setDoc(doc(db, 'plans', planId), {
        ...plan,
        created_at: new Date()
      });
      console.log(`✅ Plan "${plan.name}" created with ID: ${planId}`);
    }
    
    console.log('🎉 All plans initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing plans:', error);
    throw error;
  }
};

// Run if called directly
if (typeof window !== 'undefined' && (window as any).initializePlans) {
  (window as any).initializePlans = initializePlans;
}
