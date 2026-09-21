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
    border border-border/50 dark:border-border/50
    bg-card/70 dark:bg-card/60 backdrop-blur-xl
    shadow-lg
    transition-all duration-300
    hover:border-primary hover:dark:border-primary
  "
  >
    {/* Subtle Gradient Glow */}
    {/* <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-5 transition duration-300`} /> */}

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
          bg-linear-to-br ${gradient}
          text-primary-foreground
          shadow-lg
          transition-transform duration-300
          group-hover:scale-110
        `}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-black tracking-tight text-muted-foreground dark:text-primary-foreground">
        {value}
      </p>

      {/* Subtext */}
      <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 font-medium">
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
        colorClass="text-primary dark:text-primary"
        gradient="from-primary to-primary/70"
      />

      <SummaryCard
        title="Active Users"
        value={data?.totalActiveUsers?.toLocaleString() || "0"}
        subtext="Live user base"
        icon={UserCheck}
        colorClass="text-primary dark:text-primary"
        gradient="from-primary to-primary/70"
      />

      <SummaryCard
        title="Deactivated"
        value={data?.totalDeactivatedUsers?.toLocaleString() || "0"}
        subtext="Requires attention"
        icon={UserX}
        colorClass="text-destructive dark:text-destructive"
        gradient="from-destructive to-destructive/70"
      />

    </div>
  )
}