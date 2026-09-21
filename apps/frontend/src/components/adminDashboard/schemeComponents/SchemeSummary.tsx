import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  CheckCircle2,
  FileArchive,
  FileEdit,
} from "lucide-react";

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

export const SchemeSummary = ({ data }: { data?: any }) => {
  // Updated scheme status system: active/deactive → drafted/published/archived
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        title="Total Schemes"
        value={data?.totalSchemes?.toLocaleString() || "0"}
        subtext="All records"
        icon={FolderKanban}
        colorClass="text-primary dark:text-primary"
        gradient="from-primary to-primary/70"
      />
      <SummaryCard
        title="Drafted"
        value={data?.totalDraftedSchemes?.toLocaleString() || "0"}
        subtext="In progress"
        icon={FileEdit}
        colorClass="text-primary"
        gradient="from-primary to-primary/70"
      />
      <SummaryCard
        title="Published"
        value={data?.totalPublishedSchemes?.toLocaleString() || "0"}
        subtext="Live for users"
        icon={CheckCircle2}
        colorClass="text-primary dark:text-primary"
        gradient="from-primary to-primary/70"
      />
      <SummaryCard
        title="Archived"
        value={data?.totalArchivedSchemes?.toLocaleString() || "0"}
        subtext="Hidden records"
        icon={FileArchive}
        colorClass="text-muted-foreground dark:text-muted-foreground"
        gradient="from-muted to-muted-foreground"
      />
    </div>
  );
};
