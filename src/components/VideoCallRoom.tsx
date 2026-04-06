'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as signalR from '@microsoft/signalr';
import {
  Room,
  ChatMessage,
  UserJoined,
  UserLeft,
  RoomStatus,
  JoinedRoomEvent,
  PeerJoinedEvent,
  PeerDisconnectedEvent,
  SignalOfferEvent,
  SignalAnswerEvent,
  SignalIceCandidateEvent,
  PeerMediaStateChangedEvent,
} from '@/src/types/room';
import { RoomService } from '@/src/services/room.service';
import { AuthStorage } from '@/src/libs/auth-storage';
import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Grid,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  ActionIcon,
} from '@mantine/core';
import DashboardHeader from './DashboardHeader';

interface VideoCallRoomProps {
  roomId: string;
}

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  ],
};

export default function VideoCallRoom({ roomId }: VideoCallRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);
  const [remoteUserName, setRemoteUserName] = useState('Partner');
  const [hasRemoteStream, setHasRemoteStream] = useState(false);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const initializedRef = useRef(false);
  const currentRoomIdRef = useRef<string>('');
  const viewportRef = useRef<HTMLDivElement>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteConnectionIdRef = useRef<string | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const makingOfferRef = useRef(false);

  const router = useRouter();

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
      return;
    } catch {
      const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = audioOnly;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = audioOnly;
      }
      setIsMicOn(true);
      setIsCameraOn(false);
    }
  };

  const cleanupPeer = () => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());
    remoteStreamRef.current = null;
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingCandidatesRef.current = [];
    remoteConnectionIdRef.current = null;
    setHasRemoteStream(false);
    setRemoteUserName('Partner');
    setRemoteMicOn(true);
    setRemoteCameraOn(true);
  };

  const cleanupAllMedia = () => {
    cleanupPeer();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const ensurePeer = () => {
    if (peerRef.current) return peerRef.current;

    const pc = new RTCPeerConnection(rtcConfig);

    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    const localStream = localStreamRef.current;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      const inbound = event.streams[0];
      if (!inbound) return;

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }

      inbound.getTracks().forEach((track) => {
        remoteStreamRef.current!.addTrack(track);
      });

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }

      setHasRemoteStream(true);
    };

    pc.onicecandidate = async (event) => {
      if (!event.candidate) return;
      if (!connectionRef.current || !remoteConnectionIdRef.current) return;

      try {
        await connectionRef.current.invoke(
          'SendIceCandidate',
          roomId,
          remoteConnectionIdRef.current,
          JSON.stringify(event.candidate.toJSON())
        );
      } catch {
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        setHasRemoteStream(true);
      }
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setHasRemoteStream(false);
      }
    };

    peerRef.current = pc;
    return pc;
  };

  const flushPendingCandidates = async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;
    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
      }
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
        JSON.stringify(offer)
      );
    } finally {
      makingOfferRef.current = false;
    }
  };

  const connectToHub = async () => {
    const token = AuthStorage.getAccessToken();
    const baseUrl = (process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5118/api').replace('/api', '');

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
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: `${data.username} joined the room`,
          sentAt: data.joinedAt,
        },
      ]);
      loadRoomData();
    });

    newConnection.on('UserLeft', (data: UserLeft) => {
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: `${data.username} left the room`,
          sentAt: data.leftAt,
        },
      ]);
      loadRoomData();
    });

    newConnection.on('PartnerLeft', (data: { Message?: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: data.Message || 'Your partner has left the room',
          sentAt: new Date().toISOString(),
        },
      ]);
      loadRoomData();
    });

    newConnection.on('RoomMatched', (data: { message?: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          userId: 'system',
          username: 'System',
          message: data.message || 'Partner found. Start speaking.',
          sentAt: new Date().toISOString(),
        },
      ]);
      loadRoomData();
    });

    newConnection.on('JoinedRoom', (data: JoinedRoomEvent) => {
    });

    newConnection.on('PeerJoined', async (data: PeerJoinedEvent) => {
      remoteConnectionIdRef.current = data.connectionId;
      setRemoteUserName(data.username);
      ensurePeer();

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
        await connectionRef.current.invoke(
          'SendAnswer',
          roomId,
          data.fromConnectionId,
          JSON.stringify(answer)
        );
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
      } catch {
      }
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
    } catch {
      setError('Failed to connect to call service');
    }
  };

  const initializeRoom = async () => {
    await loadRoomData();
    await setupLocalMedia();
    await connectToHub();
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !connectionRef.current) return;

    try {
      await connectionRef.current.invoke('SendMessage', roomId, messageInput);
      setMessageInput('');
    } catch {
    }
  };

  const syncMediaState = async (nextMicOn: boolean, nextCameraOn: boolean) => {
    if (!connectionRef.current) return;
    try {
      await connectionRef.current.invoke('UpdateMediaState', roomId, nextMicOn, nextCameraOn);
    } catch {
    }
  };

  const toggleMic = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !isMicOn;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setIsMicOn(next);
    await syncMediaState(next, isCameraOn);
  };

  const toggleCamera = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !isCameraOn;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    setIsCameraOn(next);
    await syncMediaState(isMicOn, next);
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
      router.push('/adventure');
    } catch {
      router.push('/adventure');
    }
  };

  const handleStartRoom = async () => {
    try {
      const updatedRoom = await RoomService.startRoom(roomId);
      setRoom(updatedRoom);

      if (remoteConnectionIdRef.current) {
        await createAndSendOffer();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start room');
    }
  };

  useEffect(() => {
    if (currentRoomIdRef.current !== roomId) {
      initializedRef.current = false;
      currentRoomIdRef.current = roomId;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    initializeRoom();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      cleanupAllMedia();
    };
  }, [roomId]);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const getStatusMeta = () => {
    switch (room?.status) {
      case RoomStatus.Waiting:
        return { label: 'Waiting', color: 'orange' as const };
      case RoomStatus.Active:
        return { label: 'Active', color: 'green' as const };
      case RoomStatus.Completed:
        return { label: 'Completed', color: 'blue' as const };
      case RoomStatus.Cancelled:
        return { label: 'Cancelled', color: 'red' as const };
      default:
        return { label: 'Unknown', color: 'gray' as const };
    }
  };

  const statusMeta = getStatusMeta();
  const formattedLevel = room?.targetLevel ?? 'N/A';

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <Container size="md" className="pt-10">
          <Button component={Link} href="/adventure" variant="subtle" color="gray" radius="xl" mb="lg">
            Back to Adventure
          </Button>
          <Alert title="Error" color="red" variant="light" radius="md">
            {error}
          </Alert>
        </Container>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <Center h="calc(100vh - 64px)">
          <Stack align="center" gap="sm">
            <Loader size="md" color="blue" />
            <Text size="sm" c="dimmed">Loading room...</Text>
          </Stack>
        </Center>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <Container size="xl" className="max-w-[1200px] px-5 pb-12 pt-8 sm:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Button component={Link} href="/adventure" variant="subtle" color="gray" radius="xl">
            Back
          </Button>

          <Button onClick={handleLeaveRoom} radius="xl" color="red" variant="light" className="font-semibold">
            Leave Room
          </Button>
        </div>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Title order={3} className="text-xl font-bold text-gray-900">Speaking Room</Title>
              <Text size="sm" className="text-gray-500">Room ID: {room.id.slice(0, 8)}...</Text>
            </div>

            <Group gap="xs">
              <Badge radius="xl" variant="light" color="blue">
                {formattedLevel}
              </Badge>
              <Badge radius="xl" variant="light" color={statusMeta.color}>
                {statusMeta.label}
              </Badge>
              <Badge radius="xl" variant="light" color="gray">
                {room.participantCount}/{room.maxParticipants}
              </Badge>
            </Group>
          </div>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="md" h="100%">
                <Paper radius="lg" withBorder className="relative overflow-hidden bg-black min-h-[420px] sm:min-h-[500px]">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />

                  {!hasRemoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                      <div className="text-center">
                        <p className="text-base font-semibold">{remoteUserName}</p>
                        <p className="text-sm text-gray-300">Waiting for media stream...</p>
                      </div>
                    </div>
                  )}

                  {!remoteCameraOn && hasRemoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <p className="text-sm">Partner camera is off</p>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-xl border border-white/30 bg-black">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`h-full w-full object-cover ${!isCameraOn ? 'opacity-20' : 'opacity-100'}`}
                    />
                    {!isCameraOn && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
                        Camera off
                      </div>
                    )}
                  </div>
                </Paper>

                <Paper withBorder radius="lg" p="sm" className="bg-gray-50">
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Button radius="xl" variant={isMicOn ? 'filled' : 'light'} onClick={toggleMic}>
                        {isMicOn ? 'Mic on' : 'Mic off'}
                      </Button>
                      <Button radius="xl" variant={isCameraOn ? 'filled' : 'light'} onClick={toggleCamera}>
                        {isCameraOn ? 'Camera on' : 'Camera off'}
                      </Button>
                    </Group>

                    <Text size="sm" c="dimmed">
                      Partner: {remoteMicOn ? 'Mic on' : 'Mic off'} | {remoteCameraOn ? 'Camera on' : 'Camera off'}
                    </Text>
                  </Group>
                </Paper>

                {room.status === RoomStatus.Waiting && (
                  <Alert color="orange" variant="light" radius="md">
                    Waiting for another participant...
                  </Alert>
                )}

                {room.status === RoomStatus.Active && room.participantCount === 2 && (
                  <Alert color="green" variant="light" radius="md">
                    Session is active. You can start speaking now.
                  </Alert>
                )}

                {room.status === RoomStatus.Waiting && room.participantCount === 2 && (
                  <Button
                    fullWidth
                    size="md"
                    radius="xl"
                    onClick={handleStartRoom}
                    className="h-11 bg-green-600 font-semibold text-white hover:bg-green-700"
                  >
                    Start Session
                  </Button>
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Paper radius="lg" withBorder className="flex h-full min-h-[420px] flex-col overflow-hidden sm:min-h-[500px]">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <Text size="sm" fw={600} className="text-gray-800">Chat</Text>
                  <Badge radius="xl" variant="light" color={isConnected ? 'green' : 'gray'}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>

                <ScrollArea flex={1} p="md" viewportRef={viewportRef}>
                  {messages.length === 0 ? (
                    <Center h="100%">
                      <Text size="sm" c="dimmed">No messages yet</Text>
                    </Center>
                  ) : (
                    <Stack gap="xs">
                      {messages.map((msg, idx) => (
                        <div key={idx}>
                          {msg.userId === 'system' ? (
                            <Divider my="xs" label={<Text size="xs" c="dimmed">{msg.message}</Text>} labelPosition="center" />
                          ) : (
                            <div>
                              <Group gap={6} mb={4}>
                                <Text size="xs" fw={600} c="dark.7">{msg.username}</Text>
                                <Text size={10} c="dimmed">
                                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              </Group>
                              <Paper p="sm" radius="md" bg="gray.0">
                                <Text size="sm">{msg.message}</Text>
                              </Paper>
                            </div>
                          )}
                        </div>
                      ))}
                    </Stack>
                  )}
                </ScrollArea>

                <div className="border-t border-gray-100 bg-gray-50 p-3">
                  <Group gap="sm" wrap="nowrap">
                    <TextInput
                      flex={1}
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!isConnected}
                      radius="xl"
                      size="sm"
                    />
                    <ActionIcon
                      size="lg"
                      radius="xl"
                      color="blue"
                      variant="filled"
                      onClick={sendMessage}
                      disabled={!isConnected || !messageInput.trim()}
                    >
                      Send
                    </ActionIcon>
                  </Group>
                </div>
              </Paper>
            </Grid.Col>
          </Grid>
        </section>
      </Container>
    </div>
  );
}
