"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  XCircle,
  SearchX,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  FileText,
  MapPin,
  Banknote,
  Users,
  Briefcase,
  History,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// =========================
// 🔒 LOCK BODY SCROLL
// =========================
function useLockBodyScroll(open: boolean) {
  useEffect(() => {
    if (open) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);
}

// =========================
// 🚀 SCHEMES DRAWER (UNIFIED LIST & DETAILS)
// =========================

interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section = ({ title, icon: Icon, children }: SectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 px-1">
      <div className="p-2 rounded-xl bg-primary/10 text-primary dark:text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
        {title}
      </h3>
    </div>
    <div className="p-6 rounded-[2rem] bg-card dark:bg-card/5 border border-border dark:border-border/10 shadow-sm transition-all hover:shadow-md">
      {children}
    </div>
  </div>
);

const InfoCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <div className="p-4 rounded-2xl bg-muted/50 dark:bg-card/5 border border-border dark:border-border/5 flex items-center gap-4">
    <div className="p-2.5 rounded-xl bg-card dark:bg-card/10 shadow-sm text-primary dark:text-primary">
      <Icon className="w-4 h-4" />
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-black text-muted-foreground dark:text-muted-foreground">
        {value}
      </p>
    </div>
  </div>
);

import { applicationApi } from "@/components/api/applicationApi";
import { ApplicationStatusPopup } from "./ApplicationStatusPopup";
import { toast } from "sonner";

