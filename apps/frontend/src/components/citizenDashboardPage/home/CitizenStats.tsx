import React from 'react';
import { StatsCard } from '@/components/adminDashboard/dashboardComponents/StatsCard';
import { Layers, FolderKanban, CheckSquare, ShieldCheck } from 'lucide-react';

export const CitizenStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Matched Schemes" 
        value="12" 
        icon={Layers} 
        trend="+2" 
        trendLabel="new this week"
        gradient="from-blue-500 to-indigo-600"
      />
      <StatsCard 
        title="Active Applications" 
        value="3" 
        icon={FolderKanban} 
        trend="Pending" 
        trendLabel="status update soon"
        gradient="from-indigo-500 to-purple-600"
      />
      <StatsCard 
        title="Benefits Received" 
        value="2" 
        icon={CheckSquare} 
        trend="+1" 
        trendLabel="this month"
        gradient="from-purple-500 to-pink-600"
      />
      <StatsCard 
        title="Profile Complete" 
        value="75%" 
        icon={ShieldCheck} 
        trend="+15%" 
        trendLabel="from last login"
        gradient="from-orange-500 to-red-500"
      />
    </div>
  );
};
