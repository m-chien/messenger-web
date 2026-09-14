import api from "./api";
import { BlockListDTO } from "@/types/friend";

export const blockService = {
  getBlockList: async (): Promise<BlockListDTO[]> => {
    const res = await api.get<BlockListDTO[]>("/api/blockLists");
    return res.data;
  },

  checkBlock: async (targetUserId: number): Promise<boolean> => {
    const res = await api.post<boolean>(
      `/api/blockLists/check-block?targetUserId=${targetUserId}`
    );
    return res.data;
  },

  unblock: async (blockId: number): Promise<void> => {
    await api.delete(`/api/blockLists/${blockId}`);
  },

  blockUser: async (blockedUserId: number): Promise<number> => {
    const res = await api.post<number>("/api/blockLists", {
      blocked: blockedUserId,
    });
    return res.data;
  },
};
