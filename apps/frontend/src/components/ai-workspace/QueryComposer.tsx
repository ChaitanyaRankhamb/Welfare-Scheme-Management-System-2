import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, Square, Languages, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueryComposerProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isTyping: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  recordingDuration: number;
  speechLanguage: 'mr' | 'en';
  setSpeechLanguage: (lang: 'mr' | 'en') => void;
  onToggleRecording: () => void;
  onCancelRecording: () => void;
}

export function QueryComposer({
  input,
  setInput,
  onSend,
  isTyping,
  isRecording,
  isTranscribing,
  recordingDuration,
  speechLanguage,
  setSpeechLanguage,
  onToggleRecording,
  onCancelRecording
}: QueryComposerProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full pb-3 pt-2">
      {isRecording ? (
        <div className="flex items-center justify-between gap-3 p-4 px-5 rounded-2xl border border-destructive/30 bg-destructive/5 animate-pulse shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-destructive animate-ping" />
            <span className="text-sm font-bold text-destructive">
              Listening ({speechLanguage === 'mr' ? 'मराठी' : 'English'})...
            </span>
            <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
              {formatDuration(recordingDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelRecording}
              className="h-9 px-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onToggleRecording}
              className="h-9 px-4 text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl cursor-pointer shadow-xs"
            >
              <Square className="w-4 h-4 mr-1.5 fill-current" />
              Done
            </Button>
          </div>
        </div>
      ) : isTranscribing ? (
        <div className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/5 text-sm font-bold text-primary animate-pulse w-full">
          <Loader2 className="w-5 h-5 animate-spin" />
          Transcribing speech with Groq Whisper AI...
        </div>
      ) : (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setSpeechLanguage('mr')}
                  className={cn(
                    "px-3 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer",
                    speechLanguage === 'mr'
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  🇮🇳 मराठी
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechLanguage('en')}
                  className={cn(
                    "px-3 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer",
                    speechLanguage === 'en'
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>

          <div className="relative group flex items-center shadow-lg rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder={
                speechLanguage === 'mr'
                  ? "योजनांबद्दल प्रश्न विचारा किंवा बोला..."
                  : "Ask any question about welfare schemes..."
              }
              className="h-14 pl-5 pr-24 rounded-2xl border-0 bg-transparent text-foreground text-sm font-semibold shadow-none focus-visible:ring-0"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleRecording}
                disabled={isTyping || isTranscribing}
                title={speechLanguage === 'mr' ? 'मराठीत बोला' : 'Speak in English'}
                className="h-10 w-10 rounded-xl text-primary hover:bg-primary/10 transition-all active:scale-90 cursor-pointer"
              >
                <Mic className="w-5 h-5" />
              </Button>

              <Button 
                type="button"
                onClick={onSend}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "h-10 w-10 rounded-xl p-0 transition-all active:scale-90 shadow-sm cursor-pointer",
                  input.trim() 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
