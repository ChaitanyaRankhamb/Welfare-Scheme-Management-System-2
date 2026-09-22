import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/UserContext";
import { AIWorkspaceProvider } from "@/context/AIWorkspaceContext";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function CitizenDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <UserProvider>
        <AIWorkspaceProvider>
          <div className="flex h-screen flex-col bg-background overflow-hidden">
            <DashboardNavbar />
            <main className="pt-16 flex-1 flex flex-col min-h-0 overflow-y-auto">{children}</main>
          </div>
        </AIWorkspaceProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
