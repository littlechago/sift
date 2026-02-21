import { Youtube, FileText } from "lucide-react";
import type { ContentExtraction } from "@/lib/types";

interface ContentPreviewProps {
  content: ContentExtraction;
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const wordCount = content.text.split(/\s+/).length;
  const preview =
    content.text.slice(0, 200).trim() +
    (content.text.length > 200 ? "..." : "");

  return (
    <div className="relative bg-gray-900/80 border border-gray-800 rounded-xl p-5 animate-fade-in-up overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
      <div className="flex items-start gap-4">
        {content.thumbnailUrl && (
          <img
            src={content.thumbnailUrl}
            alt=""
            className="w-24 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-800"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                content.contentType === "youtube"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}
            >
              {content.contentType === "youtube" ? (
                <Youtube className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {content.contentType === "youtube" ? "YouTube" : "Article"}
            </span>
            <span className="text-xs text-gray-500">
              {wordCount.toLocaleString()} words
            </span>
          </div>
          <h3 className="font-semibold text-white truncate">{content.title}</h3>
          {content.author && (
            <p className="text-sm text-gray-400 mt-0.5">by {content.author}</p>
          )}
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {preview}
          </p>
        </div>
      </div>
    </div>
  );
}
