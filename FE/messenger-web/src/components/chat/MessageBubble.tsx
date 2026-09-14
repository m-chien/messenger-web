"use client";

import React from "react";
import { format, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageResponseDTO, AttachmentDTO } from "@/types/message";
import { FileText, Download } from "lucide-react";

import { formatMediaUrl } from "@/services/api";

interface MessageBubbleProps {
  message: MessageResponseDTO;
  isMe: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
  onImageClick?: (url: string) => void;
}

export function MessageBubble({
  message,
  isMe,
  showAvatar = true,
  showTime = false,
  onImageClick,
}: MessageBubbleProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isToday(date)) {
        return format(date, "HH:mm");
      }
      return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
    } catch {
      return "";
    }
  };

  const avatarUrl = formatMediaUrl(message.avatarUrl);

  const renderAttachment = (att: AttachmentDTO) => {
    const fileUrl = formatMediaUrl(att.fileUrl);

    if (att.fileType?.startsWith("image/")) {
      return (
        <img
          key={att.id}
          src={fileUrl}
          alt={att.fileName}
          className="max-h-72 max-w-xs sm:max-w-sm rounded-2xl object-cover cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
          onClick={() => onImageClick?.(fileUrl)}
        />
      );
    }

    if (att.fileType?.startsWith("video/")) {
      return (
        <video
          key={att.id}
          controls
          className="max-h-72 max-w-xs sm:max-w-sm rounded-2xl shadow-sm bg-black"
        >
          <source src={fileUrl} type={att.fileType} />
          Trình duyệt không hỗ trợ xem video.
        </video>
      );
    }

    if (att.fileType?.startsWith("audio/")) {
      return (
        <div key={att.id} className="py-1">
          <audio controls className="max-w-xs h-10">
            <source src={fileUrl} type={att.fileType} />
            Trình duyệt không hỗ trợ nghe audio.
          </audio>
        </div>
      );
    }

    return (
      <a
        key={att.id}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={att.fileName}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all shadow-sm ${
          isMe
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-[var(--sidebar-bg)] text-[var(--text-color)] hover:bg-[var(--hover-color)] border border-[var(--border-color)]"
        }`}
      >
        <FileText size={20} className="flex-shrink-0" />
        <span className="truncate max-w-[180px] text-xs font-medium">
          {att.fileName}
        </span>
        <Download size={16} className="flex-shrink-0 opacity-70 ml-auto" />
      </a>
    );
  };

  return (
    <div className="flex flex-col w-full my-0.5">
      {/* Time separator if gap > 10 min */}
      {showTime && message.dateSend && (
        <div className="flex justify-center my-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[var(--text-muted)] bg-[var(--sidebar-bg)] border border-[var(--border-color)] shadow-xs">
            {formatTime(message.dateSend)}
          </span>
        </div>
      )}

      <div
        className={`flex items-end gap-2 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        {/* Avatar for other user */}
        {!isMe && (
          <div className="h-7 w-7 flex-shrink-0 mb-1">
            {showAvatar ? (
              <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  "U"
                )}
              </div>
            ) : (
              <div className="w-7" />
            )}
          </div>
        )}

        {/* Message bubble & attachments */}
        <div
          className={`flex flex-col max-w-[70%] sm:max-w-[65%] gap-1 ${
            isMe ? "items-end" : "items-start"
          }`}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-1">
              {message.attachments.map((att) => renderAttachment(att))}
            </div>
          )}

          {/* Text Content */}
          {message.content && (
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-xs ${
                isMe
                  ? "bg-[var(--primary-color)] text-white rounded-br-xs"
                  : "bg-[var(--bubble-other)] text-[var(--text-color)] border border-[var(--border-color)] rounded-bl-xs"
              }`}
            >
              {message.content}
            </div>
          )}

          {/* Timestamp on hover or subtle below message */}
          <span
            className={`text-[10px] text-[var(--text-muted)] px-1 ${
              isMe ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.dateSend)}
          </span>
        </div>
      </div>
    </div>
  );
}
