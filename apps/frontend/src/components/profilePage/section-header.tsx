'use client'

import { Progress } from '@/components/ui/progress'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  progressPercent?: number
  showProgress?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  progressPercent = 0,
  showProgress = true,
}: SectionHeaderProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {showProgress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Profile Completion</span>
            <span className="text-xs font-semibold text-primary">
              {progressPercent}%
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2"
          />
        </div>
      )}
    </div>
  )
}
