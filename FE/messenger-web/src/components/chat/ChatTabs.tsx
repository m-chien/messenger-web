"use client";

import { useState } from "react";

interface ChatTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: string[];
}

export function ChatTabs({
  activeTab = "All",
  onTabChange,
  tabs = ["All", "Unread"],
}: ChatTabsProps) {
  return (
    <div className="border-b border-[var(--border-color)] px-4">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange?.(tab)}
            className={`border-b-2 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-[var(--primary-color)] text-[var(--primary-color)] font-semibold"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-color)]"
            }`}
          >
            {tab === "All" ? "Tất cả" : tab === "Unread" ? "Chưa đọc" : tab}
          </button>
        ))}
      </div>
    </div>
  );
}
