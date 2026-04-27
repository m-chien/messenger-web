"use client";

import { useState } from "react";

const tabs = ["All", "New", "Closed"];

export function ChatTabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="border-b border-[var(--border-color)] px-4">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-[var(--primary-color)] text-[var(--text-color)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-color)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
