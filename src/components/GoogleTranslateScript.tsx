import React, { useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * Component that injects the Google Translate script
 * This is a hidden component that should be added to the app
 */
const GoogleTranslateScript: React.FC = () => {
  const { language } = useTranslation();

  useEffect(() => {
    // Skip if language is English
    if (language === 'en') return;

    // Remove any existing Google Translate elements
    const existingElements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
    existingElements.forEach(el => el.remove());

    // Create Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    // Create initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'fr,ar',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
      
      // Hide Google Translate UI
      const style = document.createElement('style');
      style.textContent = `
        .goog-te-banner-frame, .skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `;
      document.head.appendChild(style);
      
      // Trigger translation to the detected language
      if (language !== 'en') {
        setTimeout(() => {
          const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = language;
            selectElement.dispatchEvent(new Event('change'));
          }
        }, 1000);
      }
    };
    
    document.head.appendChild(script);
    
    // Create hidden div for Google Translate
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
    
    return () => {
      // Clean up
      document.head.removeChild(script);
      if (div.parentNode) {
        document.body.removeChild(div);
      }
      delete window.googleTranslateElementInit;
    };
  }, [language]);

  return null;
};

// Add to window for TypeScript
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default GoogleTranslateScript;