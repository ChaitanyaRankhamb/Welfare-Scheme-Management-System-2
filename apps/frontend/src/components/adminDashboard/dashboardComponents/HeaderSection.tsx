import React from 'react'
import { Activity } from 'lucide-react'

export const HeaderSection = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

      {/* Left Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
          Real-time metrics and system insights.
        </p>
      </div>

      {/* Right Status Card */}
      <div
        className="
        relative flex items-center gap-3
        px-5 py-2.5 rounded-2xl
        bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
        border border-gray-200 dark:border-white/50
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.25)]
      "
      >
        {/* Subtle Glow Background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
        </div>

        {/* Text */}
        <div className="relative z-10 text-sm font-semibold text-gray-700 dark:text-gray-300">
          System Status: <span className="text-emerald-500 font-bold">Online</span>
        </div>
      </div>
    </div>
  )
}