"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutPanelLeft, Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

import { useAIWorkspace } from "@/context/AIWorkspaceContext";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/context/UserContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { handleAiQuery } from "@/components/api/aiApi";
import { speechAPI } from "@/components/api/speechApi";

import { ChatMessage, StreamStep, RecommendedScheme } from "./types";
import { HistorySidebar } from "./HistorySidebar";
import { ChatArea } from "./ChatArea";
import { QueryComposer } from "./QueryComposer";

interface AIWorkspaceLayoutProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AIWorkspaceLayout({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AIWorkspaceLayoutProps) {
  const {
    isOpen: contextIsOpen,
    closeWorkspace,
    initialQuery,
  } = useAIWorkspace();

  const { completionStats } = useProfile();
  const { user } = useUser();
  const [showProfileWarning, setShowProfileWarning] = useState(true);

  const isOpen = controlledOpen !== undefined ? controlledOpen : contextIsOpen;
  const setIsOpen = (value: boolean) => {
    if (setControlledOpen) setControlledOpen(value);
    if (!value) closeWorkspace();
  };

  const initialGreeting: ChatMessage = {
    id: "welcome-msg",
    role: "bot",
    text: `Namaste ${user?.username || "Citizen"}! I am your Welfare Scheme AI Agent. I have loaded your citizen profile and am ready to help you discover, verify eligibility, and guide your applications for government schemes.`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    followUps: [
      "Check all schemes matching my profile",
      "Explain eligibility criteria for PM Kisan",
      "List required documents for Ayushman Bharat",
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamSteps, setStreamSteps] = useState<StreamStep[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Speech Recognition Hooks & State
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<"mr" | "en">("mr");

  // Handle initial query passed from external action triggers
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Prevent background scroll when workspace is active
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

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        setIsTranscribing(true);
        try {
          const response = await speechAPI.transcribeAudio(
            blob,
            speechLanguage,
          );
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

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    toast.info("Conversation reset");
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

              if (
                ["status", "intent", "info", "success", "error"].includes(
                  eventData.type,
                )
              ) {
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
                if (
                  eventData.type === "recommendations" &&
                  Array.isArray(eventData.data)
                ) {
                  finalRecommendations = eventData.data;
                } else if (
                  eventData.type === "scheme_details" &&
                  eventData.data
                ) {
                  finalSchemeTitle = eventData.data.title;
                  finalRequiredDocuments =
                    eventData.data.documentsRequired || [];
                  finalEligibilityMatrix =
                    eventData.data.eligibilityMatrix || [];
                } else if (
                  eventData.type === "metadata" &&
                  eventData.data?.followUps
                ) {
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
            "I have analyzed your request and updated the recommendations below.",
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 bg-background text-foreground z-100 flex flex-col sm:flex-row overflow-hidden"
        >
          {/* Left Sidebar */}
          <HistorySidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(isSidebarOpen ? false : true)}
            onNewChat={handleClearHistory}
            messages={messages}
          />

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col h-full bg-background relative">
            {/* Header */}
            <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-sm">
                  Yojana Agentic Copilot
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                  v2.0
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                  title="Close Workspace"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </header>

            {/* Profile Warning if incomplete */}
            {showProfileWarning && completionStats.percent < 100 && (
              <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 pt-4 shrink-0">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl relative flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/20 text-primary dark:text-primary shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pr-8">
                    <h4 className="text-xs font-bold text-primary dark:text-primary">
                      Profile Context {completionStats.percent}% Complete
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                      Complete your caste, land, and income details for 100%
                      accurate AI scheme matching.
                    </p>
                  </div>
                  <Link
                    href="/citizenDashboard/profile"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary text-white h-7 text-[10px] font-bold rounded-md px-2.5 shadow-xs cursor-pointer"
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

            {/* Chat Area */}
            <ChatArea
              messages={messages}
              isTyping={isTyping}
              streamSteps={streamSteps}
              onAction={handleSend}
            />

            {/* Composer */}
            <div className="shrink-0">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
