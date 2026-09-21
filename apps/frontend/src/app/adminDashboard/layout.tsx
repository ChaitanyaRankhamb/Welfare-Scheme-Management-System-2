import React from 'react'
import { AdminSidebar } from '@/components/adminDashboard/AdminSidebar'
import { AdminNavbar } from '@/components/adminDashboard/AdminNavbar'

export const metadata = {
  title: 'Admin Portal | Welfare Scheme Management',
  description: 'Premium SaaS Admin Dashboard for managing users, schemes, and applications.',
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
  <AdminSidebar />
  <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
    <AdminNavbar />
    
    <main className="flex-1 overflow-y-auto w-full p-6">
      <div className="min-h-full rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]">
        {children}
      </div>
    </main>
    
  </div>
</div>
  )
}
