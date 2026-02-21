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
    <div className="relative bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden animate-fade-in-up delay-500">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800">
        <MessageCircle className="h-4 w-4 text-sky-400" />
        <h3 className="font-semibold text-white text-sm">Co-Pilot Chat</h3>
        <span className="text-xs text-gray-500">Ask follow-up questions</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="p-4 space-y-3 max-h-[400px] overflow-y-auto min-h-[120px]"
      >
        {messages.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
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
                  ? "bg-sky-600/20 text-sky-100 border border-sky-500/20"
                  : "bg-gray-800/60 border border-gray-700/50 text-gray-200"
              }`}
            >
              {msg.content || (
                <span className="inline-block w-2 h-4 bg-sky-400 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}
