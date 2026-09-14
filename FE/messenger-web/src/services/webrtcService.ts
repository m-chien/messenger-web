// Cấu hình STUN và TURN server miễn phí từ Google và Open Relay
// Giúp vượt qua NAT/Firewall và Symmetric NAT trên mạng 4G/di động
const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:standard.relay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:standard.relay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceCandidatePoolSize: 10,
};

export function createWebRTC({
  onTrack,
  onIce,
}: {
  onTrack: (stream: MediaStream) => void;
  onIce: (candidate: RTCIceCandidate) => void;
}): RTCPeerConnection {
  const pc = new RTCPeerConnection(ICE_CONFIG);

  pc.ontrack = (e) => {
    console.log("⚡ [WebRTC] ontrack event:", e.track.kind, "Streams:", e.streams.length);
    if (e.streams && e.streams[0]) {
      onTrack(e.streams[0]);
    } else if (e.track) {
      const fallbackStream = new MediaStream([e.track]);
      onTrack(fallbackStream);
    }
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      console.log("❄️ [WebRTC] Local ICE candidate gathered:", e.candidate.candidate.substring(0, 40) + "...");
      onIce(e.candidate);
    }
  };

  pc.oniceconnectionstatechange = () => {
    console.log("📡 [WebRTC] ICE Connection State:", pc.iceConnectionState);
  };

  pc.onconnectionstatechange = () => {
    console.log("🌐 [WebRTC] Peer Connection State:", pc.connectionState);
  };

  pc.onsignalingstatechange = () => {
    console.log("📶 [WebRTC] Signaling State:", pc.signalingState);
  };

  return pc;
}

export async function addLocalStream(
  pc: RTCPeerConnection,
  stream: MediaStream
): Promise<void> {
  const senders = pc.getSenders();
  stream.getTracks().forEach((track) => {
    const alreadyExists = senders.some((s) => s.track?.id === track.id);
    if (!alreadyExists) {
      console.log("📤 [WebRTC] Adding local track to PC:", track.kind, track.id);
      pc.addTrack(track, stream);
    }
  });
}

export async function makeOffer(
  pc: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> {
  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  console.log("📝 [WebRTC] Created and set local offer");
  return offer;
}

export async function makeAnswer(
  pc: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  console.log("📥 [WebRTC] Set remote offer description");
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  console.log("📝 [WebRTC] Created and set local answer");
  return answer;
}

export async function applyAnswer(
  pc: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
): Promise<void> {
  if (pc.signalingState === "have-local-offer") {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("📥 [WebRTC] Set remote answer description");
  }
}

export async function addCandidate(
  pc: RTCPeerConnection,
  candidate: RTCIceCandidateInit,
  queue: RTCIceCandidateInit[]
): Promise<void> {
  if (!pc.remoteDescription) {
    queue.push(candidate);
    return;
  }
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.error("Error adding ice candidate:", e);
  }
}

export async function flushCandidates(
  pc: RTCPeerConnection,
  queue: RTCIceCandidateInit[]
): Promise<void> {
  for (const c of queue) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    } catch (e) {
      console.error("Error flushing ice candidate:", e);
    }
  }
  queue.length = 0;
}
