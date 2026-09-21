import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { RecommendedScheme } from './types';

interface SchemeArtifactProps {
  recommendations: RecommendedScheme[];
  onAction: (text: string) => void;
}

export function SchemeArtifact({ recommendations, onAction }: SchemeArtifactProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-4 space-y-2.5 pt-2 border-t border-border/60">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          Matching Government Schemes ({recommendations.length})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {recommendations.map((scheme, idx) => (
          <div
            key={`${scheme.title}-${idx}`}
            className="p-3.5 rounded-xl border border-border bg-accent/20 hover:border-primary/40 hover:bg-accent/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {scheme.title}
                  </h5>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                  {scheme.category || "General"} {scheme.ministry ? `• ${scheme.ministry}` : ""}
                </p>
              </div>

              {typeof scheme.score === 'number' && (
                <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary dark:text-primary font-extrabold text-[10px] border border-primary/20 shrink-0">
                  {Math.round(scheme.score * 100)}% Match
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onAction(`Tell me full application steps for ${scheme.title}`)}
                className="h-7 px-3 text-[11px] font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                View Steps <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(`Check my eligibility criteria for ${scheme.title}`)}
                className="h-7 px-3 text-[11px] font-semibold rounded-lg border-border text-foreground hover:bg-accent cursor-pointer"
              >
                Check Eligibility
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
