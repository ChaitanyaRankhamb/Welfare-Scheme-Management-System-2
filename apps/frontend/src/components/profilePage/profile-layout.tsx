'use client'

import React, { ReactNode } from 'react'

interface ProfileLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function ProfileLayout({ header, sidebar, children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950/50 pb-20">
      {header}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {sidebar}
          
          <main className="lg:col-span-3 space-y-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
