'use client';

import React from 'react';
import { PlusCircle, History, Sparkles, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionPillProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

const ActionPill = ({ label, icon: Icon, onClick, variant = 'outline' }: ActionPillProps) => (
  <Button
    onClick={onClick}
    variant={variant === 'primary' ? 'default' : 'outline'}
    className={`
      h-12 px-6 rounded-2xl font-bold transition-all active:scale-95 gap-3 border-gray-200 dark:border-white/10 cursor-pointer
      ${variant === 'primary' ? 'bg-gradient-to-r from-indigo-600 to-violet-500 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.5)] transition-all duration-300 active:scale-95 text-white!' : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10'}
    `}
  >
    <Icon className={`w-4 h-4 ${variant === 'primary' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
    <span className="text-sm tracking-tight">{label}</span>
  </Button>
);

export function QuickActions({ 
  onApply, 
  onResume, 
  onAskAI 
}: { 
  onApply: () => void; 
  onResume: () => void; 
  onAskAI: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 py-2">
      <ActionPill 
        label="Apply for New Scheme" 
        icon={PlusCircle} 
        onClick={onApply}
        variant="primary"
      />
      <ActionPill 
        label="Resume Application" 
        icon={History} 
        onClick={onResume}
      />
      <ActionPill 
        label="Ask AI Assistant" 
        icon={Sparkles} 
        onClick={onAskAI}
      />
    </div>
  );
}
