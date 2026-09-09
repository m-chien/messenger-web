import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";

interface VideoCallModalProps {
  roomId: number;
  currentUserId: number;
  onClose: () => void;
  isIncomingCall?: boolean;
}

export function VideoCallModal({ roomId, currentUserId, onClose, isIncomingCall }: VideoCallModalProps) {
  const {
    localStream,
    remoteStream,
    isCalling,
    startCall,
    endCall,
    initLocalStream,
    toggleVideo,
    toggleAudio
  } = useWebRTC(roomId, currentUserId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  useEffect(() => {
    // Khởi tạo camera và mic khi mở modal
    initLocalStream().then(() => {
      if (!isIncomingCall) {
        startCall();
      }
    });

    return () => {
      endCall(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleToggleVideo = () => {
    toggleVideo();
    setVideoEnabled(!videoEnabled);
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setAudioEnabled(!audioEnabled);
  };

  const handleEndCall = () => {
    endCall(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative flex h-[80vh] w-[80vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
        {/* Remote Video (Main) */}
        <div className="relative flex-1 bg-black">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/50 flex-col gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse"></div>
              <p className="text-xl">{isCalling ? "Đang đổ chuông..." : "Đang chờ kết nối..."}</p>
            </div>
          )}
        </div>

        {/* Local Video (PIP) */}
        <div className="absolute right-4 top-4 h-48 w-36 overflow-hidden rounded-xl border-2 border-gray-700 bg-gray-800 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 rounded-full bg-gray-800/80 px-8 py-4 backdrop-blur-md">
          <button
            onClick={handleToggleAudio}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              audioEnabled ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>

          <button
            onClick={handleEndCall}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600 hover:scale-105 shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="h-7 w-7" />
          </button>

          <button
            onClick={handleToggleVideo}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              videoEnabled ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
