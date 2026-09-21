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
        bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
        border border-gray-200 dark:border-white/50
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:border-indigo-500 dark:hover:border-indigo-500
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 transition-transform duration-300 group-hover:scale-110">
          <Search className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          Explore Schemes
        </span>
      </Link>

      {/* Ask AI Tool */}
      <Link
        href="/citizenDashboard/ai"
        className="
        relative group flex flex-col items-center justify-center
        p-5 rounded-2xl
        bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
        border border-gray-200 dark:border-white/50
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:border-indigo-500 dark:hover:border-indigo-500
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 transition-transform duration-300 group-hover:scale-110">
          <Bot className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          AI Assistant
        </span>
      </Link>

    </div>
  );
};
