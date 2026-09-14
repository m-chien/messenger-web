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

        if (savedToken) {
          try {
            savedToken = await refreshAccessToken();
          } catch {
            savedToken = authService.getAccessToken();
          }
        }

        if (savedToken) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (err) {
        console.error("Auth init error:", err);
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
