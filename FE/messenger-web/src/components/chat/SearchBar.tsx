"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search here"
          className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-[var(--text-color)] placeholder-[var(--text-muted)] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0"
        />
      </div>
    </div>
  );
}
