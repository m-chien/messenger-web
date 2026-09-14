export interface ChatRoom {
  idChatroom: number;
  creatorID?: number;
  name: string;
  logo?: string;
  idMessage?: number;
  dateSend?: string;
  content?: string;
  lastSeenMessageId?: number;
  hasOnlineUser?: number;
  isUnread?: number;
  unreadCount?: number;
}

export interface SidebarMessageDTO {
  chatroomId: number;
  lastMessage: string;
  time: string;
  senderId?: number;
  chatRoomId?: number;
  content?: string;
  dateSend?: string;
}
