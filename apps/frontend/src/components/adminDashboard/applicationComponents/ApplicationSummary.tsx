import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileStack, Clock, XCircle } from "lucide-react";

const SummaryCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  gradient,
}: any) => (
  <Card
    className="
    relative overflow-hidden group
    rounded-2xl
    border border-border/50 dark:border-border/50
    bg-card/70 dark:bg-card/60 backdrop-blur-xl
    shadow-lg
    transition-all duration-300
    hover:border-primary hover:dark:border-primary
  "
  >
    <CardContent className="p-6 relative z-10">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider ${colorClass}`}
        >
          {title}
        </p>
        {/* Icon */}
        <div
          className={`
          p-2.5 rounded-xl
          bg-linear-to-br ${gradient}
          text-primary-foreground
          shadow-lg
          transition-transform duration-300
          group-hover:scale-110
        `}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-black tracking-tight text-muted-foreground dark:text-primary-foreground">
        {value}
      </p>

      {/* Subtext */}
      <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 font-medium">
        {subtext}
      </p>
    </CardContent>
  </Card>
);

export const ApplicationSummary = ({ stats }: { stats?: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        title="Total Applied"
        value={stats?.applied?.toLocaleString() || "0"}
        subtext="All cumulative applications"
        icon={FileStack}
        colorClass="text-primary dark:text-primary"
        gradient="from-primary to-primary/70"
      />
      <SummaryCard
        title="Initiated"
        value={stats?.initiated?.toLocaleString() || "0"}
        subtext="Pending rigorous review"
        icon={Clock}
        colorClass="text-primary"
        gradient="from-primary to-primary/70"
      />
      <SummaryCard
        title="Rejected"
        value={stats?.rejected?.toLocaleString() || "0"}
        subtext="Failed eligibility criteria"
        icon={XCircle}
        colorClass="text-destructive dark:text-destructive"
        gradient="from-destructive to-destructive/70"
      />
    </div>
  );
};
