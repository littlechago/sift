"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface ChatThreadProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatThread({
  messages,
  isStreaming,
  onSend,
  onStop,
}: ChatThreadProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up delay-500">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <MessageCircle className="h-4 w-4 text-muted" />
        <h3 className="font-semibold text-foreground text-sm">Co-Pilot Chat</h3>
        <span className="text-xs text-muted">Ask follow-up questions</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="p-4 space-y-3 max-h-[400px] overflow-y-auto min-h-[120px]"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted text-center py-6">
            Ask a question about the analysis...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-stone-50 border border-border text-foreground"
              }`}
            >
              {msg.content || (
                <span className="inline-block w-2 h-4 bg-stone-300 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-stone-400 focus:outline-none disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 text-muted hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}
