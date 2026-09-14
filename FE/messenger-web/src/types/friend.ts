export interface FriendDetailDTO {
  userId: number;
  name: string;
  email: string;
  avatarUrl?: string;
  isOnline?: boolean;
  status?: boolean;
}

export interface FriendRequestDetailDTO {
  requestId: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  senderAvatarUrl?: string;
  senderIsOnline?: boolean;
  dateSend: string;
  status: string;
}

export interface BlockListDTO {
  id: number;
  blocker: number;
  blocked: number;
  blockedDate?: string;
}
