"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useWebSocket } from "./WebSocketContext";
import { useMicCamera } from "@/hooks/useMicCamera";
import { useRingtone } from "@/hooks/useRingtone";
import {
  createWebRTC,
  addLocalStream,
  makeOffer,
  makeAnswer,
  applyAnswer,
  addCandidate,
  flushCandidates,
} from "@/services/webrtcService";
import { CallState, CallType, CallSignalPayload } from "@/types/call";
import { ChatRoom } from "@/types/chat";
import { IMessage } from "@stomp/stompjs";

interface CallContextType {
  callState: CallState;
  callType: CallType | null;
  chatRoom: ChatRoom | null;
  remoteStreams: Record<number, MediaStream>;
  localStream: MediaStream | null;
  micEnabled: boolean;
  cameraEnabled: boolean;
  userAccepted: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  startCall: (chatRoom: ChatRoom, type: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

export function CallProvider({ children }: { children: React.ReactNode }) {
  const { client, userId, connected } = useWebSocket();
  const mic = useMicCamera();
  const ringtone = useRingtone();

  const [callState, setCallState] = useState<CallState>("idle");
  const [callType, setCallType] = useState<CallType | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<number, MediaStream>>({});
  const [userAccepted, setUserAccepted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<number, RTCPeerConnection>>({});
  const iceQueue = useRef<Record<number, RTCIceCandidateInit[]>>({});
  const chatRoomIdRef = useRef<number | null>(null);
  const callTypeRef = useRef<CallType | null>(null);
  const callStateRef = useRef<CallState>("idle");

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const sendSignal = useCallback(
    (payload: CallSignalPayload) => {
      if (client?.connected) {
        client.publish({
          destination: "/app/call",
          body: JSON.stringify(payload),
        });
      }
    },
    [client]
  );

  const endCallCleanup = useCallback(() => {
    setCallState("idle");
    setCallType(null);
    setChatRoom(null);
    setUserAccepted(false);
    setRemoteStreams({});

    chatRoomIdRef.current = null;
    callTypeRef.current = null;

    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    } catch (e) {
      console.error("Error stopping local tracks:", e);
    }

    Object.values(peersRef.current).forEach((pc) => {
      try {
        pc.close();
      } catch (e) {
        console.error("Error closing pc:", e);
      }
    });
    peersRef.current = {};
    iceQueue.current = {};
  }, []);

  const createPC = useCallback(
    async (targetUserId: number, currentCallType: CallType) => {
      if (peersRef.current[targetUserId]) return peersRef.current[targetUserId];

      let stream = localStreamRef.current;
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: currentCallType === "VIDEO",
            audio: true,
          });
          localStreamRef.current = stream;
          setLocalStream(stream);
        } catch (err) {
          console.error("getUserMedia error:", err);
          throw err;
        }
      }

      const pc = createWebRTC({
        onTrack: (remoteStream) => {
          console.log("🎥 [CallContext] onTrack received for target:", targetUserId, {
            audioTracks: remoteStream.getAudioTracks().length,
            videoTracks: remoteStream.getVideoTracks().length,
          });
          setRemoteStreams((prev) => {
            const existing = prev[targetUserId];
            if (existing) {
              remoteStream.getTracks().forEach((track) => {
                if (!existing.getTracks().some((t) => t.id === track.id)) {
                  existing.addTrack(track);
                }
              });
              return { ...prev, [targetUserId]: new MediaStream(existing.getTracks()) };
            }
            return { ...prev, [targetUserId]: new MediaStream(remoteStream.getTracks()) };
          });
        },
        onIce: (candidate) => {
          sendSignal({
            type: "candidate",
            chatRoomId: chatRoomIdRef.current || undefined,
            toUserId: targetUserId,
            data: candidate.toJSON(),
          });
        },
      });

