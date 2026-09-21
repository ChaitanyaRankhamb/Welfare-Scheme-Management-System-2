'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon,
  headerAction,
  noPadding = false,
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <Card className={cn("premium-card overflow-hidden", className)} {...props}>
      {(title || icon || headerAction) && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {icon && <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{icon}</div>}
              <div>
                <CardTitle className="text-lg font-bold truncate">{title}</CardTitle>
                {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
              </div>
            </div>
            {headerAction}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? "p-0" : "pt-0")}>
        {children}
      </CardContent>
    </Card>
  );
}

// ── Section Wrapper ───────────────────────────────────────────────

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  subtitle,
  action,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ── Empty State ───────────────────────────────────────────────────

import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = <InboxIcon className="h-12 w-12 text-muted-foreground/40" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center premium-card bg-transparent border-dashed">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────

export function LoadingSkeleton({ 
  className,
  count = 1 
}: { 
  className?: string;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            "animate-pulse bg-muted rounded-2xl",
            className
          )} 
        />
      ))}
    </>
  );
}
