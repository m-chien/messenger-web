"use client";

import { useState } from "react";

export interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  active?: boolean;
  onlineStatus?: "online" | "offline" | "away";
  onClick?: (id: string) => void;
}

export function ChatItem({
  id,
  name,
  lastMessage,
  avatar,
  active = false,
  onlineStatus = "online",
  onClick,
}: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onClick?.(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full px-4 py-3 text-left transition-colors ${
        active
          ? "bg-[var(--active-chat-bg)]"
          : isHovered
            ? "bg-[var(--active-chat-bg)] bg-opacity-50"
            : "hover:bg-[var(--active-chat-bg)] hover:bg-opacity-30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-[var(--text-color)]">
            {name}
          </h4>
          <p className="truncate text-xs text-[var(--text-muted)]">
            {lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}
