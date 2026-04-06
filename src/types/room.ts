export enum JLPTLevel {
  N5 = 'N5',
  N4 = 'N4',
  N3 = 'N3',
  N2 = 'N2',
  N1 = 'N1'
}

export enum RoomStatus {
  Waiting = 'Waiting',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum RoomType {
  UserToUser = 'UserToUser',
  UserToAI = 'UserToAI'
}

export interface RoomParticipant {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Room {
  id: string;
  status: RoomStatus;
  roomType: RoomType;
  targetLevel?: JLPTLevel;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  participantCount: number;
  maxParticipants: number;
  participants: RoomParticipant[];
}

export interface JoinRoomRequest {
  targetLevel: JLPTLevel;
}

export interface RoomMatchResponse {
  isMatched: boolean;
  room: Room | null;
  message: string;
}

export interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  sentAt: string;
}

export interface UserJoined {
  userId: string;
  username: string;
  joinedAt: string;
}

export interface UserLeft {
  userId: string;
  username: string;
  leftAt: string;
}

export interface JoinedRoomEvent {
  connectionId: string;
  userId: string;
  username: string;
}

export interface PeerJoinedEvent {
  connectionId: string;
  userId: string;
  username: string;
  joinedAt: string;
}

export interface PeerDisconnectedEvent {
  connectionId: string;
  userId: string;
  username: string;
  leftAt: string;
}

export interface SignalOfferEvent {
  fromConnectionId: string;
  fromUserId: string;
  fromUsername: string;
  sdp: string;
}

export interface SignalAnswerEvent {
  fromConnectionId: string;
  fromUserId: string;
  fromUsername: string;
  sdp: string;
}

export interface SignalIceCandidateEvent {
  fromConnectionId: string;
  fromUserId: string;
  fromUsername: string;
  candidate: string;
}

export interface PeerMediaStateChangedEvent {
  connectionId: string;
  userId: string;
  username: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  updatedAt: string;
}
