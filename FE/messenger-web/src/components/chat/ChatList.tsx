"use client";

import { ChatItem } from "./ChatItem";
import { SearchBar } from "./SearchBar";
import { ChatTabs } from "./ChatTabs";

const mockChats = [
  {
    id: "1",
    name: "Alice Johnson",
    lastMessage: "Hey, how are you?",
    avatar: "A",
    onlineStatus: "online" as const,
  },
  {
    id: "2",
    name: "Bob Smith",
    lastMessage: "Thanks for the update!",
    avatar: "B",
    onlineStatus: "offline" as const,
  },
  {
    id: "3",
    name: "Carol White",
    lastMessage: "See you tomorrow",
    avatar: "C",
    onlineStatus: "away" as const,
  },
  {
    id: "4",
    name: "David Brown",
    lastMessage: "Perfect! 👍",
    avatar: "D",
    onlineStatus: "online" as const,
  },
  {
    id: "5",
    name: "Emma Davis",
    lastMessage: "Let me know!",
    avatar: "E",
    onlineStatus: "online" as const,
  },
];

interface ChatListProps {
  selectedChatId?: string;
  onSelectChat?: (chatId: string) => void;
}

export function ChatList({ selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="flex h-full flex-col bg-[var(--sidebar-bg)]">
      <SearchBar />
      <ChatTabs />
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <ChatItem
            key={chat.id}
            {...chat}
            active={selectedChatId === chat.id}
            onClick={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
}
