import api, { nonAuthApi } from "./api";
import { AuthResponse, User, UserLoginRequest } from "@/types/user";

export const authService = {
  login: async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/users/login", {
      email,
      pass,
    });
    if (res.data.token) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      }
    }
    return res.data;
  },

  loginGoogle: async (idToken: string): Promise<AuthResponse> => {
    const res = await nonAuthApi.post<AuthResponse>(
      "/users/auth/google",
      { idToken },
      { withCredentials: true }
    );
    if (res.data.token) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      }
    }
    return res.data;
  },

  register: async (userData: any): Promise<number> => {
    const res = await api.post<number>("/users", userData);
    return res.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") || "" : "";
    try {
      await api.post("/users/logout", refreshToken, {
        headers: { "Content-Type": "text/plain" },
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem("accessToken") || localStorage.getItem("token")
    );
  },
};
