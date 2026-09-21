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
        bg-card/70 dark:bg-card/70 backdrop-blur-xl
        border-r border-border dark:border-border/10
        shadow-lg
        transition-all duration-300 z-40 hidden md:flex
      `,
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center h-16 px-4 border-b border-border/50 dark:border-border/10 shrink-0 relative z-10">
        <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md" />

        {!collapsed && (
          <span className="ml-2 font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/70 truncate">
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
                    bg-primary/10 text-primary dark:text-primary
                    
                  `
                    : `
                    text-muted-foreground dark:text-muted-foreground
                    hover:bg-card/50 dark:hover:bg-card/50
                    hover:text-muted-foreground dark:hover:text-primary-foreground
                  `
                )}
              >

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
                )}

                {/* Icon */}
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-all duration-300',
                    isActive
                      ? 'drop-shadow-lg'
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
      <div className="p-4 border-t border-border/50 dark:border-border/10 shrink-0 relative z-10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
          w-full flex items-center justify-center
          p-2 rounded-xl
          bg-card/50 dark:bg-card/50
          hover:bg-primary/10
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