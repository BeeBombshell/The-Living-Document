import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LatencyBadge({ latency, isTranslating }) {
    return (
        <div className="flex items-center gap-2 text-xs font-medium">
            <AnimatePresence mode="wait">
                {isTranslating ? (
                    <motion.div
                        key="translating"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-1.5 text-pastel-blue"
                    >
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>Translating...</span>
                    </motion.div>
                ) : latency > 0 ? (
                    <motion.div
                        key="latency"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40"
                    >
                        Translated in {latency}ms
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
