"use client";

import React from "react";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useCall } from "@/contexts/CallContext";

import { formatMediaUrl } from "@/services/api";

export default function CallModal() {
  const { callState, callType, chatRoom, acceptCall, rejectCall, endCall } = useCall();

  if (callState !== "incoming") return null;

  const isIncoming = true;
  const avatarUrl = formatMediaUrl(chatRoom?.logo);
  const displayName = chatRoom?.name || "Unknown User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--chat-bg)] p-8 shadow-2xl border border-[var(--border-color)] text-center flex flex-col items-center">
        {/* Avatar with pulsing ring */}
        <div className="relative mb-6">
          <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-[var(--primary-color)] shadow-xl flex items-center justify-center bg-gradient-to-tr from-[var(--primary-color)] to-orange-400 text-white text-3xl font-bold">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-color)] text-white shadow-md">
            {callType === "VIDEO" ? <Video size={16} /> : <Phone size={16} />}
          </span>
        </div>

        {/* Name & Status */}
        <h3 className="text-2xl font-bold text-[var(--text-color)] mb-2 truncate max-w-full">
          {displayName}
        </h3>
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse mb-8">
          {isIncoming
            ? `Cuộc gọi ${callType === "VIDEO" ? "Video" : "Thoại"} đến...`
            : `Đang gọi ${callType === "VIDEO" ? "Video" : "Thoại"}...`}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-8 w-full">
          {isIncoming ? (
            <>
              <button
                onClick={rejectCall}
                title="Từ chối"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hover:bg-red-600"
              >
                <PhoneOff size={26} />
              </button>
              <button
                onClick={acceptCall}
                title="Chấp nhận"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hover:bg-emerald-600"
              >
                {callType === "VIDEO" ? <Video size={26} /> : <Phone size={26} />}
              </button>
            </>
          ) : (
            <button
              onClick={endCall}
              title="Hủy cuộc gọi"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 hover:bg-red-600"
            >
              <PhoneOff size={26} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
