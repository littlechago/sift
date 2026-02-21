"use client";

import Link from "next/link";
import { ScanSearch } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-lg font-serif italic text-foreground hover:opacity-70 transition-opacity"
          >
            Sift
          </Link>
          <Link
            href="/analyze"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ScanSearch className="h-4 w-4" />
            Analyze Content
          </Link>
        </div>
      </div>
    </nav>
  );
}
