import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, LayoutPanelLeft, SquarePen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { user, isLogged, logout } = useUser();

  const hasMessages = messages.filter((m) => m.id !== "welcome-msg").length > 0;

  return (
    <div
      className={cn(
        "shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300 overflow-hidden",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div className={cn("p-3 flex items-center", isOpen ? "justify-between" : "flex-col gap-3 pt-4")}>
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

      <ScrollArea className="flex-1 px-3">
        {isOpen && (
          <div className="space-y-1 mt-2">
            <div className="text-[11px] font-bold text-sidebar-foreground/70 uppercase tracking-wider px-2 py-2">
              Today
            </div>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-sidebar-accent/50 hover:bg-sidebar-accent rounded-xl text-left transition-colors group cursor-pointer">
              <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                {hasMessages ? "Current Conversation" : "New Chat"}
              </span>
            </button>
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border flex justify-center">
        {isLogged && (
          <div className={cn(
            "flex items-center gap-3 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer",
            isOpen ? "px-2 py-2 w-full" : "p-2 justify-center"
          )}>
            <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-sidebar-ring/30 transition-all shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback
                className={cn(
                  getAvatarColor(user?.username),
                  "text-white text-[10px] uppercase font-bold",
                )}
              >
                {user?.username?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <p className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                {user?.username}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
