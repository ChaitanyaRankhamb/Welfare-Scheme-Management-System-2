import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, StreamStep } from './types';
import { MessageItem } from './MessageItem';
import { EmptyState } from './EmptyState';
import { Loader2 } from 'lucide-react';
import { AgentReasoning } from './AgentReasoning';

interface ChatAreaProps {
  messages: ChatMessage[];
  isTyping: boolean;
  streamSteps: StreamStep[];
  onAction: (text: string) => void;
}

export function ChatArea({ messages, isTyping, streamSteps, onAction }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, streamSteps]);

  // If there's only the initial greeting or no messages, show EmptyState
  const showEmptyState = messages.length <= 1 && !isTyping;

  return (
    <ScrollArea className="flex-1 min-h-0 w-full overflow-y-auto">
      {showEmptyState ? (
        <EmptyState onAction={onAction} />
      ) : (
        <div className="flex flex-col pb-6">
          {/* Skip the initial greeting if it's there to keep ChatGPT style (usually starts clean) */}
          {messages.filter(m => m.id !== 'welcome-msg').map((m) => (
            <MessageItem key={m.id} message={m} onAction={onAction} />
          ))}

          {isTyping && (
            <div className="flex w-full py-6 bg-card/30">
              <div className="flex w-full max-w-4xl mx-auto gap-4 px-4 sm:px-6">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-primary text-primary-foreground mt-0.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                
                <div className="flex-1 space-y-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-primary tracking-wide">
                      Agent is reasoning & querying database...
                    </span>
                  </div>

                  {streamSteps.length > 0 && (
                    <AgentReasoning steps={streamSteps} isLive={true} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-px w-full" />
        </div>
      )}
    </ScrollArea>
  );
}
