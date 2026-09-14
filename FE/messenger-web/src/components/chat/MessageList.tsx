"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageResponseDTO } from "@/types/message";
import { MessagesSquare } from "lucide-react";

interface MessageListProps {
  messages: MessageResponseDTO[];
  myUserId?: number;
  onImageClick?: (url: string) => void;
}

export function MessageList({
  messages,
  myUserId,
  onImageClick,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-[var(--text-muted)] bg-[var(--chat-bg)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sidebar-bg)] mb-3">
          <MessagesSquare size={32} className="opacity-60 text-[var(--primary-color)]" />
        </div>
        <h3 className="text-base font-semibold text-[var(--text-color)] mb-1">
          Chưa có tin nhắn nào
        </h3>
        <p className="text-xs max-w-xs">
          Hãy gửi lời chào để bắt đầu cuộc trò chuyện!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-[var(--chat-bg)] px-6 py-4 scroll-smooth space-y-1"
    >
      {messages.map((msg, index) => {
        const nextMsg = messages[index + 1];
        const prevMsg = messages[index - 1];
        const isMe = Number(msg.userId) === Number(myUserId);
        const showAvatar = !nextMsg || Number(nextMsg.userId) !== Number(msg.userId);

        const showTime =
          !prevMsg ||
          (msg.dateSend &&
            prevMsg.dateSend &&
            new Date(msg.dateSend).getTime() -
              new Date(prevMsg.dateSend).getTime() >
              10 * 60 * 1000);

        return (
          <MessageBubble
            key={msg.id != null ? msg.id : `msg-${index}`}
            message={msg}
            isMe={isMe}
            showAvatar={showAvatar}
            showTime={Boolean(showTime)}
            onImageClick={onImageClick}
          />
        );
      })}
    </div>
  );
}
