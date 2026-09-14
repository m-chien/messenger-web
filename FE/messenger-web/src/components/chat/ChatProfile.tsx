"use client";

import { X, Image as ImageIcon, Bell, FileText, User } from "lucide-react";
import { ChatRoom } from "@/types/chat";
import { formatMediaUrl } from "@/services/api";

interface ChatProfileProps {
  selectedChat: ChatRoom;
  onClose: () => void;
  onViewUserProfile?: () => void;
}

export function ChatProfile({
  selectedChat,
  onClose,
  onViewUserProfile,
}: ChatProfileProps) {
  const avatarUrl = formatMediaUrl(selectedChat.logo);

  const isOnline = selectedChat.hasOnlineUser === 1;

  return (
    <div className="flex h-full w-80 flex-col bg-[var(--chat-bg)] text-[var(--text-color)] border-l border-[var(--border-color)] shadow-lg">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
        <h3 className="font-bold text-base">Thông tin hội thoại</h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center pb-6 border-b border-[var(--border-color)]">
          <div className="relative mb-3 flex h-24 w-24 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-3xl font-bold text-white shadow-md">
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
          <h2 className="text-lg font-bold text-center">{selectedChat.name}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {isOnline ? "Đang hoạt động" : "Không hoạt động"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-around py-5 border-b border-[var(--border-color)]">
          {onViewUserProfile && (
            <button
              onClick={onViewUserProfile}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sidebar-bg)] text-[var(--text-color)] transition-all group-hover:bg-[var(--primary-color)] group-hover:text-white group-hover:scale-105 shadow-xs">
                <User className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-color)]">
                Trang cá nhân
              </span>
            </button>
          )}

          <button className="flex flex-col items-center gap-1.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sidebar-bg)] text-[var(--text-color)] transition-all group-hover:bg-[var(--primary-color)] group-hover:text-white group-hover:scale-105 shadow-xs">
              <Bell className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-color)]">
              Tắt thông báo
            </span>
          </button>
        </div>

        {/* Section items */}
        <div className="py-4 space-y-1.5">
          <div className="px-2 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Tùy chọn đoạn chat
          </div>
          <button className="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--sidebar-bg)] text-sm">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-4 w-4 text-[var(--primary-color)]" />
              <span className="font-medium">File phương tiện</span>
            </div>
          </button>
          <button className="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--sidebar-bg)] text-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-[var(--primary-color)]" />
              <span className="font-medium">File & Tài liệu</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
