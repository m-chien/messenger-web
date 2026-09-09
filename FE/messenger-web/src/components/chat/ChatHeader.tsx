"use client";

import { Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  onlineStatus: "online" | "offline" | "away";
  avatar: string;
  onToggleProfile?: () => void;
  onVideoCall?: () => void;
}

export function ChatHeader({ name, onlineStatus, avatar, onToggleProfile, onVideoCall }: ChatHeaderProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  const statusTexts = {
    online: "Online",
    offline: "Offline",
    away: "Away",
  };

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--chat-bg)] px-6 py-4 shadow-sm">
      {/* Left: Avatar, Name, Status */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-orange-500 flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-color)]">
            {name}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            <span
              className={`inline-block h-2 w-2 rounded-full ${statusColors[onlineStatus]} mr-1`}
            />
            {statusTexts[onlineStatus]}
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]">
          <Phone className="h-5 w-5" />
        </button>
        <button 
          onClick={onVideoCall}
          className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
        >
          <Video className="h-5 w-5" />
        </button>
        <button 
          onClick={onToggleProfile}
          className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
