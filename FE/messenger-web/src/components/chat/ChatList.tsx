"use client";

import { useState, useMemo } from "react";
import { ChatItem } from "./ChatItem";
import { SearchBar } from "./SearchBar";
import { ChatTabs } from "./ChatTabs";
import { ChatRoom } from "@/types/chat";
import { MessageSquareDashed } from "lucide-react";

interface ChatListProps {
  chatRooms?: ChatRoom[];
  selectedChatId?: number | string;
  onSelectChat?: (conv: ChatRoom) => void;
  onDeleteConversation?: (conv: ChatRoom) => void;
  onUnfriend?: (conv: ChatRoom) => void;
  onBlock?: (conv: ChatRoom) => void;
  isLoading?: boolean;
}

export function ChatList({
  chatRooms = [],
  selectedChatId,
  onSelectChat,
  onDeleteConversation,
  onUnfriend,
  onBlock,
  isLoading = false,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredChats = useMemo(() => {
    return chatRooms.filter((chat) => {
      // Tab filter
      if (activeTab === "Unread") {
        const isUnread =
          chat.isUnread === 1 || (chat.unreadCount && chat.unreadCount > 0);
        if (!isUnread) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = chat.name?.toLowerCase().includes(query);
        const matchesContent = chat.content?.toLowerCase().includes(query);
        return matchesName || matchesContent;
      }

      return true;
    });
  }, [chatRooms, activeTab, searchQuery]);

  return (
    <div className="flex h-full flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border-color)]">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Tìm kiếm trên Messenger..."
      />
      <ChatTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={["All", "Unread"]}
      />

      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-[var(--border-color)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[var(--border-color)]" />
                  <div className="h-3 w-2/3 rounded bg-[var(--border-color)]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.idChatroom}
              conv={chat}
              active={
                selectedChatId != null &&
                String(selectedChatId) === String(chat.idChatroom)
              }
              onClick={onSelectChat}
              onDeleteConversation={onDeleteConversation}
              onUnfriend={onUnfriend}
              onBlock={onBlock}
            />
          ))
        ) : (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-[var(--text-muted)]">
            <MessageSquareDashed size={36} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">
              {searchQuery
                ? "Không tìm thấy cuộc trò chuyện nào"
                : activeTab === "Unread"
                ? "Không có tin nhắn chưa đọc"
                : "Chưa có cuộc trò chuyện"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
