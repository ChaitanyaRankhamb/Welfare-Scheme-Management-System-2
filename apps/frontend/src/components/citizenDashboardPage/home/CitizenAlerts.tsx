import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { AlertCard } from '@/components/adminDashboard/dashboardComponents/alertCard';

export const CitizenAlerts = () => {
  return (
    <Card
      className="
      relative overflow-hidden
      rounded-2xl
      border border-orange-200/40 dark:border-orange-900/30
      bg-gradient-to-br from-amber-50/60 to-orange-50/40
      dark:from-amber-950/10 dark:to-orange-950/10
      backdrop-blur-xl
      shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]
    "
    >
      {/* Header */}
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500/10">
          <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>

        <CardTitle className="text-base font-semibold text-orange-900 dark:text-orange-400">
          Action Required
        </CardTitle>
      </CardHeader>

      {/* Scrollable */}
      <CardContent
        className="
        h-[160px]
        overflow-y-auto
        snap-y snap-mandatory
        scroll-smooth
        space-y-3
        pr-2
        alert-custom-scrollbar
      "
      >
        <AlertCard
          title="Profile Incomplete"
          description="You are missing Agricultural Details. Complete your profile to unlock 14 more schemes."
          link="/citizenDashboard/profile"
          linkText="Complete Now"
          color="orange"
        />

        <AlertCard
          title="Action Pending"
          description="Your application for 'PM Kisan Samman Nidhi' is currently saved as Draft. Submit it before it expires."
          link="/citizenDashboard/applications"
          linkText="Review Draft"
          color="rose"
        />
      </CardContent>
    </Card>
  );
};
