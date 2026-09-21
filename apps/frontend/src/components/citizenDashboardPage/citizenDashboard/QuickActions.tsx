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
      h-12 px-6 rounded-2xl font-bold transition-all active:scale-95 gap-3 border-border dark:border-border/10 cursor-pointer
      ${variant === 'primary' ? 'bg-linear-to-r from-primary to-primary/70 shadow-lg hover:shadow-lg transition-all duration-300 active:scale-95 text-primary-foreground!' : 'bg-card dark:bg-card/5 hover:bg-muted dark:hover:bg-card/10'}
    `}
  >
    <Icon className={`w-4 h-4 ${variant === 'primary' ? 'text-primary-foreground' : 'text-primary dark:text-primary'}`} />
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
