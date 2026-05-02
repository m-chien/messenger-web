"use client";

import { useState } from "react";
import { Search, UserPlus, Check, X, Clock } from "lucide-react";

export function AddFriendPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "searching" | "found" | "not_found">("idle");

  // Mock data for search results
  const mockResult = {
    id: "user-999",
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "A",
    mutualFriends: 3
  };

  const [requestStatus, setRequestStatus] = useState<"none" | "sent">("none");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchState("searching");
    // Simulate API call
    setTimeout(() => {
      if (searchQuery.toLowerCase().includes("alex")) {
        setSearchState("found");
      } else {
        setSearchState("not_found");
      }
    }, 1000);
  };

  return (
    <div className="flex h-full w-full bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
      <div className="max-w-4xl mx-auto w-full p-10 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Add Friend</h2>
          <p className="text-[var(--text-muted)]">
            Search for people by their name, username, or email address to connect with them.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email (Try 'Alex')..."
            className="w-full pl-12 pr-24 py-4 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-lg transition-all shadow-sm"
          />
          <button 
            type="submit"
            disabled={!searchQuery.trim() || searchState === "searching"}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {searchState === "searching" ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Search Results */}
        <div className="max-w-2xl">
          {searchState === "searching" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[var(--sidebar-bg)] border-t-[var(--primary-color)] rounded-full animate-spin mb-4"></div>
              <p className="text-[var(--text-muted)] font-medium">Searching network...</p>
            </div>
          )}

          {searchState === "not_found" && (
            <div className="text-center py-12 bg-[var(--chat-bg)] rounded-2xl border border-[var(--border-color)]">
              <div className="w-16 h-16 bg-[var(--sidebar-bg)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-[var(--text-muted)]">
                We couldn't find anyone matching "{searchQuery}".
              </p>
            </div>
          )}

          {searchState === "found" && (
            <div className="bg-[var(--chat-bg)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {mockResult.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{mockResult.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
                    <span>{mockResult.username}</span>
                    <span>•</span>
                    <span>{mockResult.mutualFriends} mutual friends</span>
                  </div>
                </div>
              </div>

              {requestStatus === "none" ? (
                <button 
                  onClick={() => setRequestStatus("sent")}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl hover:opacity-90 transition-opacity font-medium w-full md:w-auto justify-center shadow-sm hover:shadow"
                >
                  <UserPlus className="h-5 w-5" />
                  Add Friend
                </button>
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-xl font-medium w-full md:w-auto justify-center">
                  <Check className="h-5 w-5" />
                  Request Sent
                </div>
              )}
            </div>
          )}

          {/* Pending Requests Section */}
          {searchState === "idle" && (
            <div className="mt-16">
              <h3 className="text-lg font-semibold mb-4 border-b border-[var(--border-color)] pb-2">
                Pending Requests (1)
              </h3>
              
              <div className="bg-[var(--chat-bg)] rounded-xl border border-[var(--border-color)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold shadow-sm">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Connor</h4>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity" title="Accept">
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-[var(--sidebar-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg hover:bg-opacity-80 transition-colors" title="Decline">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
