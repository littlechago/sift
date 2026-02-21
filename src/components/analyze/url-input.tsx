"use client";

import { useState } from "react";
import { ScanSearch, Loader2 } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
  error: string | null;
}

export function UrlInput({ onSubmit, loading, error }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError("Please enter a URL.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!parsed.protocol.startsWith("http")) {
        setValidationError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setValidationError("Please enter a valid URL.");
      return;
    }

    onSubmit(trimmed);
  }

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setValidationError(null);
          }}
          placeholder="Paste a YouTube video or article URL..."
          disabled={loading}
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-300 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-foreground text-background font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-80 disabled:opacity-40 whitespace-nowrap cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="h-4 w-4" />
          )}
          {loading ? "Analyzing..." : "Analyze this"}
        </button>
      </div>
      {displayError && (
        <p className="mt-2 text-sm text-red-600">{displayError}</p>
      )}
    </form>
  );
}
