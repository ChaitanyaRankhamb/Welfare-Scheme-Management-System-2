import React from 'react';
import { ShieldCheck, FileText, Sparkle, Book, ChevronRight, Bot } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const QUICK_PROMPTS = [
  { text: "Which schemes am I eligible for?", category: "Eligibility", icon: ShieldCheck },
  { text: "What documents are needed for PM Kisan?", category: "Agriculture", icon: FileText },
  { text: "How to apply for Ayushman Bharat Card?", category: "Healthcare", icon: Sparkle },
  { text: "Find education scholarships for students", category: "Grants", icon: Book },
];

interface EmptyStateProps {
  onAction: (text: string) => void;
}

export function EmptyState({ onAction }: EmptyStateProps) {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-6 py-12 text-center w-full">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20 ring-4 ring-primary/10 mb-6 relative">
        <Bot className="w-8 h-8" />
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
        </span>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
        Namaste, {user?.username || 'Citizen'}
      </h1>
      <p className="text-muted-foreground font-medium mb-10 max-w-lg">
        I am your Yojana AI Copilot. Ask me about government schemes, check your eligibility, or learn how to apply for benefits.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {QUICK_PROMPTS.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAction(q.text)}
            className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:bg-accent/40 transition-all text-left group cursor-pointer shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                <q.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  {q.category}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {q.text}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
