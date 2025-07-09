import React from 'react';
import { useTranslation as useReactI18next } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Component for translating text using i18next
 * Falls back to children if key is not found
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ i18nKey, children, className }) => {
  const { t } = useReactI18next();
  
  return (
    <span className={className}>
      {t(i18nKey, { defaultValue: children || i18nKey })}
    </span>
  );
};

export default TranslatedText;