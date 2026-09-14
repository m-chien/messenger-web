"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatProfile } from "./ChatProfile";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { ChatRoom, SidebarMessageDTO } from "@/types/chat";
import { MessageDTO, MessageResponseDTO } from "@/types/message";
import { useChatSocket } from "@/hooks/useChatSocket";
import { chatService } from "@/services/chatService";
import { uploadService } from "@/services/uploadService";
import { useCall } from "@/contexts/CallContext";
import { MessageCircle } from "lucide-react";

interface ChatAreaProps {
  selectedChat?: ChatRoom | null;
  myUserId?: number;
  onViewUserProfile?: () => void;
  onSidebarUpdate?: (dto: SidebarMessageDTO) => void;
}

export function ChatArea({
  selectedChat,
  myUserId,
  onViewUserProfile,
  onSidebarUpdate,
}: ChatAreaProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<MessageResponseDTO[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { startCall } = useCall();

  // Initialize chat socket
  const {
    messages: socketMessages,
    sendMessage,
  } = useChatSocket(
    selectedChat?.idChatroom,
    myUserId,
    onSidebarUpdate
  );

  // Fetch historical messages for the selected room
  const fetchRoomHistory = useCallback(async (roomId: number) => {
    try {
      const msgs = await chatService.getMessagesByChatRoom(roomId);
      setHistoryMessages(msgs || []);
    } catch (err) {
      console.error("Error fetching room messages:", err);
      setHistoryMessages([]);
    }
  }, []);

  useEffect(() => {
    if (selectedChat?.idChatroom) {
      fetchRoomHistory(selectedChat.idChatroom);
    } else {
      setHistoryMessages([]);
    }
  }, [selectedChat?.idChatroom, fetchRoomHistory]);

  // Combine, deduplicate, and sort messages
  const allMessages = useMemo(() => {
    const combined = [...historyMessages, ...socketMessages];
    return combined
      .filter(
        (message, index, self) =>
          message.id == null ||
          index === self.findIndex((m) => m.id != null && m.id === message.id)
      )
      .sort((a, b) => {
        const timeA = Date.parse(a.dateSend || "");
        const timeB = Date.parse(b.dateSend || "");
        if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
          if (timeA !== timeB) return timeA - timeB;
        } else if (Number.isNaN(timeA)) {
          return 1;
        } else {
          return -1;
        }
        return (a.id || 0) - (b.id || 0);
      });
  }, [historyMessages, socketMessages]);

  // Handle sending text and files
  const handleSendMessage = async () => {
    if (!selectedChat?.idChatroom) return;
    if (!messageInput.trim() && selectedFiles.length === 0) return;

    setIsSending(true);
    try {
      // 1. Upload files if any
      let uploadedAttachments: any[] = [];
      if (selectedFiles.length > 0) {
        uploadedAttachments = await Promise.all(
          selectedFiles.map((file) => uploadService.upload(file))
        );
      }

      // 2. Prepare payload
      const payload: MessageDTO = {
        chatroom: selectedChat.idChatroom,
        content: messageInput,
        type: selectedFiles.length > 0 ? "file" : "text",
        attachments: uploadedAttachments,
      };

      // 3. Send over STOMP
      sendMessage(payload);

      // 4. Reset input
      setMessageInput("");
      setSelectedFiles([]);

      // 5. Reload messages after brief delay to get updated MinIO URLs
      setTimeout(() => {
        if (selectedChat?.idChatroom) {
          fetchRoomHistory(selectedChat.idChatroom);
        }
      }, 500);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--chat-bg)] text-[var(--text-muted)] p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--sidebar-bg)] mb-4 shadow-inner">
          <MessageCircle size={40} className="text-[var(--primary-color)] opacity-70" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">
          Chào mừng đến với Messenger
        </h2>
        <p className="text-sm max-w-sm text-center">
          Chọn một cuộc trò chuyện từ danh sách bên trái hoặc tìm kiếm bạn bè để bắt đầu nhắn tin.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--chat-bg)]">
      {/* Main Chat Flow */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <ChatHeader
          selectedChat={selectedChat}
          onToggleProfile={() => setIsProfileOpen((prev) => !prev)}
          onAudioCall={() => startCall(selectedChat, "AUDIO")}
          onVideoCall={() => startCall(selectedChat, "VIDEO")}
        />

        {/* Messages */}
        <MessageList
          messages={allMessages}
          myUserId={myUserId}
          onImageClick={(url) => setPreviewImage(url)}
        />

        {/* Input */}
        <MessageInput
          message={messageInput}
          setMessage={setMessageInput}
          onSendMessage={handleSendMessage}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          isSending={isSending}
        />
      </div>

      {/* Profile Sidebar */}
      <div
        className={`transition-[width,opacity] duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          isProfileOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isProfileOpen && (
          <ChatProfile
            selectedChat={selectedChat}
            onClose={() => setIsProfileOpen(false)}
            onViewUserProfile={onViewUserProfile}
          />
        )}
      </div>

      {/* Lightbox Modal */}
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
