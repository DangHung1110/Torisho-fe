'use client';

import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as signalR from '@microsoft/signalr';
import {
  IconCamera,
  IconCameraOff,
  IconCircleFilled,
  IconDots,
  IconLoader2,
  IconLogout,
  IconMessage,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconPlus,
  IconSearch,
  IconSend,
  IconSettings,
  IconSubtitles,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import {
  ChatMessage,
  PeerDisconnectedEvent,
  PeerJoinedEvent,
  PeerMediaStateChangedEvent,
  Room,
  RoomStatus,
  SignalAnswerEvent,
  SignalIceCandidateEvent,
  SignalOfferEvent,
  UserJoined,
  UserLeft,
} from '@/src/types/room';
import { RoomService } from '@/src/services/room.service';
import { AuthStorage } from '@/src/libs/auth-storage';
import { API_BASE_URL, getApiOrigin } from '@/src/libs/api-client';

interface VideoCallRoomProps {
  roomId: string;
}

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  ],
};

export default function VideoCallRoom({ roomId }: VideoCallRoomProps) {
  const router = useRouter();
  const currentUser = AuthStorage.getUser();

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [mediaWarning, setMediaWarning] = useState('');
  const [partnerLeft, setPartnerLeft] = useState(false);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  const [remoteUserName, setRemoteUserName] = useState('Partner');
  const [hasRemoteStream, setHasRemoteStream] = useState(false);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const initializedRef = useRef(false);
  const currentRoomIdRef = useRef('');
  const chatViewportRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteConnectionIdRef = useRef<string | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const makingOfferRef = useRef(false);

  const loadRoomData = async () => {
    try {
      const roomData = await RoomService.getRoom(roomId);
      setRoom(roomData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load room');
    }
  };

  const setupLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsMicOn(true);
      setIsCameraOn(true);
      setMediaWarning('');
    } catch {
      try {
        const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = audioOnly;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = audioOnly;
        }
        setIsMicOn(true);
        setIsCameraOn(false);
        setMediaWarning('Camera is unavailable. You can still practice with audio and chat.');
      } catch {
        localStreamRef.current = new MediaStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        setIsMicOn(false);
        setIsCameraOn(false);
        setMediaWarning('Camera and microphone are blocked. You can still stay in the room and use chat.');
      }
    }
  };

  const tryPlayRemoteMedia = () => {
    remoteVideoRef.current?.play().catch(() => {});
    remoteAudioRef.current?.play().catch(() => {});
  };

  const cleanupPeer = () => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    pendingCandidatesRef.current = [];
    remoteConnectionIdRef.current = null;
    setHasRemoteStream(false);
    setRemoteUserName('Partner');
    setRemoteMicOn(true);
    setRemoteCameraOn(true);
  };

  const cleanupAllMedia = () => {
    cleanupPeer();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  };

  const ensurePeer = () => {
    if (peerRef.current) return peerRef.current;

    const pc = new RTCPeerConnection(rtcConfig);
    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      const inbound = event.streams[0];
      if (!inbound) return;

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }

      inbound.getTracks().forEach((track) => {
        remoteStreamRef.current!.addTrack(track);
      });

      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStreamRef.current;
      tryPlayRemoteMedia();
      setHasRemoteStream(true);
      setPartnerLeft(false);
    };

    pc.onicecandidate = async (event) => {
      if (!event.candidate || !connectionRef.current || !remoteConnectionIdRef.current) return;

      try {
        await connectionRef.current.invoke(
          'SendIceCandidate',
          roomId,
          remoteConnectionIdRef.current,
          JSON.stringify(event.candidate.toJSON()),
        );
      } catch {}
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') setHasRemoteStream(true);
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) setHasRemoteStream(false);
    };

    peerRef.current = pc;
    return pc;
  };

  const flushPendingCandidates = async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;

    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {}
    }
    pendingCandidatesRef.current = [];
  };

  const createAndSendOffer = async () => {
    if (!connectionRef.current || !remoteConnectionIdRef.current) return;
    const pc = ensurePeer();

    if (makingOfferRef.current) return;
    makingOfferRef.current = true;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await connectionRef.current.invoke(
        'SendOffer',
        roomId,
        remoteConnectionIdRef.current,
        JSON.stringify(offer),
      );
    } finally {
      makingOfferRef.current = false;
    }
  };

  const syncMediaState = async (nextMicOn: boolean, nextCameraOn: boolean) => {
    if (!connectionRef.current) return;
    try {
      await connectionRef.current.invoke('UpdateMediaState', roomId, nextMicOn, nextCameraOn);
    } catch {}
  };

  const connectToHub = async () => {
    const token = AuthStorage.getAccessToken();
    const baseUrl = getApiOrigin();

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/room`, {
        accessTokenFactory: () => token || '',
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on('ReceiveMessage', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    newConnection.on('UserJoined', (data: UserJoined) => {
      setPartnerLeft(false);
      setMessages((prev) => [
        ...prev,
        { userId: 'system', username: 'System', message: `${data.username} joined the room`, sentAt: data.joinedAt },
      ]);
      void loadRoomData();
    });

    newConnection.on('UserLeft', (data: UserLeft) => {
      setMessages((prev) => [
        ...prev,
        { userId: 'system', username: 'System', message: `${data.username} left the room`, sentAt: data.leftAt },
      ]);
      void loadRoomData();
    });

    newConnection.on('PartnerLeft', (data: { Message?: string; message?: string }) => {
      setPartnerLeft(true);
      cleanupPeer();
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: data.Message || data.message || 'Your partner has left the room',
          sentAt: new Date().toISOString(),
        },
      ]);
      void loadRoomData();
    });

    newConnection.on('RoomMatched', (data: { message?: string }) => {
      setPartnerLeft(false);
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: data.message || 'Partner found. Start speaking.',
          sentAt: new Date().toISOString(),
        },
      ]);
      void loadRoomData();
    });

    newConnection.on('PeerJoined', async (data: PeerJoinedEvent) => {
      remoteConnectionIdRef.current = data.connectionId;
      setRemoteUserName(data.username);
      setPartnerLeft(false);
      ensurePeer();
      await syncMediaState(isMicOn, isCameraOn);
      if (room?.status === RoomStatus.Active) {
        await createAndSendOffer();
      }
    });

    newConnection.on('PeerDisconnected', (data: PeerDisconnectedEvent) => {
      if (remoteConnectionIdRef.current && data.connectionId !== remoteConnectionIdRef.current) return;
      cleanupPeer();
    });

    newConnection.on('ReceiveOffer', async (data: SignalOfferEvent) => {
      remoteConnectionIdRef.current = data.fromConnectionId;
      setRemoteUserName(data.fromUsername);

      const pc = ensurePeer();
      const offer = JSON.parse(data.sdp) as RTCSessionDescriptionInit;
      await pc.setRemoteDescription(offer);
      await flushPendingCandidates(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (connectionRef.current) {
        await connectionRef.current.invoke('SendAnswer', roomId, data.fromConnectionId, JSON.stringify(answer));
      }
    });

    newConnection.on('ReceiveAnswer', async (data: SignalAnswerEvent) => {
      const pc = ensurePeer();
      const answer = JSON.parse(data.sdp) as RTCSessionDescriptionInit;
      await pc.setRemoteDescription(answer);
      await flushPendingCandidates(pc);
    });

    newConnection.on('ReceiveIceCandidate', async (data: SignalIceCandidateEvent) => {
      const pc = ensurePeer();
      const candidate = JSON.parse(data.candidate) as RTCIceCandidateInit;

      if (!pc.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }

      try {
        await pc.addIceCandidate(candidate);
      } catch {}
    });

    newConnection.on('PeerMediaStateChanged', (data: PeerMediaStateChangedEvent) => {
      setRemoteMicOn(data.isMicOn);
      setRemoteCameraOn(data.isCameraOn);
    });

    try {
      await newConnection.start();
      connectionRef.current = newConnection;
      setIsConnected(true);
      await newConnection.invoke('JoinRoomGroup', roomId);
      await syncMediaState(isMicOn, isCameraOn);
    } catch {
      setError('Failed to connect to call service');
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !connectionRef.current) return;

    try {
      await connectionRef.current.invoke('SendMessage', roomId, messageInput);
      setMessageInput('');
    } catch {}
  };

  const toggleMic = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !isMicOn;
    let audioTracks = stream.getAudioTracks();

    if (next && audioTracks.length === 0) {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const micTrack = micStream.getAudioTracks()[0];
        let didAddNewSender = false;

        if (micTrack) {
          stream.addTrack(micTrack);
          const pc = peerRef.current;
          if (pc) {
            const sender = pc.getSenders().find((s) => s.track?.kind === 'audio');
            if (sender) await sender.replaceTrack(micTrack);
            else {
              pc.addTrack(micTrack, stream);
              didAddNewSender = true;
            }
          }
        }

        if (didAddNewSender && remoteConnectionIdRef.current) await createAndSendOffer();
        audioTracks = stream.getAudioTracks();
      } catch {
        setMediaWarning('Cannot access microphone on this device.');
        return;
      }
    }

    audioTracks.forEach((track) => {
      track.enabled = next;
    });
    setIsMicOn(next);
    await syncMediaState(next, isCameraOn);
    setMediaWarning('');
  };

  const toggleCamera = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !isCameraOn;
    let videoTracks = stream.getVideoTracks();

    if (next && videoTracks.length === 0) {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const cameraTrack = cameraStream.getVideoTracks()[0];
        let didAddNewSender = false;

        if (cameraTrack) {
          stream.addTrack(cameraTrack);
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          const pc = peerRef.current;
          if (pc) {
            const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
            if (sender) await sender.replaceTrack(cameraTrack);
            else {
              pc.addTrack(cameraTrack, stream);
              didAddNewSender = true;
            }
          }
        }

        if (didAddNewSender && remoteConnectionIdRef.current) await createAndSendOffer();
        videoTracks = stream.getVideoTracks();
      } catch {
        setMediaWarning('Cannot access camera on this device.');
        return;
      }
    }

    videoTracks.forEach((track) => {
      track.enabled = next;
    });
    setIsCameraOn(next);
    await syncMediaState(isMicOn, next);
    setMediaWarning('');
  };

  const handleLeaveRoom = async () => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.invoke('LeaveRoomGroup', roomId);
        await connectionRef.current.stop();
        connectionRef.current = null;
      }
      cleanupAllMedia();
      await RoomService.leaveRoom(roomId);
    } finally {
      router.push('/speaking');
    }
  };

  const handleStartRoom = async () => {
    try {
      const updatedRoom = await RoomService.startRoom(roomId);
      setRoom(updatedRoom);
      if (remoteConnectionIdRef.current) await createAndSendOffer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start room');
    }
  };

  useEffect(() => {
    const initializeRoom = async () => {
      await loadRoomData();
      await setupLocalMedia();
      await connectToHub();
    };

    const localVideoEl = localVideoRef.current;
    if (currentRoomIdRef.current !== roomId) {
      initializedRef.current = false;
      currentRoomIdRef.current = roomId;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;
    void initializeRoom();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      cleanupPeer();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      if (localVideoEl) localVideoEl.srcObject = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    const onBeforeUnload = () => {
      const token = AuthStorage.getAccessToken();
      if (!token) return;

      fetch(`${API_BASE_URL}/room/${roomId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [roomId]);

  useEffect(() => {
    chatViewportRef.current?.scrollTo({ top: chatViewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const roomEnded = room?.status === RoomStatus.Completed || room?.status === RoomStatus.Cancelled || partnerLeft;
  const isWaiting = room?.status === RoomStatus.Waiting && !roomEnded;
  const canStart = room?.status === RoomStatus.Waiting && room.participantCount >= 2;
  const formattedLevel = room?.targetLevel ?? 'N/A';
  const roomCode = room?.id.slice(0, 8).toUpperCase() ?? '...';

  const topic = useMemo(() => getTopicForLevel(room?.targetLevel), [room?.targetLevel]);

  if (error) {
    return (
      <RoomStandalone>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center">
          <div className="rounded-xl border border-[#ffdad6] bg-white p-8 text-[#93000a] shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <h1 className="torisho-display text-3xl font-bold">Unable to open room</h1>
            <p className="mt-3">{error}</p>
            <Link
              href="/speaking"
              className="mt-6 inline-flex rounded-full bg-[#f5a623] px-7 py-3 font-bold text-[#291800] no-underline"
            >
              Back to Speaking
            </Link>
          </div>
        </div>
      </RoomStandalone>
    );
  }

  if (!room) {
    return (
      <RoomStandalone>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-[#d7c3ae] bg-white px-6 py-4 text-[#835500]">
            <IconLoader2 className="animate-spin" size={22} /> Loading room...
          </div>
        </div>
      </RoomStandalone>
    );
  }

  return (
    <RoomStandalone>
      <div className="flex h-screen flex-col overflow-hidden bg-[#fff8f4] text-[#211a12]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#d7c3ae] bg-white px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/speaking" className="torisho-display text-3xl font-bold text-[#835500] no-underline">
              Torisho
            </Link>
            <span className="hidden h-5 w-px bg-[#d7c3ae] sm:block" />
            <span className="truncate text-lg text-[#3d2a17]">Room #{roomCode}</span>
            <span className="hidden rounded-full bg-[#007165] px-3 py-1 text-sm font-bold text-white md:inline-flex">
              {formattedLevel} Practice
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 font-bold text-[#ba1a1a] sm:flex">
              <IconCircleFilled size={18} /> {room.startedAt ? formatDuration(room.startedAt) : '00:00'}
            </div>
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="flex h-11 items-center gap-2 rounded-full border border-[#ba1a1a] px-5 font-bold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
            >
              <IconLogout size={18} /> Leave
            </button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="relative min-h-[55vh] flex-1 overflow-hidden bg-[#211a12] xl:min-h-0">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`absolute inset-0 h-full w-full object-cover ${hasRemoteStream && remoteCameraOn && !roomEnded ? 'opacity-100' : 'opacity-0'}`}
            />
            <audio ref={remoteAudioRef} autoPlay playsInline />

            {isWaiting && (
              <WaitingOverlay
                canStart={canStart}
                mediaWarning={mediaWarning}
                onStart={handleStartRoom}
                onLeave={handleLeaveRoom}
              />
            )}

            {roomEnded && (
              <PartnerLeftOverlay onFindNew={handleLeaveRoom} onLeave={handleLeaveRoom} />
            )}

            {!isWaiting && !roomEnded && (!hasRemoteStream || !remoteCameraOn) && (
              <VideoPlaceholder
                name={remoteUserName}
                subtitle={remoteCameraOn ? 'Waiting for partner video...' : 'Partner camera is off'}
              />
            )}

            {!isWaiting && !roomEnded && (
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-[#d7c3ae] bg-white/90 px-4 py-3 text-[#211a12] shadow-sm backdrop-blur">
                <span className="font-bold">{remoteUserName}</span>
                {remoteMicOn ? <IconMicrophone size={17} className="text-[#007165]" /> : <IconMicrophoneOff size={17} className="text-[#ba1a1a]" />}
              </div>
            )}

            <LocalPreview isCameraOn={isCameraOn} localVideoRef={localVideoRef} currentUserName={currentUser?.username ?? 'You'} />

            <CallControls
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              roomEnded={roomEnded}
              onToggleMic={toggleMic}
              onToggleCamera={toggleCamera}
              onLeave={handleLeaveRoom}
            />
          </section>

          <aside className="flex min-h-0 w-full flex-col border-l border-[#d7c3ae] bg-white xl:w-[420px]">
            <ChatPanel
              messages={messages}
              messageInput={messageInput}
              isConnected={isConnected}
              currentUserId={currentUser?.id}
              viewportRef={chatViewportRef}
              onMessageInput={setMessageInput}
              onSend={sendMessage}
            />
          </aside>
        </main>

        <TopicDock topic={topic} />
      </div>
    </RoomStandalone>
  );
}

function RoomStandalone({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#fff8f4]">{children}</div>;
}

function WaitingOverlay({
  canStart,
  mediaWarning,
  onStart,
  onLeave,
}: {
  canStart: boolean;
  mediaWarning: string;
  onStart: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fff8f4]/90 p-8 text-center backdrop-blur">
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-[#d7c3ae] bg-white text-[#835500] shadow-sm">
        <div className="absolute -inset-4 animate-ping rounded-full border-2 border-[#f5a623]/25" />
        <IconUsers size={54} stroke={1.5} />
      </div>
      <h1 className="torisho-display text-4xl font-bold">Waiting for your partner to join</h1>
      <p className="mt-3 max-w-xl text-lg text-[#665744]">
        Take a deep breath and review your notes. The room controls are ready.
      </p>
      {mediaWarning && (
        <p className="mt-5 max-w-xl rounded-lg border border-[#d7c3ae] bg-white px-5 py-3 text-[#3d2a17]">
          {mediaWarning}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {canStart && (
          <button
            type="button"
            onClick={onStart}
            className="h-12 rounded-full bg-[#f5a623] px-8 font-bold text-[#291800] transition hover:bg-[#ffb955]"
          >
            Start Session
          </button>
        )}
        <button
          type="button"
          onClick={onLeave}
          className="h-12 rounded-full border border-[#ba1a1a] px-8 font-bold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

function PartnerLeftOverlay({
  onFindNew,
  onLeave,
}: {
  onFindNew: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#fff8f4]/95 p-8 text-center backdrop-blur">
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-[#d7c3ae] bg-[#fff1e4] text-[#835500]">
        <IconUser size={50} stroke={1.5} />
      </div>
      <h1 className="torisho-display max-w-xl text-4xl font-bold">Your partner has left the room</h1>
      <p className="mt-4 max-w-xl text-lg text-[#3d2a17]">
        The practice session has ended. You can find another partner or return to the speaking lobby.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onFindNew}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#f5a623] px-8 font-bold text-[#291800] transition hover:bg-[#ffb955]"
        >
          <IconSearch size={20} /> Find New Partner
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="h-12 rounded-full border border-[#d7c3ae] px-8 font-bold text-[#3d2a17] transition hover:bg-white"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

function VideoPlaceholder({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#211a12] text-white">
      <div className="text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#f5a623] text-6xl font-bold text-[#291800]">
          {name.charAt(0).toUpperCase() || 'P'}
        </div>
        <p className="mt-5 text-2xl font-bold">{name}</p>
        <p className="mt-2 text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}

function LocalPreview({
  isCameraOn,
  localVideoRef,
  currentUserName,
}: {
  isCameraOn: boolean;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  currentUserName: string;
}) {
  return (
    <div className="absolute bottom-24 right-5 z-30 aspect-video w-48 overflow-hidden rounded-xl border-2 border-white bg-[#211a12] shadow-lg md:w-64">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className={`h-full w-full object-cover ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
      />
      {!isCameraOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#211a12] text-white">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faebdd] text-2xl font-bold text-[#835500]">
              {currentUserName.charAt(0).toUpperCase() || 'Y'}
            </div>
            <p className="mt-2 text-sm">Camera off</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-bold text-[#211a12]">You</div>
    </div>
  );
}

function CallControls({
  isMicOn,
  isCameraOn,
  roomEnded,
  onToggleMic,
  onToggleCamera,
  onLeave,
}: {
  isMicOn: boolean;
  isCameraOn: boolean;
  roomEnded: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
}) {
  return (
    <div className={`absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d7c3ae] bg-white/95 px-5 py-3 shadow-lg backdrop-blur ${roomEnded ? 'opacity-60' : ''}`}>
      <ControlButton label="Microphone" onClick={onToggleMic} active={isMicOn} disabled={roomEnded}>
        {isMicOn ? <IconMicrophone size={22} /> : <IconMicrophoneOff size={22} />}
      </ControlButton>
      <ControlButton label="Camera" onClick={onToggleCamera} active={isCameraOn} disabled={roomEnded}>
        {isCameraOn ? <IconCamera size={22} /> : <IconCameraOff size={22} />}
      </ControlButton>
      <ControlButton label="Captions" disabled>
        <IconSubtitles size={22} />
      </ControlButton>
      <ControlButton label="Chat" active disabled>
        <IconMessage size={22} />
      </ControlButton>
      <ControlButton label="Settings" disabled>
        <IconSettings size={22} />
      </ControlButton>
      <button
        type="button"
        onClick={onLeave}
        className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#ba1a1a] text-white transition hover:bg-[#93000a]"
        aria-label="End call"
      >
        <IconPhoneOff size={23} />
      </button>
    </div>
  );
}

function ControlButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
        active ? 'bg-[#f5a623] text-[#291800]' : 'bg-[#fff1e4] text-[#3d2a17] hover:bg-[#eee0d2]'
      } disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function ChatPanel({
  messages,
  messageInput,
  isConnected,
  currentUserId,
  viewportRef,
  onMessageInput,
  onSend,
}: {
  messages: ChatMessage[];
  messageInput: string;
  isConnected: boolean;
  currentUserId?: string;
  viewportRef: RefObject<HTMLDivElement | null>;
  onMessageInput: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <>
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#d7c3ae] px-6">
        <h2 className="torisho-display text-3xl font-bold">Room Chat</h2>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${isConnected ? 'bg-[#62fae3] text-[#00201c]' : 'bg-[#eee0d2] text-[#665744]'}`}>
            {isConnected ? 'Connected' : 'Connecting'}
          </span>
          <IconDots size={23} />
        </div>
      </div>
      <div ref={viewportRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#fff8f4] p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-[#665744]">
            <p>No messages yet. Say hello when your partner joins.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble key={`${message.sentAt}-${index}`} message={message} isMine={message.userId === currentUserId} />
          ))
        )}
      </div>
      <div className="shrink-0 border-t border-[#d7c3ae] bg-white p-4">
        <div className="flex items-end gap-3 rounded-xl border border-[#d7c3ae] bg-[#fff1e4] p-2 focus-within:border-[#f5a623]">
          <button type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#665744]">
            <IconPlus size={22} />
          </button>
          <textarea
            value={messageInput}
            onChange={(event) => onMessageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            disabled={!isConnected}
            placeholder="Type message or Romaji..."
            rows={1}
            className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!isConnected || !messageInput.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#835500] text-white disabled:opacity-50"
          >
            <IconSend size={19} />
          </button>
        </div>
        <p className="mt-2 text-xs text-[#665744]">Romaji auto-conversion can be added here when the BE supports it.</p>
      </div>
    </>
  );
}

function ChatBubble({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  if (message.userId === 'system') {
    return (
      <div className="text-center">
        <span className="rounded-full border border-[#d7c3ae] bg-white px-3 py-1 text-xs font-bold text-[#665744]">
          {message.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] ${isMine ? 'text-right' : 'text-left'}`}>
        <p className="mb-1 text-xs text-[#665744]">
          {isMine ? formatTime(message.sentAt) : `${message.username} - ${formatTime(message.sentAt)}`}
        </p>
        <div
          className={`rounded-xl px-5 py-4 shadow-sm ${
            isMine
              ? 'rounded-br-none bg-[#f5a623] text-[#291800]'
              : 'rounded-bl-none border border-[#d7c3ae] bg-[#faebdd] text-[#211a12]'
          }`}
        >
          <p className="leading-relaxed">{message.message}</p>
        </div>
      </div>
    </div>
  );
}

function TopicDock({ topic }: { topic: ReturnType<typeof getTopicForLevel> }) {
  return (
    <div className="hidden border-t border-[#d7c3ae] bg-white px-8 py-4 xl:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">Current Topic</p>
          <h3 className="torisho-display text-2xl font-bold">{topic.title}</h3>
          <p className="text-[#665744]">{topic.description}</p>
        </div>
        <div className="flex gap-2">
          {topic.words.map((word) => (
            <span key={word.jp} className="rounded-lg border border-[#d7c3ae] bg-[#fff1e4] px-3 py-2">
              <span className="torisho-jp mr-2 text-lg">{word.jp}</span>
              <span className="text-sm text-[#665744]">{word.en}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTopicForLevel(level?: string) {
  if (level === 'N4') {
    return {
      title: 'Weekend Plans',
      description: 'Practice talking about places, schedules, and invitations.',
      words: [
        { jp: '映画館', en: 'movie theater' },
        { jp: '買い物', en: 'shopping' },
        { jp: '楽しみ', en: 'looking forward to' },
      ],
    };
  }

  return {
    title: 'Self Introduction',
    description: 'Practice asking and answering basic questions about yourself.',
    words: [
      { jp: '名前', en: 'name' },
      { jp: '趣味', en: 'hobby' },
      { jp: '日本語', en: 'Japanese' },
    ],
  };
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(startedAt: string) {
  const diff = Math.max(0, Date.now() - new Date(startedAt).getTime());
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
