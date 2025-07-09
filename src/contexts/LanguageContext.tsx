import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'it' | 'hi';

// Translation interface
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signals',
    'nav.history': 'History',
    'nav.admin': 'Admin',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'nav.register': 'Register',
    
    'auth.login.title': 'Sign in to your account',
    'auth.login.subtitle': 'Welcome back! Please enter your credentials.',
    'auth.register.title': 'Create your account',
    'auth.register.subtitle': 'Join thousands of traders using AI-powered signals.',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signIn': 'Sign In',
    'auth.createAccount': 'Create Account',
    'auth.orSignInWith': 'Or sign in with',
    'auth.orCreateWith': 'Or create account with',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signUpHere': 'Sign up here',
    'auth.signInHere': 'Sign in here',
    
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Generate AI-powered trading signals',
    'dashboard.currentPlan': 'Current Plan',
    'dashboard.signalsToday': 'Signals Today',
    'dashboard.remaining': 'Remaining',
    'dashboard.needMoreSignals': 'Need More Signals?',
    'dashboard.upgradeDesc': 'Upgrade your plan to get more daily signals and advanced features.',
    'dashboard.viewPlans': 'View Plans',
    
    'signal.title': 'Generate Signal',
    'signal.tradingPair': 'Trading Pair',
    'signal.tradingSchool': 'Trading School',
    'signal.advancedSettings': 'Advanced Settings',
    'signal.candleCount': 'Candle Count',
    'signal.aiProvider': 'AI Provider',
    'signal.fetchMarketData': 'Fetch Market Data',
    'signal.generateSignal': 'Generate Signal',
    'signal.fetchingData': 'Fetching Data...',
    'signal.analyzingMarket': 'Analyzing Market...',
    'signal.marketDataReady': 'Market Data Ready',
    'signal.demoData': 'Demo Data',
    'signal.dailyLimitReached': 'You have reached your daily signal limit. Upgrade your plan to get more signals.',
    
    'stats.accountType': 'Account Type',
    'stats.dailyLimit': 'Daily Limit',
    'stats.usedToday': 'Used Today',
    'stats.selectedPair': 'Selected Pair',
    'stats.dataSource': 'Data Source',
    'stats.live': 'Live Data',
    'stats.demo': 'Demo Data',
    
    'market.symbol': 'Symbol',
    'market.candles5min': '5min Candles',
    'market.candles15min': '15min Candles',
    'market.candles1h': '1h Candles',
    'market.candles4h': '4h Candles',
    
    'api.connected': 'Market API Connected',
    'api.disconnected': 'Market API Disconnected',
    'api.checking': 'Checking API Connection...',
    'api.retry': 'Retry Connection',
    'api.demoDataUsed': 'Using demo data',
    
    'error.apiNotConfigured': 'Market data API not configured. Using demo data instead.',
    'error.rateLimitReached': 'API rate limit reached. Using demo data instead.',
    'error.symbolNotFound': 'Symbol not found. Using demo data instead.',
    'error.marketDataUnavailable': 'Market data unavailable. Using demo data instead.',
    
    'common.loading': 'Loading...',
    
    'landing.hero.subtitle': 'Get professional trading signals powered by advanced AI analysis. Make smarter trading decisions with our cutting-edge platform.',
    'landing.hero.startTrial': 'Start Free Trial',
    
    'landing.features.title': 'Powerful Features',
    'landing.features.subtitle': 'Our platform combines cutting-edge AI with proven trading methodologies',
    'landing.features.ai.title': 'AI-Powered Analysis',
    'landing.features.ai.desc': 'Advanced algorithms analyze market data to generate accurate trading signals',
    'landing.features.secure.title': 'Secure & Reliable',
    'landing.features.secure.desc': 'Bank-level security with 99.9% uptime guarantee',
    'landing.features.schools.title': 'Multiple Trading Schools',
    'landing.features.schools.desc': 'Choose from different trading methodologies and strategies',
    
    'landing.pricing.title': 'Simple, Transparent Pricing',
    'landing.pricing.subtitle': 'Choose the plan that fits your trading needs',
    'landing.pricing.getStarted': 'Get Started',
    
    'landing.cta.title': 'Start Making Smarter Trades Today',
    'landing.cta.subtitle': 'Join thousands of traders who are already using AI Trader',
    'landing.cta.startTrial': 'Start Free Trial',
    
    'language.english': 'English',
    'language.french': 'French',
    'language.arabic': 'Arabic',
    'language.spanish': 'Spanish',
    'language.german': 'German',
    'language.italian': 'Italian',
    'language.hindi': 'Hindi'
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.signals': 'Signaux',
    'nav.history': 'Historique',
    'nav.admin': 'Admin',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.getStarted': 'Commencer',
    'nav.register': 'S\'inscrire',
    
    'auth.login.title': 'Connectez-vous à votre compte',
    'auth.login.subtitle': 'Bienvenue ! Veuillez entrer vos identifiants.',
    'auth.register.title': 'Créez votre compte',
    'auth.register.subtitle': 'Rejoignez des milliers de traders utilisant des signaux alimentés par l\'IA.',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.signIn': 'Se connecter',
    'auth.createAccount': 'Créer un compte',
    'auth.orSignInWith': 'Ou connectez-vous avec',
    'auth.orCreateWith': 'Ou créez un compte avec',
    'auth.dontHaveAccount': 'Vous n\'avez pas de compte ?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte ?',
    'auth.signUpHere': 'Inscrivez-vous ici',
    'auth.signInHere': 'Connectez-vous ici',
    
    'dashboard.title': 'Tableau de bord',
    'dashboard.subtitle': 'Générez des signaux de trading alimentés par l\'IA',
    'dashboard.currentPlan': 'Plan actuel',
    'dashboard.signalsToday': 'Signaux aujourd\'hui',
    'dashboard.remaining': 'Restants',
    'dashboard.needMoreSignals': 'Besoin de plus de signaux ?',
    'dashboard.upgradeDesc': 'Améliorez votre plan pour obtenir plus de signaux quotidiens et des fonctionnalités avancées.',
    'dashboard.viewPlans': 'Voir les plans',
    
    'signal.title': 'Générer un signal',
    'signal.tradingPair': 'Paire de trading',
    'signal.tradingSchool': 'École de trading',
    'signal.advancedSettings': 'Paramètres avancés',
    'signal.candleCount': 'Nombre de bougies',
    'signal.aiProvider': 'Fournisseur d\'IA',
    'signal.fetchMarketData': 'Récupérer les données du marché',
    'signal.generateSignal': 'Générer un signal',
    'signal.fetchingData': 'Récupération des données...',
    'signal.analyzingMarket': 'Analyse du marché...',
    'signal.marketDataReady': 'Données du marché prêtes',
    'signal.demoData': 'Données de démonstration',
    'signal.dailyLimitReached': 'Vous avez atteint votre limite quotidienne de signaux. Améliorez votre plan pour obtenir plus de signaux.',
    
    'stats.accountType': 'Type de compte',
    'stats.dailyLimit': 'Limite quotidienne',
    'stats.usedToday': 'Utilisés aujourd\'hui',
    'stats.selectedPair': 'Paire sélectionnée',
    'stats.dataSource': 'Source de données',
    'stats.live': 'Données en direct',
    'stats.demo': 'Données de démo',
    
    'market.symbol': 'Symbole',
    'market.candles5min': 'Bougies 5min',
    'market.candles15min': 'Bougies 15min',
    'market.candles1h': 'Bougies 1h',
    'market.candles4h': 'Bougies 4h',
    
    'api.connected': 'API de marché connectée',
    'api.disconnected': 'API de marché déconnectée',
    'api.checking': 'Vérification de la connexion API...',
    'api.retry': 'Réessayer la connexion',
    'api.demoDataUsed': 'Utilisation des données de démo',
    
    'error.apiNotConfigured': 'API de données de marché non configurée. Utilisation des données de démo à la place.',
    'error.rateLimitReached': 'Limite de taux API atteinte. Utilisation des données de démo à la place.',
    'error.symbolNotFound': 'Symbole non trouvé. Utilisation des données de démo à la place.',
    'error.marketDataUnavailable': 'Données de marché indisponibles. Utilisation des données de démo à la place.',
    
    'common.loading': 'Chargement...',
    
    'landing.hero.subtitle': 'Obtenez des signaux de trading professionnels alimentés par une analyse IA avancée. Prenez des décisions de trading plus intelligentes avec notre plateforme de pointe.',
    'landing.hero.startTrial': 'Commencer l\'essai gratuit',
    
    'landing.features.title': 'Fonctionnalités puissantes',
    'landing.features.subtitle': 'Notre plateforme combine l\'IA de pointe avec des méthodologies de trading éprouvées',
    'landing.features.ai.title': 'Analyse alimentée par l\'IA',
    'landing.features.ai.desc': 'Des algorithmes avancés analysent les données du marché pour générer des signaux de trading précis',
    'landing.features.secure.title': 'Sécurisé et fiable',
    'landing.features.secure.desc': 'Sécurité de niveau bancaire avec garantie de disponibilité de 99,9%',
    'landing.features.schools.title': 'Multiples écoles de trading',
    'landing.features.schools.desc': 'Choisissez parmi différentes méthodologies et stratégies de trading',
    
    'landing.pricing.title': 'Tarification simple et transparente',
    'landing.pricing.subtitle': 'Choisissez le plan qui correspond à vos besoins de trading',
    'landing.pricing.getStarted': 'Commencer',
    
    'landing.cta.title': 'Commencez à faire des trades plus intelligents dès aujourd\'hui',
    'landing.cta.subtitle': 'Rejoignez des milliers de traders qui utilisent déjà AI Trader',
    'landing.cta.startTrial': 'Commencer l\'essai gratuit',
    
    'language.english': 'Anglais',
    'language.french': 'Français',
    'language.arabic': 'Arabe',
    'language.spanish': 'Espagnol',
    'language.german': 'Allemand',
    'language.italian': 'Italien',
    'language.hindi': 'Hindi'
  },
  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.signals': 'الإشارات',
    'nav.history': 'التاريخ',
    'nav.admin': 'المشرف',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ الآن',
    'nav.register': 'التسجيل',
    
    'auth.login.title': 'تسجيل الدخول إلى حسابك',
    'auth.login.subtitle': 'مرحبًا بعودتك! الرجاء إدخال بيانات الاعتماد الخاصة بك.',
    'auth.register.title': 'إنشاء حسابك',
    'auth.register.subtitle': 'انضم إلى آلاف المتداولين الذين يستخدمون إشارات مدعومة بالذكاء الاصطناعي.',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.signIn': 'تسجيل الدخول',
    'auth.createAccount': 'إنشاء حساب',
    'auth.orSignInWith': 'أو سجل الدخول باستخدام',
    'auth.orCreateWith': 'أو أنشئ حسابًا باستخدام',
    'auth.dontHaveAccount': 'ليس لديك حساب؟',
    'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
    'auth.signUpHere': 'سجل هنا',
    'auth.signInHere': 'سجل الدخول هنا',
    
    'dashboard.title': 'لوحة التحكم',
    'dashboard.subtitle': 'توليد إشارات تداول مدعومة بالذكاء الاصطناعي',
    'dashboard.currentPlan': 'الخطة الحالية',
    'dashboard.signalsToday': 'إشارات اليوم',
    'dashboard.remaining': 'المتبقي',
    'dashboard.needMoreSignals': 'تحتاج إلى المزيد من الإشارات؟',
    'dashboard.upgradeDesc': 'قم بترقية خطتك للحصول على المزيد من الإشارات اليومية والميزات المتقدمة.',
    'dashboard.viewPlans': 'عرض الخطط',
    
    'signal.title': 'توليد إشارة',
    'signal.tradingPair': 'زوج التداول',
    'signal.tradingSchool': 'مدرسة التداول',
    'signal.advancedSettings': 'إعدادات متقدمة',
    'signal.candleCount': 'عدد الشموع',
    'signal.aiProvider': 'مزود الذكاء الاصطناعي',
    'signal.fetchMarketData': 'جلب بيانات السوق',
    'signal.generateSignal': 'توليد إشارة',
    'signal.fetchingData': 'جلب البيانات...',
    'signal.analyzingMarket': 'تحليل السوق...',
    'signal.marketDataReady': 'بيانات السوق جاهزة',
    'signal.demoData': 'بيانات تجريبية',
    'signal.dailyLimitReached': 'لقد وصلت إلى الحد اليومي للإشارات. قم بترقية خطتك للحصول على المزيد من الإشارات.',
    
    'stats.accountType': 'نوع الحساب',
    'stats.dailyLimit': 'الحد اليومي',
    'stats.usedToday': 'المستخدم اليوم',
    'stats.selectedPair': 'الزوج المحدد',
    'stats.dataSource': 'مصدر البيانات',
    'stats.live': 'بيانات مباشرة',
    'stats.demo': 'بيانات تجريبية',
    
    'market.symbol': 'الرمز',
    'market.candles5min': 'شموع 5 دقائق',
    'market.candles15min': 'شموع 15 دقيقة',
    'market.candles1h': 'شموع ساعة',
    'market.candles4h': 'شموع 4 ساعات',
    
    'api.connected': 'API السوق متصل',
    'api.disconnected': 'API السوق غير متصل',
    'api.checking': 'التحقق من اتصال API...',
    'api.retry': 'إعادة محاولة الاتصال',
    'api.demoDataUsed': 'استخدام بيانات تجريبية',
    
    'error.apiNotConfigured': 'API بيانات السوق غير مكون. استخدام بيانات تجريبية بدلاً من ذلك.',
    'error.rateLimitReached': 'تم الوصول إلى حد معدل API. استخدام بيانات تجريبية بدلاً من ذلك.',
    'error.symbolNotFound': 'الرمز غير موجود. استخدام بيانات تجريبية بدلاً من ذلك.',
    'error.marketDataUnavailable': 'بيانات السوق غير متوفرة. استخدام بيانات تجريبية بدلاً من ذلك.',
    
    'common.loading': 'جاري التحميل...',
    
    'landing.hero.subtitle': 'احصل على إشارات تداول احترافية مدعومة بتحليل الذكاء الاصطناعي المتقدم. اتخذ قرارات تداول أكثر ذكاءً مع منصتنا المتطورة.',
    'landing.hero.startTrial': 'ابدأ النسخة التجريبية المجانية',
    
    'landing.features.title': 'ميزات قوية',
    'landing.features.subtitle': 'تجمع منصتنا بين الذكاء الاصطناعي المتطور ومنهجيات التداول المثبتة',
    'landing.features.ai.title': 'تحليل مدعوم بالذكاء الاصطناعي',
    'landing.features.ai.desc': 'خوارزميات متقدمة تحلل بيانات السوق لتوليد إشارات تداول دقيقة',
    'landing.features.secure.title': 'آمن وموثوق',
    'landing.features.secure.desc': 'أمان على مستوى البنوك مع ضمان توفر بنسبة 99.9٪',
    'landing.features.schools.title': 'مدارس تداول متعددة',
    'landing.features.schools.desc': 'اختر من بين منهجيات واستراتيجيات تداول مختلفة',
    
    'landing.pricing.title': 'تسعير بسيط وشفاف',
    'landing.pricing.subtitle': 'اختر الخطة التي تناسب احتياجات التداول الخاصة بك',
    'landing.pricing.getStarted': 'ابدأ الآن',
    
    'landing.cta.title': 'ابدأ في إجراء تداولات أكثر ذكاءً اليوم',
    'landing.cta.subtitle': 'انضم إلى آلاف المتداولين الذين يستخدمون بالفعل AI Trader',
    'landing.cta.startTrial': 'ابدأ النسخة التجريبية المجانية',
    
    'language.english': 'الإنجليزية',
    'language.french': 'الفرنسية',
    'language.arabic': 'العربية',
    'language.spanish': 'الإسبانية',
    'language.german': 'الألمانية',
    'language.italian': 'الإيطالية',
    'language.hindi': 'الهندية'
  },
  // Add more languages as needed
  es: {
    // Spanish translations
    'nav.dashboard': 'Panel',
    'nav.signals': 'Señales',
    'nav.history': 'Historial',
    'nav.admin': 'Admin',
    'nav.settings': 'Ajustes',
    'nav.logout': 'Cerrar sesión',
    'nav.login': 'Iniciar sesión',
    'nav.getStarted': 'Comenzar',
    'nav.register': 'Registrarse',
    
    'language.english': 'Inglés',
    'language.french': 'Francés',
    'language.arabic': 'Árabe',
    'language.spanish': 'Español',
    'language.german': 'Alemán',
    'language.italian': 'Italiano',
    'language.hindi': 'Hindi'
  },
  de: {
    // German translations
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signale',
    'nav.history': 'Verlauf',
    'nav.admin': 'Admin',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',
    'nav.getStarted': 'Loslegen',
    'nav.register': 'Registrieren',
    
    'language.english': 'Englisch',
    'language.french': 'Französisch',
    'language.arabic': 'Arabisch',
    'language.spanish': 'Spanisch',
    'language.german': 'Deutsch',
    'language.italian': 'Italienisch',
    'language.hindi': 'Hindi'
  },
  it: {
    // Italian translations
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Segnali',
    'nav.history': 'Cronologia',
    'nav.admin': 'Admin',
    'nav.settings': 'Impostazioni',
    'nav.logout': 'Disconnetti',
    'nav.login': 'Accedi',
    'nav.getStarted': 'Inizia',
    'nav.register': 'Registrati',
    
    'language.english': 'Inglese',
    'language.french': 'Francese',
    'language.arabic': 'Arabo',
    'language.spanish': 'Spagnolo',
    'language.german': 'Tedesco',
    'language.italian': 'Italiano',
    'language.hindi': 'Hindi'
  },
  hi: {
    // Hindi translations
    'nav.dashboard': 'डैशबोर्ड',
    'nav.signals': 'सिग्नल',
    'nav.history': 'इतिहास',
    'nav.admin': 'एडमिन',
    'nav.settings': 'सेटिंग्स',
    'nav.logout': 'लॉगआउट',
    'nav.login': 'लॉगिन',
    'nav.getStarted': 'शुरू करें',
    'nav.register': 'रजिस्टर करें',
    
    'language.english': 'अंग्रेज़ी',
    'language.french': 'फ्रेंच',
    'language.arabic': 'अरबी',
    'language.spanish': 'स्पैनिश',
    'language.german': 'जर्मन',
    'language.italian': 'इटैलियन',
    'language.hindi': 'हिंदी'
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get browser language or use stored preference
  const getBrowserLanguage = (): Language => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage && Object.keys(translations).includes(storedLanguage)) {
      return storedLanguage as Language;
    }
    
    // Get browser language
    const browserLang = navigator.language.split('-')[0];
    
    // Check if browser language is supported
    if (Object.keys(translations).includes(browserLang)) {
      return browserLang as Language;
    }
    
    // Default to English
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getBrowserLanguage());
  const [isRTL, setIsRTL] = useState<boolean>(language === 'ar');

  // Set language and update RTL status
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    setIsRTL(newLanguage === 'ar');
    
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Set lang attribute
    document.documentElement.lang = newLanguage;
  };

  // Initialize RTL on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, []);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to English if translation not found
        let fallback = translations['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found in English either
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};