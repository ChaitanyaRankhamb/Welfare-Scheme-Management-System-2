import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle2, IndianRupee } from 'lucide-react';
import { RecommendedScheme } from './types';

interface SchemeArtifactCardProps {
  scheme: RecommendedScheme;
  onAction: (text: string) => void;
  index?: number;
}

export function SchemeArtifactCard({ scheme, onAction, index }: SchemeArtifactCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all group w-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {index !== undefined && (
              <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
            )}
            <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {scheme.title}
            </h5>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
            <span className="px-2 py-0.5 rounded-full bg-accent text-foreground">
              {scheme.category || "General"}
            </span>
            {scheme.ministry && (
              <span className="truncate flex-1">
                {scheme.ministry}
              </span>
            )}
          </div>
        </div>

        {typeof scheme.score === 'number' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-primary font-bold text-xs border border-primary/20 shrink-0 h-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {Math.round(scheme.score * 100)}% Match
          </div>
        )}
      </div>

      {scheme.benefits && (
        <div className="mb-4 mt-2 p-3 rounded-lg bg-accent/30 text-sm flex gap-2">
          <IndianRupee className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-foreground font-medium leading-relaxed">
            {scheme.benefits}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
        <Button
          size="sm"
          onClick={() => onAction(`Tell me full application steps for ${scheme.title}`)}
          className="h-8 px-4 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
        >
          View Steps <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(`Check my eligibility criteria for ${scheme.title}`)}
          className="h-8 px-4 text-xs font-semibold rounded-lg border-border text-foreground hover:bg-accent cursor-pointer"
        >
          Check Eligibility
        </Button>
      </div>
    </div>
  );
}
