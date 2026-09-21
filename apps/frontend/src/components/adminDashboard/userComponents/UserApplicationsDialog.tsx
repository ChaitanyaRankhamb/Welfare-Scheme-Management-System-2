import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userAPI } from "@/components/api/userAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";

interface UserApplicationsDialogProps {
  user: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserApplicationsDialog = ({
  user,
  open,
  onOpenChange,
}: UserApplicationsDialogProps) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user?._id) {
      const fetchApps = async () => {
        try {
          setLoading(true);
          const res = await userAPI.getUserApplications(user._id);
          if (res.success) {
            setApplications(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch apps", error);
        } finally {
          setLoading(false);
        }
      };
      fetchApps();
    }
  }, [open, user?._id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col gap-0 border-border dark:border-border/10 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border dark:border-border/5 bg-muted/50 dark:bg-card/30">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <span>Applications for {user?.username}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div
                  key={app._id}
                  className="group p-4 rounded-2xl bg-card dark:bg-card border border-border dark:border-border/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted dark:bg-card rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-muted-foreground dark:text-primary-foreground group-hover:text-primary transition-colors">
                          {app.schemeId?.title || "Unknown Scheme"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter bg-muted dark:bg-card px-2 py-0.5 rounded-md">
                            {app.schemeId?.category}
                          </span>
                          <span className="text-muted-foreground dark:text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {app.schemeId?.ministry}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border dark:border-border/5">
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">
                          Status
                        </div>
                        <Badge
                          className={`uppercase text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                            app.status === "approved"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : app.status === "rejected"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">
                          Applied On
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-muted dark:bg-card rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 opacity-20" />
              </div>
              <h3 className="font-bold text-muted-foreground dark:text-primary-foreground text-lg">
                No Applications
              </h3>
              <p className="text-sm max-w-xs mt-2">
                This user hasn't applied for any schemes yet or all applications
                are deleted.
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border dark:border-border/5 bg-muted/30 dark:bg-card/20 flex justify-end">
          <Badge
            variant="outline"
            className="text-[10px] font-medium border-border dark:border-border/10 text-muted-foreground"
          >
            End of application records
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};
