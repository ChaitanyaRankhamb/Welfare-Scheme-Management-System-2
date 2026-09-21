import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { AlertCard } from './alertCard'

export const CriticalAlerts = ({ recentApplications = [] }: { recentApplications?: any[] }) => {
  return (
    <Card
      className="
      relative overflow-hidden
      rounded-2xl
      border border-indigo-200/40 dark:border-indigo-900/30
      bg-gradient-to-br from-indigo-50/60 to-purple-50/40
      dark:from-indigo-950/10 dark:to-purple-950/10
      backdrop-blur-xl
      shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]
    "
    >
      {/* Header */}
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500/10">
          <AlertTriangle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>

        <CardTitle className="text-base font-semibold text-indigo-900 dark:text-indigo-400">
          Recent Activity
        </CardTitle>
      </CardHeader>

      {/* Scrollable */}
      <CardContent
        className="
        h-[110px]
        overflow-y-auto
        snap-y snap-mandatory
        scroll-smooth
        space-y-3
        pr-2
        alert-custom-scrollbar
      "
      >
        {recentApplications.map((app, i) => (
          <AlertCard
            key={i}
            title={app.userId?.username || app.userId?.email || 'User'}
            description={`Applied for ${app.schemeId?.name || app.schemeName}`}
            link="/adminDashboard/applications"
            linkText="View"
            color={app.status === 'REJECTED' ? 'rose' : app.status === 'APPLIED' ? 'emerald' : 'orange'}
          />
        ))}

        {recentApplications.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4 italic">No recent activity</p>
        )}
      </CardContent>
    </Card>
  )
}