'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileSectionProps {
  id?: string
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  isOptional?: boolean
  completionPercent?: number
  className?: string
  onSave?: () => void
  isSaving?: boolean
  canSave?: boolean
  isSaved?: boolean
}

export function ProfileSection({
  id,
  title,
  description,
  icon,
  children,
  isOptional,
  completionPercent,
  className,
  onSave,
  isSaving,
  canSave = true,
  isSaved = false,
}: ProfileSectionProps) {
  const isComplete = isSaved

  return (
    <Card 
      id={id}
      className={cn(
        "rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl transition-all duration-500 overflow-visible relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
        isComplete && "border-green-500/30 dark:border-green-500/20 shadow-green-500/5",
        className
      )}
    >
      {isComplete && (
        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg z-10 animate-in zoom-in duration-300">
           <CheckCircle2 className="h-5 w-5" />
        </div>
      )}

      <CardHeader className="pb-6 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110 border border-white/20 dark:border-white/10",
              isComplete ? "bg-green-500/10 text-green-600" : "bg-indigo-500/10 text-indigo-600"
            )}>
              {icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
                {isOptional && (
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 border-dashed bg-muted/30">
                    Optional
                  </Badge>
                )}
              </div>
              {description && (
                <CardDescription className="text-sm font-medium opacity-80">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          {completionPercent !== undefined && (
            <div className="flex flex-col items-end gap-1.5">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Completion</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{completionPercent}%</span>
               </div>
               <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                 <div 
                   className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                   style={{ width: `${completionPercent}%` }}
                 />
               </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-10 mb-8">
          {children}
        </div>

        {onSave && (
          <div className="flex justify-end pt-6 border-t border-border/40">
            <Button
              onClick={onSave}
              disabled={isSaving || !canSave}
              className={cn(
                "rounded-xl font-bold h-10 px-6 transition-all duration-300 gap-2",
                !canSave 
                  ? "opacity-60 blur-[0.5px] cursor-not-allowed bg-muted text-muted-foreground shadow-none hover:bg-muted" 
                  : "shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
              )}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : (isSaved ? 'Update Section' : 'Save Section')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
