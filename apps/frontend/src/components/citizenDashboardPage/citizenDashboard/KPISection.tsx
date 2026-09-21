'use client';

import React from 'react';
import {
  Users,
  FileStack,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Search,
  FileText,
  TrendingUp,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  // border border-gray-100 dark:border-white/50 bg-white dark:bg-zinc-900/60
 <Card
  className={cn(
    "relative overflow-hidden group rounded-2xl cursor-default",
    "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl",
    "border border-gray-100 dark:border-white/50",
    "shadow-sm hover:shadow-md",
    "transition-all duration-300 ease-in-out",
    "hover:-translate-y-0.5 hover:border-indigo-500/60"
  )}
>
    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
        {label}
      </CardTitle>
      <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        {value}
      </div>
    </CardContent>
  </Card>
);

export function KPISection({ stats, profileHealth }: { stats: any, profileHealth: number }) {
  // Expected stats object from applications/stats: { total, initiated, applied, rejected, ... }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Applications"
        value={stats?.total?.toString() || "0"}
        title="Total"
        icon={Search}
        gradient="from-indigo-500 to-indigo-600"
      />
      <StatsCard
        label="Applied Successfully"
        value={stats?.applied?.toString() || "0"}
        title="Applied"
        icon={CheckCircle2}
        gradient="from-emerald-500 to-green-600"
      />
      <StatsCard
        label="Initiated Applications"
        value={stats?.initiated?.toString() || "0"}
        title="Initiated"
        icon={Clock}
        gradient="from-amber-500 to-orange-600"
      />
      <StatsCard
        label="Rejected Applications"
        value={stats?.rejected?.toString() || "0"}
        title="Rejected"
        icon={FileText}
        gradient="from-rose-500 to-pink-600"
      />
    </div>
  );
}
