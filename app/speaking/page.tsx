'use client';

import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconAlertCircle,
  IconArrowRight,
  IconCamera,
  IconInfoCircle,
  IconLoader2,
  IconMicrophone,
  IconSearch,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import LearningShell from '@/src/components/LearningShell';
import { useAuth } from '@/src/libs/useAuth';
import { RoomService } from '@/src/services/room.service';
import { JLPTLevel, Room, RoomStatus } from '@/src/types/room';

const levelDescriptions: Record<JLPTLevel, string> = {
  [JLPTLevel.N5]: 'Basic greetings, self-introduction, daily objects',
  [JLPTLevel.N4]: 'Everyday plans, requests, shopping, and simple opinions',
  [JLPTLevel.N3]: 'Work, travel, opinions, and longer everyday conversations',
  [JLPTLevel.N2]: 'Abstract topics, news, debate, and nuanced explanations',
  [JLPTLevel.N1]: 'Fluent discussion, advanced topics, and natural expression',
};

type LobbyState = 'idle' | 'permissions' | 'searching' | 'matched';

export default function SpeakingPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>(JLPTLevel.N5);
  const [lobbyState, setLobbyState] = useState<LobbyState>('idle');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const partner = useMemo(
    () => currentRoom?.participants.find((participant) => participant.userId !== user?.id) ?? null,
    [currentRoom?.participants, user?.id],
  );

  const stopPreview = useCallback(() => {
    previewStreamRef.current?.getTracks().forEach((track) => track.stop());
    previewStreamRef.current = null;
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
  }, []);

  const loadExistingRoom = useCallback(async () => {
    setIsCheckingRoom(true);
    try {
      const room = await RoomService.getCurrentRoom();
      if (!room) return;

      const roomAge = Date.now() - new Date(room.scheduledAt).getTime();
      const isFresh = roomAge < 30 * 60 * 1000;
      const isValid = [RoomStatus.Waiting, RoomStatus.Active].includes(room.status) && isFresh;

      if (!isValid) {
        await RoomService.leaveRoom(room.id).catch(() => {});
        return;
      }

      setCurrentRoom(room);
      setSelectedLevel(room.targetLevel ?? JLPTLevel.N5);
      setLobbyState(room.participantCount >= 2 || room.status === RoomStatus.Active ? 'matched' : 'searching');
    } finally {
      setIsCheckingRoom(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!loading && isAuthenticated) {
      void loadExistingRoom();
    }
  }, [isAuthenticated, loadExistingRoom, loading, router]);

  useEffect(() => {
    if (lobbyState !== 'searching' || !currentRoom?.id) return;

    const timer = window.setInterval(async () => {
      try {
        const room = await RoomService.getRoom(currentRoom.id);
        setCurrentRoom(room);
        if (room.participantCount >= 2 || room.status === RoomStatus.Active) {
          setLobbyState('matched');
        }
      } catch {
        setJoinError('Unable to refresh room status.');
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [currentRoom?.id, lobbyState]);

  useEffect(() => {
    const videoEl = previewVideoRef.current;
    return () => {
      previewStreamRef.current?.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;
      if (videoEl) {
        videoEl.srcObject = null;
      }
    };
  }, []);

  const startPreview = async () => {
    setIsPreviewLoading(true);
    setPermissionMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      previewStreamRef.current = stream;
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
      setPermissionMessage('Camera and microphone are ready. You can still join even if you turn them off later.');
    } catch {
      setPermissionMessage('Camera or microphone is blocked. You can still continue and use chat or enable devices later in the room.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const findPartner = async () => {
    setIsJoining(true);
    setJoinError(null);

    try {
      const result = await RoomService.findOrCreateRoom(selectedLevel);
      if (!result.room) {
        throw new Error(result.message || 'Unable to create speaking room.');
      }

      stopPreview();
      setCurrentRoom(result.room);
      setLobbyState(result.isMatched || result.room.participantCount >= 2 ? 'matched' : 'searching');
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Unable to find a partner.');
    } finally {
      setIsJoining(false);
    }
  };

  const cancelSearch = async () => {
    const roomId = currentRoom?.id;
    setCurrentRoom(null);
    setLobbyState('idle');
    if (roomId) {
      await RoomService.leaveRoom(roomId).catch(() => {});
    }
  };

  const joinRoom = () => {
    if (currentRoom?.id) {
      router.push(`/speaking/room/${currentRoom.id}`);
    }
  };

  if (loading || isCheckingRoom) {
    return (
      <LearningShell active="speaking">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-[#d7c3ae] bg-white px-6 py-4 text-[#835500]">
            <IconLoader2 className="animate-spin" size={22} />
            Checking speaking room...
          </div>
        </div>
      </LearningShell>
    );
  }

  return (
    <LearningShell active="speaking">
      <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          <header className="grid gap-6 border-b border-[#d7c3ae] pb-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">
                Real conversation
              </p>
              <h1 className="torisho-display text-5xl font-bold leading-tight text-[#211a12] md:text-6xl">
                Speaking Practice
              </h1>
              <p className="mt-3 max-w-2xl text-xl text-[#3d2a17]">
                Match with a partner and practice conversational Japanese.
              </p>
            </div>
            <div className="hidden h-36 w-36 items-center justify-center rounded-xl border border-[#d7c3ae] bg-[#fff1e4] text-[#835500] shadow-sm md:flex">
              <IconUsers size={58} stroke={1.4} />
            </div>
          </header>

          {joinError && (
            <div className="mt-7 flex items-center gap-3 rounded-xl border border-[#ffdad6] bg-white px-5 py-4 text-[#93000a]">
              <IconAlertCircle size={20} /> {joinError}
            </div>
          )}

          {lobbyState === 'idle' && (
            <IdleLobby
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              onPrepare={() => setLobbyState('permissions')}
            />
          )}

          {lobbyState === 'permissions' && (
            <PermissionsLobby
              selectedLevel={selectedLevel}
              previewVideoRef={previewVideoRef}
              isPreviewLoading={isPreviewLoading}
              permissionMessage={permissionMessage}
              isJoining={isJoining}
              onEnablePreview={startPreview}
              onBack={() => {
                stopPreview();
                setLobbyState('idle');
              }}
              onContinue={findPartner}
            />
          )}

          {lobbyState === 'searching' && (
            <SearchingLobby
              selectedLevel={selectedLevel}
              room={currentRoom}
              onCancel={cancelSearch}
            />
          )}

          {lobbyState === 'matched' && currentRoom && (
            <MatchedLobby
              selectedLevel={currentRoom.targetLevel ?? selectedLevel}
              partnerName={partner?.fullName ?? 'Partner'}
              room={currentRoom}
              onJoin={joinRoom}
              onCancel={cancelSearch}
            />
          )}

          <Tips />
        </div>
      </div>
    </LearningShell>
  );
}

function IdleLobby({
  selectedLevel,
  onSelectLevel,
  onPrepare,
}: {
  selectedLevel: JLPTLevel;
  onSelectLevel: (level: JLPTLevel) => void;
  onPrepare: () => void;
}) {
  return (
    <section className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[#3d2a17]">
          Select JLPT Level
        </p>
        <div className="flex flex-wrap gap-4">
          {Object.values(JLPTLevel).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onSelectLevel(level)}
              className={`h-14 min-w-24 rounded-full border px-8 text-2xl transition ${
                selectedLevel === level
                  ? 'border-[#f5a623] bg-[#f5a623] font-bold text-[#291800]'
                  : 'border-[#d7c3ae] bg-white text-[#3d2a17] hover:bg-[#fff1e4]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="mt-7 flex max-w-xl items-start gap-3 rounded-lg border border-[#d7c3ae] bg-[#fff1e4] px-5 py-4 text-[#3d2a17]">
          <IconInfoCircle className="mt-0.5 shrink-0 text-[#835500]" size={22} />
          <span>
            {selectedLevel} - {levelDescriptions[selectedLevel]}
          </span>
        </div>

        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-72 w-full max-w-xl items-center justify-center rounded-xl border border-[#d7c3ae] bg-white shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#fff1e4] text-[#835500]">
              <IconMicrophone size={48} stroke={1.5} />
            </div>
          </div>
          <h2 className="torisho-display mt-9 text-4xl font-bold">Ready to practice?</h2>
          <p className="mt-3 max-w-xl text-xl text-[#3d2a17]">
            Find a speaking partner at your level and practice real conversation.
          </p>
          <button
            type="button"
            onClick={onPrepare}
            className="mt-9 flex h-16 w-full max-w-xl items-center justify-center gap-3 rounded-full bg-[#f5a623] text-2xl font-bold text-[#291800] shadow-[0_10px_28px_rgba(26,20,16,0.06)] transition hover:bg-[#ffb955]"
          >
            <IconSearch size={26} /> Find Partner
          </button>
        </div>
      </div>

      <LevelCard selectedLevel={selectedLevel} />
    </section>
  );
}

function PermissionsLobby({
  selectedLevel,
  previewVideoRef,
  isPreviewLoading,
  permissionMessage,
  isJoining,
  onEnablePreview,
  onBack,
  onContinue,
}: {
  selectedLevel: JLPTLevel;
  previewVideoRef: RefObject<HTMLVideoElement | null>;
  isPreviewLoading: boolean;
  permissionMessage: string | null;
  isJoining: boolean;
  onEnablePreview: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">
          Optional pre-call check
        </p>
        <h2 className="torisho-display mt-2 text-4xl font-bold">Camera and microphone preview</h2>
        <p className="mt-3 max-w-2xl text-lg text-[#3d2a17]">
          You can test devices before matching. This is not required; the room also supports chat-only practice.
        </p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[#d7c3ae] bg-[#211a12]">
            <video ref={previewVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/75">
              <div className="rounded-full bg-black/45 px-4 py-2 text-sm">Preview appears here when camera is allowed</div>
            </div>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={onEnablePreview}
              disabled={isPreviewLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#835500] px-5 font-bold text-[#835500] transition hover:bg-[#fff1e4] disabled:opacity-60"
            >
              {isPreviewLoading ? <IconLoader2 className="animate-spin" size={20} /> : <IconCamera size={20} />}
              Test devices
            </button>
            <div className="rounded-lg border border-[#d7c3ae] bg-[#fff8f4] p-4 text-[#3d2a17]">
              <div className="flex items-center gap-2 font-bold">
                <IconMicrophone size={20} /> Mic
              </div>
              <div className="mt-2 flex items-center gap-2 font-bold">
                <IconCamera size={20} /> Camera
              </div>
            </div>
            {permissionMessage && (
              <p className="rounded-lg border border-[#d7c3ae] bg-[#fff1e4] p-4 text-[#3d2a17]">
                {permissionMessage}
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            className="h-12 rounded-full border border-[#d7c3ae] px-7 font-bold text-[#3d2a17]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={isJoining}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#f5a623] px-8 font-bold text-[#291800] transition hover:bg-[#ffb955] disabled:opacity-60"
          >
            {isJoining ? <IconLoader2 className="animate-spin" size={20} /> : <IconSearch size={20} />}
            Continue to match
          </button>
        </div>
      </div>

      <LevelCard selectedLevel={selectedLevel} />
    </section>
  );
}

function SearchingLobby({
  selectedLevel,
  room,
  onCancel,
}: {
  selectedLevel: JLPTLevel;
  room: Room | null;
  onCancel: () => void;
}) {
  return (
    <section className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-xl border border-[#d7c3ae] bg-white p-8 text-center shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
        <div className="relative mb-9 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#f5a623]/25" />
          <div className="absolute inset-4 animate-pulse rounded-full border-2 border-[#ffddb4]" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#f5a623] bg-[#fff1e4] text-[#835500]">
            <IconLoader2 className="animate-spin" size={34} />
          </div>
        </div>
        <h2 className="torisho-display text-4xl font-bold">Finding a partner</h2>
        <p className="mt-3 text-xl text-[#3d2a17]">Searching for {selectedLevel} partners...</p>
        {room && (
          <p className="mt-3 rounded-full bg-[#fff1e4] px-4 py-2 text-sm font-bold text-[#665744]">
            Room {room.id.slice(0, 8)} - {room.participantCount}/{room.maxParticipants}
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="mt-10 h-12 rounded-full border border-[#857462] px-8 font-bold text-[#3d2a17] transition hover:bg-[#fff1e4]"
        >
          Cancel Search
        </button>
      </div>

      <div className="space-y-6">
        <LevelCard selectedLevel={selectedLevel} />
        <SenseiTip />
      </div>
    </section>
  );
}

function MatchedLobby({
  selectedLevel,
  partnerName,
  room,
  onJoin,
  onCancel,
}: {
  selectedLevel: JLPTLevel;
  partnerName: string;
  room: Room;
  onJoin: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="py-10">
      <h2 className="torisho-display text-center text-4xl font-bold text-[#f5a623]">Partner found</h2>
      <div className="mx-auto mt-9 grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[#d7c3ae] bg-[#fff1e4] p-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <ParticipantOrb label="You" />
            <div className="h-px w-16 bg-[#d7c3ae]" />
            <ParticipantOrb label={partnerName || 'Partner'} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-[#d7c3ae] bg-white p-7 text-center shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <ParticipantOrb label={partnerName || 'Partner'} compact />
            <h3 className="torisho-display mt-5 text-3xl font-bold">{partnerName || 'Partner'}</h3>
            <span className="mt-4 inline-flex rounded-full bg-[#f5a623] px-4 py-1.5 text-sm font-bold text-[#291800]">
              {selectedLevel} Level
            </span>
          </div>
          <div className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
            <button
              type="button"
              onClick={onJoin}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#f5a623] text-xl font-bold text-[#291800] transition hover:bg-[#ffb955]"
            >
              Join Room <IconArrowRight size={24} />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-bold text-[#93000a]"
            >
              <IconX size={18} /> Leave match
            </button>
            <p className="mt-4 text-center text-sm font-bold text-[#93000a]">
              Room {room.id.slice(0, 8)} is ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParticipantOrb({ label, compact = false }: { label: string; compact?: boolean }) {
  const initial = label.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full border-4 border-white bg-[#faebdd] text-[#835500] shadow-sm ring-1 ring-[#d7c3ae] ${
          compact ? 'h-24 w-24 text-4xl' : 'h-36 w-36 text-6xl'
        }`}
      >
        {initial}
      </div>
      {!compact && <span className="mt-4 text-lg font-bold text-[#3d2a17]">{label}</span>}
    </div>
  );
}

function LevelCard({ selectedLevel }: { selectedLevel: JLPTLevel }) {
  return (
    <aside className="rounded-xl border border-[#d7c3ae] bg-white p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
      <h2 className="torisho-display text-3xl font-bold">Target Level</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {Object.values(JLPTLevel).map((level) => (
          <span
            key={level}
            className={`rounded-full border px-4 py-1.5 font-bold ${
              selectedLevel === level
                ? 'border-[#f5a623] bg-[#f5a623] text-[#291800]'
                : 'border-[#d7c3ae] bg-[#fff1e4] text-[#665744]'
            }`}
          >
            {level}
          </span>
        ))}
      </div>
    </aside>
  );
}

function SenseiTip() {
  return (
    <div className="rounded-xl border border-[#d7c3ae] bg-[#faebdd] p-7 shadow-[0_12px_32px_rgba(26,20,16,0.05)]">
      <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#835500]">Sensei&apos;s Tip</p>
      <p className="mt-4 text-lg leading-relaxed text-[#3d2a17]">
        Don&apos;t worry about making mistakes. Focus on communicating one clear idea at a time.
      </p>
    </div>
  );
}

function Tips() {
  return (
    <section className="mt-5 border-t border-[#d7c3ae] pt-8">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Speak naturally', 'Mistakes are part of learning.'],
          ['Stay at your level', 'Use vocabulary you can explain clearly.'],
          ['Keep it short', 'Sessions are easier when each answer is focused.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-[#d7c3ae] bg-white p-6 shadow-[0_10px_28px_rgba(26,20,16,0.04)]">
            <h3 className="font-bold text-[#211a12]">{title}</h3>
            <p className="mt-2 text-[#665744]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
