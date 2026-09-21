'use client'

import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProfileHeaderProps {
  activeSection: string
  completionPercent: number
}

export function ProfileHeader({ activeSection, completionPercent }: ProfileHeaderProps) {
  return (
    <div className="sticky top-16 z-30 w-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/citizenDashboard">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted/80">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70 leading-none mb-1">Citizen Profile</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight">Manage Details</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 capitalize">{activeSection.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <ShieldCheck className="h-3 w-3 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Strength</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-1.5 w-40 rounded-full bg-muted/50 border border-border/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
