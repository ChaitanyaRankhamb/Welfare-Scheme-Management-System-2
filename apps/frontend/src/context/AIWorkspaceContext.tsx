'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

import { useRouter } from 'next/navigation';

export type AIWorkspaceMode = 'side-panel' | 'wide' | 'fullscreen';

interface AIWorkspaceContextType {
  isOpen: boolean;
  mode: AIWorkspaceMode;
  initialQuery?: string;
  openWorkspace: (query?: string) => void;
  closeWorkspace: () => void;
  toggleWorkspace: () => void;
  setMode: (mode: AIWorkspaceMode) => void;
}

const AIWorkspaceContext = createContext<AIWorkspaceContextType | undefined>(undefined);

export const AIWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AIWorkspaceMode>('side-panel');
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);

  const openWorkspace = useCallback((query?: string) => {
    if (query) {
      setInitialQuery(query);
    }
    setIsOpen(true);
    router.push('/citizenDashboard/ai-assistant');
  }, [router]);

  const closeWorkspace = useCallback(() => {
    setIsOpen(false);
    setInitialQuery(undefined);
  }, []);

  const toggleWorkspace = useCallback(() => {
    setIsOpen((prev) => !prev);
    router.push('/citizenDashboard/ai-assistant');
  }, [router]);

  return (
    <AIWorkspaceContext.Provider
      value={{
        isOpen,
        mode,
        initialQuery,
        openWorkspace,
        closeWorkspace,
        toggleWorkspace,
        setMode,
      }}
    >
      {children}
    </AIWorkspaceContext.Provider>
  );
};

export const useAIWorkspace = () => {
  const context = useContext(AIWorkspaceContext);
  if (!context) {
    return {
      isOpen: false,
      mode: 'fullscreen' as AIWorkspaceMode,
      initialQuery: undefined,
      openWorkspace: () => {},
      closeWorkspace: () => {},
      toggleWorkspace: () => {},
      setMode: () => {},
    };
  }
  return context;
};
