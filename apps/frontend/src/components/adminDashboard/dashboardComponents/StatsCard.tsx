import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
  trendLabel: string
  gradient: string
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  gradient,
}: StatsCardProps) => (
  <Card
    className="
    relative overflow-hidden group
    rounded-2xl border border-transparent dark:border-border/50
    bg-card dark:bg-card/60 backdrop-blur-xl
    transition-all duration-300 hover:border-primary hover:dark:border-primary
    shadow-lg
  "
  >
    {/* Gradient Glow Background */}
    {/* <div
      className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-10 transition duration-300`}
    /> */}

    {/* Subtle Border Glow */}
    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />

    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground tracking-wide">
        {title}
      </CardTitle>

      {/* Icon Container */}
      <div
        className={`
        p-2 rounded-xl bg-linear-to-br ${gradient}
        text-primary-foreground shadow-md
        group-hover:scale-110 transition-transform duration-300
      `}
      >
        <Icon className="w-4 h-4" />
      </div>
    </CardHeader>

    <CardContent className="relative z-10">
      {/* Value */}
      <div className="text-3xl font-extrabold text-muted-foreground dark:text-primary-foreground tracking-tight">
        {value}
      </div>

      {/* Trend */}
      <div className="flex items-center mt-3">
        <span
          className="
          flex items-center text-xs font-semibold
          text-primary dark:text-primary
          bg-primary dark:bg-primary/10
          px-2 py-1 rounded-full
        "
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </span>
        <span className="ml-2 text-xs text-muted-foreground dark:text-muted-foreground">
          {trendLabel}
        </span>
      </div>
    </CardContent>
  </Card>
)