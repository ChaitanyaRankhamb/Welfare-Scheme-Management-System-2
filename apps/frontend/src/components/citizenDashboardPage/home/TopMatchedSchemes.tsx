import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopMatchedSchemes = () => {
  return (
    <Card
      className="
      lg:col-span-2
      rounded-2xl
      border border-border dark:border-border/50
      bg-card/70 dark:bg-card/60 backdrop-blur-xl
      shadow-lg
      transition-all duration-300
      hover:shadow-lg
    "
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary dark:bg-primary/20 rounded-lg">
            <Bot className="w-5 h-5 text-primary dark:text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-muted-foreground dark:text-muted-foreground">
              AI Recommendations
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Top scheme matches based on your profile completeness.
            </p>
          </div>
        </div>

        <Link
          href="/citizenDashboard/schemes"
          className="text-sm font-semibold text-primary hover:text-primary flex items-center group"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-6 space-y-4">
        {[
          {
            title: 'PM Kisan Samman Nidhi',
            description: 'Direct income support providing ₹6,000 per year.',
            matchReason: 'Matched based on your Agricultural Income profile.',
          },
          {
            title: 'Ayushman Bharat - PMJAY',
            description: 'Health insurance scheme providing up to ₹5 lakhs annual coverage.',
            matchReason: 'Matched based on your BPL Status and State.',
          },
          {
            title: 'Pradhan Mantri Fasal Bima Yojana',
            description: 'Comprehensive crop insurance scheme against natural calamities.',
            matchReason: 'Matched because you are a registered farmer in Maharashtra.',
          }
        ].map((scheme, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-border dark:border-border bg-muted/50 dark:bg-card/30 hover:bg-muted dark:hover:bg-card/80 transition-colors gap-4">
            <div className="space-y-1flex-1">
              <h4 className="font-bold text-sm tracking-tight">{scheme.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{scheme.description}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3 h-3 text-primary dark:text-primary" />
                <span className="text-[11px] font-medium text-primary dark:text-primary">{scheme.matchReason}</span>
              </div>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Link href="/citizenDashboard/applications">
                <Button size="sm" className="w-full sm:w-auto text-xs px-4 rounded-lg bg-primary hover:bg-primary text-primary-foreground font-semibold">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
