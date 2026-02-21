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
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in-up">
      <div className="flex items-start gap-4">
        {content.thumbnailUrl && (
          <img
            src={content.thumbnailUrl}
            alt=""
            className="w-24 h-16 rounded-lg object-cover flex-shrink-0 bg-stone-100"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                content.contentType === "youtube"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-sky-50 text-sky-600"
              }`}
            >
              {content.contentType === "youtube" ? (
                <Youtube className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {content.contentType === "youtube" ? "YouTube" : "Article"}
            </span>
            <span className="text-xs text-muted">
              {wordCount.toLocaleString()} words
            </span>
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {content.title}
          </h3>
          {content.author && (
            <p className="text-sm text-muted mt-0.5">by {content.author}</p>
          )}
          <p className="text-sm text-muted mt-2 leading-relaxed">{preview}</p>
        </div>
      </div>
    </div>
  );
}
