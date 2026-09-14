import api from "./api";
import { User, ApiResponse } from "@/types/user";

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users");
    return res.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<number> => {
    const res = await api.put<number>(`/users/${id}`, userData);
    return res.data;
  },

  updateAvatar: async (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post<ApiResponse<string>>("/users/upAva", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
