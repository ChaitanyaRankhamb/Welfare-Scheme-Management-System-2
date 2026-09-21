'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardCard } from './dashboard-components';
import { ArrowUpRight, Calendar, User, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Scheme Card ───────────────────────────────────────────────────

interface SchemeCardProps {
  title: string;
  description: string;
  category: string;
  state?: string;
  matchReason?: string;
  isEligible?: boolean;
}

export function SchemeCard({
  title,
  description,
  category,
  state = 'National',
  matchReason,
  isEligible = true,
}: SchemeCardProps) {
  return (
    <DashboardCard
      className="group"
      noPadding
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
            {category}
          </Badge>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            <MapPin className="h-3 w-3" />
            {state}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {matchReason && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-500/5 border border-green-500/10 text-[11px] text-green-700 dark:text-green-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Matched: {matchReason}</span>
          </div>
        )}

        <div className="pt-2 flex items-center gap-2">
          <Button size="sm" className="flex-1 rounded-xl font-bold h-10 shadow-sm transition-all active:scale-95 group-hover:shadow-indigo-500/10">
            Apply Now
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold h-10 border-border/50 hover:bg-muted/50 active:scale-95">
            View Details
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}

// ── Application Card ──────────────────────────────────────────────

interface ApplicationCardProps {
  schemeName: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Under Review' | 'Initiated';
  date: string;
  applicationId: string;
}

const statusConfig = {
  Approved: { color: 'text-green-600 bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
  Pending: { color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  'Under Review': { color: 'text-blue-600 bg-blue-500/10 border-blue-500/20', icon: AlertCircle },
  Rejected: { color: 'text-red-600 bg-red-500/10 border-red-500/20', icon: AlertCircle },
  Initiated: { color: 'text-slate-600 bg-slate-500/10 border-slate-500/20', icon: Clock },
};

export function ApplicationCard({
  schemeName,
  status,
  date,
  applicationId,
}: ApplicationCardProps) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <DashboardCard className="hover:scale-[1.005]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base truncate max-w-[200px] sm:max-w-md">{schemeName}</h4>
            <Badge variant="outline" className={cn("rounded-full border text-[10px] font-bold px-2 py-0.5", config.color)}>
              <Icon className="mr-1 h-3 w-3 inline" />
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Applied: {date}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">ID:</span>
              <span className="font-mono">{applicationId}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-bold border-border/50 hover:bg-muted active:scale-95">
            Track Status
          </Button>
          <Button size="sm" className="h-9 px-4 rounded-xl font-bold active:scale-95">
            Details
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
