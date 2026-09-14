"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, UserMinus, ShieldAlert } from "lucide-react";
import { ChatRoom } from "@/types/chat";
import { timeAgo } from "@/hooks/useTimeAgo";

import { formatMediaUrl } from "@/services/api";

interface ChatItemProps {
  conv: ChatRoom;
  active?: boolean;
  onClick?: (conv: ChatRoom) => void;
  onDeleteConversation?: (conv: ChatRoom) => void;
  onUnfriend?: (conv: ChatRoom) => void;
  onBlock?: (conv: ChatRoom) => void;
}

export function ChatItem({
  conv,
  active = false,
  onClick,
  onDeleteConversation,
  onUnfriend,
  onBlock,
}: ChatItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const avatarUrl = formatMediaUrl(conv.logo);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const isUnread = conv.isUnread === 1 || (conv.unreadCount && conv.unreadCount > 0);

  return (
    <div
      onClick={() => onClick?.(conv)}
      className={`group relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-2xl cursor-pointer transition-all ${
        active
          ? "bg-[var(--primary-color)]/15 text-[var(--text-color)] shadow-sm"
          : "hover:bg-[var(--hover-color)] text-[var(--text-color)]"
      }`}
    >
      {/* Avatar with status indicator */}
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-sm">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={conv.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            conv.name.charAt(0).toUpperCase()
          )}
        </div>
        {conv.hasOnlineUser === 1 && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--sidebar-bg)] bg-emerald-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4
            className={`truncate text-sm font-semibold ${
              isUnread ? "font-bold text-[var(--text-color)]" : "text-[var(--text-color)]"
            }`}
          >
            {conv.name}
          </h4>
          <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
            {timeAgo(conv.dateSend)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-xs ${
              isUnread
                ? "font-bold text-[var(--primary-color)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {conv.content || "Chưa có tin nhắn"}
          </p>

          {isUnread && (
            <span className="flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--primary-color)]" />
          )}
        </div>
      </div>

      {/* Menu Options Button */}
      <div className="relative flex-shrink-0">
        <button
          onClick={handleMenuClick}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
          title="Tùy chọn"
        >
          <MoreHorizontal size={18} />
        </button>

        {showMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-[var(--chat-bg)] border border-[var(--border-color)] p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-xs"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                onDeleteConversation?.(conv);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <Trash2 size={14} />
              <span>Xóa cuộc trò chuyện</span>
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onUnfriend?.(conv);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <UserMinus size={14} />
              <span>Hủy kết bạn</span>
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onBlock?.(conv);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <ShieldAlert size={14} />
              <span>Chặn người dùng</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
