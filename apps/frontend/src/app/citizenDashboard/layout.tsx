import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/UserContext";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function CitizenDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <DashboardNavbar />
          <div className="pt-16 flex-1 flex flex-col">{children}</div>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
