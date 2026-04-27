"use client";

import { useState } from "react";
import { Send, Plus, Paperclip, Smile, Mic } from "lucide-react";

export function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Handle send
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--chat-bg)] px-6 py-4">
      <div className="flex items-end gap-3">
        {/* Action Buttons */}
        <button className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]">
          <Plus className="h-5 w-5" />
        </button>

        {/* Input Area */}
        <div className="flex-1 flex items-end gap-2 rounded-xl bg-[var(--sidebar-bg)] px-4 py-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Aa"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none"
            style={{
              minHeight: "1.5rem",
              maxHeight: "5rem",
            }}
          />

          <button className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-color)]">
            <Smile className="h-5 w-5" />
          </button>

          <button className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-color)]">
            <Paperclip className="h-5 w-5" />
          </button>
        </div>

        {/* Send / Mic Button */}
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="rounded-lg bg-[var(--primary-color)] p-2 text-white transition-all hover:shadow-md hover:brightness-110 active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        ) : (
          <button className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]">
            <Mic className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
