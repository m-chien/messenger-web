"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { chatService } from "@/services/chatService";
import { MessageDTO, MessageResponseDTO } from "@/types/message";
import { SidebarMessageDTO } from "@/types/chat";
import { IMessage } from "@stomp/stompjs";

export function useChatSocket(
  selectedChatId?: number | null,
  userId?: number | null,
  onSidebarUpdate?: (sidebarDto: SidebarMessageDTO) => void
) {
  const { client, connected } = useWebSocket();
  const [messages, setMessages] = useState<MessageResponseDTO[]>([]);

  // Clear room messages when selectedChatId changes
  useEffect(() => {
    setMessages([]);
  }, [selectedChatId]);

  // 1. Subscribe Sidebar channel
  useEffect(() => {
    if (!connected || !client || !userId || !onSidebarUpdate) return;

    const subscription = client.subscribe(
      `/topic/user/${userId}/sidebar`,
      (response: IMessage) => {
        try {
          const sidebarDto = JSON.parse(response.body) as SidebarMessageDTO;
          onSidebarUpdate(sidebarDto);
        } catch (err) {
          console.error("Sidebar parse error:", err);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [connected, client, userId, onSidebarUpdate]);

  // 2. Subscribe ChatRoom channel
  useEffect(() => {
    if (!connected || !selectedChatId || !client) return;

    const subscription = client.subscribe(
      `/topic/chatroom/${selectedChatId}`,
      (response: IMessage) => {
        try {
          const msgBody = JSON.parse(response.body) as MessageResponseDTO;
          setMessages((prev) => [...prev, msgBody]);
        } catch (err) {
          console.error("Message parse error:", err);
        }
      }
    );

    // Call read-latest API
    chatService.markAsRead(selectedChatId).catch((err) => {
      console.error("Error marking chat as read:", err);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChatId, connected, client]);

  // 3. Send message
  const sendMessage = useCallback(
    (messagePayload: MessageDTO) => {
      if (client?.connected && selectedChatId) {
        client.publish({
          destination: `/app/chat.send/${messagePayload.chatroom}`,
          body: JSON.stringify(messagePayload),
        });
      } else {
        console.warn("WebSocket not connected, cannot send message");
      }
    },
    [client, selectedChatId]
  );

  return {
    messages,
    sendMessage,
    connected,
  };
}
