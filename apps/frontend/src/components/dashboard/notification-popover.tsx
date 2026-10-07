"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, Check, FileCheck2, Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NotificationTab, useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/api/notificationApi";

export function NotificationPopover({ isLogged }: { isLogged: boolean }) {
  const notificationsState = useNotifications(isLogged);
  const {
    notifications,
    unreadCount,
    activeTab,
    isLoading,
    selectTab,
    markAsRead,
    markAllAsRead,
  } = notificationsState;

  if (!isLogged) return null;

  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Bell className="h-[1.1rem] w-[1.1rem] cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-background">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(400px,calc(100vw-2rem))] overflow-hidden rounded-xl border-border bg-popover p-0 text-popover-foreground shadow-xl"
      >
        <div className="border-b border-border px-4 pb-0 pt-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
              type="button"
              onClick={() => void markAllAsRead()}
              className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
              disabled={!unreadCount}
            >
              Mark all as read
            </button>
          </div>
          <div className="mt-4 flex gap-5">
            {(["all", "unread"] as const).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                activeTab={activeTab}
                unreadCount={unreadCount}
                onSelect={selectTab}
              />
            ))}
          </div>
        </div>

        <div className="max-h-95 overflow-y-auto p-2">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-muted-foreground">
              <Bell className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">
                {activeTab === "unread"
                  ? "You're all caught up!"
                  : "No notifications yet."}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onRead={() => void markAsRead(notification.id)}
              />
            ))
          )}
        </div>

        <div className="border-t border-border p-3 text-center">
          <Link
            href="/dashboard/notifications"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Notifications →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TabButton({
  tab,
  activeTab,
  unreadCount,
  onSelect,
}: {
  tab: NotificationTab;
  activeTab: NotificationTab;
  unreadCount: number;
  onSelect: (tab: NotificationTab) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tab)}
      className={cn(
        "border-b-2 px-0 pb-2 text-sm font-medium capitalize transition-colors",
        activeTab === tab
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-accent-foreground",
      )}
    >
      {tab === "unread" ? `Unread (${unreadCount})` : "All"}
    </button>
  );
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationItem;
  onRead: () => void;
}) {
  const isUnread = !notification.readAt;
  const Icon =
    notification.type === "scheme_match"
      ? Landmark
      : notification.title.toLowerCase().includes("approved")
        ? FileCheck2
        : AlertCircle;
  const iconClass =
    notification.type === "scheme_match"
      ? "bg-accent text-accent-foreground"
      : notification.title.toLowerCase().includes("approved")
        ? "bg-primary/15 text-primary"
        : "bg-destructive/10 text-destructive";
  const tag =
    notification.type === "scheme_match"
      ? "New Scheme"
      : notification.title.toLowerCase().includes("approved")
        ? "Approved"
        : "Action Needed";

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg p-3 mb-2 transition-colors hover:bg-muted border border-border",
        isUnread && "bg-accent/50",
      )}
      onClick={onRead}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onRead();
      }}
    >
      <div className="relative shrink-0">
        {isUnread && (
          <span className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-popover" />
        )}
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            iconClass,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {tag}
        </span>
        <p
          className={cn(
            "mt-1 text-sm text-foreground",
            isUnread && "font-semibold",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      {isUnread && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Mark notification as read"
          onClick={(event) => {
            event.stopPropagation();
            onRead();
          }}
          className="self-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100 cursor-pointer"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
