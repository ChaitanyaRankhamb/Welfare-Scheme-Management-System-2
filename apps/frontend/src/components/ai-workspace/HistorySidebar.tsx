import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutPanelLeft, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./types";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/getAvatarColor";

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  messages: ChatMessage[];
}

export function HistorySidebar({
  isOpen,
  onToggle,
  onNewChat,
  messages,
}: HistorySidebarProps) {
  const { user, isLogged, isLoading } = useUser();
  const hasMessages = messages.filter((m) => m.id !== "welcome-msg").length > 0;

  return (
    <aside
      className={cn(
        "self-stretch min-h-0 flex flex-col shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 overflow-hidden select-none relative",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Top Header - fixed */}
      <div
        className={cn(
          "p-3 flex items-center shrink-0 border-b border-sidebar-border bg-sidebar z-10",
          isOpen ? "justify-between" : "flex-col gap-3 pt-4",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-9 w-9 hover:bg-sidebar-accent rounded-xl cursor-pointer shrink-0"
          title={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <LayoutPanelLeft className="w-5 h-5 text-sidebar-foreground/70" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="h-9 w-9 hover:bg-sidebar-accent rounded-xl cursor-pointer shrink-0"
          title="New chat"
        >
          <SquarePen className="w-5 h-5 text-sidebar-foreground" />
        </Button>
      </div>

      {/* Middle Chat History - fills all space from header to profile with scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
        {isOpen && (
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-sidebar-foreground/70 uppercase tracking-wider px-2 py-1.5">
              Today
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-sidebar-accent/60 hover:bg-sidebar-accent rounded-xl text-left transition-colors group cursor-pointer border border-sidebar-border/50">
              <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                {hasMessages ? "Current Conversation" : "New Chat"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Profile Footer - fixed at bottom */}
      <div className="p-3 border-t border-sidebar-border flex justify-center shrink-0 bg-sidebar z-10">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl transition-colors",
            isOpen ? "px-2 py-2 w-full" : "p-2 justify-center",
            isLogged && "hover:bg-sidebar-accent cursor-pointer",
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.username ?? "User"} />
            <AvatarFallback
              className={cn(
                getAvatarColor(user?.username),
                "text-white text-[10px] uppercase font-bold",
              )}
            >
              {isLoading ? "..." : (user?.username?.charAt(0) ?? "G")}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <p className="text-sm font-medium text-sidebar-foreground truncate flex-1">
              {isLoading ? "Loading..." : (user?.username ?? "Guest")}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
