import type { Stream, StreamStatus } from '../types';

export function microStxToStx(n: bigint): string {
  const whole = n / 1_000_000n;
  const frac = n % 1_000_000n;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(6, '0').replace(/0+$/, '');
  return `${whole}.${fracStr}`;
}

export function stxToMicroStx(n: number): bigint {
  return BigInt(Math.round(n * 1_000_000));
}

export function shortAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function blocksToApproxTime(blocks: number): string {
  if (blocks <= 0) return '0 min';
  const minutes = blocks * 10;
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `~${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `~${days}d`;
  const months = Math.round(days / 30);
  return `~${months}mo`;
}

export function getStreamStatus(stream: Stream): StreamStatus {
  if (stream.isCancelled) return 'cancelled';
  if (stream.isCompleted) return 'completed';
  if (stream.isPaused) return 'paused';
  return 'active';
}

export function streamProgress(stream: Stream): number {
  if (stream.totalAmount === 0n) return 0;
  const pct = Number((stream.withdrawn * 100n) / stream.totalAmount);
  return Math.min(100, pct);
}
