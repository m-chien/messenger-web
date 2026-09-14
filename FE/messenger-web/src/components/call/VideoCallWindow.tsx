"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useCall } from "@/contexts/CallContext";

export default function VideoCallWindow() {
  const {
    callState,
    callType,
    chatRoom,
    localStream,
    remoteStreams,
    micEnabled,
    cameraEnabled,
    toggleMic,
    toggleCamera,
    endCall,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const shouldRender = ["outgoing", "incall"].includes(callState);

  useEffect(() => {
    if (!shouldRender || !localStream || !localVideoRef.current) return;
    localVideoRef.current.srcObject = localStream;
    localVideoRef.current.play().catch(console.error);
  }, [localStream, shouldRender]);

  if (!shouldRender) return null;

  const entries = Object.entries(remoteStreams);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-300">
      {/* Video Content Grid */}
      <div className="relative flex-1 p-4 flex items-center justify-center overflow-hidden">
        {entries.length > 0 ? (
          <div
            className="grid h-full w-full gap-4 items-center justify-center"
            style={{
              gridTemplateColumns:
                entries.length === 1
                  ? "1fr"
                  : "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            {entries.map(([targetUserId, stream]) => (
              <RemoteVideo
                key={targetUserId}
                stream={stream}
                callType={callType}
                roomName={chatRoom?.name}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-28 w-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
              {chatRoom?.logo ? (
                <img
                  src={
                    chatRoom.logo.startsWith("http")
                      ? chatRoom.logo
                      : `http://localhost:8080${chatRoom.logo}`
                  }
                  alt={chatRoom.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                chatRoom?.name?.charAt(0) || "U"
              )}
            </div>
            <h2 className="text-2xl font-bold">{chatRoom?.name || "Cuộc gọi"}</h2>
            <p className="text-white/60 animate-pulse">
              {callState === "outgoing"
                ? "Đang chờ người khác tham gia..."
                : "Đang kết nối tín hiệu..."}
            </p>
          </div>
        )}

        {/* Local Stream (Picture in Picture) */}
        {callType === "VIDEO" && (
          <div className="absolute bottom-6 right-6 h-48 w-36 sm:h-56 sm:w-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-slate-900 z-10">
            <video
              ref={localVideoRef}
              playsInline
              autoPlay
              muted
              className="h-full w-full object-cover -scale-x-100"
            />
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-24 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-6 px-6">
        <button
          onClick={toggleMic}
          title={micEnabled ? "Tắt micro" : "Bật micro"}
          className={`flex h-13 w-13 items-center justify-center rounded-full transition-all shadow-lg active:scale-95 ${
            micEnabled
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        {callType === "VIDEO" && (
          <button
            onClick={toggleCamera}
            title={cameraEnabled ? "Tắt camera" : "Bật camera"}
            className={`flex h-13 w-13 items-center justify-center rounded-full transition-all shadow-lg active:scale-95 ${
              cameraEnabled
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {cameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
        )}

        <button
          onClick={endCall}
          title="Kết thúc cuộc gọi"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}

function RemoteVideo({
  stream,
  callType,
  roomName,
}: {
  stream: MediaStream;
  callType: string | null;
  roomName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  if (callType === "AUDIO") {
    return (
      <div className="flex h-full w-full min-h-[300px] flex-col items-center justify-center rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-xl">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
          {roomName ? roomName.charAt(0).toUpperCase() : "U"}
        </div>
        <p className="text-xl font-semibold">{roomName || "Người tham gia"}</p>
        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          Đang đàm thoại
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[300px] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
      <video
        ref={videoRef}
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />
    </div>
  );
}
