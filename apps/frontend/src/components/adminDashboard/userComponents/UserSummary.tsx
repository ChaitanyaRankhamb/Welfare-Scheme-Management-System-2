import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, UserX } from 'lucide-react'

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
    {/* Subtle Gradient Glow */}
    {/* <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition duration-300`} /> */}

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

export const UserSummary = ({ data }: { data?: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <SummaryCard
        title="Total Users"
        value={data?.totalUsers?.toLocaleString() || "0"}
        subtext="Across all districts"
        icon={Users}
        colorClass="text-indigo-600 dark:text-indigo-400"
        gradient="from-indigo-500 to-indigo-600"
      />

      <SummaryCard
        title="Active Users"
        value={data?.totalActiveUsers?.toLocaleString() || "0"}
        subtext="Live user base"
        icon={UserCheck}
        colorClass="text-emerald-600 dark:text-emerald-400"
        gradient="from-emerald-500 to-emerald-600"
      />

      <SummaryCard
        title="Deactivated"
        value={data?.totalDeactivatedUsers?.toLocaleString() || "0"}
        subtext="Requires attention"
        icon={UserX}
        colorClass="text-rose-600 dark:text-rose-400"
        gradient="from-rose-500 to-rose-600"
      />

    </div>
  )
}