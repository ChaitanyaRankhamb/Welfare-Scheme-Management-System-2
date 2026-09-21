"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/mode-toggle";
import { useUser } from "@/context/UserContext";
import { getAvatarColor } from "@/getAvatarColor";
import styles from "../styles/navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  const { user, isLogged, logout } = useUser();
  const router = useRouter();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5 ${styles.nav}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className={styles.logo}>YojanaConnect</span>
      </Link>

      {/* Center Nav Links */}
      <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <Link href="#features" className={styles.navLink}>Features</Link>
        <Link href="#how-it-works" className={styles.navLink}>How It Works</Link>
        <Link href="#ai-section" className={styles.navLink}>AI</Link>
        <Link href="#tech-stack" className={styles.navLink}>Tech Stack</Link>
        <Link href="#faq" className={styles.navLink}>Q&A</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Guest */}
        {!isLogged && (
          <>
            <Link href="/login" className={styles.loginLink}>Login</Link>
            <Link href="/register" className={styles.ctaLink}>Get Started →</Link>
          </>
        )}

        {/* Authenticated */}
        {isLogged && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-indigo-400/40 transition-all">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className={`${getAvatarColor(user?.username)} text-white text-sm font-semibold`}>
                  {user?.username?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col px-3 py-2">
                <p className="font-semibold text-sm">{user?.username ?? "User Account"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <ModeToggle />
      </div>
    </motion.nav>
  );
}