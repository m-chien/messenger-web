"use client";

import React, { useRef } from "react";
import { Send, Paperclip, X, FileText } from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";

interface MessageInputProps {
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: () => void;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSending?: boolean;
}

export function MessageInput({
  message,
  setMessage,
  onSendMessage,
  selectedFiles,
  setSelectedFiles,
  isSending = false,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = message.trim().length > 0 || selectedFiles.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const existingKey = new Set(prev.map((f) => f.name + f.size));
      const filtered = newFiles.filter((f) => !existingKey.has(f.name + f.size));
      return [...prev, ...filtered];
    });
    // Reset file input value so re-selecting same file triggers change
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isSending) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="border-t border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-3 sm:px-6">
      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-3 mb-2 border-b border-[var(--border-color)] overflow-x-auto max-h-32">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isAudio = file.type.startsWith("audio/");

            return (
              <div
                key={`${file.name}-${index}`}
                className="relative group flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] shadow-xs"
              >
                {isImage ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : isAudio ? (
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <span className="text-xs font-semibold text-[var(--primary-color)]">
                      🎙 Ghi âm
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-1">
                    <FileText size={20} className="text-[var(--primary-color)]" />
                    <span className="truncate max-w-[120px] text-xs font-medium text-[var(--text-color)]">
                      {file.name}
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="rounded-full bg-black/60 text-white p-1 hover:bg-black/80 transition-colors"
                  title="Xóa tệp"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full p-2.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
          title="Đính kèm tệp"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1 flex items-end rounded-2xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] px-4 py-2 focus-within:border-[var(--primary-color)] transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none max-h-32 min-h-[1.5rem]"
          />
        </div>

        {/* Send Button or Voice Recorder */}
        {canSend ? (
          <button
            onClick={onSendMessage}
            disabled={isSending}
            className="rounded-full bg-[var(--primary-color)] p-2.5 text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-sm"
            title="Gửi"
          >
            <Send className="h-5 w-5" />
          </button>
        ) : (
          <VoiceRecorder
            onRecorded={(audioFile) => {
              setSelectedFiles((prev) => [...prev, audioFile]);
            }}
          />
        )}
      </div>
    </div>
  );
}
