import React, { ReactNode } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import useTranslatedContent from '../hooks/useTranslatedContent';

interface TranslateWrapperProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Component that automatically translates its text content
 * This is useful for wrapping static text that isn't in translation files
 */
const TranslateWrapper: React.FC<TranslateWrapperProps> = ({ 
  children, 
  as: Component = 'span',
  className 
}) => {
  const { language } = useTranslation();
  const { translatedContent, isLoading } = useTranslatedContent(children);
  
  // Don't translate if language is English
  if (language === 'en') {
    return <Component className={className}>{children}</Component>;
  }
  
  return (
    <Component className={className}>
      {isLoading ? children : translatedContent}
    </Component>
  );
};

export default TranslateWrapper;