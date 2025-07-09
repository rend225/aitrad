import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface AutoTranslateProps {
  children: string;
  className?: string;
}

const AutoTranslate: React.FC<AutoTranslateProps> = ({ children, className }) => {
  const { language, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (language !== 'en') {
      const performTranslation = async () => {
        const translated = await translate(children);
        setTranslatedText(translated);
      };
      
      performTranslation();
    } else {
      setTranslatedText(children);
    }
  }, [children, language, translate]);

  return <span className={className}>{translatedText}</span>;
};

export default AutoTranslate;