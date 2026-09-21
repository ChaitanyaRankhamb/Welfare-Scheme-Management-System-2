'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ProfileHelperSection() {
  return (
    <Card className="border-primary dark:border-primary bg-primary dark:bg-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary dark:text-primary" />
          Unlock More Schemes
        </CardTitle>
        <CardDescription>
          These results are based on your current profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          Complete your profile with additional information like income, education, and family details to discover more welfare schemes you&apos;re eligible for.
        </p>
        <Link href="/profile">
          <Button className="w-full sm:w-auto">Update Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
