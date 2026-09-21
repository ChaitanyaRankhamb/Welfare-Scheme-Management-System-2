import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { AlertCard } from "./alertCard";

export const CriticalAlerts = ({
  recentApplications = [],
}: {
  recentApplications?: any[];
}) => {
  return (
    <Card
      className="
      relative overflow-hidden
      rounded-2xl
      border border-primary/40 dark:border-primary/30
      bg-linear-to-br from-primary/60 to-primary/40
      dark:from-primary/10 dark:to-primary/10
      backdrop-blur-xl
      shadow-lg
    "
    >
      {/* Header */}
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10">
          <AlertTriangle className="w-4 h-4 text-primary dark:text-primary" />
        </div>

        <CardTitle className="text-base font-semibold text-primary dark:text-primary">
          Recent Activity
        </CardTitle>
      </CardHeader>

      {/* Scrollable */}
      <CardContent
        className="
        h-27.5
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
            title={app.userId?.username || app.userId?.email || "User"}
            description={`Applied for ${app.schemeId?.name || app.schemeName}`}
            link="/adminDashboard/applications"
            linkText="View"
            color={
              app.status === "REJECTED"
                ? "destructive"
                : app.status === "APPLIED"
                  ? "primary"
                  : "primary"
            }
          />
        ))}

        {recentApplications.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4 italic">
            No recent activity
          </p>
        )}
      </CardContent>
    </Card>
  );
};
