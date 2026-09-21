'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function SchemesPreview({
  schemes,
  onExploreAll
}: {
  schemes: any[],
  onExploreAll: () => void
}) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-indigo-500/10 backdrop-blur-sm
        shadow-[0_10px_15px_-5px_rgba(99,102,241,0.35)] p-6 text-center space-y-3">
      <h3 className="text-lg font-bold">Explore Government Schemes</h3>
      <p className="text-sm text-muted-foreground">
        Browse all available schemes tailored for different categories and benefits.
      </p>
      <Button
        onClick={onExploreAll}
        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.5)] transition-all duration-300 active:scale-95 hover:opacity-90 cursor-pointer"
      >
        Explore All Schemes
      </Button>
    </div>
  );
}
