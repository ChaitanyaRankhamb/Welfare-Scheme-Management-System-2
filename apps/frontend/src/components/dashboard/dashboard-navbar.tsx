'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Bell } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useUser } from '@/context/UserContext';
import { getAvatarColor } from '@/getAvatarColor';
import { cn } from '@/lib/utils';
import styles from '@/components/landingPage/styles/navbar.module.css';
import Image from 'next/image';

const navLinks = [
  { name: 'Dashboard', href: '/citizenDashboard' },
  { name: 'Profile', href: '/citizenDashboard/profile' },
];

export function DashboardNavbar() {
  const { user, isLogged, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5",
        styles.nav
      )}
    >
      {/* Logo */}
      <Link href="/citizenDashboard" className="flex items-center gap-2 shrink-0">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className={cn(styles.logo, "hidden sm:inline")}>YojanaConnect</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link-saas px-3 py-1.5",
                isActive && "nav-link-saas-active"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 shrink-0">

        {!isLogged && (
          <>
            <Link href="/login" className={styles.loginLink}>Login</Link>
            <Link href="/register" className={styles.ctaLink}>Get Started →</Link>
          </>
        )}
      
        <ModeToggle />
        
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground border-border box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
        >
          <Bell className="h-[1.1rem] w-[1.1rem]" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
        </Button>

        {isLogged && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2.5 px-3 py-1 rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-border outline-hidden group"
            >
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-semibold leading-none">{user?.username ?? 'Account'}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Citizen</span>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className={cn(getAvatarColor(user?.username), "text-white text-[10px] uppercase font-bold")}>
                  {user?.username?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 mt-2">
              <div className="flex flex-col px-3 py-2">
                <p className="font-semibold text-sm truncate">{user?.username ?? "User Account"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/citizenDashboard/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer text-muted-foreground">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 cursor-pointer" 
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.nav>
  );
}
