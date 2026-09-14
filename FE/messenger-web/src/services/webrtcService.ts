export function createWebRTC({
  onTrack,
  onIce,
}: {
  onTrack: (stream: MediaStream) => void;
  onIce: (candidate: RTCIceCandidate) => void;
}): RTCPeerConnection {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  });

  pc.ontrack = (e) => {
    if (e.streams && e.streams[0]) {
      onTrack(e.streams[0]);
    }
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      onIce(e.candidate);
    }
  };

  return pc;
}

export async function addLocalStream(
  pc: RTCPeerConnection,
  stream: MediaStream
): Promise<void> {
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));
}

export async function makeOffer(
  pc: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
}

export async function makeAnswer(
  pc: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

export async function applyAnswer(
  pc: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
): Promise<void> {
  if (pc.signalingState === "have-local-offer") {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
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
