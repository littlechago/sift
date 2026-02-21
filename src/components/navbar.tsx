"use client";

import Link from "next/link";
import { ScanSearch } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold group">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
              <ScanSearch className="h-4 w-4 text-sky-400" />
            </div>
            <span>Sift</span>
          </Link>
          <Link
            href="/analyze"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Analyze
          </Link>
        </div>
      </div>
    </nav>
  );
}
