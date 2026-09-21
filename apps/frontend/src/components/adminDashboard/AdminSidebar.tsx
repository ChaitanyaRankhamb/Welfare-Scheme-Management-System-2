'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileStack,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const navItems = [
  { name: 'Dashboard', href: '/adminDashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/adminDashboard/users', icon: Users },
  { name: 'Schemes', href: '/adminDashboard/schemes', icon: FolderKanban },
  { name: 'Applications', href: '/adminDashboard/applications', icon: FileStack },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        `
        relative flex flex-col h-screen
        bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl
        border-r border-gray-200 dark:border-white/10
        shadow-[4px_0_30px_-10px_rgba(0,0,0,0.1)]
        transition-all duration-300 z-40 hidden md:flex
      `,
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200/50 dark:border-white/10 shrink-0 relative z-10">
        <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md" />

        {!collapsed && (
          <span className="ml-2 font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 truncate">
            YojanaConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 relative z-10">

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/adminDashboard' && pathname.startsWith(item.href))

          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  `
                  relative flex items-center rounded-xl p-3 mb-1
                  transition-all duration-300 group cursor-pointer
                `,
                  isActive
                    ? `
                    bg-indigo-500/10 text-indigo-600 dark:text-indigo-400
                    
                  `
                    : `
                    text-gray-600 dark:text-gray-400
                    hover:bg-white/50 dark:hover:bg-zinc-900/50
                    hover:text-gray-900 dark:hover:text-white
                  `
                )}
              >

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-500" />
                )}

                {/* Icon */}
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-all duration-300',
                    isActive
                      ? 'drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]'
                      : 'group-hover:scale-110'
                  )}
                />

                {/* Text */}
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200/50 dark:border-white/10 shrink-0 relative z-10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
          w-full flex items-center justify-center
          p-2 rounded-xl
          bg-white/50 dark:bg-zinc-900/50
          hover:bg-indigo-500/10
          transition-all duration-300
          "
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}