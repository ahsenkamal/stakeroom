export type EventType = 'STAKING' | 'BETTING';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  stakeAmount?: string; 
  poolTotal?: string;
  createdAt: number;
}