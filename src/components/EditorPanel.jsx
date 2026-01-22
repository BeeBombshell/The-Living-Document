import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const LANGUAGES = [
    { label: 'English', value: 'English' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Arabic', value: 'Arabic' },
];

export function EditorPanel({
    content,
    onChange,
    language,
    onLanguageChange,
    isLastEdited,
    isUpdating,
    placeholder = "Start typing..."
}) {
    const editorRef = useRef(null);

    // Sync content with ref if it's not the last edited panel
    useEffect(() => {
        if (!isLastEdited && editorRef.current && content !== editorRef.current.innerText) {
            editorRef.current.innerText = content;
        }
    }, [content, isLastEdited]);

    const handleInput = (e) => {
        const text = e.target.innerText;
        onChange(text);
    };

    return (
        <div className="flex flex-col h-full min-h-[400px] border border-white/10 rounded-2xl bg-[#1a1a1a] overflow-hidden group">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                        <Languages className="w-4 h-4 text-pastel-pink" />
                    </div>
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer appearance-none pr-6 relative"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value} className="bg-[#1a1a1a]">
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {isLastEdited && (
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">
                        Editing
                    </span>
                )}
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 p-6">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className={cn(
                        "w-full h-full min-h-[300px] bg-transparent outline-none text-lg leading-relaxed text-white/90 whitespace-pre-wrap",
                        isUpdating && "animate-highlight"
                    )}
                    spellCheck="false"
                />
                {!content && (
                    <div className="absolute top-6 left-6 pointer-events-none text-white/20 text-lg italic">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    );
}
