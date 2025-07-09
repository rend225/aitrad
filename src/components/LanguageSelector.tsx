import React, { useState } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'ar', name: t('language.arabic'), flag: '🇸🇦' },
    { code: 'fr', name: t('language.french'), flag: '🇫🇷' },
    { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
    { code: 'de', name: t('language.german'), flag: '🇩🇪' },
    { code: 'it', name: t('language.italian'), flag: '🇮🇹' },
    { code: 'hi', name: t('language.hindi'), flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        <span className="text-sm hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 min-w-[200px] max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code ? 'bg-blue-600 text-white' : 'text-gray-300'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-blue-300 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;