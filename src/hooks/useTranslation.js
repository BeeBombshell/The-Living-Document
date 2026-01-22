import { useState, useCallback, useRef } from 'react';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  const translate = useCallback(async (text, targetLanguage, onComplete) => {
    if (!text || text.trim() === '') {
      onComplete('');
      return;
    }

    if (!ANTHROPIC_API_KEY) {
      console.warn('VITE_ANTHROPIC_API_KEY is missing');
      setError('API Key Missing');
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsTranslating(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: `You are a context-aware translator. Translate the following text to ${targetLanguage}, preserving nuance, idioms, and context. Keep technical terms untranslated. Return ONLY the translation, no explanations.`,
          messages: [
            { role: 'user', content: text }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data.content[0].text;
      
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setIsTranslating(false);
      onComplete(translatedText);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Translation error:', err);
      setError(err.message);
      setIsTranslating(false);
    }
  }, []);

  const debouncedTranslate = useCallback((text, targetLanguage, onComplete) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      translate(text, targetLanguage, onComplete);
    }, 500);
  }, [translate]);

  return {
    isTranslating,
    latency,
    error,
    debouncedTranslate
  };
}
