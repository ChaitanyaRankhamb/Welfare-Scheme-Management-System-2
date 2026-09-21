import React, { useState } from "react";
import { FileText, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentChecklistProps {
  documents: string[];
  schemeTitle?: string;
}

export function DocumentChecklist({
  documents,
  schemeTitle,
}: DocumentChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!documents || documents.length === 0) return null;

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = Math.round((completedCount / documents.length) * 100);

  return (
    <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary dark:text-primary">
          <FileText className="w-4 h-4" />
          <h5 className="text-sm font-bold">
            Required Documents {schemeTitle ? `for ${schemeTitle}` : ""}
          </h5>
        </div>
        <span className="text-xs font-bold text-primary dark:text-primary">
          {completedCount} / {documents.length} Ready
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <button
              key={`${doc}-${idx}`}
              onClick={() => toggleCheck(idx)}
              className={cn(
                "flex items-center text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                isChecked
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-background/80 border-border/60 text-muted-foreground hover:border-primary/30",
              )}
            >
              {isChecked ? (
                <Check className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary/50 shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  isChecked && "line-through opacity-70",
                )}
              >
                {doc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
