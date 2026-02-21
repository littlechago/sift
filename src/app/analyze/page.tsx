"use client";

import { useCallback } from "react";
import { UrlInput } from "@/components/analyze/url-input";
import { ContentPreview } from "@/components/analyze/content-preview";
import { AnalysisResult } from "@/components/analyze/analysis-result";
import { ChatThread } from "@/components/analyze/chat-thread";
import { useContentExtraction } from "@/lib/use-content-extraction";
import { useAnalysis } from "@/lib/use-analysis";
import { useChat } from "@/lib/use-chat";
import type { ContentExtraction } from "@/lib/types";

export default function AnalyzePage() {
  const {
    extraction,
    loading: extracting,
    error: extractError,
    extract,
  } = useContentExtraction();

  const {
    analysis,
    loading: analyzing,
    error: analyzeError,
    analyze,
  } = useAnalysis();

  const { messages, isStreaming, send, stop } = useChat(extraction);

  const handleSubmit = useCallback(
    async (url: string) => {
      const result = await extract(url);
      if (result) {
        analyze(result as ContentExtraction);
      }
    },
    [extract, analyze],
  );

  const isLoading = extracting || analyzing;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-serif italic text-foreground">
          Analyze Content
        </h1>
        <p className="text-muted mt-2">
          Paste a YouTube video or article URL to get an AI-powered critical
          analysis.
        </p>
      </div>

      {/* URL Input */}
      <div className="animate-fade-in-up delay-100">
        <UrlInput
          onSubmit={handleSubmit}
          loading={isLoading}
          error={extractError || analyzeError}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 animate-fade-in-up">
          <div className="flex items-center gap-3 justify-center py-12">
            <div className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-pulse" />
            <div className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-pulse delay-100" />
            <div className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-pulse delay-200" />
            <span className="text-sm text-muted ml-2">
              {extracting ? "Extracting content..." : "Running AI analysis..."}
            </span>
          </div>
        </div>
      )}

      {/* Content Preview */}
      {extraction && !isLoading && (
        <div className="mt-8">
          <ContentPreview content={extraction} />
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !analyzing && (
        <div className="mt-6">
          <AnalysisResult analysis={analysis} />
        </div>
      )}

      {/* Chat Thread */}
      {analysis && !analyzing && (
        <div className="mt-6">
          <ChatThread
            messages={messages}
            isStreaming={isStreaming}
            onSend={send}
            onStop={stop}
          />
        </div>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-stone-400">
        Content is processed by Anthropic&apos;s Claude API. Nothing is stored
        permanently.
      </p>
    </div>
  );
}
