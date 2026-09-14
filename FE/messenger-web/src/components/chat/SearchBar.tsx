"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search here",
}: SearchBarProps) {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full bg-[var(--chat-bg)] py-2 pl-10 pr-4 text-[var(--text-color)] placeholder-[var(--text-muted)] border border-[var(--border-color)] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--primary-color)]"
        />
      </div>
    </div>
  );
}
