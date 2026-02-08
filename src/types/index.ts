export type EventType = 'STAKING' | 'BETTING';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  creatorAddress: string; 
  stakeAmount?: string; 
  poolTotal?: string;
  createdAt: number;
  participants: string[];
}