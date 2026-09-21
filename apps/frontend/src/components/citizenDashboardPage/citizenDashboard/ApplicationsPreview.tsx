'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppItemProps {
  schemeName: string;
  status: string;
  date: string;
  onClick: () => void;
}

const statusMap: any = {
  'APPLIED': { color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  'INITIATED': { color: 'text-amber-600 bg-amber-500/10 border-amber-500/20', icon: Clock },
  'REJECTED': { color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', icon: XCircle },
};

const ApplicationItem = ({ schemeName, status, date, onClick }: AppItemProps) => {
  const config = statusMap[status] || statusMap['INITIATED'];
  const Icon = config.icon;

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer group shrink-0 h-[80px]"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn("p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110", config.color)}>
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-black truncate">{schemeName}</h4>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <Badge variant="outline" className={cn("rounded-full border text-[9px] font-black uppercase tracking-widest px-2 py-0.5", config.color)}>
              <Icon className="w-2.5 h-2.5 mr-1" />
              {status}
            </Badge>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
    </div>
  );
};

export function ApplicationsPreview({ 
  applications, 
  onViewAll 
}: { 
  applications: any[], 
  onViewAll: () => void 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-black tracking-tight">Recent Activity</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl">
          View All
          <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3 h-[360px] overflow-y-auto pr-2 scrollbar-hide flex flex-col">
        {applications.length > 0 ? (
          applications.map((app, i) => (
            <ApplicationItem 
              key={i} 
              schemeName={app?.schemeId?.name || app?.schemeName || 'Unknown Scheme'} 
              status={app.status} 
              date={new Date(app.updatedAt).toLocaleDateString()} 
              onClick={onViewAll} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 text-center space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground/30 px-1" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
