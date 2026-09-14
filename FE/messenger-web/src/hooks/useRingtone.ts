import { useRef } from "react";

export function useRingtone() {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const callingRef = useRef<HTMLAudioElement | null>(null);

  const playRingtone = () => {
    if (typeof window === "undefined") return;
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
      ringtoneRef.current.loop = true;
    }
    ringtoneRef.current.play().catch((e) => console.warn("Ringtone play error:", e));
  };

  const playCallingTone = () => {
    if (typeof window === "undefined") return;
    if (!callingRef.current) {
      callingRef.current = new Audio("/sounds/calling.mp3");
      callingRef.current.loop = true;
    }
    callingRef.current.play().catch((e) => console.warn("Calling tone play error:", e));
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const stopCallingTone = () => {
    if (callingRef.current) {
      callingRef.current.pause();
      callingRef.current.currentTime = 0;
    }
  };

  const stopAllTones = () => {
    stopRingtone();
    stopCallingTone();
  };

  return {
    playRingtone,
    playCallingTone,
    stopRingtone,
    stopCallingTone,
    stopAllTones,
  };
}
