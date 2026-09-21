'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, Sparkles } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export function Recommendations({ schemes, onApply }: { schemes: any[], onApply: (scheme: any) => void }) {
  if (!schemes || schemes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1 px-2">
          <h2 className="text-2xl font-black tracking-tight">Smart AI Recommendations</h2>
          <p className="text-sm text-muted-foreground font-medium italic italic opacity-70">Hand-picked schemes based on your profile details</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 rounded-[2rem] bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-white/10 text-center space-y-3">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">No recommendations yet</p>
            <p className="text-xs text-muted-foreground font-medium">Complete your profile to unlock personalized matches</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight">Smart AI Recommendations</h2>
            <Badge variant="secondary" className="rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase px-2">AI-Powered</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium italic opacity-70">Personalized scheme matches prioritized by our intelligence engine</p>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/50 bg-white dark:bg-zinc-900 shadow-sm
      shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-gray-200 dark:border-white/50">
                <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-widest py-5 pl-8">Sr. No</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Scheme Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Category</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Start Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">End Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme, index) => (
                <TableRow
                  key={scheme.id || index}
                  className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors border-gray-100 dark:border-white/10"
                >
                  <TableCell className="font-bold text-muted-foreground/60 py-5 pl-8">
                    {String(index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="space-y-1 max-w-sm">
                      <p className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors truncate">
                        {scheme.title}
                      </p>
                      <p className="text-[10px] font-bold text-indigo-600/60 dark:text-indigo-400/60 italic line-clamp-1">
                        {scheme.matchReason}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 uppercase tracking-tight">
                      {scheme.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground py-5">
                    {scheme.startDate ? new Date(scheme.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground py-5">
                    {scheme.endDate ? new Date(scheme.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </TableCell>
                  <TableCell className="text-right py-5 pr-8">
                    <div className="flex items-center justify-end gap-2">
                        {/* VIEW BUTTON */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onApply(scheme)}
                              className="h-9 w-9 p-0 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* APPLY BUTTON */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (scheme.applicationLink) {
                                  window.open(scheme.applicationLink, '_blank');
                                } else {
                                  onApply(scheme);
                                }
                              }}
                              className="h-9 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              Apply
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Apply for this scheme</p>
                          </TooltipContent>
                        </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
