"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, RefreshCw, Maximize2, AlertCircle, Briefcase, IndianRupee, MapPin, ShieldCheck, GraduationCap, Info, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/context/UserContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { handleAiQuery } from "@/components/api/aiApi";
import { speechAPI } from "@/components/api/speechApi";

import { ChatMessage, StreamStep, RecommendedScheme } from "@/components/ai-workspace/types";
import { HistorySidebar } from "@/components/ai-workspace/HistorySidebar";
import { ChatArea } from "@/components/ai-workspace/ChatArea";
import { QueryComposer } from "@/components/ai-workspace/QueryComposer";

interface AIAssistantProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AIAssistant({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AIAssistantProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { profile, completionStats } = useProfile();
  const { user } = useUser();

  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (value: boolean) => {
    if (setControlledOpen) setControlledOpen(value);
    else setUncontrolledOpen(value);
  };

  const initialGreeting: ChatMessage = {
    id: "welcome-msg",
    role: "bot",
    text: `Namaste ${user?.username || "Citizen"}! I am your Welfare Scheme AI Agent. Ask me about government schemes, eligibility criteria, required documents, or application steps.`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamSteps, setStreamSteps] = useState<StreamStep[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileWarning, setShowProfileWarning] = useState(true);

  // Audio Hooks
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<"mr" | "en">("mr");

  // Prevent body scroll when overlay is open
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

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    toast.info("Conversation reset");
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        setIsTranscribing(true);
        try {
          const response = await speechAPI.transcribeAudio(blob, speechLanguage);
          if (response?.text) {
            setInput(response.text);
            toast.success(
              speechLanguage === "mr"
                ? "आवाज यशस्वीरित्या ओळखला!"
                : "Speech transcribed successfully!",
            );
          } else {
            toast.info("No speech detected in audio.");
          }
        } catch (error: any) {
          toast.error(error?.message || "Failed to transcribe voice.");
        } finally {
          setIsTranscribing(false);
        }
      }
    } else {
      const started = await startRecording();
      if (started) {
        toast.info(
          speechLanguage === "mr"
            ? "बोलणे सुरू करा (मराठी)..."
            : "Listening (English)...",
        );
      }
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setStreamSteps([]);

    try {
      const response = await handleAiQuery(text);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let finalAiResponse = "";
      let finalRecommendations: RecommendedScheme[] = [];
      let finalRequiredDocuments: string[] = [];
      let finalEligibilityMatrix: any[] = [];
      let finalSchemeTitle = "";
      let finalFollowUps: string[] = [];
      const recordedSteps: StreamStep[] = [];

      if (!reader) throw new Error("Failed to initialize stream reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const eventData: StreamStep = JSON.parse(trimmed.slice(6));

              if (["status", "intent", "info", "success", "error"].includes(eventData.type)) {
                recordedSteps.push(eventData);
                setStreamSteps([...recordedSteps]);
              }

              if (eventData.type === "content" && eventData.content) {
                finalAiResponse += eventData.content;
              }

              if (
                eventData.type === "metadata" ||
                eventData.type === "recommendations" ||
                eventData.type === "scheme_details"
              ) {
                if (eventData.type === "recommendations" && Array.isArray(eventData.data)) {
                  finalRecommendations = eventData.data;
                } else if (eventData.type === "scheme_details" && eventData.data) {
                  finalSchemeTitle = eventData.data.title;
                  finalRequiredDocuments = eventData.data.documentsRequired || [];
                  finalEligibilityMatrix = eventData.data.eligibilityMatrix || [];
                } else if (eventData.type === "metadata" && eventData.data?.followUps) {
                  finalFollowUps = eventData.data.followUps;
                }
              }
            } catch (e) {
              console.warn("Failed to parse SSE chunk", e);
            }
          }
        }
      }

      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "bot",
          text:
            finalAiResponse ||
            "I have analyzed your request and updated recommendations.",
          recommendations: finalRecommendations,
          requiredDocuments: finalRequiredDocuments,
          eligibilityMatrix: finalEligibilityMatrix,
          schemeTitle: finalSchemeTitle,
          steps: recordedSteps.length > 0 ? recordedSteps : undefined,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          followUps:
            finalFollowUps.length > 0
              ? finalFollowUps
              : finalSchemeTitle
                ? [
                    `How do I apply for ${finalSchemeTitle}?`,
                    `Are there alternatives to ${finalSchemeTitle}?`,
                    "Check eligibility for other schemes",
                  ]
                : [
                    "Show schemes with financial assistance",
                    "What documents do I need to prepare?",
                    "How do I update my profile details?",
                  ],
        },
      ]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to communicate with AI Agent.";
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "bot",
          text: `**Agent Execution Error:** ${errorMessage}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
      setStreamSteps([]);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 z-50 p-0 overflow-hidden group transition-all active:scale-95 border-2 border-border/20 cursor-pointer",
          isOpen
            ? "scale-0 opacity-0 pointer-events-none"
            : "scale-100 opacity-100 bg-primary hover:bg-primary",
        )}
        title="Open AI Workspace"
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
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm dark:bg-foreground/50"
            />

            {/* AI Workspace Full View Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-2 sm:inset-4 md:inset-6 z-[60] bg-background border border-border/80 rounded-3xl shadow-2xl flex overflow-hidden"
            >
              {/* Left History Sidebar */}
              <HistorySidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
                onNewChat={handleClearHistory}
                messages={messages}
              />

              {/* Center AI Workspace Area */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background relative overflow-hidden">
                {/* Header Top Bar */}
                <header className="h-14 border-b border-border/60 flex items-center justify-between px-5 shrink-0 bg-card/60 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-extrabold text-base text-foreground">
                        Yojana AI Workspace
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                        v2.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearHistory}
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                      title="Reset Conversation"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>

                    <Link href="/citizenDashboard/ai-assistant">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs font-semibold rounded-xl h-9 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Full Screen</span>
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                      title="Close Workspace"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </header>

                {/* Profile Context Warning if profile incomplete */}
                {showProfileWarning && completionStats.percent < 100 && (
                  <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 pt-3 shrink-0">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl relative flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-primary/20 text-primary shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="text-xs font-bold text-primary">
                          Profile Context {completionStats.percent}% Complete
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                          Complete your profile details for 100% accurate AI scheme matching.
                        </p>
                      </div>
                      <Link href="/citizenDashboard/profile">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary text-primary-foreground h-7 text-[10px] font-bold rounded-md px-2.5 shadow-xs cursor-pointer"
                        >
                          Update
                        </Button>
                      </Link>
                      <button
                        onClick={() => setShowProfileWarning(false)}
                        className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Center Chat / Empty State Area */}
                <ChatArea
                  messages={messages}
                  isTyping={isTyping}
                  streamSteps={streamSteps}
                  onAction={handleSend}
                />

                {/* ChatGPT-style Fixed Query Composer at Bottom */}
                <div className="sticky bottom-0 left-0 right-0 z-30 w-full bg-gradient-to-t from-background via-background to-transparent pt-2 pb-3 px-4">
                  <div className="max-w-4xl mx-auto w-full">
                    <QueryComposer
                      input={input}
                      setInput={setInput}
                      onSend={() => handleSend()}
                      isTyping={isTyping}
                      isRecording={isRecording}
                      isTranscribing={isTranscribing}
                      recordingDuration={recordingDuration}
                      speechLanguage={speechLanguage}
                      setSpeechLanguage={setSpeechLanguage}
                      onToggleRecording={handleToggleRecording}
                      onCancelRecording={cancelRecording}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
