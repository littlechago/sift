"use client";

import { useState, useCallback } from "react";
import type { ContentExtraction } from "@/lib/types";

export function useContentExtraction() {
  const [extraction, setExtraction] = useState<ContentExtraction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setExtraction(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed.");
      setExtraction(data as ContentExtraction);
      return data as ContentExtraction;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExtraction(null);
    setError(null);
    setLoading(false);
  }, []);

  return { extraction, loading, error, extract, reset };
}
