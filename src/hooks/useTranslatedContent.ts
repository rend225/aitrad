import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * Hook for translating content on the fly
 * @param content The content to translate
 * @returns The translated content and loading state
 */
export const useTranslatedContent = (content: string) => {
  const { language, translate } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language !== 'en' && content) {
      setIsLoading(true);
      translate(content)
        .then(translated => {
          setTranslatedContent(translated);
        })
        .catch(() => {
          // Fallback to original content on error
          setTranslatedContent(content);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTranslatedContent(content);
    }
  }, [content, language, translate]);

  return { translatedContent, isLoading };
};

export default useTranslatedContent;