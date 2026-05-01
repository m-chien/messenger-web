"use client";

import { X, Bell, Search, Image as ImageIcon, FileText, Link2 } from "lucide-react";

interface ChatProfileProps {
  selectedChat: {
    id: string;
    name: string;
    avatar: string;
    onlineStatus: "online" | "offline" | "away";
  };
  onClose: () => void;
}

export function ChatProfile({ selectedChat, onClose }: ChatProfileProps) {
  return (
    <div className="flex h-full w-80 flex-col bg-[var(--chat-bg)] text-[var(--text-color)]">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
        <h3 className="font-semibold">Profile</h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center pb-6 border-b border-[var(--border-color)]">
          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-color)] to-orange-500 text-3xl font-semibold text-white">
            {selectedChat.avatar}
          </div>
          <h2 className="text-lg font-bold">{selectedChat.name}</h2>
          <p className="text-sm text-[var(--text-muted)] capitalize">
            {selectedChat.onlineStatus}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 py-6 border-b border-[var(--border-color)]">
          <button className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sidebar-bg)] text-[var(--text-color)] transition-colors hover:bg-[var(--primary-color)] hover:text-white">
              <Search className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sidebar-bg)] text-[var(--text-color)] transition-colors hover:bg-[var(--primary-color)] hover:text-white">
              <Bell className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Mute</span>
          </button>
        </div>

        {/* Sections */}
        <div className="py-4 space-y-2">
          <button className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-[var(--sidebar-bg)]">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-[var(--text-muted)]" />
              <span className="font-medium text-sm">Media</span>
            </div>
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-[var(--sidebar-bg)]">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--text-muted)]" />
              <span className="font-medium text-sm">Files</span>
            </div>
          </button>
          <button className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-[var(--sidebar-bg)]">
            <div className="flex items-center gap-3">
              <Link2 className="h-5 w-5 text-[var(--text-muted)]" />
              <span className="font-medium text-sm">Links</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
