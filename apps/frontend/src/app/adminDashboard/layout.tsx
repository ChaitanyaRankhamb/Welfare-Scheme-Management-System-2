import React from "react";
import { AdminSidebar } from "@/components/adminDashboard/AdminSidebar";
import { AdminNavbar } from "@/components/adminDashboard/AdminNavbar";

export const metadata = {
  title: "Admin Portal | Welfare Scheme Management",
  description:
    "Premium SaaS Admin Dashboard for managing users, schemes, and applications.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto w-full p-6">
          <div className="min-h-full rounded-2xl border border-border bg-card/40 shadow-xl backdrop-blur-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
