export type StreamStatus = 'active' | 'paused' | 'cancelled' | 'completed';

export interface Stream {
  id: number;
  sender: string;
  recipient: string;
  totalAmount: bigint;
  withdrawn: bigint;
  ratePerBlock: bigint;
  startBlock: number;
  endBlock: number;
  lastWithdrawBlock: number;
  pauseBlock: number;
  pausedDuration: number;
  isPaused: boolean;
  isCancelled: boolean;
  isCompleted: boolean;
}

export interface PendingTx {
  txId: string;
  action: string;
}
