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
      border border-destructive/40 dark:border-destructive/30
      bg-linear-to-br from-primary/10 to-primary/40
      dark:from-primary/10 dark:to-primary/10
      backdrop-blur-xl
      shadow-lg
    "
    >
      {/* Header */}
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10">
          <ShieldAlert className="w-4 h-4 text-destructive dark:text-destructive" />
        </div>

        <CardTitle className="text-base font-semibold text-destructive dark:text-destructive">
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
