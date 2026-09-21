'use client';

import React from 'react';
import { CitizenHeader } from '@/components/citizenDashboardPage/home/CitizenHeader';
import { CitizenStats } from '@/components/citizenDashboardPage/home/CitizenStats';
import { TopMatchedSchemes } from '@/components/citizenDashboardPage/home/TopMatchedSchemes';
import { CitizenAlerts } from '@/components/citizenDashboardPage/home/CitizenAlerts';
import { CitizenQuickLinks } from '@/components/citizenDashboardPage/home/CitizenQuickLinks';

export default function HomePage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Section */}
      <CitizenHeader />

      {/* 2. Stats Grid */}
      <CitizenStats />

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: AI Matched Schemes & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <TopMatchedSchemes />
        </div>

        {/* Right: Sidebar with Alerts & Links */}
        <div className="space-y-6">
          <CitizenAlerts />
          <CitizenQuickLinks />
        </div>

      </div>
    </div>
  );
}
