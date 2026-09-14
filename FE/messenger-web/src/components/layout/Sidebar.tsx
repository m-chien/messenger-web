"use client";

import {
  MessageSquare,
  Users,
  User,
  ShieldAlert,
  Settings,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { id: "chat", Icon: MessageSquare, label: "Đoạn chat" },
    { id: "friends", Icon: Users, label: "Bạn bè" },
    { id: "profile", Icon: User, label: "Trang cá nhân" },
    { id: "restricted", Icon: ShieldAlert, label: "Tài khoản hạn chế" },
    { id: "settings", Icon: Settings, label: "Cài đặt" },
  ];

  return (
    <div className="flex h-full w-[70px] flex-col items-center bg-[var(--slim-sidebar-bg)] py-4 shadow-lg flex-shrink-0 z-20">
      {/* Top Icons */}
      <div className="flex flex-col gap-3">
        {navItems.map(({ id, Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={label}
              className={`relative rounded-2xl p-3.5 transition-all ${
                isActive
                  ? "bg-white/20 text-white shadow-md scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={toggleTheme}
          title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          className="rounded-2xl p-3 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          onClick={logout}
          title="Đăng xuất"
          className="rounded-2xl p-3 text-white/70 transition-all hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