      await addLocalStream(pc, stream);
      peersRef.current[targetUserId] = pc;
      return pc;
    },
    [sendSignal]
  );

  const handleSignal = useCallback(
    async (data: CallSignalPayload) => {
      try {
        const fromUserId = data.fromUserId;
        if (!fromUserId) return;

        switch (data.type) {
          case "call-request": {
            chatRoomIdRef.current = data.chatRoomId || null;
            callTypeRef.current = data.callType || "AUDIO";
            if (data.chatRoom) {
              setChatRoom({
                idChatroom: data.chatRoom.id || data.chatRoomId || 0,
                name: data.chatRoom.name || "Unknown",
                logo: data.chatRoom.logo,
              });
            }
            setCallType(data.callType || "AUDIO");
            setCallState("incoming");
            ringtone.playRingtone();
            break;
          }

          case "call-response": {
            if (callStateRef.current === "incoming") {
              return;
            }

            if (data.data === "accepted") {
              ringtone.stopCallingTone();
              setCallState("incall");

              const activeType = callTypeRef.current || "AUDIO";
              const pc = await createPC(fromUserId, activeType);
              const offer = await makeOffer(pc);

              sendSignal({
                type: "offer",
                chatRoomId: chatRoomIdRef.current || undefined,
                toUserId: fromUserId,
                data: offer,
              });
            } else {
              console.log(`User ${fromUserId} rejected call`);
              ringtone.stopAllTones();
              endCallCleanup();
            }
            break;
          }

          case "offer": {
            if (data.toUserId && String(data.toUserId) !== String(userId)) return;

            const activeType = callTypeRef.current || "AUDIO";
            const pc = await createPC(fromUserId, activeType);
            const answer = await makeAnswer(pc, data.data);

            const queue = iceQueue.current[fromUserId] || [];
            console.log(`🚀 [CallContext] Flushing ${queue.length} queued ICE candidates on offer`);
            for (const c of queue) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(c));
              } catch (e) {
                console.error("Error adding queued ice candidate:", e);
              }
            }
            delete iceQueue.current[fromUserId];

            sendSignal({
              type: "answer",
              chatRoomId: chatRoomIdRef.current || undefined,
              toUserId: fromUserId,
              data: answer,
            });

            if (callStateRef.current !== "incall") {
              setCallState("incall");
              ringtone.stopRingtone();
            }
            break;
          }

          case "answer": {
            if (data.toUserId && String(data.toUserId) !== String(userId)) return;

            const pc = peersRef.current[fromUserId];
            if (pc) {
              await applyAnswer(pc, data.data);
              const queue = iceQueue.current[fromUserId] || [];
              console.log(`🚀 [CallContext] Flushing ${queue.length} queued ICE candidates on answer`);
              for (const c of queue) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(c));
                } catch (e) {
                  console.error("Error adding queued ice candidate:", e);
                }
              }
              delete iceQueue.current[fromUserId];
            }
            break;
          }

          case "candidate": {
            if (data.toUserId && String(data.toUserId) !== String(userId)) return;

            if (!iceQueue.current[fromUserId]) {
              iceQueue.current[fromUserId] = [];
            }

            const pc = peersRef.current[fromUserId];
            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(data.data));
              } catch (err) {
                console.error("Error adding ice candidate:", err);
              }
            } else {
              iceQueue.current[fromUserId].push(data.data);
            }
            break;
          }

          case "end-call": {
            ringtone.stopAllTones();
            endCallCleanup();
            break;
          }
        }
      } catch (err) {
        console.error("handleSignal error:", err);
      }
    },
    [userId, ringtone, createPC, sendSignal, endCallCleanup]
  );

  useEffect(() => {
    if (!client?.connected || !userId) return;

    const subscription = client.subscribe(
      `/topic/user/${userId}/call`,
      (message: IMessage) => {
        if (message.body) {
          const payload = JSON.parse(message.body) as CallSignalPayload;
          handleSignal(payload);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [client, connected, userId, handleSignal]);

  const startCall = async (targetRoom: ChatRoom, type: CallType) => {
    chatRoomIdRef.current = targetRoom.idChatroom;
    callTypeRef.current = type;

    setChatRoom(targetRoom);
    setCallType(type);
    setCallState("outgoing");

    ringtone.playCallingTone();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "VIDEO",
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      console.warn("Could not get local media preview on startCall:", err);
    }

    sendSignal({
      type: "call-request",
      chatRoomId: targetRoom.idChatroom,
      chatRoom: {
        id: targetRoom.idChatroom,
        name: targetRoom.name,
        logo: targetRoom.logo,
      },
      callType: type,
    });
  };

  const acceptCall = async () => {
    ringtone.stopRingtone();
    setUserAccepted(true);
    setCallState("incall");

    try {
      const activeType = callTypeRef.current || "AUDIO";
      const stream = await navigator.mediaDevices.getUserMedia({
        video: activeType === "VIDEO",
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
    } catch (e) {
      console.error("Failed to get local stream:", e);
    }

    sendSignal({
      type: "call-response",
      chatRoomId: chatRoomIdRef.current || undefined,
      data: "accepted",
    });
  };

  const rejectCall = () => {
    ringtone.stopRingtone();
    sendSignal({
      type: "call-response",
      chatRoomId: chatRoomIdRef.current || undefined,
      data: "rejected",
    });
    endCallCleanup();
  };

  const endCall = () => {
    ringtone.stopAllTones();
    sendSignal({
      type: "end-call",
      chatRoomId: chatRoomIdRef.current || undefined,
    });
    endCallCleanup();
  };

  const handleToggleMic = () => {
    mic.toggleMic(localStreamRef.current);
  };

  const handleToggleCamera = () => {
    mic.toggleCamera(localStreamRef.current);
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        callType,
        chatRoom,
        remoteStreams,
        localStream,
        micEnabled: mic.micEnabled,
        cameraEnabled: mic.cameraEnabled,
        userAccepted,
        toggleMic: handleToggleMic,
        toggleCamera: handleToggleCamera,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}
