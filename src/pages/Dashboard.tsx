import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getSchools, saveRecommendation, canUserGenerateRecommendation, getUserRecommendations } from '../services/firestore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { generateTradingSignalWithRealData } from '../services/gpt';
import { fetchMultiTimeframeData, generateMockMultiTimeframeData, TRADING_PAIRS, testApiConnection, loadApiKeys } from '../services/marketData';
import { sendTelegramMessage, formatSignal\ForTelegram } from '../services/telegram';
import { db } from '../config/firebase';
import { School } from '../types';
import AnalysisDisplay from '../components/AnalysisDisplay';
import { 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  BarChart3, 
  Crown, 
  Clock, 
  Settings,
  RefreshCw,
  Activity,
  Target,
  DollarSign,
  TrendingDown,
  Minus,
  ChevronDown,
  Globe,
  Loader,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  FileText,
  Shield,
  Users,
  Database
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // ... [rest of the component code remains exactly the same]
};

export default Dashboard;