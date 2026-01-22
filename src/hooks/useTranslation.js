import { useState, useCallback, useRef } from 'react';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY;

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  
  const lingoRef = useRef(null);

  if (!lingoRef.current && typeof window !== 'undefined') {
    lingoRef.current = new LingoDotDevEngine({
      apiKey: LINGO_API_KEY,
      apiUrl: `${window.location.origin}/api/lingo`,
    });
  }

  const translate = useCallback(async (text, targetLocale, onComplete, sourceLocale = 'en') => {
    if (!text || text.trim() === '') {
      onComplete('');
      return;
    }

    if (!LINGO_API_KEY) {
      setError('API Key Missing');
      return;
    }

    setIsTranslating(true);
    const startTime = performance.now();

    try {
      const translatedText = await lingoRef.current.localizeText(text, {
        sourceLocale,
        targetLocale,
      });
      
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setIsTranslating(false);
      onComplete(translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
      setIsTranslating(false);
    }
  }, []);

  const debouncedTranslate = useCallback((text, targetLocale, onComplete, sourceLocale) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      translate(text, targetLocale, onComplete, sourceLocale);
    }, 500);
  }, [translate]);

  return {
    isTranslating,
    latency,
    error,
    debouncedTranslate
  };
}