export function SchemesDrawer({
  open,
  onClose,
  schemes,
  userProfile,
  initialViewMode = "list",
  initialScheme = null,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  schemes: any[];
  userProfile?: any;
  initialViewMode?: "list" | "details";
  initialScheme?: any;
}) {
  const [viewMode, setViewMode] = useState<"list" | "details">(initialViewMode);
  const [selectedScheme, setSelectedScheme] = useState<any>(initialScheme);
  const [search, setSearch] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);

  // Sync state when open/closed or props change
  useEffect(() => {
    if (open) {
      setViewMode(initialViewMode);
      setSelectedScheme(initialScheme);

      // Check for existing application when viewing details
      if (initialScheme && initialViewMode === "details") {
        checkApplicationStatus(initialScheme._id);
      }
    }
  }, [open, initialViewMode, initialScheme]);

  const checkApplicationStatus = async (schemeId: string) => {
    try {
      const response = await applicationApi.getApplicationByScheme(schemeId);
      if (
        response.success &&
        response.data &&
        response.data.status === "INITIATED"
      ) {
        setCurrentAppId(response.data.id);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async (scheme: any) => {
    try {
      const response = await applicationApi.initiate(scheme._id);
      if (response.success) {
        if (scheme.applicationLink) {
          window.open(scheme.applicationLink, "_blank");
        }
        // Re-check status to trigger popup if they come back
        checkApplicationStatus(scheme._id);
      }
    } catch (error) {
      console.error("Error initiating application:", error);
      toast.error("Failed to initiate application");
    }
  };

  const handleStatusUpdate = async (status: "APPLIED" | "REJECTED") => {
    if (!currentAppId) return;
    try {
      const response = await applicationApi.updateStatus(currentAppId, status);
      if (response.success) {
        toast.success(`Application marked as ${status}`);
        setIsPopupOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filtered = schemes.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleViewDetails = (scheme: any) => {
    setSelectedScheme(scheme);
    setViewMode("details");
    checkApplicationStatus(scheme._id);
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedScheme(null);
  };

  useLockBodyScroll(open);

  const matchStats = useMemo(() => {
    if (!selectedScheme || !userProfile) return null;

    const el = selectedScheme.eligibility;
    const p = userProfile;

    const results = [
      {
        label: "Age",
        match: p.age >= el.age.min && p.age <= el.age.max,
        value: `${p.age} yrs (${el.age.min}-${el.age.max})`,
      },
      {
        label: "Income",
        match: p.annualIncome <= el.income.max,
        value: `₹${p.annualIncome} (Limit: ₹${el.income.max})`,
      },
      {
        label: "Location",
        match:
          el.location?.states?.includes(p.location?.state) ||
          el.location?.states?.length === 0,
        value: p.location?.state,
      },
      {
        label: "Employment",
        match: el.employment?.employmentStatus?.includes(p.employmentStatus),
        value: p.employmentStatus,
      },
    ];

    const score = Math.round(
      (results.filter((r) => r.match).length / results.length) * 100,
    );

    return { results, score };
  }, [selectedScheme, userProfile]);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:w-[94%] md:w-[85%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] max-w-none p-0 border-l border-border/10 bg-card/80 dark:bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500"
        >
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full bg-muted/50 dark:bg-card"
              >
                <SheetHeader className="px-8 pt-8 pb-6 border-b bg-card dark:bg-card space-y-4">
                  <div className="space-y-1">
                    <SheetTitle className="text-3xl font-black tracking-tight">
                      Scheme Directory
                    </SheetTitle>
                    <SheetDescription className="text-sm font-medium italic opacity-70">
                      Explore government welfare benefits tailored for you.
                    </SheetDescription>
                  </div>

                  <div className="relative mt-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by keyword, ministry, or category..."
                      className="pl-11 h-14 rounded-2xl border-border dark:border-border/10 bg-muted/50 dark:bg-card/5 focus-visible:ring-primary/20 text-sm font-medium transition-all focus:bg-card dark:focus:bg-card shadow-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </SheetHeader>

                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-8 pb-32">
                    {filtered.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {filtered.map((scheme, index) => (
                          <div
                            key={index}
                            className="group p-6 rounded-[2rem] bg-card dark:bg-card border border-border dark:border-border/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary dark:text-primary border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                              >
                                {scheme.category}
                              </Badge>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">
                                {scheme.state || "National"}
                              </span>
                            </div>
                            <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-primary transition-colors">
                              {scheme.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2 font-medium italic opacity-80 leading-relaxed">
                              {scheme.description}
                            </p>
                            <div className="flex gap-3 mt-8">
                              <Button
                                onClick={() => handleViewDetails(scheme)}
                                variant="outline"
                                className="flex-1 rounded-xl h-12 font-bold border-border dark:border-border/10 hover:bg-primary dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all active:scale-95"
                              >
                                View Details
                              </Button>
                              <Button
                                onClick={() => handleApply(scheme)}
                                className="flex-1 rounded-xl h-12 font-bold bg-primary hover:bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95"
                              >
                                Apply Now
                                <ExternalLink className="ml-2 w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center border border-dashed border-muted-foreground/20">
                          <SearchX className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-muted-foreground dark:text-primary-foreground uppercase tracking-widest">
                            No matching schemes
                          </p>
                          <p className="text-xs text-muted-foreground font-medium italic">
                            Try adjusting your search filters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full bg-card dark:bg-card"
              >
                {/* DETAILS HEADER */}
                <div className="p-8 pb-6 border-b bg-card/50 dark:bg-card/50 backdrop-blur-md sticky top-0 z-10 flex items-start justify-between">
                  <div className="space-y-4 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="rounded-full h-10 px-4 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Back to Schemes
                      </span>
                    </Button>

                    <div className="space-y-1">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                        {selectedScheme?.title}
                      </h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                        {selectedScheme?.ministry}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="rounded-full bg-primary text-primary-foreground font-bold text-[10px] uppercase px-3 py-1 shadow-md shadow-primary/20">
                        {selectedScheme?.category}
                      </Badge>
                      {(selectedScheme?.tags || []).map(
                        (tag: string, i: number) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="rounded-full border-border dark:border-border/10 font-bold text-[10px] uppercase px-3 py-1"
                          >
                            #{tag}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 pt-10">
                    <Button
                      onClick={() => handleApply(selectedScheme)}
                      className="rounded-2xl h-10 px-8 font-black uppercase tracking-widest text-xs bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                    >
                      Apply
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* DETAILS CONTENT */}
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-8 space-y-10 pb-32">
                    {/* AI ELIGIBILITY CARD */}
                    {matchStats && (
                      <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary to-primary/70 p-8 text-primary-foreground shadow-2xl shadow-primary/30">
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                AI Eligibility Profile
                              </h3>
                              <p className="text-sm font-medium opacity-70 italic">
                                Calculated based on your verified profile
                                details
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-black">
                                {matchStats.score}%
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                                Match Score
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="h-3 w-full bg-card/20 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${matchStats.score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-card shadow-lg"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            {matchStats.results.map((r, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-2xl bg-card/10 backdrop-blur-md border border-border/10 flex flex-col gap-1 text-center"
                              >
                                <div className="flex items-center justify-center gap-1.5">
                                  {r.match ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                                  )}
                                  <span
                                    className={cn(
                                      "text-[10px] font-black uppercase tracking-widest",
                                      !r.match && "text-destructive",
                                    )}
                                  >
                                    {r.label}
                                  </span>
                                </div>
                                <p className="text-xs font-bold truncate opacity-80">
                                  {r.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Decorative Background Icons */}
                        <Sparkles className="absolute -top-10 -right-10 w-48 h-48 opacity-10 blur-xl" />
                        <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] from-primary-foreground/20" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-10">
                      {/* 1. Overview */}
                      <Section title="Overview" icon={Info}>
                        <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                          "{selectedScheme?.description}"
                        </p>
                      </Section>

                      {/* 2. Benefits */}
                      <Section title="Key Benefits" icon={TrendingUp}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(selectedScheme?.benefits || []).map(
                            (benefit: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-2xl bg-primary/50 dark:bg-primary/5 border border-primary/50 dark:border-primary/10"
                              >
                                <div className="p-1.5 rounded-full bg-primary text-primary-foreground shrink-0">
                                  <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <p className="text-xs font-bold leading-relaxed">
                                  {benefit}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </Section>

                      {/* 3. Eligibility Grid */}
                      <Section title="Eligibility Criteria" icon={Users}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <InfoCard
                            label="Min Age"
                            value={`${selectedScheme?.eligibility?.age?.min || 0} yrs`}
                            icon={Calendar}
                          />
                          <InfoCard
                            label="Max Age"
                            value={`${selectedScheme?.eligibility?.age?.max || "No limit"} yrs`}
                            icon={Calendar}
                          />
                          <InfoCard
                            label="Annual Income"
                            value={`Below ₹${selectedScheme?.eligibility?.income?.max || "N/A"}`}
                            icon={Banknote}
                          />
                          <InfoCard
                            label="Gender"
                            value={
                              selectedScheme?.eligibility?.gender?.toUpperCase() ||
                              "ANY"
                            }
                            icon={Users}
                          />
                          <InfoCard
                            label="Employment"
                            value={
                              selectedScheme?.eligibility?.employment?.employmentStatus?.join(
                                ", ",
                              ) || "ANY"
                            }
                            icon={Briefcase}
                          />
                          <InfoCard
                            label="Location"
                            value={
                              selectedScheme?.eligibility?.location?.ruralOnly
                                ? "Rural Only"
                                : selectedScheme?.eligibility?.location
                                      ?.urbanOnly
                                  ? "Urban Only"
                                  : "National"
                            }
                            icon={MapPin}
                          />
                        </div>
                      </Section>

                      {/* 4. Documents Required */}
                      <Section title="Required Documents" icon={FileText}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(selectedScheme?.documentsRequired || []).map(
                            (doc: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 px-4 rounded-xl border border-border dark:border-border/5 bg-muted/30 dark:bg-card/5"
                              >
                                <FileText className="w-4 h-4 text-primary opacity-50" />
                                <span className="text-xs font-bold">{doc}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </Section>

                      {/* 5. Tracking / Steps */}
                      <Section title="Application Workflow" icon={Layers}>
                        <div className="relative space-y-6 pl-4">
                          {/* Connection Line */}
                          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-linear-to-b from-primary to-primary/70 opacity-20" />

                          {(
                            selectedScheme?.trackingMeta?.instructions || []
                          ).map((step: string, i: number) => (
                            <div
                              key={i}
                              className="relative flex items-center gap-6"
                            >
                              <div className="relative z-10 w-12 h-12 rounded-2xl bg-card dark:bg-card border border-primary flex items-center justify-center font-black text-primary shadow-md shadow-primary/10">
                                {i + 1}
                              </div>
                              <div className="p-5 flex-1 rounded-2xl bg-muted/50 dark:bg-card/5 border border-border dark:border-border/5">
                                <p className="text-xs font-black text-muted-foreground dark:text-muted-foreground leading-relaxed uppercase tracking-widest">
                                  {step}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>

      <ApplicationStatusPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        schemeName={selectedScheme?.title || ""}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}

// =========================
// 📄 APPLICATIONS DRAWER (IMPROVED)
// =========================
export function ApplicationsDrawer({
  open,
  onClose,
  applications,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  applications: any[];
}) {
  useLockBodyScroll(open);

  const [activeTab, setActiveTab] = useState("all");

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[94%] md:w-[85%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] max-w-none p-0 border-l border-border/10 bg-card/80 dark:bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500"
      >
        <div className="flex flex-col h-full bg-muted/30 dark:bg-card">
          {/* HEADER */}
          <SheetHeader className="px-8 pt-12 pb-8 border-b bg-card dark:bg-card space-y-2">
            <SheetTitle className="text-4xl font-black tracking-tighter">
              Application <span className="text-primary">Timeline</span>
            </SheetTitle>
            <SheetDescription className="text-sm font-medium italic opacity-60">
              Real-time monitoring of your government welfare requests.
            </SheetDescription>
          </SheetHeader>

          {/* TABS */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col pt-6"
          >
            <div className="px-8 mb-6">
              <TabsList className="grid grid-cols-3 h-12 p-1 bg-muted dark:bg-card/5 rounded-2xl border border-border dark:border-border/10">
                <TabsTrigger
                  value="all"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  All Activity
                </TabsTrigger>
                <TabsTrigger
                  value="applied"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Applied
                </TabsTrigger>
                <TabsTrigger
                  value="initiated"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Pending
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-8">
              <div className="pb-24">
                <TabsContent value="all" className="space-y-4 m-0">
                  {applications.length > 0 ? (
                    applications.map((app, i) => <AppItem key={i} app={app} />)
                  ) : (
                    <EmptyState />
                  )}
                </TabsContent>

                <TabsContent value="applied" className="space-y-4 m-0">
                  {applications.filter((a) => a.status === "APPLIED").length >
                  0 ? (
                    applications
                      .filter((a) => a.status === "APPLIED")
                      .map((app, i) => <AppItem key={i} app={app} />)
                  ) : (
                    <EmptyState />
                  )}
                </TabsContent>

                <TabsContent value="initiated" className="space-y-4 m-0">
                  {applications.filter((a) => a.status === "INITIATED").length >
                  0 ? (
                    applications
                      .filter((a) => a.status === "INITIATED")
                      .map((app, i) => <AppItem key={i} app={app} />)
                  ) : (
                    <EmptyState />
                  )}
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border dark:border-border/5 rounded-[2.5rem]">
      <History className="w-12 h-12 text-muted-foreground/20" />
      <div className="space-y-1">
        <p className="text-sm font-black text-muted-foreground dark:text-primary-foreground uppercase tracking-widest">
          No applications found
        </p>
        <p className="text-xs text-muted-foreground font-medium italic opacity-60">
          You haven't reached this stage yet
        </p>
      </div>
    </div>
  );
}

// =========================
// 🔹 APPLICATION ITEM
// =========================
function AppItem({ app }: { app: any }) {
  const statusConfig: any = {
    APPLIED: {
      color: "bg-primary/10 text-primary border-primary/20",
      icon: CheckCircle2,
    },
    INITIATED: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: Clock,
    },
    REJECTED: {
      color: "bg-destructive/10 text-destructive border-destructive/20",
      icon: XCircle,
    },
  };

  const config = statusConfig[app.status] || statusConfig["INITIATED"];
  const Icon = config.icon;

  return (
    <div className="group p-6 rounded-[2rem] bg-card dark:bg-card/5 border border-border dark:border-border/10 hover:shadow-xl hover:shadow-primary/5 transition-all flex items-center justify-between gap-6">
      <div className="flex items-center gap-6 min-w-0">
        <div
          className={cn(
            "p-4 rounded-2xl border shrink-0 transition-transform group-hover:scale-110",
            config.color,
          )}
        >
          <FileText className="w-6 h-6" />
        </div>

        <div className="space-y-1 min-w-0">
          <h3 className="font-black text-lg tracking-tight truncate">
            {app.schemeId?.name || app.schemeName}
          </h3>

          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1.5 bg-muted dark:bg-card/5 px-2 py-0.5 rounded-md">
              <Calendar className="w-3 h-3" />
              {new Date(app.updatedAt).toLocaleDateString()}
            </span>

            <span>ID: {app.id?.slice(-8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge
          className={cn(
            "rounded-full px-4 py-1.5 border font-black uppercase tracking-tighter text-[9px]",
            config.color,
          )}
        >
          <Icon className="w-3 h-3 mr-1.5" />
          {app.status}
        </Badge>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-xl w-10 h-10 hover:bg-muted dark:hover:bg-card/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
