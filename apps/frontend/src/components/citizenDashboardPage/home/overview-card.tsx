'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function OverviewCards() {
  const stats = [
    {
      title: 'Matched Schemes',
      value: '12',
      description: 'Schemes matching your profile',
    },
    {
      title: 'Applications in Progress',
      value: '3',
      description: 'Pending review',
    },
    {
      title: 'Applied Schemes',
      value: '5',
      description: 'Total applications',
    },
    {
      title: 'Profile Completion',
      value: '75%',
      description: 'Complete your profile for better matches',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.slice(0, 3).map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={75} className="h-2" />
          <p className="text-xs text-muted-foreground">75% Complete</p>
        </CardContent>
      </Card>
    </div>
  );
}
