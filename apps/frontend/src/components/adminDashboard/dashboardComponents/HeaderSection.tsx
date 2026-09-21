import React from 'react'
import { Activity } from 'lucide-react'

export const HeaderSection = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

      {/* Left Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-muted-foreground dark:text-primary-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-2 text-sm md:text-base">
          Real-time metrics and system insights.
        </p>
      </div>

      {/* Right Status Card */}
      <div
        className="
        relative flex items-center gap-3
        px-5 py-2.5 rounded-2xl
        bg-card/70 dark:bg-card/60 backdrop-blur-xl
        border border-border dark:border-border/50
        shadow-lg
        transition-all duration-300
        hover:shadow-lg
      "
      >
        {/* Subtle Glow Background */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/10 to-transparent opacity-0 hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
        </div>

        {/* Text */}
        <div className="relative z-10 text-sm font-semibold text-muted-foreground dark:text-muted-foreground">
          System Status: <span className="text-primary font-bold">Online</span>
        </div>
      </div>
    </div>
  )
}