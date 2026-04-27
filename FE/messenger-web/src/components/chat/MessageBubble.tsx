"use client";

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: string;
  avatar?: string;
}

export function MessageBubble({
  content,
  isOwn,
  timestamp,
  avatar,
}: MessageBubbleProps) {
  return (
    <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <div className="mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          {avatar || "U"}
        </div>
      )}

      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs rounded-xl px-4 py-2 border ${
            isOwn
              ? "bg-[var(--bubble-me)] text-[var(--text-color-me)] "
              : "bg-[var(--bubble-other)] text-[var(--text-color)] border-[var(--border-color)]"
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>
        <span className="mt-1 text-xs text-[var(--text-muted)]">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
