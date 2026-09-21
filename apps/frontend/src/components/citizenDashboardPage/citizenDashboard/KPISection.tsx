"use client";

import React from "react";
import {
  Users,
  FileStack,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Search,
  FileText,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  children?: React.ReactNode;
}

const StatsCard = ({
  title,
  value,
  label,
  icon: Icon,
  gradient,
  children,
}: StatsCardProps) => (
  // border border-border dark:border-border/50 bg-card dark:bg-card/60
  <Card
    className={cn(
      "relative overflow-hidden group rounded-2xl cursor-default",
      "bg-card/80 dark:bg-card/80 backdrop-blur-xl",
      "border border-border dark:border-border/50",
      "shadow-sm hover:shadow-md",
      "transition-all duration-300 ease-in-out",
      "hover:-translate-y-0.5 hover:border-primary/60",
    )}
  >
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary-foreground/10" />
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
        {label}
      </CardTitle>
      <div
        className={`p-2 rounded-xl bg-linear-to-br ${gradient} text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-4 h-4" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-black text-muted-foreground dark:text-primary-foreground tracking-tight">
        {value}
      </div>
    </CardContent>
  </Card>
);

export function KPISection({
  stats,
  profileHealth,
}: {
  stats: any;
  profileHealth: number;
}) {
  // Expected stats object from applications/stats: { total, initiated, applied, rejected, ... }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Applications"
        value={stats?.total?.toString() || "0"}
        title="Total"
        icon={Search}
        gradient="from-primary to-primary/70"
      />
      <StatsCard
        label="Applied Successfully"
        value={stats?.applied?.toString() || "0"}
        title="Applied"
        icon={CheckCircle2}
        gradient="from-primary to-primary/70"
      />
      <StatsCard
        label="Initiated Applications"
        value={stats?.initiated?.toString() || "0"}
        title="Initiated"
        icon={Clock}
        gradient="from-primary to-primary/70"
      />
      <StatsCard
        label="Rejected Applications"
        value={stats?.rejected?.toString() || "0"}
        title="Rejected"
        icon={FileText}
        gradient="from-destructive to-destructive/70"
      />
    </div>
  );
}
