"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  conditional?: boolean;
}

interface ProfileSidebarProps {
  sections: Section[];
  activeSection: string;
  isFarmer: boolean;
  scrollToSection: (id: string) => void;
}

export function ProfileSidebar({
  sections,
  activeSection,
  isFarmer,
  scrollToSection,
}: ProfileSidebarProps) {
  return (
    <aside className="lg:col-span-1 hidden lg:block">
      <div className="sticky top-40 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-4 mb-5 opacity-60">
          Profile Navigation
        </p>
        <nav className="space-y-1">
          {sections.map((s) => {
            if (s.conditional && s.id === "agriculture" && !isFarmer)
              return null;
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group relative backdrop-blur-sm",
                  isActive
                    ? "bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-xl shadow-primary/25 active:scale-[0.97]"
                    : "text-muted-foreground hover:bg-card/60 dark:hover:bg-card/40 hover:backdrop-blur-md shadow-none hover:shadow-lg dark:hover:shadow-lg hover:border-border/20 dark:hover:border-border/10 hover:text-foreground hover:translate-x-1 border border-transparent",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-card/20"
                      : "bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110",
                    )}
                  />
                </div>
                <span className="text-sm font-bold tracking-tight">
                  {s.title}
                </span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-card animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-12 rounded-4xl bg-linear-to-br from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 p-6 backdrop-blur-xl border border-border/20 dark:border-border/10 shadow-lg dark:shadow-lg space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-primary leading-none">
              AI Smart Hack
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">
            Completing your <b>Educational</b> history helps us unlock{" "}
            <b>80% more specialized</b> student subsidies for you.
          </p>
        </div>
      </div>
    </aside>
  );
}
