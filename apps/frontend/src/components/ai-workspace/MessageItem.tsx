import React, { useState } from 'react';
import { Bot, Check, Copy } from 'lucide-react';
import { ChatMessage } from './types';
import { AgentReasoning } from './AgentReasoning';
import { SchemeArtifactCard } from './SchemeArtifactCard';
import { DocumentChecklist } from './DocumentChecklist';
import { EligibilityMatrix } from './EligibilityMatrix';
import { SuggestedActionChips } from './SuggestedActionChips';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageItemProps {
  message: ChatMessage;
  onAction: (text: string) => void;
}

export function MessageItem({ message, onAction }: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full py-4 border-b border-border/40 last:border-b-0">
        <div className="flex w-full max-w-4xl mx-auto gap-4 px-4 sm:px-6">
          <div className="flex-1 text-sm font-medium text-foreground py-1 leading-relaxed">
            <span className="font-semibold text-primary mr-2">You:</span>
            {message.text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full py-6 border-b border-border/40 bg-card/30 last:border-b-0 group/msg">
      <div className="flex w-full max-w-4xl mx-auto gap-4 px-4 sm:px-6">
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-primary text-primary-foreground mt-0.5 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
        
        <div className="flex-1 space-y-5 min-w-0">
          {message.steps && message.steps.length > 0 && (
            <AgentReasoning steps={message.steps} />
          )}

          <div className="text-sm font-medium text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="my-3 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs text-foreground" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="px-3 py-2 font-semibold" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-3 py-2 border-t border-border/40" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-primary underline font-medium hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-lg font-bold text-foreground mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-base font-bold text-foreground mt-3 mb-1.5" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-sm font-bold text-foreground mt-2 mb-1" {...props} />
                ),
                code: ({ node, inline, className, children, ...props }: any) => (
                  inline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary font-semibold" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-muted/70 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-border" {...props}>
                      {children}
                    </code>
                  )
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* {message.recommendations && message.recommendations.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Matching Government Schemes ({message.recommendations.length})
              </div>
              <div className="grid grid-cols-1 gap-3">
                {message.recommendations.map((scheme, idx) => (
                  <SchemeArtifactCard 
                    key={`${scheme.title}-${idx}`} 
                    scheme={scheme} 
                    onAction={onAction} 
                    index={idx} 
                  />
                ))}
              </div>
            </div>
          )} */}

          {/* {message.eligibilityMatrix && message.eligibilityMatrix.length > 0 && (
            <EligibilityMatrix 
              criteria={message.eligibilityMatrix} 
              schemeTitle={message.schemeTitle} 
            />
          )} */}

          {/* {message.requiredDocuments && message.requiredDocuments.length > 0 && (
            <DocumentChecklist 
              documents={message.requiredDocuments} 
              schemeTitle={message.schemeTitle} 
            />
          )} */}

          <div className="flex items-center justify-between pt-2">
            {message.followUps && message.followUps.length > 0 && (
              <SuggestedActionChips actions={message.followUps} onAction={onAction} />
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer opacity-0 group-hover/msg:opacity-100 transition-opacity"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
