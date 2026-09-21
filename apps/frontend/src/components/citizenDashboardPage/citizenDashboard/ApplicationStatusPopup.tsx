'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ApplicationStatusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  schemeName: string;
  onStatusUpdate: (status: 'APPLIED' | 'REJECTED') => void;
}

export function ApplicationStatusPopup({
  isOpen,
  onClose,
  schemeName,
  onStatusUpdate,
}: ApplicationStatusPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 group">
            <Clock className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <DialogTitle className="text-2xl font-black text-center tracking-tight">
            Update Application Status
          </DialogTitle>
          <DialogDescription className="text-center font-bold text-muted-foreground/80 px-4">
            Did you complete your application for <span className="text-indigo-600 font-black">{schemeName}</span> on the official website?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <Button
            onClick={() => onStatusUpdate('APPLIED')}
            className="flex flex-col items-center gap-3 h-auto py-6 rounded-3xl border-2 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 transition-all group"
          >
            <CheckCircle2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-black uppercase tracking-widest text-[10px]">Applied Successfully</span>
          </Button>

          <Button
            onClick={() => onStatusUpdate('REJECTED')}
            className="flex flex-col items-center gap-3 h-auto py-6 rounded-3xl border-2 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 transition-all group"
          >
            <XCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-black uppercase tracking-widest text-[10px]">Rejected</span>
          </Button>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-bold text-muted-foreground hover:text-indigo-600 rounded-xl px-8"
          >
            Not yet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
