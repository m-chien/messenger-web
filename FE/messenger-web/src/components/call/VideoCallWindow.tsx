"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useCall } from "@/contexts/CallContext";
import { formatMediaUrl } from "@/services/api";

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
    if (localVideoRef.current.srcObject !== localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    const p = localVideoRef.current.play();
    if (p !== undefined) {
      p.catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    }
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
                  src={formatMediaUrl(chatRoom.logo)}
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
        {callType === "VIDEO" && localStream && (
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasLiveVideo, setHasLiveVideo] = React.useState(false);

  // 1. Dành cho cuộc gọi thoại (AUDIO call): Dùng thẻ audio chuyên biệt
  useEffect(() => {
    if (callType !== "AUDIO") return;
    const audioEl = audioRef.current;
    if (!audioEl || !stream) return;

    audioEl.srcObject = stream;
    const playAudio = () => {
      if (audioEl.paused) {
        audioEl.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Remote audio play error:", err);
          }
        });
      }
    };

    playAudio();
    audioEl.addEventListener("canplay", playAudio);
    audioEl.addEventListener("loadedmetadata", playAudio);

    return () => {
      audioEl.removeEventListener("canplay", playAudio);
      audioEl.removeEventListener("loadedmetadata", playAudio);
    };
  }, [stream, callType]);

  // 2. Dành cho cuộc gọi Video (VIDEO call): Dùng thẻ video (phát cả hình và tiếng)
  useEffect(() => {
    if (callType === "AUDIO") return;
    const videoEl = videoRef.current;
    if (!videoEl || !stream) return;

    videoEl.srcObject = stream;

    const checkTracks = () => {
      const vTracks = stream.getVideoTracks();
      const hasActive =
        vTracks.length > 0 && vTracks.some((t) => t.enabled && t.readyState === "live");
      setHasLiveVideo(hasActive);
      console.log("📹 [RemoteVideo] Stream tracks check:", {
        audio: stream.getAudioTracks().map((t) => `${t.id}: enabled=${t.enabled}, state=${t.readyState}`),
        video: stream.getVideoTracks().map((t) => `${t.id}: enabled=${t.enabled}, state=${t.readyState}`),
      });
    };

    checkTracks();

    const safePlay = () => {
      if (videoEl.paused) {
        videoEl.play().catch((err: any) => {
          if (err.name !== "AbortError") {
            console.warn("Remote video play warning:", err);
          }
        });
      }
    };

    safePlay();
    videoEl.addEventListener("loadedmetadata", safePlay);
    videoEl.addEventListener("canplay", safePlay);

    const handleTrackChange = () => {
      checkTracks();
      safePlay();
    };

    stream.addEventListener("addtrack", handleTrackChange);
    stream.addEventListener("removetrack", handleTrackChange);

    return () => {
      videoEl.removeEventListener("loadedmetadata", safePlay);
      videoEl.removeEventListener("canplay", safePlay);
      stream.removeEventListener("addtrack", handleTrackChange);
      stream.removeEventListener("removetrack", handleTrackChange);
    };
  }, [stream, callType]);

  return (
    <div
      onClick={() => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(console.error);
        }
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(console.error);
        }
      }}
      className="relative h-full w-full min-h-[300px] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center cursor-pointer"
    >
      {/* Thẻ audio chuyên biệt để phát âm thanh cho cuộc gọi thoại */}
      {callType === "AUDIO" && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
        />
      )}

      {/* Video element phát hình ảnh & âm thanh cho video call */}
      {callType !== "AUDIO" && (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            !hasLiveVideo
              ? "opacity-0 absolute pointer-events-none"
              : "opacity-100 block"
          }`}
        />
      )}

      {/* Khi là cuộc gọi âm thanh HOẶC khi video chưa sẵn sàng thì hiển thị avatar */}
      {(callType === "AUDIO" || !hasLiveVideo) && (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
          <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold mb-4 shadow-xl border-4 border-white/20">
            {roomName ? roomName.charAt(0).toUpperCase() : "U"}
          </div>
          <p className="text-2xl font-semibold mb-2">{roomName || "Người tham gia"}</p>
          <p className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            {callType === "AUDIO"
              ? "Đang đàm thoại"
              : "Đang kết nối hình ảnh & âm thanh..."}
          </p>
          {!hasLiveVideo && callType === "VIDEO" && (
            <p className="text-xs text-white/50 mt-3 max-w-xs">
              Chạm vào màn hình nếu bạn chưa nghe thấy âm thanh từ người đối diện.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
