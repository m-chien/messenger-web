"use client";

import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatProfile } from "./ChatProfile";

interface ChatAreaProps {
  selectedChat?: {
    id: string;
    name: string;
    avatar: string;
    onlineStatus: "online" | "offline" | "away";
  };
}

export function ChatArea({ selectedChat }: ChatAreaProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--chat-bg)] text-[var(--text-muted)]">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--chat-bg)]">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <ChatHeader
          name={selectedChat.name}
          avatar={selectedChat.avatar}
          onlineStatus={selectedChat.onlineStatus}
          onToggleProfile={() => setIsProfileOpen(!isProfileOpen)}
        />

        {/* Messages */}
        <MessageList />

        {/* Input */}
        <MessageInput />
      </div>

      {/* Profile Sidebar */}
      <div
        className={`transition-[width,border,opacity] duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          isProfileOpen ? "w-80 border-l border-[var(--border-color)] opacity-100" : "w-0 border-l-0 border-transparent opacity-0"
        }`}
      >
        <ChatProfile
          selectedChat={selectedChat}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </div>
  );
}
