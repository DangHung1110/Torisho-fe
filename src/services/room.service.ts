import { apiRequest } from '../libs/api-client';
import { Room, RoomMatchResponse, JoinRoomRequest, JLPTLevel } from '../types/room';

export class RoomService {
  static async findOrCreateRoom(targetLevel: JLPTLevel): Promise<RoomMatchResponse> {
    const request: JoinRoomRequest = { targetLevel };
    return apiRequest<RoomMatchResponse>('/room/match', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getCurrentRoom(): Promise<Room | null> {
    try {
      return await apiRequest<Room>('/room/current');
    } catch (error) {
      return null;
    }
  }

  static async getRoom(roomId: string): Promise<Room> {
    return apiRequest<Room>(`/room/${roomId}`);
  }

  static async startRoom(roomId: string): Promise<Room> {
    return apiRequest<Room>(`/room/${roomId}/start`, {
      method: 'POST',
    });
  }

  static async leaveRoom(roomId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/room/${roomId}/leave`, {
      method: 'POST',
    });
  }
}
