"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Users,
  UserPlus,
  ShieldAlert,
  Shield,
  HelpCircle,
} from "lucide-react";

interface HeaderProps {
  onNavigate?: (view: "friends" | "requests" | "discover" | "restricted") => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--sidebar-bg)] px-5 py-3.5 shadow-xs">
      <h1 className="text-xl font-bold text-[var(--text-color)]">Đoạn chat</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--chat-bg)] hover:text-[var(--text-color)]"
          title="Tùy chọn khác"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 z-50 w-56 rounded-2xl bg-[var(--chat-bg)] border border-[var(--border-color)] p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setShowMenu(false);
                onNavigate?.("friends");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <Users size={16} className="text-[var(--primary-color)]" />
              <span>Danh sách bạn bè</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onNavigate?.("discover");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <UserPlus size={16} className="text-[var(--primary-color)]" />
              <span>Khám phá bạn bè</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onNavigate?.("restricted");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <ShieldAlert size={16} className="text-red-500" />
              <span>Tài khoản đã hạn chế</span>
            </button>

            <div className="my-1 border-t border-[var(--border-color)]" />

            <button
              onClick={() => {
                setShowMenu(false);
                alert("Tính năng quyền riêng tư đang được cập nhật!");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <Shield size={16} className="text-[var(--text-muted)]" />
              <span>Quyền riêng tư...</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                alert("Messenger Web Clone - Hỗ trợ và hướng dẫn sử dụng.");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            >
              <HelpCircle size={16} className="text-[var(--text-muted)]" />
              <span>Trợ giúp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
