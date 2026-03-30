'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as signalR from '@microsoft/signalr';
import { Room, ChatMessage, UserJoined, UserLeft, RoomStatus } from '@/src/types/room';
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
  ThemeIcon,
  Title,
  ActionIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconAlertCircle,
  IconDoorExit,
  IconMessageCircle,
  IconMicrophone,
  IconRocket,
  IconSend,
  IconTarget,
  IconUsers,
  IconVideo,
} from '@tabler/icons-react';
import DashboardHeader from './DashboardHeader';

interface VideoCallRoomProps {
  roomId: string;
}

export default function VideoCallRoom({ roomId }: VideoCallRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const initializedRef = useRef(false);
  const currentRoomIdRef = useRef<string>('');
  const viewportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadRoomData = async () => {
    try {
      const roomData = await RoomService.getRoom(roomId);
      setRoom(roomData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load room');
    }
  };

  const initializeRoom = async () => {
    await loadRoomData();
    await connectToHub();
  };

  const connectToHub = async () => {
    const token = AuthStorage.getAccessToken();
    // SignalR hub is at /hubs/room (without /api prefix)
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
          message: data.message || 'Partner found! Start speaking!',
          sentAt: new Date().toISOString(),
        },
      ]);
      loadRoomData();
    });

    try {
      await newConnection.start();
      setIsConnected(true);
      connectionRef.current = newConnection;

      await newConnection.invoke('JoinRoomGroup', roomId);
    } catch (err) {
      console.error('SignalR connection error:', err);
      setError('Failed to connect to chat');
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !connectionRef.current) return;

    try {
      await connectionRef.current.invoke('SendMessage', roomId, messageInput);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.invoke('LeaveRoomGroup', roomId);
        await connectionRef.current.stop();
        connectionRef.current = null;
      }
      await RoomService.leaveRoom(roomId);
      router.push('/adventure');
    } catch (err) {
      console.error('Failed to leave room:', err);
      router.push('/adventure');
    }
  };

  const handleStartRoom = async () => {
    try {
      const updatedRoom = await RoomService.startRoom(roomId);
      setRoom(updatedRoom);
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
          <Button
            component={Link}
            href="/adventure"
            variant="subtle"
            color="gray"
            radius="xl"
            leftSection={<IconArrowLeft size={16} />}
            mb="lg"
          >
            Back to Adventure
          </Button>
          <Alert icon={<IconAlertCircle size="1.1rem" />} title="Error" color="red" variant="light" radius="md">
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
          <Button
            component={Link}
            href="/adventure"
            variant="subtle"
            color="gray"
            radius="xl"
            leftSection={<IconArrowLeft size={16} stroke={1.5} />}
          >
            Back
          </Button>

          <Button
            onClick={handleLeaveRoom}
            radius="xl"
            color="red"
            variant="light"
            leftSection={<IconDoorExit size={16} stroke={1.5} />}
            className="font-semibold"
          >
            Leave Room
          </Button>
        </div>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ThemeIcon size={40} radius="xl" variant="light" color="blue">
                <IconMicrophone size={18} stroke={1.8} />
              </ThemeIcon>
              <div>
                <Title order={3} className="text-xl font-bold text-gray-900">Speaking Room</Title>
                <Text size="sm" className="text-gray-500">Room ID: {room.id.slice(0, 8)}...</Text>
              </div>
            </div>

            <Group gap="xs">
              <Badge radius="xl" variant="light" color="blue" leftSection={<IconTarget size={12} />}>
                {formattedLevel}
              </Badge>
              <Badge radius="xl" variant="light" color={statusMeta.color}>
                {statusMeta.label}
              </Badge>
              <Badge radius="xl" variant="light" color="gray" leftSection={<IconUsers size={12} />}>
                {room.participantCount}/{room.maxParticipants}
              </Badge>
            </Group>
          </div>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="md" h="100%">
                <Paper
                  radius="lg"
                  withBorder
                  className="flex min-h-[420px] items-center justify-center bg-gray-900 text-white sm:min-h-[500px]"
                >
                  <Stack align="center" gap="xs">
                    <ThemeIcon size={72} radius="100%" variant="light" color="gray">
                      <IconVideo size={34} />
                    </ThemeIcon>
                    <Title order={4} c="white">Video Call Area</Title>
                    <Text size="sm" c="gray.4">WebRTC integration needed</Text>
                  </Stack>
                </Paper>

                {room.status === RoomStatus.Waiting && (
                  <Alert color="orange" variant="light" radius="md" icon={<Loader size="0.9rem" />}>
                    Waiting for another participant...
                  </Alert>
                )}

                {room.status === RoomStatus.Active && room.participantCount === 2 && (
                  <Alert color="green" variant="light" radius="md" icon={<IconMicrophone size="1rem" />}>
                    Session is active. You can start speaking now.
                  </Alert>
                )}

                {room.status === RoomStatus.Waiting && room.participantCount === 2 && (
                  <Button
                    fullWidth
                    size="md"
                    radius="xl"
                    onClick={handleStartRoom}
                    leftSection={<IconRocket size={18} />}
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
                  <Group gap="xs">
                    <IconMessageCircle size={17} className="text-gray-600" />
                    <Text size="sm" fw={600} className="text-gray-800">Chat</Text>
                  </Group>
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
                            <Divider
                              my="xs"
                              label={<Text size="xs" c="dimmed">{msg.message}</Text>}
                              labelPosition="center"
                            />
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
                      <IconSend size={16} />
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
