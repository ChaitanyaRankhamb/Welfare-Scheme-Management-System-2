"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  Search,
  Book,
  MoreVertical,
  ChevronRight,
  Info,
  MapPin,
  Briefcase,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/context/UserContext";

const SUGGESTED_QUERIES = [
  { text: "Which schemes am I eligible for?", icon: Search },
  { text: "What documents are needed for PM Kisan?", icon: Book },
  { text: "How to apply for Ayushman Bharat?", icon: HelpCircle },
];

interface AIAssistantProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AIAssistant({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AIAssistantProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { profile } = useProfile();
  const { user } = useUser();

  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (value: boolean) => {
    if (setControlledOpen) setControlledOpen(value);
    else setUncontrolledOpen(value);
  };

  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      text: `Hello ${user?.username || "there"}! I'm your AI Agent. I'm currently analyzing your profile to provide personalized recommendations.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate agent processing
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Based on your profile as a ${profile.occupationType || "citizen"} earning ₹${profile.annualIncome || "0"} annually in ${profile.state || "India"}, you are highly eligible for the PM Kisan scheme and Ayushman Bharat. Would you like me to guide you through the application process for these?`,
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 z-50 p-0 overflow-hidden group transition-all active:scale-95 border-2 border-border/20 dark:border-border/10",
          isOpen
            ? "scale-0 opacity-0 pointer-events-none"
            : "scale-100 opacity-100 bg-primary hover:bg-primary",
        )}
      >
        <Sparkles className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 h-full bg-foreground/20 backdrop-blur-sm dark:bg-foreground/40"
            />

            {/* AI Agent Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[440px] lg:w-[480px] bg-card dark:bg-card shadow-lg z-[60] flex flex-col border-l border-border dark:border-border/10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border dark:border-border/10 flex items-center justify-between bg-card dark:bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest leading-none text-muted-foreground dark:text-primary-foreground">
                      AI Agent
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Active Workspace
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-muted dark:hover:bg-card/5"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Context Panel (The Agent Intelligence Layer) */}
              <div className="px-6 py-4 bg-muted/50 dark:bg-card/[0.02] border-b border-border dark:border-border/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Active Context
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary"
                  >
                    Update Profile
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ContextItem
                    icon={Briefcase}
                    label="Occupation"
                    value={profile.occupationType || "Not set"}
                  />
                  <ContextItem
                    icon={IndianRupee}
                    label="Income"
                    value={
                      profile.annualIncome
                        ? `₹${profile.annualIncome}`
                        : "Not set"
                    }
                  />
                  <ContextItem
                    icon={MapPin}
                    label="Location"
                    value={profile.state || "Not set"}
                  />
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 px-6 py-6" viewportRef={scrollRef}>
                <div className="space-y-6">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-4 max-w-[90%]",
                        m.role === "user"
                          ? "ml-auto flex-row-reverse"
                          : "mr-auto",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
                          m.role === "bot"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted dark:bg-card/10 text-muted-foreground dark:text-muted-foreground",
                        )}
                      >
                        {m.role === "bot" ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-[1.5rem] text-sm leading-relaxed font-medium shadow-sm transition-all",
                          m.role === "bot"
                            ? "bg-muted dark:bg-card/5 text-muted-foreground dark:text-muted-foreground rounded-tl-none border border-border dark:border-border/5"
                            : "bg-primary text-primary-foreground rounded-tr-none",
                        )}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4 mr-auto animate-pulse">
                      <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-4 rounded-[1.5rem] bg-muted dark:bg-card/5 rounded-tl-none border border-border dark:border-border/5">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          Agent is thinking...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Queries */}
                {messages.length < 3 && !isTyping && (
                  <div className="mt-10 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Quick Actions:
                    </p>
                    {SUGGESTED_QUERIES.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q.text)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-border dark:border-border/5 bg-card dark:bg-card/5 hover:border-primary/30 hover:bg-primary/50 dark:hover:bg-primary/10 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-muted dark:bg-card/5 group-hover:bg-primary/20 transition-colors">
                            <q.icon className="w-4 h-4 text-primary dark:text-primary" />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                            {q.text}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Bar */}
              <div className="p-6 bg-card dark:bg-card border-t border-border dark:border-border/10">
                <div className="relative group">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your query for the AI Agent..."
                    className="h-14 pl-6 pr-14 rounded-2xl border-border dark:border-border/10 bg-muted dark:bg-card/[0.03] focus-visible:ring-primary/20 text-sm font-bold shadow-sm"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className={cn(
                      "absolute right-2 top-2 h-10 w-10 rounded-xl p-0 transition-all active:scale-90 shadow-lg",
                      input.trim()
                        ? "bg-primary text-primary-foreground shadow-primary/20"
                        : "bg-muted dark:bg-card/10 text-muted-foreground",
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                  <Sparkles className="w-3 h-3" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                    Agent context locked
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ContextItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-2xl bg-card dark:bg-card/5 border border-border dark:border-border/5 flex flex-col gap-1 transition-all hover:border-primary/10">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="w-2.5 h-2.5" />
        <span className="text-[8px] font-black uppercase tracking-widest leading-none">
          {label}
        </span>
      </div>
      <p className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground truncate">
        {value}
      </p>
    </div>
  );
}
