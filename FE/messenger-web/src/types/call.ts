export type CallType = "AUDIO" | "VIDEO";
export type CallState = "idle" | "incoming" | "outgoing" | "incall";

export interface CallChatRoomInfo {
  id?: number;
  name?: string;
  logo?: string;
}

export interface CallSignalPayload {
  type: "call-request" | "call-response" | "offer" | "answer" | "candidate" | "end-call";
  chatRoomId?: number;
  chatRoom?: CallChatRoomInfo;
  callType?: CallType;
  toUserId?: number;
  fromUserId?: number;
  data?: any;
}
