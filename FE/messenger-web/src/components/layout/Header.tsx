"use client";

import { MoreVertical } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--chat-bg)] px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[var(--text-color)]">Chats</h1>
      <button className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}
