import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  plan: 'free' | 'pro' | 'elite';
  used_today: number;
  recommendation_limit: number;
  subscriptionId: string | null;
  school: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  recommendations_per_day: number;
  features: string[];
  paypal_plan_id: string;
  popular?: boolean;
}

export interface School {
  id: string;
  name: string;
  prompt: string;
  active: boolean;
}

export interface TradingSignal {
  pair: string;
  type: 'buy' | 'sell' | 'hold';
  entry?: number;
  stopLoss?: number;
  takeProfit1?: number;
  takeProfit2?: number;
  probability?: number;
  confidence?: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  school: string;
  prompt: string;
  response: string;
  candlestick_data: any;
  timestamp: Timestamp;
  confidence?: number;
  signal_type?: 'buy' | 'sell' | 'hold';
  // New structured signal data
  signal?: TradingSignal;
}

export interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  total_recommendations: number;
  revenue_monthly: number;
}