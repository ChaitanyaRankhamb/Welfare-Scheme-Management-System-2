import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface InsightsSectionProps {
  data?: Record<string, number>;
}

export const InsightsSection = ({ data = {} }: InsightsSectionProps) => {
  const statuses = Object.entries(data);
  const total = statuses.reduce((acc, [_, count]) => acc + count, 0) || 1;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'from-emerald-400 to-emerald-600';
      case 'rejected': return 'from-rose-400 to-rose-600';
      case 'pending': return 'from-amber-400 to-amber-600';
      case 'applied': return 'from-indigo-400 to-indigo-600';
      case 'initiated': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-emerald-600';
      case 'rejected': return 'text-rose-600';
      case 'pending': return 'text-amber-500';
      case 'applied': return 'text-indigo-600';
      case 'initiated': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card
      className="
      lg:col-span-2
      rounded-2xl
      border border-gray-200 dark:border-white/50
      bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
      shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
      transition-all duration-300
      hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]
    "
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-white/50 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Applications by Status
        </CardTitle>

        <Link
          href="/adminDashboard/applications"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center group"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-6 space-y-8">
        {statuses.length > 0 ? (
          statuses.map(([status, count]) => {
            const percentage = Math.round((count / total) * 100);
            return (
              <div key={status} className="space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                  <span className={getStatusTextColor(status)}>
                    {percentage}% ({count.toLocaleString()})
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getStatusColor(status)} h-2.5 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-10 text-gray-500 italic">
            No application data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};