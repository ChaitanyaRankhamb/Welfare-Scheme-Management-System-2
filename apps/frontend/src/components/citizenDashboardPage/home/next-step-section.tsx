'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface NextStepSectionProps {
  hasApplications?: boolean;
  profileComplete?: boolean;
}

export function NextStepSection({ hasApplications = false, profileComplete = true }: NextStepSectionProps) {
  let title = 'Get Started';
  let description = 'Start applying to schemes matching your profile';
  let cta = 'Browse Schemes';
  let ctaHref = '/schemes';

  if (!profileComplete) {
    title = 'Complete Your Profile';
    description = 'Complete your profile to unlock more schemes and better matches';
    cta = 'Update Profile';
    ctaHref = '/profile';
  } else if (hasApplications) {
    title = 'Track Your Applications';
    description = 'Monitor the status of your applications and get updates';
    cta = 'View Applications';
    ctaHref = '/applications';
  }

  return (
    <Card className="border-2 border-dashed bg-gradient-to-br from-background to-secondary/10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={ctaHref}>
          <Button size="lg" className="w-full sm:w-auto gap-2">
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
