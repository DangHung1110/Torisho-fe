'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoCallRoom from '@/src/components/VideoCallRoom';
import { useAuth } from '@/src/libs/useAuth';

export default function RoomPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <VideoCallRoom roomId={roomId} />;
}
