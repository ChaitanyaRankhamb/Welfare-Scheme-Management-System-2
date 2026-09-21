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
    rounded-2xl border border-transparent dark:border-white/50
    bg-white dark:bg-zinc-900/60 backdrop-blur-xl
    transition-all duration-300 hover:border-indigo-500 hover:dark:border-indigo-500
    shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)]
  "
  >
    {/* Gradient Glow Background */}
    {/* <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition duration-300`}
    /> */}

    {/* Subtle Border Glow */}
    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />

    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
        {title}
      </CardTitle>

      {/* Icon Container */}
      <div
        className={`
        p-2 rounded-xl bg-gradient-to-br ${gradient}
        text-white shadow-md
        group-hover:scale-110 transition-transform duration-300
      `}
      >
        <Icon className="w-4 h-4" />
      </div>
    </CardHeader>

    <CardContent className="relative z-10">
      {/* Value */}
      <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        {value}
      </div>

      {/* Trend */}
      <div className="flex items-center mt-3">
        <span
          className="
          flex items-center text-xs font-semibold
          text-emerald-600 dark:text-emerald-400
          bg-emerald-50 dark:bg-emerald-500/10
          px-2 py-1 rounded-full
        "
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          {trendLabel}
        </span>
      </div>
    </CardContent>
  </Card>
)