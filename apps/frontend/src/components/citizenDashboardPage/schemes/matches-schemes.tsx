'use client';

import React from 'react';
import { SchemeCard } from '@/components/scheme-card';

const schemes = [
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Comprehensive crop insurance scheme providing coverage against crop loss due to natural calamities, pests, and diseases',
    category: 'Agriculture',
    state: 'Maharashtra',
    matchReason: 'You are a registered farmer',
  },
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support providing ₹6,000 per year to eligible farmer families in three installments',
    category: 'Agriculture',
    state: 'National',
    matchReason: 'Your landholding matches eligibility',
  },
  {
    title: 'Ayushman Bharat - PMJAY',
    description: 'Health insurance scheme providing up to ₹5 lakhs annual health insurance coverage for families',
    category: 'Health',
    state: 'National',
    matchReason: 'Your family income is within range',
  },
];

export function MatchedSchemesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Top Matches for You</h2>
        <p className="text-muted-foreground mt-2">
          We found {schemes.length} schemes based on your profile and eligibility
        </p>
      </div>

      {schemes.length <= 2 ? (
        <div className="grid grid-cols-1 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.title}
              title={scheme.title}
              description={scheme.description}
              category={scheme.category}
              state={scheme.state}
              matchReason={scheme.matchReason}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.title}
              title={scheme.title}
              description={scheme.description}
              category={scheme.category}
              state={scheme.state}
              matchReason={scheme.matchReason}
            />
          ))}
        </div>
      )}
    </div>
  );
}
