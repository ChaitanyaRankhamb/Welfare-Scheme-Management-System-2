import React from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const UserHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">

      {/* Left Section */}
      <div className="space-y-2">
        
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-muted-foreground dark:text-primary-foreground">
            User Management
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-muted-foreground dark:text-muted-foreground max-w-xl">
          View, manage, and control user access across the platform.
        </p>
      </div>
    </div>
  )
}