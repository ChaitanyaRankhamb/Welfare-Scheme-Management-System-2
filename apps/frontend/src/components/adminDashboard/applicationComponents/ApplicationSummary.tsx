import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileStack, Clock, XCircle } from 'lucide-react'

const SummaryCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  gradient,
}: any) => (
  <Card
    className="
    relative overflow-hidden group
    rounded-2xl
    border border-gray-200/50 dark:border-white/50
    bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
    shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]
    transition-all duration-300
    hover:border-indigo-500 hover:dark:border-indigo-500
  "
  >
    <CardContent className="p-6 relative z-10">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${colorClass}`}>
          {title}
        </p>
        {/* Icon */}
        <div
          className={`
          p-2.5 rounded-xl
          bg-gradient-to-br ${gradient}
          text-white
          shadow-[0_6px_15px_-5px_rgba(0,0,0,0.2)]
          transition-transform duration-300
          group-hover:scale-110
        `}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>

      {/* Subtext */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
        {subtext}
      </p>
    </CardContent>
  </Card>
)

export const ApplicationSummary = ({ stats }: { stats?: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard 
        title="Total Applied" 
        value={stats?.applied?.toLocaleString() || "0"} 
        subtext="All cumulative applications"
        icon={FileStack}
        colorClass="text-emerald-600 dark:text-emerald-400"
        gradient="from-emerald-500 to-teal-600"
      />
      <SummaryCard 
        title="Initiated" 
        value={stats?.initiated?.toLocaleString() || "0"} 
        subtext="Pending rigorous review"
        icon={Clock}
        colorClass="text-amber-600 dark:text-amber-400"
        gradient="from-amber-500 to-amber-600"
      />
      <SummaryCard 
        title="Rejected" 
        value={stats?.rejected?.toLocaleString() || "0"} 
        subtext="Failed eligibility criteria"
        icon={XCircle}
        colorClass="text-rose-600 dark:text-rose-400"
        gradient="from-rose-500 to-rose-600"
      />
    </div>
  )
}
