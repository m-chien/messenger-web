"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatProfile } from "./ChatProfile";
import { useSocket } from "@/hooks/useSocket";
import { VideoCallModal } from "./VideoCallModal";

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
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const roomId = selectedChat ? parseInt(selectedChat.id) : undefined;
  const { messages, sendMessage, isConnected } = useSocket(roomId);

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
          onVideoCall={() => setIsVideoCallOpen(true)}
        />

        {/* Messages */}
        <MessageList messages={messages} currentUserId={currentUserId} />

        {/* Input */}
        <MessageInput onSendMessage={(content) => sendMessage(content, 'text')} />
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

      {/* Video Call Modal */}
      {isVideoCallOpen && roomId && currentUserId && (
        <VideoCallModal
          roomId={roomId}
          currentUserId={currentUserId}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}
    </div>
  );
}
