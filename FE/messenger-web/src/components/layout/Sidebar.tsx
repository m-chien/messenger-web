"use client";

import { useState } from "react";
import {
  MessageSquare,
  Grid3x3,
  User,
  Settings,
  Moon,
  LogOut,
  Sun,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();

  const icons = [
    { id: "chat", Icon: MessageSquare, label: "Chat" },
    { id: "grid", Icon: Grid3x3, label: "Grid" },
    { id: "user", Icon: User, label: "User" },
    { id: "settings", Icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-full w-[70px] flex-col items-center bg-[var(--slim-sidebar-bg)] py-4 shadow-lg">
      {/* Top Icons */}
      <div className="flex flex-col gap-6">
        {icons.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            title={label}
            className={`rounded-lg p-3 transition-all ${
              activeTab === id
                ? "bg-white/20 text-white shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Icons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-lg p-3 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          title="Logout"
          className="rounded-lg p-3 text-white/70 transition-all hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
