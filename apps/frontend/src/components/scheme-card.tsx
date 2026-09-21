'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SchemeCardProps {
  title: string;
  description: string;
  category: string;
  state?: string;
  matchReason?: string;
  compact?: boolean;
}

export function SchemeCard({
  title,
  description,
  category,
  state,
  matchReason,
  compact = false,
}: SchemeCardProps) {
  if (compact) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
            </div>
            <Badge variant="secondary" className="whitespace-nowrap">
              {category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="line-clamp-2">{description}</CardDescription>
          {state && <Badge variant="outline">{state}</Badge>}
          <Button className="w-full" size="sm">
            Apply
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {state && (
            <div>
              <span className="text-sm font-medium">State:</span>
              <Badge variant="outline" className="ml-2">
                {state}
              </Badge>
            </div>
          )}
          {matchReason && (
            <div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                ✓ Why matched: {matchReason}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
