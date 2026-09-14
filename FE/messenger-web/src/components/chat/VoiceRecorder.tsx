"use client";

import { Mic } from "lucide-react";
import { useRef, useState } from "react";

interface VoiceRecorderProps {
  onRecorded: (file: File) => void;
}

export function VoiceRecorder({ onRecorded }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        stream.getTracks().forEach((t) => t.stop());
        onRecorded(file);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền thiết bị.");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      title={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói"}
      className={`rounded-lg p-2 transition-all flex items-center justify-center ${
        isRecording
          ? "bg-red-500 text-white animate-pulse"
          : "text-[var(--text-muted)] hover:bg-[var(--sidebar-bg)] hover:text-[var(--text-color)]"
      }`}
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}

export default VoiceRecorder;
