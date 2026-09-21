import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

interface EligibilityCriterion {
  label: string;
  met: boolean | null; // null if unknown
}

interface EligibilityMatrixProps {
  criteria: EligibilityCriterion[];
  schemeTitle?: string;
}

export function EligibilityMatrix({ criteria, schemeTitle }: EligibilityMatrixProps) {
  const { completionStats } = useProfile();

  if (!criteria || criteria.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="w-4 h-4" />
          <h5 className="text-sm font-bold">
            Eligibility Match {schemeTitle ? `for ${schemeTitle}` : ""}
          </h5>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {criteria.map((criterion, idx) => {
          const isMet = criterion.met === true;
          const isUnknown = criterion.met === null;
          
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-sm font-medium",
                isMet ? "bg-primary/10 border-primary/30 text-primary dark:text-primary" :
                isUnknown ? "bg-background/80 border-border/60 text-muted-foreground" :
                "bg-destructive/10 border-destructive/30 text-destructive"
              )}
            >
              {isMet ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : isUnknown ? (
                <ShieldCheck className="w-4 h-4 shrink-0 opacity-50" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{criterion.label}</span>
            </div>
          );
        })}
      </div>

      {completionStats.percent < 100 && criteria.some(c => c.met === null) && (
        <p className="text-xs text-muted-foreground mt-2">
          * Some criteria couldn't be evaluated. Please update your profile.
        </p>
      )}
    </div>
  );
}
