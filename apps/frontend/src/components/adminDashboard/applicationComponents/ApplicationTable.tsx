import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Trash2,
  Eye,
  FileText,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ApplicationTable = ({
  searchTerm,
  setSearchTerm,
  applications = [],
  total = 0,
}: any) => {
  const [activeTab, setActiveTab] = useState("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const tabs = ["All", "Initiated", "Applied", "Rejected"];

  const filteredApps = applications.filter((app: any) => {
    const statusMatch =
      activeTab === "All" ||
      app.status.toLowerCase() === activeTab.toLowerCase();
    const applicantName =
      (app.userId as any)?.username || (app.userId as any)?.email || "";
    const schemeTitle = (app.schemeId as any)?.title || "";
    const searchMatch =
      !searchTerm ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schemeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app._id.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <Card className="rounded-2xl border border-border dark:border-border/50 bg-card/70 dark:bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
      {/* Header Panel */}
      <div className="p-5 border-b border-border dark:border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search ID, Name, or Scheme..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card/50 dark:bg-card/50 border border-border/50 dark:border-border/10 text-sm focus:ring-2 focus:ring-ring/20 outline-none transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-2 border-b border-border dark:border-border/50 flex space-x-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[13px] font-bold whitespace-nowrap transition-colors border-b-2 relative top-[1px] ${
              activeTab === tab
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Table */}
      <div className="max-h-[500px] overflow-y-auto alert-custom-scrollbar">
        <table className="w-full text-sm">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-card/90 dark:bg-card/90 backdrop-blur border-b border-border/50 dark:border-border/10 text-xs uppercase text-muted-foreground z-10">
            <tr>
              <th className="px-6 py-4 text-left">App ID</th>
              <th className="px-6 py-4 text-left">
                Applicant / Scheme Variant
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Timeline</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border/10">
            {filteredApps.map((app: any) => (
              <tr
                key={app._id}
                className="group hover:bg-primary/30 dark:hover:bg-primary/5 transition-colors"
              >
                {/* ID */}
                <td className="px-6 py-4 font-mono text-[11px] font-bold text-muted-foreground">
                  {app._id.slice(-8).toUpperCase()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-transform group-hover:scale-105 shadow-sm">
                      <FileText className="w-5 h-5 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-muted-foreground dark:text-primary-foreground group-hover:text-primary transition-colors">
                        {(app.userId as any)?.username ||
                          (app.userId as any)?.email}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground max-w-sm truncate mt-0.5">
                        {(app.schemeId as any)?.title}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-xs">
                  <Badge
                    className={`px-2.5 py-0.5 rounded-lg border shadow-none font-bold text-[10px] uppercase tracking-wider items-center gap-1.5 ${
                      app.status === "APPLIED"
                        ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary"
                        : app.status === "INITIATED"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20"
                    }`}
                  >
                    {app.status === "APPLIED" && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {app.status === "REJECTED" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    {app.status === "INITIATED" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {app.status}
                  </Badge>
                </td>

                {/* Timeline */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground dark:text-muted-foreground font-semibold text-[11px] tracking-wide whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {app.status === "INITIATED" &&
                      (() => {
                        const days = Math.floor(
                          (Date.now() - new Date(app.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24),
                        );
                        return days > 14 ? (
                          <span className="text-[9px] font-black uppercase text-destructive animate-pulse">
                            SLA Breach: {days}d
                          </span>
                        ) : days > 7 ? (
                          <span className="text-[9px] font-black uppercase text-primary">
                            Pending: {days}d
                          </span>
                        ) : null;
                      })()}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Primary Action Button (Review/View) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {app.status === "INITIATED" ? (
                          <Button className="h-9 px-4 text-xs font-bold bg-primary hover:bg-primary text-primary-foreground rounded-xl shadow-sm transition-all">
                            Review →
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            className="h-9 px-3 text-xs font-bold text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-card rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4 mr-1.5 opacity-70" />
                            Details
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Process Application
                      </TooltipContent>
                    </Tooltip>

                    {/* Delete Toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {confirmDeleteId === app._id ? (
                          <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-300">
                            <Button
                              size="sm"
                              className="text-[10px] h-9 bg-destructive hover:bg-destructive text-primary-foreground rounded-xl shadow-sm"
                              onClick={() => {
                                console.log("Delete application", app._id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[10px] h-9 text-muted-foreground hover:bg-muted dark:hover:bg-card rounded-xl"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmDeleteId(app._id)}
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="top">Delete Record</TooltipContent>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-semibold text-sm">No applications found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border dark:border-border/50 text-sm">
        <span className="text-muted-foreground font-medium">
          Showing 1–{filteredApps.length} of {total} applications
        </span>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl cursor-not-allowed opacity-50 border-border dark:border-border/10"
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl hover:border-primary hover:dark:border-primary hover:text-primary transition-all border-border dark:border-border/10"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};
