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
      border border-gray-200 dark:border-white/50
      bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
      shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
      transition-all duration-300
      hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]
    "
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-white/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              AI Recommendations
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Top scheme matches based on your profile completeness.
            </p>
          </div>
        </div>

        <Link
          href="/citizenDashboard/schemes"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center group"
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
          <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors gap-4">
            <div className="space-y-1flex-1">
              <h4 className="font-bold text-sm tracking-tight">{scheme.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{scheme.description}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-500" />
                <span className="text-[11px] font-medium text-green-700 dark:text-green-400">{scheme.matchReason}</span>
              </div>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Link href="/citizenDashboard/applications">
                <Button size="sm" className="w-full sm:w-auto text-xs px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
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
