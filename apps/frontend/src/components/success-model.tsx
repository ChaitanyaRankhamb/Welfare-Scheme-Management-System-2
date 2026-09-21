'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  buttonLabel?: string;
  redirectPath?: string;
  onClose?: () => void;
}

export function SuccessModal({
  isOpen,
  title,
  description,
  buttonLabel = 'Continue',
  redirectPath = '/',
  onClose,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md p-8 border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl",
        "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
      )}>
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          
          <div className="relative flex justify-center items-center mb-3">
            {/* Ambient glow behind icon */}
            <div className="absolute w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-center w-full">
          <Link href={redirectPath} className="w-full">
            <Button
              className={cn(
                "w-full h-12 text-[15px] font-semibold rounded-xl shadow-lg transition-all",
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02]",
                "dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 border-none"
              )}
            >
              {buttonLabel}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
