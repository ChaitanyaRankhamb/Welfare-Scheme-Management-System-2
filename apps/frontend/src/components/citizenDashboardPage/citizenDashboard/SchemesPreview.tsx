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
    <div className="rounded-2xl border border-border dark:border-primary/10 backdrop-blur-sm
        shadow-lg p-6 text-center space-y-3">
      <h3 className="text-lg font-bold">Explore Government Schemes</h3>
      <p className="text-sm text-muted-foreground">
        Browse all available schemes tailored for different categories and benefits.
      </p>
      <Button
        onClick={onExploreAll}
        className="mt-2 bg-primary hover:bg-primary text-primary-foreground font-semibold bg-linear-to-r from-primary to-primary/70 shadow-lg hover:shadow-lg transition-all duration-300 active:scale-95 hover:opacity-90 cursor-pointer"
      >
        Explore All Schemes
      </Button>
    </div>
  );
}
