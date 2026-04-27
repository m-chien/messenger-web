"use client";

import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
  avatar?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you?",
    isOwn: false,
    timestamp: "10:30 AM",
    avatar: "A",
  },
  {
    id: "2",
    content: "I'm doing great, thanks for asking!",
    isOwn: true,
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    content: "Did you finish the project?",
    isOwn: false,
    timestamp: "10:32 AM",
    avatar: "A",
  },
  {
    id: "4",
    content: "Almost done! Should be ready by tomorrow.",
    isOwn: true,
    timestamp: "10:33 AM",
  },
  {
    id: "5",
    content: "That's awesome! 🎉",
    isOwn: false,
    timestamp: "10:34 AM",
    avatar: "A",
  },
];

export function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--chat-bg)] px-6 py-4">
      <div className="flex flex-col gap-4">
        {mockMessages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            isOwn={message.isOwn}
            timestamp={message.timestamp}
            avatar={message.avatar}
          />
        ))}
      </div>
    </div>
  );
}
