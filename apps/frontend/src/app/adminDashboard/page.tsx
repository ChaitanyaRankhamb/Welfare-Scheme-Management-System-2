'use client'

import React, { useState, useEffect } from 'react'
import { Users, FileStack, FolderKanban, Clock } from 'lucide-react'
import { StatsCard } from '../../components/adminDashboard/dashboardComponents/StatsCard'
import { InsightsSection } from '../../components/adminDashboard/dashboardComponents/InsightsSection'
import { CriticalAlerts } from '../../components/adminDashboard/dashboardComponents/CriticalAlerts'
import { QuickLinks } from '../../components/adminDashboard/dashboardComponents/QuickLinks'
import { HeaderSection } from '../../components/adminDashboard/dashboardComponents/HeaderSection'
import { dashboardApi } from '@/components/api/adminDashboardApis/dashboardApi'
import { applicationApi } from '@/components/api/applicationApi'
import { toast } from 'sonner'

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [appStats, setAppStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, appStatsRes, recentAppsRes] = await Promise.all([
          dashboardApi.getAggregatedData(),
          applicationApi.getStats(),
          applicationApi.getRecent(5, true)
        ]);

        if (dashRes.success) {
          setData(dashRes.data);
        }
        if (appStatsRes.success) {
          setAppStats(appStatsRes.data);
        }
        if (recentAppsRes.success) {
          setRecentApps(recentAppsRes.data);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Aggregating dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const { dashboard } = data || {};

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <HeaderSection />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={dashboard?.totalUsers?.toLocaleString() || "0"}
          icon={Users}
          trend="+14%"
          trendLabel="this month"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Total Schemes"
          value={dashboard?.totalSchemes?.toLocaleString() || "0"}
          icon={FolderKanban}
          trend="+2"
          trendLabel="new this week"
          gradient="from-indigo-500 to-purple-600"
        />
        <StatsCard
          title="Total Applications"
          value={appStats?.total?.toLocaleString() || "0"}
          icon={FileStack}
          trend="+21%"
          trendLabel="this month"
          gradient="from-purple-500 to-pink-600"
        />
        <StatsCard
          title="Applied (Success)"
          value={appStats?.applied?.toLocaleString() || "0"}
          icon={Clock}
          trend={`${appStats?.appliedPercentage}%`}
          trendLabel="of total"
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InsightsSection data={{
          Applied: appStats?.applied || 0,
          Rejected: appStats?.rejected || 0,
          Initiated: appStats?.initiated || 0
        }} />
        <div className="space-y-6">
          <CriticalAlerts recentApplications={recentApps} />
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}
