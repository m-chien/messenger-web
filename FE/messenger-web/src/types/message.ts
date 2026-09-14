export interface AttachmentDTO {
  id?: number;
  fileUrl: string;
  fileName?: string;
  fileType: string;
  fileSize?: number;
}

export interface MessageDTO {
  id?: number;
  userId?: number;
  chatroom: number;
  content: string;
  type: string; // "text" | "file"
  isPin?: boolean;
  dateSend?: string;
  replyMessage?: number;
  attachments?: AttachmentDTO[];
}

export interface MessageResponseDTO {
  id: number;
  type: string;
  content: string;
  isPin?: boolean;
  dateSend: string;
  userId: number;
  isOnline?: boolean;
  userName?: string;
  avatarUrl?: string;
  attachments?: AttachmentDTO[];
  replyMessage?: number;
}
