"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { KPISection } from "@/components/citizenDashboardPage/citizenDashboard/KPISection";
import { QuickActions } from "@/components/citizenDashboardPage/citizenDashboard/QuickActions";
import { Recommendations } from "@/components/citizenDashboardPage/citizenDashboard/Recommendations";
import { ApplicationsPreview } from "@/components/citizenDashboardPage/citizenDashboard/ApplicationsPreview";
import { SchemesPreview } from "@/components/citizenDashboardPage/citizenDashboard/SchemesPreview";
import {
  SchemesDrawer,
  ApplicationsDrawer,
} from "@/components/citizenDashboardPage/citizenDashboard/Drawers";
import { AIAssistant } from "@/components/citizenDashboardPage/citizenDashboard/AIAssistant";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/components/api/citizenDashboardApis/dashboardApi";
import { applicationApi } from "@/components/api/applicationApi";

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
  const [schemeViewMode, setSchemeViewMode] = useState<"list" | "details">(
    "list",
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashRes, appStatsRes, recentAppsRes] = await Promise.all([
          dashboardApi.getAggregatedData(),
          applicationApi.getStats(),
          applicationApi.getRecent(10),
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
        console.error("Fetch Error:", err);
        setError(err.message || "An unexpected error occurred");
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
            Loading Your Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md space-y-4 rounded-4xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-destructive">
            Something went wrong
          </h2>
          <p className="text-sm font-medium italic leading-relaxed text-destructive/70">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-destructive font-bold text-destructive-foreground hover:bg-destructive/90"
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
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Namaste,{" "}
            <span className="capitalize text-primary">
              {user?.username || "Citizen"}
            </span>
          </h1>
          <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Your Welfare Command Center
          </p>
        </div>

        {/* Quick AI Invite */}
        <div className="hidden items-center gap-4 rounded-3xl border border-primary/10 bg-primary/5 p-2 pl-4 backdrop-blur-sm lg:flex shadow-lg">
          <p className="text-xs font-bold italic text-primary">
            "Find your best scheme match with AI"
          </p>
          <Button
            onClick={() => setIsAIModalOpen(true)}
            size="sm"
            className=" group shrink-0 rounded-xl h-11 px-6
          font-semibold text-primary-foreground
          bg-primary
          shadow-lg
          hover:bg-primary/90 hover:shadow-xl
          transition-all duration-300 active:scale-95
          flex items-center gap-2 cursor-pointer hover:opacity-80
        "
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            Launch Assistant
          </Button>
        </div>
      </section>

      {/* 2. KPI Section */}
      <KPISection stats={appStats} profileHealth={profileHealth} />

      {/* 3. Quick Actions */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
          Primary Actions
        </h3>
        <QuickActions
          onApply={() => {
            setSchemeViewMode("list");
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
          setSchemeViewMode("details");
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
            setSchemeViewMode("list");
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
      <AIAssistant open={isAIModalOpen} onOpenChange={setIsAIModalOpen} />

      {/* Footer Branding */}
      <div className="pt-20 pb-10 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">
          YojanaConnect SaaS Platform v2.0
        </p>
      </div>
    </div>
  );
}
