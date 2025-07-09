import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { i18n, t } = useI18nTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL direction for Arabic
    setIsRTL(i18n.language === 'ar');
    
    // Set HTML lang and dir attributes
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
    // Add RTL class to body if needed
    if (i18n.language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Function to translate text using Google Translate API
  const translate = async (text: string): Promise<string> => {
    if (i18n.language === 'en') return text; // No translation needed for English
    
    setIsTranslating(true);
    try {
      // Google Translate API endpoint
      const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with your API key
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: i18n.language,
          format: 'text'
        })
      });
      
      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        return data.data.translations[0].translatedText;
      }
      
      return text; // Fallback to original text
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslationContext.Provider value={{ 
      language: i18n.language, 
      setLanguage, 
      t,
      translate, 
      isTranslating,
      isRTL
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};