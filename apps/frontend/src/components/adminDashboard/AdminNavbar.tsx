'use client'

import React from 'react'
import { Bell, Search, Menu, User, LogOut, Settings } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/context/UserContext'
import { getAvatarColor } from '@/getAvatarColor'
import { cn } from '@/lib/utils'

export function AdminNavbar() {
  const { user, isLogged, logout } = useUser()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-card/70 dark:bg-card/70 backdrop-blur-xl border-b border-border/50 dark:border-border/10 shadow-sm">

      {/* Mobile Menu */}
      <div className="flex items-center md:hidden">
        <button className="p-2 -ml-2 text-muted-foreground rounded-lg hover:bg-muted dark:hover:bg-card">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search users, schemes, applications..."
            className="
              w-full h-10 pl-10 pr-3 text-sm
              bg-card/60 dark:bg-card/60
              border border-border/50 dark:border-border/10
              rounded-xl
              focus:ring-2 focus:ring-ring/20 focus:border-primary
              transition-all outline-none
              text-muted-foreground dark:text-primary-foreground
              placeholder:text-muted-foreground
            "
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">

        {/* Right Section */}
        {/* Theme */}
        <ModeToggle />

        {/* Notifications */}
        <button
          className="
          relative p-2 rounded-full
          text-muted-foreground hover:text-primary
          hover:bg-primary/10
          transition-all group
        "
        >
          <Bell className="w-5 h-5 group-hover:animate-[wiggle_0.6s_ease-in-out]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-border dark:border-border" />
        </button>

        {/* If NOT logged */}
        {!isLogged && (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground dark:text-muted-foreground hover:text-primary transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="
                text-sm font-semibold
                px-4 py-1.5 rounded-full
                bg-linear-to-r from-primary to-primary/70
                text-primary-foreground shadow-md hover:shadow-lg
                transition-all
              "
            >
              Get Started →
            </Link>
          </>
        )}

        {/* Logged In */}
        {isLogged && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-muted/50 transition group">

              {/* Text */}
              <div className="hidden md:flex flex-col items-end mr-1">
                <span className="text-xs font-semibold leading-none">
                  {user?.username ?? 'Admin'}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Admin
                </span>
              </div>

              {/* Avatar */}
              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-ring/20 transition">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback
                  className={cn(
                    getAvatarColor(user?.username),
                    'text-primary-foreground text-[10px] font-bold'
                  )}
                >
                  {user?.username?.charAt(0) ?? 'A'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 mt-2">

              {/* Profile Info */}
              <div className="px-3 py-2">
                <p className="font-semibold text-sm truncate">
                  {user?.username ?? 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? 'admin@gov.in'}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => logout()}
                className="text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}