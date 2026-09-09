import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { IMessage } from '@stomp/stompjs';

export const useWebRTC = (roomId: number, currentUserId: number) => {
  const { stompClient, isConnected } = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // Cấu hình máy chủ TURN/STUN cho WebRTC
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && stompClient && isConnected) {
        stompClient.publish({
          destination: '/app/call',
          body: JSON.stringify({
            chatRoomId: roomId,
            type: 'ice-candidate',
            candidate: event.candidate
          })
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    peerConnection.current = pc;
    return pc;
  }, [localStream, stompClient, isConnected, roomId]);

  useEffect(() => {
    if (!stompClient || !isConnected || !currentUserId) return;

    // Lắng nghe tín hiệu từ server
    const subscription = stompClient.subscribe(`/topic/user/${currentUserId}/call`, async (message: IMessage) => {
      const data = JSON.parse(message.body);
      
      if (data.chatRoomId !== roomId) return;

      const pc = peerConnection.current || createPeerConnection();

      try {
        if (data.type === 'offer') {
          setIsCalling(true);
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          stompClient.publish({
            destination: '/app/call',
            body: JSON.stringify({
              chatRoomId: roomId,
              type: 'answer',
              sdp: answer
            })
          });
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } else if (data.type === 'ice-candidate' && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else if (data.type === 'end-call') {
          endCall(false);
        }
      } catch (error) {
        console.error("WebRTC Error:", error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isConnected, roomId, currentUserId, createPeerConnection]);

  const startCall = async () => {
    setIsCalling(true);
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (stompClient && isConnected) {
      stompClient.publish({
        destination: '/app/call',
        body: JSON.stringify({
          chatRoomId: roomId,
          type: 'offer',
          sdp: offer
        })
      });
    }
  };

  const initLocalStream = async (video: boolean = true, audio: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Lỗi lấy stream:", err);
      return null;
    }
  };

  const endCall = (emit: boolean = true) => {
    if (emit && stompClient && isConnected) {
      stompClient.publish({
        destination: '/app/call',
        body: JSON.stringify({
          chatRoomId: roomId,
          type: 'end-call'
        })
      });
    }

    setIsCalling(false);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  return {
    localStream,
    remoteStream,
    isCalling,
    startCall,
    endCall,
    initLocalStream,
    toggleVideo,
    toggleAudio
  };
};
