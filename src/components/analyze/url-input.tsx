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
        <div className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setValidationError(null);
            }}
            placeholder="Paste a YouTube video or article URL..."
            disabled={loading}
            className="w-full bg-gray-900/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-colors disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap cursor-pointer"
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
        <p className="mt-2 text-sm text-red-400">{displayError}</p>
      )}
    </form>
  );
}
