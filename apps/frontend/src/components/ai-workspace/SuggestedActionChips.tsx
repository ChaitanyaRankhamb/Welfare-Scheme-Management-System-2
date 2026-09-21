import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedActionChipsProps {
  actions: string[];
  onAction: (text: string) => void;
}

export function SuggestedActionChips({ actions, onAction }: SuggestedActionChipsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {actions.map((actionText, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onAction(actionText)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          <span>{actionText}</span>
        </button>
      ))}
    </div>
  );
}
