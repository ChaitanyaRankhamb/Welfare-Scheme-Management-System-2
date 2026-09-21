import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Cpu, Search, CheckCircle2, AlertCircle, Loader2, Bot } from 'lucide-react';
import { StreamStep } from './types';

interface AgentReasoningProps {
  steps: StreamStep[];
  isLive?: boolean;
}

export function AgentReasoning({ steps, isLive }: AgentReasoningProps) {
  const [expanded, setExpanded] = useState(isLive || false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/80 bg-accent/30 p-2.5 transition-all w-full">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-primary" />
          <span>Agent Execution Steps ({steps.length} actions)</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 pt-2 border-t border-border/50 space-y-1.5 pl-1"
          >
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px]">
                {step.type === 'intent' && <Search className="w-3 h-3 text-primary shrink-0" />}
                {step.type === 'success' && <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />}
                {step.type === 'error' && <AlertCircle className="w-3 h-3 text-destructive shrink-0" />}
                {(step.type === 'status' || isLive) && <Loader2 className="w-3 h-3 animate-spin text-primary shrink-0" />}
                {step.type === 'info' && <Bot className="w-3 h-3 text-primary shrink-0" />}
                <span className="text-muted-foreground font-medium truncate">
                  {step.message || step.content}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
