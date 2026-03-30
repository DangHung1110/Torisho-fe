'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoomService } from '@/src/services/room.service';
import { useAuth } from '@/src/libs/useAuth';
import { RoomStatus } from '@/src/types/room';

export default function SpeakingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isCheckingRoom, setIsCheckingRoom] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!loading && isAuthenticated) {
      checkExistingRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]);

  const checkExistingRoom = async () => {
    try {
      const currentRoom = await RoomService.getCurrentRoom();
      if (currentRoom) {
        // Only redirect if room is actually active or waiting AND has participants
        // If room is completed/cancelled, or user is alone too long, auto-leave it
        const isRoomValid = (
          (currentRoom.status === RoomStatus.Waiting || currentRoom.status === RoomStatus.Active) &&
          currentRoom.participantCount > 0
        );

        if (isRoomValid) {
          // Check if room was created recently (within last 30 minutes)
          const roomAge = new Date().getTime() - new Date(currentRoom.scheduledAt).getTime();
          const thirtyMinutes = 30 * 60 * 1000;
          
          if (roomAge < thirtyMinutes) {
            router.push(`/speaking/room/${currentRoom.id}`);
            return;
          } else {
            // Room too old, leave it automatically
            try {
              await RoomService.leaveRoom(currentRoom.id);
            } catch {
              // Ignore leave errors
            }
          }
        } else {
          // Room not valid (completed/cancelled), try to leave it
          try {
            await RoomService.leaveRoom(currentRoom.id);
          } catch {
            // Ignore leave errors
          }
        }
      }
    } catch {
      // No existing room, continue to redirect below
    } finally {
      router.replace('/adventure');
      setIsCheckingRoom(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isCheckingRoom) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p>Checking for active rooms...</p>
      </div>
    );
  }

  return null;
}
