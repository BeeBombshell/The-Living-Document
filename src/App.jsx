import React, { useState, useCallback, useEffect } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { LatencyBadge } from './components/LatencyBadge';
import { DemoScenarios } from './components/DemoScenarios';
import { useTranslation } from './hooks/useTranslation';
import { Sparkles, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');
  const [leftLang, setLeftLang] = useState('English');
  const [rightLang, setRightLang] = useState('Spanish');
  const [lastEdited, setLastEdited] = useState(null); // 'left' or 'right'
  const [isUpdating, setIsUpdating] = useState({ left: false, right: false });

  const { isTranslating, latency, debouncedTranslate } = useTranslation();

  const handleLeftChange = useCallback((text) => {
    setLeftContent(text);
    setLastEdited('left');

    debouncedTranslate(text, rightLang, (translatedText) => {
      setRightContent(translatedText);
      setIsUpdating({ left: false, right: true });
      setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
    });
  }, [rightLang, debouncedTranslate]);

  const handleRightChange = useCallback((text) => {
    setRightContent(text);
    setLastEdited('right');

    debouncedTranslate(text, leftLang, (translatedText) => {
      setLeftContent(translatedText);
      setIsUpdating({ left: true, right: false });
      setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
    });
  }, [leftLang, debouncedTranslate]);

  const handleScenarioSelect = (content) => {
    setLeftContent(content);
    setLastEdited('left');
    debouncedTranslate(content, rightLang, (translatedText) => {
      setRightContent(translatedText);
      setIsUpdating({ left: false, right: true });
      setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 selection:bg-pastel-blue/30 p-4 md:p-8 flex flex-col items-center">
      {/* Header Section */}
      <header className="max-w-6xl w-full mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-pastel-pink mb-6"
        >
          <Sparkles className="w-3 h-3" />
          The Living Document
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
          Write in one language.<br />Read in another.
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto">
          A collaborative editor demo that translates your thoughts in real-time,
          preserving the soul of your words across borders.
        </p>
      </header>

      {/* Main Translation Interface */}
      <main className="max-w-7xl w-full flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <EditorPanel
              content={leftContent}
              onChange={handleLeftChange}
              language={leftLang}
              onLanguageChange={setLeftLang}
              isLastEdited={lastEdited === 'left'}
              isUpdating={isUpdating.left}
              placeholder="Start typing in English..."
            />
          </div>

          <div className="flex-1">
            <EditorPanel
              content={rightContent}
              onChange={handleRightChange}
              language={rightLang}
              onLanguageChange={setRightLang}
              isLastEdited={lastEdited === 'right'}
              isUpdating={isUpdating.right}
              placeholder="Traducción automática..."
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center gap-4">
            <LatencyBadge latency={latency} isTranslating={isTranslating} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/20 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pastel-green animate-pulse" />
            Live Sync Active
          </div>
        </div>

        {/* Demo Scenarios */}
        <DemoScenarios onSelect={handleScenarioSelect} />
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/5 w-full max-w-6xl text-center text-white/20 text-sm">
        Built with Anthropic Claude-3.5-Sonnet • Real-time Context-Aware Translation
      </footer>
    </div>
  );
}

export default App;
