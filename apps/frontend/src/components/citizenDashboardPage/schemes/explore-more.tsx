'use client';

import React from 'react';
import { SchemeCard } from '@/components/scheme-card';

const generalSchemes = [
  {
    title: 'PMEGP - Prime Minister Employment Generation Programme',
    description: 'Supports traditional industries, manufacturing, and service sectors for creating employment opportunities',
    category: 'Employment',
    state: 'National',
  },
  {
    title: 'Stand-Up India Scheme',
    description: 'Loan assistance and support for SC/ST entrepreneurs and women entrepreneurs to start new enterprises',
    category: 'Business',
    state: 'National',
  },
  {
    title: 'Pradhan Mantri Awas Yojana',
    description: 'Housing scheme for economically weaker sections and low-income groups to own a house',
    category: 'Housing',
    state: 'National',
  },
];

export function ExploreMoreSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Explore More Schemes</h2>
        <p className="text-muted-foreground mt-2">
          Other welfare schemes you might be interested in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generalSchemes.map((scheme) => (
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
