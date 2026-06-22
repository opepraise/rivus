import { fetchCallReadOnlyFunction, cvToJSON, uintCV, type ClarityValue } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { CONTRACT_OWNER, REGISTRY_NAME, HIRO_API } from '../constants';
import type { Stream } from '../types';

const SENDER = CONTRACT_OWNER;

async function callRead(contractName: string, fn: string, args: ClarityValue[] = []) {
  return fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_OWNER,
    contractName,
    functionName: fn,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionArgs: args as any[],
    network: STACKS_MAINNET,
    senderAddress: SENDER,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTupleValue(tuple: any): Stream | null {
  if (!tuple || tuple.value === null || tuple.value === undefined) return null;
  const v = tuple.type === 'none' ? null : (tuple.value ?? tuple);
  if (!v) return null;
  const t = v.value ?? v;

  return {
    id: 0,
    sender: t.sender?.value ?? '',
    recipient: t.recipient?.value ?? '',
    totalAmount: BigInt(t['total-amount']?.value ?? 0),
    withdrawn: BigInt(t.withdrawn?.value ?? 0),
    ratePerBlock: BigInt(t['rate-per-block']?.value ?? 0),
    startBlock: Number(t['start-block']?.value ?? 0),
    endBlock: Number(t['end-block']?.value ?? 0),
    lastWithdrawBlock: Number(t['last-withdraw-block']?.value ?? 0),
    pauseBlock: Number(t['pause-block']?.value ?? 0),
    pausedDuration: Number(t['paused-duration']?.value ?? 0),
    isPaused: t['is-paused']?.value === true,
    isCancelled: t['is-cancelled']?.value === true,
    isCompleted: t['is-completed']?.value === true,
  };
}

export async function fetchNextStreamId(): Promise<number> {
  const result = await callRead(REGISTRY_NAME, 'get-next-stream-id');
  const json = cvToJSON(result);
  return Number(json.value ?? json);
}

export async function fetchStream(id: number): Promise<Stream | null> {
  const result = await callRead(REGISTRY_NAME, 'get-stream', [uintCV(BigInt(id))]);
  const json = cvToJSON(result);
  const stream = parseTupleValue(json.value ?? json);
  if (!stream) return null;
  stream.id = id;
  return stream;
}

export async function fetchWithdrawable(id: number): Promise<bigint> {
  const result = await callRead(REGISTRY_NAME, 'get-withdrawable-amount', [uintCV(BigInt(id))]);
  const json = cvToJSON(result);
  return BigInt(json.value ?? 0);
}

export async function fetchCurrentBlock(): Promise<number> {
  try {
    const res = await fetch(`${HIRO_API}/v2/info`);
    const data = await res.json();
    return data.stacks_tip_height ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchStreamsForAddress(address: string): Promise<{ sending: Stream[]; receiving: Stream[] }> {
  const nextId = await fetchNextStreamId();
  if (nextId === 0) return { sending: [], receiving: [] };

  const ids = Array.from({ length: nextId }, (_, i) => i);
  const results = await Promise.all(ids.map(fetchStream));

  const sending: Stream[] = [];
  const receiving: Stream[] = [];

  for (const stream of results) {
    if (!stream) continue;
    if (stream.sender === address) sending.push(stream);
    else if (stream.recipient === address) receiving.push(stream);
  }

  return { sending, receiving };
}
