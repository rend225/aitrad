import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signals',
    'nav.history': 'History',
    'nav.admin': 'Admin',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'nav.logout': 'Logout',

    // Landing Page
    'landing.hero.title': 'AI-Powered Trading Signals',
    'landing.hero.subtitle': 'Get intelligent trading recommendations powered by advanced AI analysis. Make smarter trading decisions with our cutting-edge signal generation platform.',
    'landing.hero.startTrial': 'Start Free Trial',
    'landing.hero.viewPlans': 'View Plans',
    
    'landing.features.title': 'Why Choose AI Trader?',
    'landing.features.subtitle': 'Advanced technology meets professional trading insights',
    'landing.features.ai.title': 'AI-Powered Signals',
    'landing.features.ai.desc': 'Advanced GPT-4 analysis of market data to generate precise trading recommendations',
    'landing.features.secure.title': 'Secure & Reliable',
    'landing.features.secure.desc': 'Enterprise-grade security with Firebase backend and encrypted data transmission',
    'landing.features.schools.title': 'Multiple Trading Schools',
    'landing.features.schools.desc': 'Choose from different analysis methodologies and trading strategies',

    'landing.pricing.title': 'Simple, Transparent Pricing',
    'landing.pricing.subtitle': 'Choose the plan that fits your trading needs',
    'landing.pricing.getStarted': 'Get Started',

    'landing.cta.title': 'Ready to Transform Your Trading?',
    'landing.cta.subtitle': 'Join thousands of traders who trust AI Trader for their market insights',
    'landing.cta.startTrial': 'Start Your Free Trial',

    // Plans
    'plans.title': 'Choose Your Trading Plan',
    'plans.subtitle': 'Unlock the power of AI-driven trading insights with our comprehensive plans designed for traders at every level',
    'plans.noSetupFees': 'No setup fees',
    'plans.cancelAnytime': 'Cancel anytime',
    'plans.support247': '24/7 support',
    'plans.mostPopular': 'Most Popular',
    'plans.bestValue': 'Best Value',
    'plans.currentPlan': 'Current Plan',
    'plans.freeForever': 'Free Forever',
    'plans.signInToSubscribe': 'Sign In to Subscribe',
    'plans.comingSoon': 'Coming Soon',
    'plans.setupRequired': 'Setup Required',
    'plans.cancel': 'Cancel',

    // Dashboard
    'dashboard.title': 'AI Trading Dashboard',
    'dashboard.subtitle': 'Generate professional trading signals with real market data analysis',
    'dashboard.currentPlan': 'Current Plan',
    'dashboard.signalsToday': 'Signals Today',
    'dashboard.remaining': 'Remaining',
    'dashboard.needMoreSignals': 'Need More Signals?',
    'dashboard.upgradeDesc': 'Upgrade to Pro or Elite for more daily signals and advanced features.',
    'dashboard.viewPlans': 'View Plans',

    // Signal Generator
    'signal.title': 'Professional Signal Generator',
    'signal.tradingPair': 'Trading Pair',
    'signal.tradingSchool': 'Trading School',
    'signal.advancedSettings': 'Advanced Settings',
    'signal.candleCount': 'Candle Count',
    'signal.aiProvider': 'AI Provider',
    'signal.marketDataReady': 'Market Data Ready',
    'signal.demoData': 'Demo Data',
    'signal.fetchMarketData': 'Fetch Market Data',
    'signal.generateSignal': 'Generate Signal',
    'signal.analyzingMarket': 'Analyzing Market...',
    'signal.fetchingData': 'Fetching Market Data...',
    'signal.latestSignal': 'Latest Signal',
    'signal.fullAnalysis': 'Full Analysis',
    'signal.dailyLimitReached': 'Daily limit reached. Upgrade your plan for more signals.',

    // Signal Types
    'signal.type.buy': 'BUY',
    'signal.type.sell': 'SELL',
    'signal.type.hold': 'HOLD',
    'signal.entry': 'Entry',
    'signal.stopLoss': 'Stop Loss',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'Probability',
    'signal.risk': 'Risk',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.refresh': 'Refresh',
    'common.export': 'Export',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.confirm': 'Confirm',

    // Auth
    'auth.login.title': 'Welcome back',
    'auth.login.subtitle': 'Sign in to your account to continue',
    'auth.register.title': 'Create your account',
    'auth.register.subtitle': 'Start your journey with AI-powered trading signals',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Sign up',
    'auth.createAccount': 'Create account',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInHere': 'Sign in here',
    'auth.signUpHere': 'Sign up here',
    'auth.orContinueWith': 'Or continue with',
    'auth.orSignInWith': 'Or sign in with email',
    'auth.orCreateWith': 'Or create account with email',

    // Settings
    'settings.title': 'Account Settings',
    'settings.subtitle': 'Manage your account preferences and security settings',
    'settings.profile': 'Profile',
    'settings.security': 'Security',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.subscription': 'Subscription',
    'settings.language': 'Language',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'Account Type',
    'stats.dailyLimit': 'Daily Limit',
    'stats.usedToday': 'Used Today',
    'stats.selectedPair': 'Selected Pair',
    'stats.dataSource': 'Data Source',
    'stats.live': 'Live',
    'stats.demo': 'Demo',

    // Market Data
    'market.symbol': 'Symbol',
    'market.candles5min': '5min Candles',
    'market.candles15min': '15min Candles',
    'market.candles1h': '1h Candles',
    'market.candles4h': '4h Candles',

    // API Status
    'api.connected': 'API Connected',
    'api.disconnected': 'API Disconnected',
    'api.checking': 'Checking API...',
    'api.demoDataUsed': 'Demo data will be used',
    'api.retry': 'Retry',

    // Errors
    'error.apiNotConfigured': 'TwelveData API key not configured. Using demo data instead.',
    'error.rateLimitReached': 'API rate limit reached. Using demo data instead.',
    'error.symbolNotFound': 'Symbol not found or invalid. Using demo data instead.',
    'error.marketDataUnavailable': 'Market data unavailable. Using demo data instead.',
    'error.paymentFailed': 'Payment failed. Please try again or contact support.',
    'error.subscriptionFailed': 'Subscription activation failed. Please contact support with your payment details.',
    'error.accessDenied': 'Access Denied',
    'error.noAdminPrivileges': "You don't have admin privileges to access this page.",
  },

  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.signals': 'الإشارات',
    'nav.history': 'التاريخ',
    'nav.admin': 'المدير',
    'nav.settings': 'الإعدادات',
    'nav.login': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ الآن',
    'nav.logout': 'تسجيل الخروج',

    // Landing Page
    'landing.hero.title': 'إشارات التداول المدعومة بالذكاء الاصطناعي',
    'landing.hero.subtitle': 'احصل على توصيات تداول ذكية مدعومة بتحليل الذكاء الاصطناعي المتقدم. اتخذ قرارات تداول أذكى مع منصة توليد الإشارات المتطورة.',
    'landing.hero.startTrial': 'ابدأ التجربة المجانية',
    'landing.hero.viewPlans': 'عرض الخطط',
    
    'landing.features.title': 'لماذا تختار AI Trader؟',
    'landing.features.subtitle': 'التكنولوجيا المتقدمة تلتقي برؤى التداول المهنية',
    'landing.features.ai.title': 'إشارات مدعومة بالذكاء الاصطناعي',
    'landing.features.ai.desc': 'تحليل GPT-4 المتقدم لبيانات السوق لتوليد توصيات تداول دقيقة',
    'landing.features.secure.title': 'آمن وموثوق',
    'landing.features.secure.desc': 'أمان على مستوى المؤسسات مع خلفية Firebase ونقل البيانات المشفرة',
    'landing.features.schools.title': 'مدارس تداول متعددة',
    'landing.features.schools.desc': 'اختر من منهجيات تحليل واستراتيجيات تداول مختلفة',

    'landing.pricing.title': 'تسعير بسيط وشفاف',
    'landing.pricing.subtitle': 'اختر الخطة التي تناسب احتياجات التداول الخاصة بك',
    'landing.pricing.getStarted': 'ابدأ الآن',

    'landing.cta.title': 'مستعد لتحويل تداولك؟',
    'landing.cta.subtitle': 'انضم إلى آلاف المتداولين الذين يثقون في AI Trader لرؤى السوق',
    'landing.cta.startTrial': 'ابدأ تجربتك المجانية',

    // Plans
    'plans.title': 'اختر خطة التداول الخاصة بك',
    'plans.subtitle': 'اكتشف قوة رؤى التداول المدعومة بالذكاء الاصطناعي مع خططنا الشاملة المصممة للمتداولين في كل مستوى',
    'plans.noSetupFees': 'بدون رسوم إعداد',
    'plans.cancelAnytime': 'إلغاء في أي وقت',
    'plans.support247': 'دعم 24/7',
    'plans.mostPopular': 'الأكثر شعبية',
    'plans.bestValue': 'أفضل قيمة',
    'plans.currentPlan': 'الخطة الحالية',
    'plans.freeForever': 'مجاني إلى الأبد',
    'plans.signInToSubscribe': 'سجل الدخول للاشتراك',
    'plans.comingSoon': 'قريباً',
    'plans.setupRequired': 'يتطلب إعداد',
    'plans.cancel': 'إلغاء',

    // Dashboard
    'dashboard.title': 'لوحة تحكم التداول بالذكاء الاصطناعي',
    'dashboard.subtitle': 'توليد إشارات تداول احترافية مع تحليل بيانات السوق الحقيقية',
    'dashboard.currentPlan': 'الخطة الحالية',
    'dashboard.signalsToday': 'الإشارات اليوم',
    'dashboard.remaining': 'المتبقي',
    'dashboard.needMoreSignals': 'تحتاج المزيد من الإشارات؟',
    'dashboard.upgradeDesc': 'ترقية إلى Pro أو Elite للحصول على المزيد من الإشارات اليومية والميزات المتقدمة.',
    'dashboard.viewPlans': 'عرض الخطط',

    // Signal Generator
    'signal.title': 'مولد الإشارات المهني',
    'signal.tradingPair': 'زوج التداول',
    'signal.tradingSchool': 'مدرسة التداول',
    'signal.advancedSettings': 'الإعدادات المتقدمة',
    'signal.candleCount': 'عدد الشموع',
    'signal.aiProvider': 'مزود الذكاء الاصطناعي',
    'signal.marketDataReady': 'بيانات السوق جاهزة',
    'signal.demoData': 'بيانات تجريبية',
    'signal.fetchMarketData': 'جلب بيانات السوق',
    'signal.generateSignal': 'توليد الإشارة',
    'signal.analyzingMarket': 'تحليل السوق...',
    'signal.fetchingData': 'جلب بيانات السوق...',
    'signal.latestSignal': 'أحدث إشارة',
    'signal.fullAnalysis': 'التحليل الكامل',
    'signal.dailyLimitReached': 'تم الوصول للحد اليومي. ترقية خطتك للحصول على المزيد من الإشارات.',

    // Signal Types
    'signal.type.buy': 'شراء',
    'signal.type.sell': 'بيع',
    'signal.type.hold': 'انتظار',
    'signal.entry': 'الدخول',
    'signal.stopLoss': 'وقف الخسارة',
    'signal.takeProfit1': 'جني الأرباح 1',
    'signal.takeProfit2': 'جني الأرباح 2',
    'signal.probability': 'الاحتمالية',
    'signal.risk': 'المخاطرة',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.refresh': 'تحديث',
    'common.export': 'تصدير',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.submit': 'إرسال',
    'common.confirm': 'تأكيد',

    // Auth
    'auth.login.title': 'مرحباً بعودتك',
    'auth.login.subtitle': 'سجل الدخول إلى حسابك للمتابعة',
    'auth.register.title': 'إنشاء حسابك',
    'auth.register.subtitle': 'ابدأ رحلتك مع إشارات التداول المدعومة بالذكاء الاصطناعي',
    'auth.email': 'عنوان البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'التسجيل',
    'auth.createAccount': 'إنشاء حساب',
    'auth.dontHaveAccount': 'ليس لديك حساب؟',
    'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
    'auth.signInHere': 'سجل الدخول هنا',
    'auth.signUpHere': 'سجل هنا',
    'auth.orContinueWith': 'أو تابع مع',
    'auth.orSignInWith': 'أو سجل الدخول بالبريد الإلكتروني',
    'auth.orCreateWith': 'أو أنشئ حساب بالبريد الإلكتروني',

    // Settings
    'settings.title': 'إعدادات الحساب',
    'settings.subtitle': 'إدارة تفضيلات حسابك وإعدادات الأمان',
    'settings.profile': 'الملف الشخصي',
    'settings.security': 'الأمان',
    'settings.notifications': 'الإشعارات',
    'settings.privacy': 'الخصوصية',
    'settings.subscription': 'الاشتراك',
    'settings.language': 'اللغة',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'نوع الحساب',
    'stats.dailyLimit': 'الحد اليومي',
    'stats.usedToday': 'المستخدم اليوم',
    'stats.selectedPair': 'الزوج المحدد',
    'stats.dataSource': 'مصدر البيانات',
    'stats.live': 'مباشر',
    'stats.demo': 'تجريبي',

    // Market Data
    'market.symbol': 'الرمز',
    'market.candles5min': 'شموع 5 دقائق',
    'market.candles15min': 'شموع 15 دقيقة',
    'market.candles1h': 'شموع ساعة',
    'market.candles4h': 'شموع 4 ساعات',

    // API Status
    'api.connected': 'API متصل',
    'api.disconnected': 'API منقطع',
    'api.checking': 'فحص API...',
    'api.demoDataUsed': 'سيتم استخدام البيانات التجريبية',
    'api.retry': 'إعادة المحاولة',

    // Errors
    'error.apiNotConfigured': 'مفتاح TwelveData API غير مكون. استخدام البيانات التجريبية بدلاً من ذلك.',
    'error.rateLimitReached': 'تم الوصول لحد معدل API. استخدام البيانات التجريبية بدلاً من ذلك.',
    'error.symbolNotFound': 'الرمز غير موجود أو غير صالح. استخدام البيانات التجريبية بدلاً من ذلك.',
    'error.marketDataUnavailable': 'بيانات السوق غير متاحة. استخدام البيانات التجريبية بدلاً من ذلك.',
    'error.paymentFailed': 'فشل الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
    'error.subscriptionFailed': 'فشل تفعيل الاشتراك. يرجى الاتصال بالدعم مع تفاصيل الدفع.',
    'error.accessDenied': 'تم رفض الوصول',
    'error.noAdminPrivileges': 'ليس لديك صلاحيات المدير للوصول إلى هذه الصفحة.',
  },

  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.signals': 'Signaux',
    'nav.history': 'Historique',
    'nav.admin': 'Admin',
    'nav.settings': 'Paramètres',
    'nav.login': 'Connexion',
    'nav.getStarted': 'Commencer',
    'nav.logout': 'Déconnexion',

    // Landing Page
    'landing.hero.title': 'Signaux de Trading Alimentés par IA',
    'landing.hero.subtitle': 'Obtenez des recommandations de trading intelligentes alimentées par une analyse IA avancée. Prenez des décisions de trading plus intelligentes avec notre plateforme de génération de signaux de pointe.',
    'landing.hero.startTrial': 'Commencer l\'Essai Gratuit',
    'landing.hero.viewPlans': 'Voir les Plans',
    
    'landing.features.title': 'Pourquoi Choisir AI Trader ?',
    'landing.features.subtitle': 'La technologie avancée rencontre les insights de trading professionnels',
    'landing.features.ai.title': 'Signaux Alimentés par IA',
    'landing.features.ai.desc': 'Analyse GPT-4 avancée des données de marché pour générer des recommandations de trading précises',
    'landing.features.secure.title': 'Sécurisé et Fiable',
    'landing.features.secure.desc': 'Sécurité de niveau entreprise avec backend Firebase et transmission de données chiffrées',
    'landing.features.schools.title': 'Écoles de Trading Multiples',
    'landing.features.schools.desc': 'Choisissez parmi différentes méthodologies d\'analyse et stratégies de trading',

    'landing.pricing.title': 'Tarification Simple et Transparente',
    'landing.pricing.subtitle': 'Choisissez le plan qui correspond à vos besoins de trading',
    'landing.pricing.getStarted': 'Commencer',

    'landing.cta.title': 'Prêt à Transformer Votre Trading ?',
    'landing.cta.subtitle': 'Rejoignez des milliers de traders qui font confiance à AI Trader pour leurs insights de marché',
    'landing.cta.startTrial': 'Commencez Votre Essai Gratuit',

    // Plans
    'plans.title': 'Choisissez Votre Plan de Trading',
    'plans.subtitle': 'Débloquez la puissance des insights de trading alimentés par IA avec nos plans complets conçus pour les traders de tous niveaux',
    'plans.noSetupFees': 'Pas de frais d\'installation',
    'plans.cancelAnytime': 'Annuler à tout moment',
    'plans.support247': 'Support 24/7',
    'plans.mostPopular': 'Le Plus Populaire',
    'plans.bestValue': 'Meilleure Valeur',
    'plans.currentPlan': 'Plan Actuel',
    'plans.freeForever': 'Gratuit Pour Toujours',
    'plans.signInToSubscribe': 'Se Connecter pour S\'Abonner',
    'plans.comingSoon': 'Bientôt Disponible',
    'plans.setupRequired': 'Configuration Requise',
    'plans.cancel': 'Annuler',

    // Dashboard
    'dashboard.title': 'Tableau de Bord Trading IA',
    'dashboard.subtitle': 'Générez des signaux de trading professionnels avec l\'analyse de données de marché en temps réel',
    'dashboard.currentPlan': 'Plan Actuel',
    'dashboard.signalsToday': 'Signaux Aujourd\'hui',
    'dashboard.remaining': 'Restant',
    'dashboard.needMoreSignals': 'Besoin de Plus de Signaux ?',
    'dashboard.upgradeDesc': 'Passez à Pro ou Elite pour plus de signaux quotidiens et des fonctionnalités avancées.',
    'dashboard.viewPlans': 'Voir les Plans',

    // Signal Generator
    'signal.title': 'Générateur de Signaux Professionnel',
    'signal.tradingPair': 'Paire de Trading',
    'signal.tradingSchool': 'École de Trading',
    'signal.advancedSettings': 'Paramètres Avancés',
    'signal.candleCount': 'Nombre de Bougies',
    'signal.aiProvider': 'Fournisseur IA',
    'signal.marketDataReady': 'Données de Marché Prêtes',
    'signal.demoData': 'Données Démo',
    'signal.fetchMarketData': 'Récupérer les Données de Marché',
    'signal.generateSignal': 'Générer le Signal',
    'signal.analyzingMarket': 'Analyse du Marché...',
    'signal.fetchingData': 'Récupération des Données de Marché...',
    'signal.latestSignal': 'Dernier Signal',
    'signal.fullAnalysis': 'Analyse Complète',
    'signal.dailyLimitReached': 'Limite quotidienne atteinte. Améliorez votre plan pour plus de signaux.',

    // Signal Types
    'signal.type.buy': 'ACHETER',
    'signal.type.sell': 'VENDRE',
    'signal.type.hold': 'TENIR',
    'signal.entry': 'Entrée',
    'signal.stopLoss': 'Stop Loss',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'Probabilité',
    'signal.risk': 'Risque',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.refresh': 'Actualiser',
    'common.export': 'Exporter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.submit': 'Soumettre',
    'common.confirm': 'Confirmer',

    // Auth
    'auth.login.title': 'Bon retour',
    'auth.login.subtitle': 'Connectez-vous à votre compte pour continuer',
    'auth.register.title': 'Créez votre compte',
    'auth.register.subtitle': 'Commencez votre voyage avec les signaux de trading alimentés par IA',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'S\'inscrire',
    'auth.createAccount': 'Créer un compte',
    'auth.dontHaveAccount': 'Vous n\'avez pas de compte ?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte ?',
    'auth.signInHere': 'Connectez-vous ici',
    'auth.signUpHere': 'Inscrivez-vous ici',
    'auth.orContinueWith': 'Ou continuez avec',
    'auth.orSignInWith': 'Ou connectez-vous avec l\'e-mail',
    'auth.orCreateWith': 'Ou créez un compte avec l\'e-mail',

    // Settings
    'settings.title': 'Paramètres du Compte',
    'settings.subtitle': 'Gérez vos préférences de compte et paramètres de sécurité',
    'settings.profile': 'Profil',
    'settings.security': 'Sécurité',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.subscription': 'Abonnement',
    'settings.language': 'Langue',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'Type de Compte',
    'stats.dailyLimit': 'Limite Quotidienne',
    'stats.usedToday': 'Utilisé Aujourd\'hui',
    'stats.selectedPair': 'Paire Sélectionnée',
    'stats.dataSource': 'Source de Données',
    'stats.live': 'En Direct',
    'stats.demo': 'Démo',

    // Market Data
    'market.symbol': 'Symbole',
    'market.candles5min': 'Bougies 5min',
    'market.candles15min': 'Bougies 15min',
    'market.candles1h': 'Bougies 1h',
    'market.candles4h': 'Bougies 4h',

    // API Status
    'api.connected': 'API Connectée',
    'api.disconnected': 'API Déconnectée',
    'api.checking': 'Vérification API...',
    'api.demoDataUsed': 'Les données démo seront utilisées',
    'api.retry': 'Réessayer',

    // Errors
    'error.apiNotConfigured': 'Clé API TwelveData non configurée. Utilisation des données démo à la place.',
    'error.rateLimitReached': 'Limite de taux API atteinte. Utilisation des données démo à la place.',
    'error.symbolNotFound': 'Symbole non trouvé ou invalide. Utilisation des données démo à la place.',
    'error.marketDataUnavailable': 'Données de marché indisponibles. Utilisation des données démo à la place.',
    'error.paymentFailed': 'Échec du paiement. Veuillez réessayer ou contacter le support.',
    'error.subscriptionFailed': 'Échec de l\'activation de l\'abonnement. Veuillez contacter le support avec vos détails de paiement.',
    'error.accessDenied': 'Accès Refusé',
    'error.noAdminPrivileges': 'Vous n\'avez pas les privilèges d\'administrateur pour accéder à cette page.',
  },

  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.signals': 'Señales',
    'nav.history': 'Historial',
    'nav.admin': 'Admin',
    'nav.settings': 'Configuración',
    'nav.login': 'Iniciar Sesión',
    'nav.getStarted': 'Comenzar',
    'nav.logout': 'Cerrar Sesión',

    // Landing Page
    'landing.hero.title': 'Señales de Trading Impulsadas por IA',
    'landing.hero.subtitle': 'Obtén recomendaciones de trading inteligentes impulsadas por análisis avanzado de IA. Toma decisiones de trading más inteligentes con nuestra plataforma de generación de señales de vanguardia.',
    'landing.hero.startTrial': 'Comenzar Prueba Gratuita',
    'landing.hero.viewPlans': 'Ver Planes',
    
    'landing.features.title': '¿Por Qué Elegir AI Trader?',
    'landing.features.subtitle': 'La tecnología avanzada se encuentra con insights de trading profesionales',
    'landing.features.ai.title': 'Señales Impulsadas por IA',
    'landing.features.ai.desc': 'Análisis GPT-4 avanzado de datos de mercado para generar recomendaciones de trading precisas',
    'landing.features.secure.title': 'Seguro y Confiable',
    'landing.features.secure.desc': 'Seguridad de nivel empresarial con backend Firebase y transmisión de datos encriptada',
    'landing.features.schools.title': 'Múltiples Escuelas de Trading',
    'landing.features.schools.desc': 'Elige entre diferentes metodologías de análisis y estrategias de trading',

    'landing.pricing.title': 'Precios Simples y Transparentes',
    'landing.pricing.subtitle': 'Elige el plan que se adapte a tus necesidades de trading',
    'landing.pricing.getStarted': 'Comenzar',

    'landing.cta.title': '¿Listo para Transformar tu Trading?',
    'landing.cta.subtitle': 'Únete a miles de traders que confían en AI Trader para sus insights de mercado',
    'landing.cta.startTrial': 'Comienza tu Prueba Gratuita',

    // Plans
    'plans.title': 'Elige tu Plan de Trading',
    'plans.subtitle': 'Desbloquea el poder de los insights de trading impulsados por IA con nuestros planes integrales diseñados para traders de todos los niveles',
    'plans.noSetupFees': 'Sin tarifas de configuración',
    'plans.cancelAnytime': 'Cancelar en cualquier momento',
    'plans.support247': 'Soporte 24/7',
    'plans.mostPopular': 'Más Popular',
    'plans.bestValue': 'Mejor Valor',
    'plans.currentPlan': 'Plan Actual',
    'plans.freeForever': 'Gratis Para Siempre',
    'plans.signInToSubscribe': 'Iniciar Sesión para Suscribirse',
    'plans.comingSoon': 'Próximamente',
    'plans.setupRequired': 'Configuración Requerida',
    'plans.cancel': 'Cancelar',

    // Dashboard
    'dashboard.title': 'Panel de Trading con IA',
    'dashboard.subtitle': 'Genera señales de trading profesionales con análisis de datos de mercado en tiempo real',
    'dashboard.currentPlan': 'Plan Actual',
    'dashboard.signalsToday': 'Señales Hoy',
    'dashboard.remaining': 'Restante',
    'dashboard.needMoreSignals': '¿Necesitas Más Señales?',
    'dashboard.upgradeDesc': 'Actualiza a Pro o Elite para más señales diarias y características avanzadas.',
    'dashboard.viewPlans': 'Ver Planes',

    // Signal Generator
    'signal.title': 'Generador de Señales Profesional',
    'signal.tradingPair': 'Par de Trading',
    'signal.tradingSchool': 'Escuela de Trading',
    'signal.advancedSettings': 'Configuración Avanzada',
    'signal.candleCount': 'Número de Velas',
    'signal.aiProvider': 'Proveedor de IA',
    'signal.marketDataReady': 'Datos de Mercado Listos',
    'signal.demoData': 'Datos Demo',
    'signal.fetchMarketData': 'Obtener Datos de Mercado',
    'signal.generateSignal': 'Generar Señal',
    'signal.analyzingMarket': 'Analizando Mercado...',
    'signal.fetchingData': 'Obteniendo Datos de Mercado...',
    'signal.latestSignal': 'Última Señal',
    'signal.fullAnalysis': 'Análisis Completo',
    'signal.dailyLimitReached': 'Límite diario alcanzado. Actualiza tu plan para más señales.',

    // Signal Types
    'signal.type.buy': 'COMPRAR',
    'signal.type.sell': 'VENDER',
    'signal.type.hold': 'MANTENER',
    'signal.entry': 'Entrada',
    'signal.stopLoss': 'Stop Loss',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'Probabilidad',
    'signal.risk': 'Riesgo',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.refresh': 'Actualizar',
    'common.export': 'Exportar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.submit': 'Enviar',
    'common.confirm': 'Confirmar',

    // Auth
    'auth.login.title': 'Bienvenido de vuelta',
    'auth.login.subtitle': 'Inicia sesión en tu cuenta para continuar',
    'auth.register.title': 'Crea tu cuenta',
    'auth.register.subtitle': 'Comienza tu viaje con señales de trading impulsadas por IA',
    'auth.email': 'Dirección de correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.signIn': 'Iniciar sesión',
    'auth.signUp': 'Registrarse',
    'auth.createAccount': 'Crear cuenta',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.signInHere': 'Inicia sesión aquí',
    'auth.signUpHere': 'Regístrate aquí',
    'auth.orContinueWith': 'O continúa con',
    'auth.orSignInWith': 'O inicia sesión con correo electrónico',
    'auth.orCreateWith': 'O crea cuenta con correo electrónico',

    // Settings
    'settings.title': 'Configuración de Cuenta',
    'settings.subtitle': 'Gestiona las preferencias de tu cuenta y configuración de seguridad',
    'settings.profile': 'Perfil',
    'settings.security': 'Seguridad',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Privacidad',
    'settings.subscription': 'Suscripción',
    'settings.language': 'Idioma',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'Tipo de Cuenta',
    'stats.dailyLimit': 'Límite Diario',
    'stats.usedToday': 'Usado Hoy',
    'stats.selectedPair': 'Par Seleccionado',
    'stats.dataSource': 'Fuente de Datos',
    'stats.live': 'En Vivo',
    'stats.demo': 'Demo',

    // Market Data
    'market.symbol': 'Símbolo',
    'market.candles5min': 'Velas 5min',
    'market.candles15min': 'Velas 15min',
    'market.candles1h': 'Velas 1h',
    'market.candles4h': 'Velas 4h',

    // API Status
    'api.connected': 'API Conectada',
    'api.disconnected': 'API Desconectada',
    'api.checking': 'Verificando API...',
    'api.demoDataUsed': 'Se usarán datos demo',
    'api.retry': 'Reintentar',

    // Errors
    'error.apiNotConfigured': 'Clave API de TwelveData no configurada. Usando datos demo en su lugar.',
    'error.rateLimitReached': 'Límite de tasa de API alcanzado. Usando datos demo en su lugar.',
    'error.symbolNotFound': 'Símbolo no encontrado o inválido. Usando datos demo en su lugar.',
    'error.marketDataUnavailable': 'Datos de mercado no disponibles. Usando datos demo en su lugar.',
    'error.paymentFailed': 'Pago fallido. Por favor intenta de nuevo o contacta soporte.',
    'error.subscriptionFailed': 'Activación de suscripción fallida. Por favor contacta soporte con tus detalles de pago.',
    'error.accessDenied': 'Acceso Denegado',
    'error.noAdminPrivileges': 'No tienes privilegios de administrador para acceder a esta página.',
  },

  // NEW: German Language Support 🇩🇪
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signale',
    'nav.history': 'Verlauf',
    'nav.admin': 'Admin',
    'nav.settings': 'Einstellungen',
    'nav.login': 'Anmelden',
    'nav.getStarted': 'Loslegen',
    'nav.logout': 'Abmelden',

    // Landing Page
    'landing.hero.title': 'KI-gestützte Trading-Signale',
    'landing.hero.subtitle': 'Erhalten Sie intelligente Trading-Empfehlungen, die von fortschrittlicher KI-Analyse angetrieben werden. Treffen Sie klügere Trading-Entscheidungen mit unserer hochmodernen Signal-Generierungsplattform.',
    'landing.hero.startTrial': 'Kostenlose Testversion starten',
    'landing.hero.viewPlans': 'Pläne ansehen',
    
    'landing.features.title': 'Warum AI Trader wählen?',
    'landing.features.subtitle': 'Fortschrittliche Technologie trifft auf professionelle Trading-Einblicke',
    'landing.features.ai.title': 'KI-gestützte Signale',
    'landing.features.ai.desc': 'Fortschrittliche GPT-4-Analyse von Marktdaten zur Generierung präziser Trading-Empfehlungen',
    'landing.features.secure.title': 'Sicher & Zuverlässig',
    'landing.features.secure.desc': 'Unternehmenssicherheit mit Firebase-Backend und verschlüsselter Datenübertragung',
    'landing.features.schools.title': 'Mehrere Trading-Schulen',
    'landing.features.schools.desc': 'Wählen Sie aus verschiedenen Analysemethoden und Trading-Strategien',

    'landing.pricing.title': 'Einfache, transparente Preise',
    'landing.pricing.subtitle': 'Wählen Sie den Plan, der zu Ihren Trading-Bedürfnissen passt',
    'landing.pricing.getStarted': 'Loslegen',

    'landing.cta.title': 'Bereit, Ihr Trading zu transformieren?',
    'landing.cta.subtitle': 'Schließen Sie sich Tausenden von Tradern an, die AI Trader für ihre Markteinblicke vertrauen',
    'landing.cta.startTrial': 'Starten Sie Ihre kostenlose Testversion',

    // Plans
    'plans.title': 'Wählen Sie Ihren Trading-Plan',
    'plans.subtitle': 'Entfesseln Sie die Kraft KI-gestützter Trading-Einblicke mit unseren umfassenden Plänen für Trader aller Ebenen',
    'plans.noSetupFees': 'Keine Einrichtungsgebühren',
    'plans.cancelAnytime': 'Jederzeit kündbar',
    'plans.support247': '24/7 Support',
    'plans.mostPopular': 'Am beliebtesten',
    'plans.bestValue': 'Bester Wert',
    'plans.currentPlan': 'Aktueller Plan',
    'plans.freeForever': 'Für immer kostenlos',
    'plans.signInToSubscribe': 'Anmelden zum Abonnieren',
    'plans.comingSoon': 'Demnächst',
    'plans.setupRequired': 'Einrichtung erforderlich',
    'plans.cancel': 'Abbrechen',

    // Dashboard
    'dashboard.title': 'KI Trading Dashboard',
    'dashboard.subtitle': 'Generieren Sie professionelle Trading-Signale mit Echtzeit-Marktdatenanalyse',
    'dashboard.currentPlan': 'Aktueller Plan',
    'dashboard.signalsToday': 'Signale heute',
    'dashboard.remaining': 'Verbleibend',
    'dashboard.needMoreSignals': 'Benötigen Sie mehr Signale?',
    'dashboard.upgradeDesc': 'Upgraden Sie auf Pro oder Elite für mehr tägliche Signale und erweiterte Funktionen.',
    'dashboard.viewPlans': 'Pläne ansehen',

    // Signal Generator
    'signal.title': 'Professioneller Signal-Generator',
    'signal.tradingPair': 'Trading-Paar',
    'signal.tradingSchool': 'Trading-Schule',
    'signal.advancedSettings': 'Erweiterte Einstellungen',
    'signal.candleCount': 'Kerzen-Anzahl',
    'signal.aiProvider': 'KI-Anbieter',
    'signal.marketDataReady': 'Marktdaten bereit',
    'signal.demoData': 'Demo-Daten',
    'signal.fetchMarketData': 'Marktdaten abrufen',
    'signal.generateSignal': 'Signal generieren',
    'signal.analyzingMarket': 'Markt analysieren...',
    'signal.fetchingData': 'Marktdaten abrufen...',
    'signal.latestSignal': 'Neuestes Signal',
    'signal.fullAnalysis': 'Vollständige Analyse',
    'signal.dailyLimitReached': 'Tageslimit erreicht. Upgraden Sie Ihren Plan für mehr Signale.',

    // Signal Types
    'signal.type.buy': 'KAUFEN',
    'signal.type.sell': 'VERKAUFEN',
    'signal.type.hold': 'HALTEN',
    'signal.entry': 'Einstieg',
    'signal.stopLoss': 'Stop Loss',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'Wahrscheinlichkeit',
    'signal.risk': 'Risiko',

    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.refresh': 'Aktualisieren',
    'common.export': 'Exportieren',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Vorherige',
    'common.submit': 'Senden',
    'common.confirm': 'Bestätigen',

    // Auth
    'auth.login.title': 'Willkommen zurück',
    'auth.login.subtitle': 'Melden Sie sich in Ihrem Konto an, um fortzufahren',
    'auth.register.title': 'Erstellen Sie Ihr Konto',
    'auth.register.subtitle': 'Beginnen Sie Ihre Reise mit KI-gestützten Trading-Signalen',
    'auth.email': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    'auth.createAccount': 'Konto erstellen',
    'auth.dontHaveAccount': 'Haben Sie kein Konto?',
    'auth.alreadyHaveAccount': 'Haben Sie bereits ein Konto?',
    'auth.signInHere': 'Hier anmelden',
    'auth.signUpHere': 'Hier registrieren',
    'auth.orContinueWith': 'Oder fortfahren mit',
    'auth.orSignInWith': 'Oder anmelden mit E-Mail',
    'auth.orCreateWith': 'Oder Konto erstellen mit E-Mail',

    // Settings
    'settings.title': 'Kontoeinstellungen',
    'settings.subtitle': 'Verwalten Sie Ihre Kontopräferenzen und Sicherheitseinstellungen',
    'settings.profile': 'Profil',
    'settings.security': 'Sicherheit',
    'settings.notifications': 'Benachrichtigungen',
    'settings.privacy': 'Datenschutz',
    'settings.subscription': 'Abonnement',
    'settings.language': 'Sprache',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'Kontotyp',
    'stats.dailyLimit': 'Tageslimit',
    'stats.usedToday': 'Heute verwendet',
    'stats.selectedPair': 'Ausgewähltes Paar',
    'stats.dataSource': 'Datenquelle',
    'stats.live': 'Live',
    'stats.demo': 'Demo',

    // Market Data
    'market.symbol': 'Symbol',
    'market.candles5min': '5min Kerzen',
    'market.candles15min': '15min Kerzen',
    'market.candles1h': '1h Kerzen',
    'market.candles4h': '4h Kerzen',

    // API Status
    'api.connected': 'API verbunden',
    'api.disconnected': 'API getrennt',
    'api.checking': 'API prüfen...',
    'api.demoDataUsed': 'Demo-Daten werden verwendet',
    'api.retry': 'Wiederholen',

    // Errors
    'error.apiNotConfigured': 'TwelveData API-Schlüssel nicht konfiguriert. Verwende stattdessen Demo-Daten.',
    'error.rateLimitReached': 'API-Ratenlimit erreicht. Verwende stattdessen Demo-Daten.',
    'error.symbolNotFound': 'Symbol nicht gefunden oder ungültig. Verwende stattdessen Demo-Daten.',
    'error.marketDataUnavailable': 'Marktdaten nicht verfügbar. Verwende stattdessen Demo-Daten.',
    'error.paymentFailed': 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
    'error.subscriptionFailed': 'Abonnement-Aktivierung fehlgeschlagen. Bitte kontaktieren Sie den Support mit Ihren Zahlungsdetails.',
    'error.accessDenied': 'Zugriff verweigert',
    'error.noAdminPrivileges': 'Sie haben keine Administratorrechte für den Zugriff auf diese Seite.',
  },

  // NEW: Italian Language Support 🇮🇹
  it: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Segnali',
    'nav.history': 'Cronologia',
    'nav.admin': 'Admin',
    'nav.settings': 'Impostazioni',
    'nav.login': 'Accedi',
    'nav.getStarted': 'Inizia',
    'nav.logout': 'Esci',

    // Landing Page
    'landing.hero.title': 'Segnali di Trading Alimentati da IA',
    'landing.hero.subtitle': 'Ottieni raccomandazioni di trading intelligenti alimentate da analisi IA avanzate. Prendi decisioni di trading più intelligenti con la nostra piattaforma di generazione segnali all\'avanguardia.',
    'landing.hero.startTrial': 'Inizia Prova Gratuita',
    'landing.hero.viewPlans': 'Visualizza Piani',
    
    'landing.features.title': 'Perché Scegliere AI Trader?',
    'landing.features.subtitle': 'La tecnologia avanzata incontra gli insights di trading professionali',
    'landing.features.ai.title': 'Segnali Alimentati da IA',
    'landing.features.ai.desc': 'Analisi GPT-4 avanzata dei dati di mercato per generare raccomandazioni di trading precise',
    'landing.features.secure.title': 'Sicuro e Affidabile',
    'landing.features.secure.desc': 'Sicurezza di livello aziendale con backend Firebase e trasmissione dati crittografata',
    'landing.features.schools.title': 'Scuole di Trading Multiple',
    'landing.features.schools.desc': 'Scegli tra diverse metodologie di analisi e strategie di trading',

    'landing.pricing.title': 'Prezzi Semplici e Trasparenti',
    'landing.pricing.subtitle': 'Scegli il piano che si adatta alle tue esigenze di trading',
    'landing.pricing.getStarted': 'Inizia',

    'landing.cta.title': 'Pronto a Trasformare il Tuo Trading?',
    'landing.cta.subtitle': 'Unisciti a migliaia di trader che si fidano di AI Trader per i loro insights di mercato',
    'landing.cta.startTrial': 'Inizia la Tua Prova Gratuita',

    // Plans
    'plans.title': 'Scegli il Tuo Piano di Trading',
    'plans.subtitle': 'Sblocca il potere degli insights di trading alimentati da IA con i nostri piani completi progettati per trader di ogni livello',
    'plans.noSetupFees': 'Nessuna commissione di configurazione',
    'plans.cancelAnytime': 'Cancella in qualsiasi momento',
    'plans.support247': 'Supporto 24/7',
    'plans.mostPopular': 'Più Popolare',
    'plans.bestValue': 'Miglior Valore',
    'plans.currentPlan': 'Piano Attuale',
    'plans.freeForever': 'Gratis Per Sempre',
    'plans.signInToSubscribe': 'Accedi per Abbonarti',
    'plans.comingSoon': 'Prossimamente',
    'plans.setupRequired': 'Configurazione Richiesta',
    'plans.cancel': 'Annulla',

    // Dashboard
    'dashboard.title': 'Dashboard Trading IA',
    'dashboard.subtitle': 'Genera segnali di trading professionali con analisi dei dati di mercato in tempo reale',
    'dashboard.currentPlan': 'Piano Attuale',
    'dashboard.signalsToday': 'Segnali Oggi',
    'dashboard.remaining': 'Rimanenti',
    'dashboard.needMoreSignals': 'Hai Bisogno di Più Segnali?',
    'dashboard.upgradeDesc': 'Aggiorna a Pro o Elite per più segnali giornalieri e funzionalità avanzate.',
    'dashboard.viewPlans': 'Visualizza Piani',

    // Signal Generator
    'signal.title': 'Generatore di Segnali Professionale',
    'signal.tradingPair': 'Coppia di Trading',
    'signal.tradingSchool': 'Scuola di Trading',
    'signal.advancedSettings': 'Impostazioni Avanzate',
    'signal.candleCount': 'Numero di Candele',
    'signal.aiProvider': 'Provider IA',
    'signal.marketDataReady': 'Dati di Mercato Pronti',
    'signal.demoData': 'Dati Demo',
    'signal.fetchMarketData': 'Recupera Dati di Mercato',
    'signal.generateSignal': 'Genera Segnale',
    'signal.analyzingMarket': 'Analizzando Mercato...',
    'signal.fetchingData': 'Recuperando Dati di Mercato...',
    'signal.latestSignal': 'Ultimo Segnale',
    'signal.fullAnalysis': 'Analisi Completa',
    'signal.dailyLimitReached': 'Limite giornaliero raggiunto. Aggiorna il tuo piano per più segnali.',

    // Signal Types
    'signal.type.buy': 'COMPRA',
    'signal.type.sell': 'VENDI',
    'signal.type.hold': 'MANTIENI',
    'signal.entry': 'Entrata',
    'signal.stopLoss': 'Stop Loss',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'Probabilità',
    'signal.risk': 'Rischio',

    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.add': 'Aggiungi',
    'common.refresh': 'Aggiorna',
    'common.export': 'Esporta',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.close': 'Chiudi',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.submit': 'Invia',
    'common.confirm': 'Conferma',

    // Auth
    'auth.login.title': 'Bentornato',
    'auth.login.subtitle': 'Accedi al tuo account per continuare',
    'auth.register.title': 'Crea il tuo account',
    'auth.register.subtitle': 'Inizia il tuo viaggio con i segnali di trading alimentati da IA',
    'auth.email': 'Indirizzo email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Conferma Password',
    'auth.signIn': 'Accedi',
    'auth.signUp': 'Registrati',
    'auth.createAccount': 'Crea account',
    'auth.dontHaveAccount': 'Non hai un account?',
    'auth.alreadyHaveAccount': 'Hai già un account?',
    'auth.signInHere': 'Accedi qui',
    'auth.signUpHere': 'Registrati qui',
    'auth.orContinueWith': 'O continua con',
    'auth.orSignInWith': 'O accedi con email',
    'auth.orCreateWith': 'O crea account con email',

    // Settings
    'settings.title': 'Impostazioni Account',
    'settings.subtitle': 'Gestisci le preferenze del tuo account e le impostazioni di sicurezza',
    'settings.profile': 'Profilo',
    'settings.security': 'Sicurezza',
    'settings.notifications': 'Notifiche',
    'settings.privacy': 'Privacy',
    'settings.subscription': 'Abbonamento',
    'settings.language': 'Lingua',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'Tipo di Account',
    'stats.dailyLimit': 'Limite Giornaliero',
    'stats.usedToday': 'Usato Oggi',
    'stats.selectedPair': 'Coppia Selezionata',
    'stats.dataSource': 'Fonte Dati',
    'stats.live': 'Live',
    'stats.demo': 'Demo',

    // Market Data
    'market.symbol': 'Simbolo',
    'market.candles5min': 'Candele 5min',
    'market.candles15min': 'Candele 15min',
    'market.candles1h': 'Candele 1h',
    'market.candles4h': 'Candele 4h',

    // API Status
    'api.connected': 'API Connessa',
    'api.disconnected': 'API Disconnessa',
    'api.checking': 'Controllo API...',
    'api.demoDataUsed': 'Verranno utilizzati dati demo',
    'api.retry': 'Riprova',

    // Errors
    'error.apiNotConfigured': 'Chiave API TwelveData non configurata. Utilizzo dati demo invece.',
    'error.rateLimitReached': 'Limite di velocità API raggiunto. Utilizzo dati demo invece.',
    'error.symbolNotFound': 'Simbolo non trovato o non valido. Utilizzo dati demo invece.',
    'error.marketDataUnavailable': 'Dati di mercato non disponibili. Utilizzo dati demo invece.',
    'error.paymentFailed': 'Pagamento fallito. Riprova o contatta il supporto.',
    'error.subscriptionFailed': 'Attivazione abbonamento fallita. Contatta il supporto con i dettagli del pagamento.',
    'error.accessDenied': 'Accesso Negato',
    'error.noAdminPrivileges': 'Non hai privilegi di amministratore per accedere a questa pagina.',
  },

  // NEW: Hindi Language Support 🇮🇳
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.signals': 'सिग्नल',
    'nav.history': 'इतिहास',
    'nav.admin': 'एडमिन',
    'nav.settings': 'सेटिंग्स',
    'nav.login': 'लॉगिन',
    'nav.getStarted': 'शुरू करें',
    'nav.logout': 'लॉगआउट',

    // Landing Page
    'landing.hero.title': 'AI-संचालित ट्रेडिंग सिग्नल',
    'landing.hero.subtitle': 'उन्नत AI विश्लेषण द्वारा संचालित बुद्धिमान ट्रेडिंग सिफारिशें प्राप्त करें। हमारे अत्याधुनिक सिग्नल जेनरेशन प्लेटफॉर्म के साथ स्मार्ट ट्रेडिंग निर्णय लें।',
    'landing.hero.startTrial': 'मुफ्त ट्रायल शुरू करें',
    'landing.hero.viewPlans': 'प्लान देखें',
    
    'landing.features.title': 'AI Trader क्यों चुनें?',
    'landing.features.subtitle': 'उन्नत तकनीक पेशेवर ट्रेडिंग अंतर्दृष्टि से मिलती है',
    'landing.features.ai.title': 'AI-संचालित सिग्नल',
    'landing.features.ai.desc': 'सटीक ट्रेडिंग सिफारिशें उत्पन्न करने के लिए बाजार डेटा का उन्नत GPT-4 विश्लेषण',
    'landing.features.secure.title': 'सुरक्षित और विश्वसनीय',
    'landing.features.secure.desc': 'Firebase बैकएंड और एन्क्रिप्टेड डेटा ट्रांसमिशन के साथ एंटरप्राइज़-ग्रेड सुरक्षा',
    'landing.features.schools.title': 'कई ट्रेडिंग स्कूल',
    'landing.features.schools.desc': 'विभिन्न विश्लेषण पद्धतियों और ट्रेडिंग रणनीतियों में से चुनें',

    'landing.pricing.title': 'सरल, पारदर्शी मूल्य निर्धारण',
    'landing.pricing.subtitle': 'अपनी ट्रेडिंग आवश्यकताओं के अनुकूल प्लान चुनें',
    'landing.pricing.getStarted': 'शुरू करें',

    'landing.cta.title': 'अपनी ट्रेडिंग को बदलने के लिए तैयार हैं?',
    'landing.cta.subtitle': 'हजारों ट्रेडर्स से जुड़ें जो अपनी बाजार अंतर्दृष्टि के लिए AI Trader पर भरोसा करते हैं',
    'landing.cta.startTrial': 'अपना मुफ्त ट्रायल शुरू करें',

    // Plans
    'plans.title': 'अपना ट्रेडिंग प्लान चुनें',
    'plans.subtitle': 'हर स्तर के ट्रेडर्स के लिए डिज़ाइन किए गए हमारे व्यापक प्लान के साथ AI-संचालित ट्रेडिंग अंतर्दृष्टि की शक्ति को अनलॉक करें',
    'plans.noSetupFees': 'कोई सेटअप फीस नहीं',
    'plans.cancelAnytime': 'कभी भी रद्द करें',
    'plans.support247': '24/7 सहायता',
    'plans.mostPopular': 'सबसे लोकप्रिय',
    'plans.bestValue': 'सर्वोत्तम मूल्य',
    'plans.currentPlan': 'वर्तमान प्लान',
    'plans.freeForever': 'हमेशा के लिए मुफ्त',
    'plans.signInToSubscribe': 'सब्सक्राइब करने के लिए साइन इन करें',
    'plans.comingSoon': 'जल्द आ रहा है',
    'plans.setupRequired': 'सेटअप आवश्यक',
    'plans.cancel': 'रद्द करें',

    // Dashboard
    'dashboard.title': 'AI ट्रेडिंग डैशबोर्ड',
    'dashboard.subtitle': 'वास्तविक बाजार डेटा विश्लेषण के साथ पेशेवर ट्रेडिंग सिग्नल उत्पन्न करें',
    'dashboard.currentPlan': 'वर्तमान प्लान',
    'dashboard.signalsToday': 'आज के सिग्नल',
    'dashboard.remaining': 'शेष',
    'dashboard.needMoreSignals': 'अधिक सिग्नल चाहिए?',
    'dashboard.upgradeDesc': 'अधिक दैनिक सिग्नल और उन्नत सुविधाओं के लिए Pro या Elite में अपग्रेड करें।',
    'dashboard.viewPlans': 'प्लान देखें',

    // Signal Generator
    'signal.title': 'पेशेवर सिग्नल जेनरेटर',
    'signal.tradingPair': 'ट्रेडिंग जोड़ी',
    'signal.tradingSchool': 'ट्रेडिंग स्कूल',
    'signal.advancedSettings': 'उन्नत सेटिंग्स',
    'signal.candleCount': 'कैंडल संख्या',
    'signal.aiProvider': 'AI प्रदाता',
    'signal.marketDataReady': 'बाजार डेटा तैयार',
    'signal.demoData': 'डेमो डेटा',
    'signal.fetchMarketData': 'बाजार डेटा प्राप्त करें',
    'signal.generateSignal': 'सिग्नल उत्पन्न करें',
    'signal.analyzingMarket': 'बाजार का विश्लेषण...',
    'signal.fetchingData': 'बाजार डेटा प्राप्त कर रहे हैं...',
    'signal.latestSignal': 'नवीनतम सिग्नल',
    'signal.fullAnalysis': 'पूर्ण विश्लेषण',
    'signal.dailyLimitReached': 'दैनिक सीमा पहुंच गई। अधिक सिग्नल के लिए अपना प्लान अपग्रेड करें।',

    // Signal Types
    'signal.type.buy': 'खरीदें',
    'signal.type.sell': 'बेचें',
    'signal.type.hold': 'होल्ड करें',
    'signal.entry': 'प्रवेश',
    'signal.stopLoss': 'स्टॉप लॉस',
    'signal.takeProfit1': 'TP1',
    'signal.takeProfit2': 'TP2',
    'signal.probability': 'संभावना',
    'signal.risk': 'जोखिम',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.add': 'जोड़ें',
    'common.refresh': 'रिफ्रेश करें',
    'common.export': 'निर्यात करें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर करें',
    'common.close': 'बंद करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.submit': 'सबमिट करें',
    'common.confirm': 'पुष्टि करें',

    // Auth
    'auth.login.title': 'वापस स्वागत है',
    'auth.login.subtitle': 'जारी रखने के लिए अपने खाते में साइन इन करें',
    'auth.register.title': 'अपना खाता बनाएं',
    'auth.register.subtitle': 'AI-संचालित ट्रेडिंग सिग्नल के साथ अपनी यात्रा शुरू करें',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.signIn': 'साइन इन करें',
    'auth.signUp': 'साइन अप करें',
    'auth.createAccount': 'खाता बनाएं',
    'auth.dontHaveAccount': 'खाता नहीं है?',
    'auth.alreadyHaveAccount': 'पहले से खाता है?',
    'auth.signInHere': 'यहां साइन इन करें',
    'auth.signUpHere': 'यहां साइन अप करें',
    'auth.orContinueWith': 'या जारी रखें',
    'auth.orSignInWith': 'या ईमेल से साइन इन करें',
    'auth.orCreateWith': 'या ईमेल से खाता बनाएं',

    // Settings
    'settings.title': 'खाता सेटिंग्स',
    'settings.subtitle': 'अपनी खाता प्राथमिकताएं और सुरक्षा सेटिंग्स प्रबंधित करें',
    'settings.profile': 'प्रोफाइल',
    'settings.security': 'सुरक्षा',
    'settings.notifications': 'सूचनाएं',
    'settings.privacy': 'गोपनीयता',
    'settings.subscription': 'सब्सक्रिप्शन',
    'settings.language': 'भाषा',

    // Language names
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',

    // Quick Stats
    'stats.accountType': 'खाता प्रकार',
    'stats.dailyLimit': 'दैनिक सीमा',
    'stats.usedToday': 'आज उपयोग किया गया',
    'stats.selectedPair': 'चयनित जोड़ी',
    'stats.dataSource': 'डेटा स्रोत',
    'stats.live': 'लाइव',
    'stats.demo': 'डेमो',

    // Market Data
    'market.symbol': 'प्रतीक',
    'market.candles5min': '5मिनट कैंडल',
    'market.candles15min': '15मिनट कैंडल',
    'market.candles1h': '1घंटा कैंडल',
    'market.candles4h': '4घंटा कैंडल',

    // API Status
    'api.connected': 'API कनेक्टेड',
    'api.disconnected': 'API डिस्कनेक्टेड',
    'api.checking': 'API जांच रहे हैं...',
    'api.demoDataUsed': 'डेमो डेटा का उपयोग किया जाएगा',
    'api.retry': 'पुनः प्रयास करें',

    // Errors
    'error.apiNotConfigured': 'TwelveData API कुंजी कॉन्फ़िगर नहीं है। इसके बजाय डेमो डेटा का उपयोग कर रहे हैं।',
    'error.rateLimitReached': 'API दर सीमा पहुंच गई। इसके बजाय डेमो डेटा का उपयोग कर रहे हैं।',
    'error.symbolNotFound': 'प्रतीक नहीं मिला या अमान्य। इसके बजाय डेमो डेटा का उपयोग कर रहे हैं।',
    'error.marketDataUnavailable': 'बाजार डेटा उपलब्ध नहीं। इसके बजाय डेमो डेटा का उपयोग कर रहे हैं।',
    'error.paymentFailed': 'भुगतान असफल। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
    'error.subscriptionFailed': 'सब्सक्रिप्शन सक्रियण असफल। कृपया अपने भुगतान विवरण के साथ सहायता से संपर्क करें।',
    'error.accessDenied': 'पहुंच अस्वीकृत',
    'error.noAdminPrivileges': 'इस पृष्ठ तक पहुंचने के लिए आपके पास व्यवस्थापक अधिकार नहीं हैं।',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};