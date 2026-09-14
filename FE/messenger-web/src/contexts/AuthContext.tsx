"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthResponse } from "@/types/user";
import { authService } from "@/services/authService";
import { refreshAccessToken } from "@/services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  loginGoogle: (idToken: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authService.getCurrentUser();
        let savedToken = authService.getAccessToken();

        if (savedToken && savedUser) {
          try {
            savedToken = await refreshAccessToken();
            setToken(savedToken);
            setUser(savedUser);
          } catch (refreshErr: any) {
            console.warn(
              "Could not refresh token on init:",
              refreshErr?.message || refreshErr
            );
            // If the server rejected the token (401/403), the session is definitely expired
            if (
              refreshErr?.response?.status === 401 ||
              refreshErr?.response?.status === 403
            ) {
              sessionStorage.removeItem("accessToken");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setToken(null);
              setUser(null);
            } else {
              // If it's a network error (server is offline), preserve local state
              setToken(savedToken);
              setUser(savedUser);
            }
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    setToken(data.token);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const loginGoogle = async (idToken: string) => {
    const data = await authService.loginGoogle(idToken);
    setToken(data.token);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading: isLoading,
        setUser,
        login,
        loginGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
