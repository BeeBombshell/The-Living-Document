import React from 'react';
import { Sparkles, Terminal, MessageSquare } from 'lucide-react';

const SCENARIOS = [
    {
        id: 'nuance',
        label: 'Show Nuance',
        icon: Sparkles,
        content: 'The coffee was good, but the atmosphere was truly special.',
        color: 'hover:border-pastel-purple/50'
    },
    {
        id: 'idioms',
        label: 'Show Idioms',
        icon: MessageSquare,
        content: "Don't beat around the bush; just tell me what's going on.",
        color: 'hover:border-pastel-pink/50'
    },
    {
        id: 'technical',
        label: 'Show Technical',
        icon: Terminal,
        content: 'The async function returns a Promise that resolves with the User object.',
        color: 'hover:border-pastel-blue/50'
    }
];

export function DemoScenarios({ onSelect }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                return (
                    <button
                        key={scenario.id}
                        onClick={() => onSelect(scenario.content)}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white/90 ${scenario.color}`}
                    >
                        <Icon className="w-4 h-4" />
                        {scenario.label}
                    </button>
                );
            })}
        </div>
    );
}
