import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InsightsSectionProps {
  data?: Record<string, number>;
}

export const InsightsSection = ({ data = {} }: InsightsSectionProps) => {
  const statuses = Object.entries(data);
  const total = statuses.reduce((acc, [_, count]) => acc + count, 0) || 1;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "from-primary to-primary/70";
      case "rejected":
        return "from-destructive to-destructive/70";
      case "pending":
        return "from-primary to-primary/70";
      case "applied":
        return "from-primary to-primary/70";
      case "initiated":
        return "from-primary to-primary/70";
      default:
        return "from-muted to-muted-foreground";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-primary";
      case "rejected":
        return "text-destructive";
      case "pending":
        return "text-primary";
      case "applied":
        return "text-primary";
      case "initiated":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card
      className="
      lg:col-span-2
      rounded-2xl
      border border-border dark:border-border/50
      bg-card/70 dark:bg-card/60 backdrop-blur-xl
      shadow-lg
      transition-all duration-300
      hover:shadow-lg
    "
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-border/50 pb-4">
        <CardTitle className="text-lg font-semibold text-muted-foreground dark:text-muted-foreground">
          Applications by Status
        </CardTitle>

        <Link
          href="/adminDashboard/applications"
          className="text-sm font-semibold text-primary hover:text-primary flex items-center group"
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
                  <span className="text-muted-foreground dark:text-muted-foreground capitalize">
                    {status}
                  </span>
                  <span className={getStatusTextColor(status)}>
                    {percentage}% ({count.toLocaleString()})
                  </span>
                </div>

                <div className="w-full bg-muted dark:bg-card rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`bg-linear-to-r ${getStatusColor(status)} h-2.5 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-10 text-muted-foreground italic">
            No application data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
