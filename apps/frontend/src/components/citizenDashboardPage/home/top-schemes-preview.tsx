'use client';

import React from 'react';
import { SchemeCard } from '@/components/scheme-card';

const mockSchemes = [
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme for farmers providing comprehensive coverage',
    category: 'Agriculture',
    state: 'National',
  },
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support to farmer families across India',
    category: 'Agriculture',
    state: 'National',
  },
  {
    title: 'Ayushman Bharat - PMJAY',
    description: 'Health insurance scheme for low-income families',
    category: 'Health',
    state: 'National',
  },
];

export function TopSchemesPreview() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Top Matching Schemes</h2>
        <p className="text-muted-foreground mt-1">Based on your profile and eligibility</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.title}
            title={scheme.title}
            description={scheme.description}
            category={scheme.category}
            state={scheme.state}
            compact
          />
        ))}
      </div>
    </div>
  );
}
