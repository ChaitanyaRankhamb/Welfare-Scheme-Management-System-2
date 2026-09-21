import React from 'react'
import { FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ApplicationHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      {/* Left Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Applications Command Center
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl">
          Review applicant profiles, process approvals, and manage application workflows efficiently.
        </p>
      </div>
    </div>
  )
}
