"use client";

import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatAreaProps {
  selectedChat?: {
    id: string;
    name: string;
    avatar: string;
    onlineStatus: "online" | "offline" | "away";
  };
}

export function ChatArea({ selectedChat }: ChatAreaProps) {
  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--chat-bg)] text-[var(--text-muted)]">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <ChatHeader
        name={selectedChat.name}
        avatar={selectedChat.avatar}
        onlineStatus={selectedChat.onlineStatus}
      />

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <MessageInput />
    </div>
  );
}
