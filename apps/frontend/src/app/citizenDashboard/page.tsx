'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { KPISection } from '@/components/citizenDashboardPage/citizenDashboard/KPISection';
import { QuickActions } from '@/components/citizenDashboardPage/citizenDashboard/QuickActions';
import { Recommendations } from '@/components/citizenDashboardPage/citizenDashboard/Recommendations';
import { ApplicationsPreview } from '@/components/citizenDashboardPage/citizenDashboard/ApplicationsPreview';
import { SchemesPreview } from '@/components/citizenDashboardPage/citizenDashboard/SchemesPreview';
import { SchemesDrawer, ApplicationsDrawer } from '@/components/citizenDashboardPage/citizenDashboard/Drawers';
import { AIAssistant } from '@/components/citizenDashboardPage/citizenDashboard/AIAssistant';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/components/api/citizenDashboardApis/dashboardApi';
import { applicationApi } from '@/components/api/applicationApi';

export default function CitizenDashboardPage() {
  const { user } = useUser();
  const [isSchemesOpen, setIsSchemesOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [citizenData, setCitizenData] = useState<any>(null);
  const [appStats, setAppStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [schemeViewMode, setSchemeViewMode] = useState<'list' | 'details'>('list');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dashRes, appStatsRes, recentAppsRes] = await Promise.all([
          dashboardApi.getAggregatedData(),
          applicationApi.getStats(),
          applicationApi.getRecent(10)
        ]);

        if (dashRes.success) {
          setCitizenData(dashRes.data);
        }
        
        if (appStatsRes.success) {
          setAppStats(appStatsRes.data);
        }

        if (recentAppsRes.success) {
          setRecentApps(recentAppsRes.data);
        }

      } catch (err: any) {
        console.error('Fetch Error:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Your Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center space-y-4 max-w-md p-8 rounded-[2rem] bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10">
          <div className="bg-rose-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-rose-600">Something went wrong</h2>
          <p className="text-sm font-medium text-rose-600/70 italic leading-relaxed">
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const topSchemes = citizenData?.recommendations?.schemes || [];
  const allSchemes = citizenData?.summary?.totalSchemes || [];
  const profileHealth = citizenData?.summary?.profileHealthScore || 0;
  const userProfile = citizenData?.profile;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Namaste, <span className="text-indigo-600 dark:text-indigo-400 capitalize">{user?.username || 'Citizen'}</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Your Welfare Command Center
          </p>
        </div>
        
        {/* Quick AI Invite */}
        <div className="hidden lg:flex items-center gap-4 p-2 pl-4 rounded-3xl bg-indigo-500/5 border border-gray-100 dark:border-indigo-500/10 backdrop-blur-sm
        shadow-[0_10px_15px_-5px_rgba(99,102,241,0.35)]">
           <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 italic">"Find your best scheme match with AI"</p>
           <Button 
            onClick={() => setIsAIModalOpen(true)}
            size="sm" 
            className=" group shrink-0 rounded-xl h-11 px-6
          font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-violet-500
          shadow-[0_10px_25px_-5px_rgba(99,102,241,0.35)]
          hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.5)]
          transition-all duration-300 active:scale-95
          flex items-center gap-2 cursor-pointer hover:opacity-80
        "
           >
            <Sparkles className="h-3.5 w-3.5 text-white dark:text-white" />
            Launch Assistant
           </Button>
        </div>
      </section>

      {/* 2. KPI Section */}
      <KPISection stats={appStats} profileHealth={profileHealth} />

      {/* 3. Quick Actions */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Primary Actions</h3>
        <QuickActions 
          onApply={() => {
            setSchemeViewMode('list');
            setSelectedScheme(null);
            setIsSchemesOpen(true);
          }}
          onResume={() => setIsApplicationsOpen(true)}
          onAskAI={() => setIsAIModalOpen(true)}
        />
      </section>

      {/* 4. Recommendations Horizontal Scroll */}
      <Recommendations 
        schemes={topSchemes} 
        onApply={(scheme) => {
          setSelectedScheme(scheme);
          setSchemeViewMode('details');
          setIsSchemesOpen(true);
        }} 
      />

      {/* 5. Split Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ApplicationsPreview 
          applications={recentApps} 
          onViewAll={() => setIsApplicationsOpen(true)} 
        />
        <SchemesPreview 
          schemes={allSchemes} 
          onExploreAll={() => {
            setSchemeViewMode('list');
            setSelectedScheme(null);
            setIsSchemesOpen(true);
          }} 
        />
      </div>

      {/* Overlays */}
      <SchemesDrawer 
        open={isSchemesOpen} 
        onClose={setIsSchemesOpen} 
        schemes={allSchemes} 
        userProfile={userProfile}
        initialViewMode={schemeViewMode}
        initialScheme={selectedScheme}
      />
      <ApplicationsDrawer 
        open={isApplicationsOpen} 
        onClose={setIsApplicationsOpen} 
        applications={recentApps} 
      />
      <AIAssistant 
        open={isAIModalOpen} 
        onOpenChange={setIsAIModalOpen} 
      />

      {/* Footer Branding */}
      <div className="pt-20 pb-10 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] tracking-wider">YojanaConnect SaaS Platform v2.0</p>
      </div>
    </div>
  );
}