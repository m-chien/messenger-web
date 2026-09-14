"use client";

import { Phone, Video, Info } from "lucide-react";
import { ChatRoom } from "@/types/chat";

interface ChatHeaderProps {
  selectedChat: ChatRoom;
  onToggleProfile?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
}

export function ChatHeader({
  selectedChat,
  onToggleProfile,
  onAudioCall,
  onVideoCall,
}: ChatHeaderProps) {
  const avatarUrl = selectedChat.logo
    ? selectedChat.logo.startsWith("http")
      ? selectedChat.logo
      : `http://localhost:8080${selectedChat.logo}`
    : "";

  const isOnline = selectedChat.hasOnlineUser === 1;

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--chat-bg)] px-6 py-3.5 shadow-sm z-10">
      {/* Left: Avatar, Name, Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-base shadow-sm">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={selectedChat.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              selectedChat.name.charAt(0).toUpperCase()
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--chat-bg)] bg-emerald-500" />
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[var(--text-color)]">
            {selectedChat.name}
          </h2>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {isOnline ? "Đang hoạt động" : "Không hoạt động"}
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onAudioCall}
          className="rounded-full p-2.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-color)] hover:text-[var(--primary-color)]"
          title="Bắt đầu gọi thoại"
        >
          <Phone className="h-5 w-5" />
        </button>
        <button
          onClick={onVideoCall}
          className="rounded-full p-2.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-color)] hover:text-[var(--primary-color)]"
          title="Bắt đầu gọi video"
        >
          <Video className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleProfile}
          className="rounded-full p-2.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-color)] hover:text-[var(--primary-color)]"
          title="Thông tin cuộc trò chuyện"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
