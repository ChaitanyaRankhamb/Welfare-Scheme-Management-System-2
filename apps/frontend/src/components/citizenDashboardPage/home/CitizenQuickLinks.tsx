import React from 'react';
import Link from 'next/link';
import { Search, Bot } from 'lucide-react';

export const CitizenQuickLinks = () => {
  return (
    <div className="grid grid-cols-2 gap-5">

      {/* Explore Schemes */}
      <Link
        href="/citizenDashboard/schemes"
        className="
        relative group flex flex-col items-center justify-center
        p-5 rounded-2xl
        bg-card/70 dark:bg-card/60 backdrop-blur-xl
        border border-border dark:border-border/50
        shadow-lg
        transition-all duration-300
        hover:border-primary dark:hover:border-primary
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
          <Search className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-muted-foreground dark:text-muted-foreground text-center">
          Explore Schemes
        </span>
      </Link>

      {/* Ask AI Tool */}
      <Link
        href="/citizenDashboard/ai"
        className="
        relative group flex flex-col items-center justify-center
        p-5 rounded-2xl
        bg-card/70 dark:bg-card/60 backdrop-blur-xl
        border border-border dark:border-border/50
        shadow-lg
        transition-all duration-300
        hover:border-primary dark:hover:border-primary
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
          <Bot className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-muted-foreground dark:text-muted-foreground text-center">
          AI Assistant
        </span>
      </Link>

    </div>
  );
};
