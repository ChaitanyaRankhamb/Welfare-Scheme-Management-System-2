'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function AIShortcutCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Need Help Finding Schemes?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized recommendations from our AI assistant
            </p>
          </div>
          <Link href="/ai">
            <Button className="ml-4 whitespace-nowrap">Ask AI</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
