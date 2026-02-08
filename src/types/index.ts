export type EventType = 'STAKING' | 'BETTING';

export interface Participant {
  id: number;
  event_id: string;
  user_address: string;
  amount: string;
  side: 'YES' | 'NO' | 'STAKE' | null;
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  creatorAddress: string;
  stakeAmount?: string;
  poolTotal?: string;
  createdAt: number;
  endsAt: number;
  participants: Participant[];
}