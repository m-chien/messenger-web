import api from "./api";
import { ChatRoom } from "@/types/chat";
import { MessageResponseDTO } from "@/types/message";

export const chatService = {
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const res = await api.get<ChatRoom[]>("/chatRooms/user");
    return res.data;
  },

  getMessagesByChatRoom: async (chatRoomId: number): Promise<MessageResponseDTO[]> => {
    const res = await api.get<MessageResponseDTO[]>(`/messages/chatroom/${chatRoomId}`);
    return res.data;
  },

  markAsRead: async (chatRoomId: number): Promise<void> => {
    await api.post(`/chatRoomUsers/${chatRoomId}/read-latest`, {});
  },
};
