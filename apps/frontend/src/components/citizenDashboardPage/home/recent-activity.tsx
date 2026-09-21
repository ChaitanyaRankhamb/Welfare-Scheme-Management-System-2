'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileText, AlertCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    message: 'You applied for PM Kisan Samman Nidhi',
    timestamp: '2 days ago',
    type: 'application',
    icon: CheckCircle2,
  },
  {
    id: 2,
    message: 'Your Ayushman Bharat application is under review',
    timestamp: '5 days ago',
    type: 'update',
    icon: FileText,
  },
  {
    id: 3,
    message: 'New scheme added: PMEGP Scheme',
    timestamp: '1 week ago',
    type: 'alert',
    icon: AlertCircle,
  },
  {
    id: 4,
    message: 'Pradhan Mantri Fasal Bima Yojana approved',
    timestamp: '2 weeks ago',
    type: 'success',
    icon: CheckCircle2,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
