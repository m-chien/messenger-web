import api from "./api";
import { FriendDetailDTO, FriendRequestDetailDTO } from "@/types/friend";
import { User } from "@/types/user";

export const friendService = {
  getFriends: async (): Promise<FriendDetailDTO[]> => {
    const res = await api.get<FriendDetailDTO[]>("/friends/list");
    return res.data;
  },

  getFriendRequests: async (): Promise<FriendRequestDetailDTO[]> => {
    const res = await api.get<FriendRequestDetailDTO[]>("/friendRequests/friendRequestsForUser");
    return res.data;
  },

  acceptRequest: async (requestId: number): Promise<void> => {
    await api.post(`/friends/accept/${requestId}`, {});
  },

  rejectRequest: async (requestId: number): Promise<void> => {
    await api.post(`/friends/reject/${requestId}`, {});
  },

  removeFriend: async (friendId: number): Promise<void> => {
    await api.post(`/friends/remove/${friendId}`, {});
  },

  getMutualFriends: async (targetUserId: number): Promise<User[]> => {
    const res = await api.get<User[]>(`/friends/mutual?userID2=${targetUserId}`);
    return res.data;
  },

  sendFriendRequest: async (senderId: number, receiverId: number): Promise<number> => {
    const res = await api.post<number>("/friendRequests", {
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    return res.data;
  },
};
