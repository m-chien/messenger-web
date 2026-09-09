"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string | number;
  content: string;
  userId?: number;
  dateSend?: string;
  avatarUrl?: string;
  isOwn?: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: number;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-[var(--chat-bg)] px-6 py-4 scroll-smooth"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => {
          const isOwn = message.userId === currentUserId || message.isOwn;
          
          return (
            <MessageBubble
              key={message.id || index}
              content={message.content}
              isOwn={isOwn}
              timestamp={message.dateSend ? new Date(message.dateSend).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Now"}
              avatar={message.avatarUrl || "A"}
            />
          );
        })}
      </div>
    </div>
  );
}
