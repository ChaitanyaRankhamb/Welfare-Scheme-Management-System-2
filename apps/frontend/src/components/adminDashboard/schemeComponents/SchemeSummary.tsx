import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban, CheckCircle2, FileArchive, FileEdit } from 'lucide-react'

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

export const SchemeSummary = ({ data }: { data?: any }) => {
  // Updated scheme status system: active/deactive → drafted/published/archived
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <SummaryCard 
        title="Total Schemes" 
        value={data?.totalSchemes?.toLocaleString() || "0"} 
        subtext="All records"
        icon={FolderKanban}
        colorClass="text-indigo-600 dark:text-indigo-400"
        gradient="from-indigo-500 to-indigo-600"
      />
      <SummaryCard 
        title="Drafted" 
        value={data?.totalDraftedSchemes?.toLocaleString() || "0"} 
        subtext="In progress"
        icon={FileEdit}
        colorClass="text-amber-600 dark:text-amber-400"
        gradient="from-amber-500 to-amber-600"
      />
      <SummaryCard 
        title="Published" 
        value={data?.totalPublishedSchemes?.toLocaleString() || "0"} 
        subtext="Live for users"
        icon={CheckCircle2}
        colorClass="text-emerald-600 dark:text-emerald-400"
        gradient="from-emerald-500 to-emerald-600"
      />
      <SummaryCard 
        title="Archived" 
        value={data?.totalArchivedSchemes?.toLocaleString() || "0"} 
        subtext="Hidden records"
        icon={FileArchive}
        colorClass="text-gray-600 dark:text-gray-400"
        gradient="from-gray-500 to-gray-600"
      />
    </div>
  )
}
