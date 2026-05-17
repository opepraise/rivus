export type LifecycleActor = "sender" | "recipient";

export interface LifecycleStep {
  step: string;
  actor: LifecycleActor;
  desc: string;
}

export const lifecycleSteps: LifecycleStep[] = [
  { step: "open-stream",          actor: "sender",    desc: "Lock STX in vault, set rate per block" },
  { step: "withdraw-from-stream", actor: "recipient", desc: "Claim earned balance at any time" },
  { step: "top-up-stream",        actor: "sender",    desc: "Add more STX, rate recalculates" },
  { step: "pause-stream",         actor: "sender",    desc: "Pause accrual; blocks stop counting" },
  { step: "resume-stream",        actor: "sender",    desc: "Restart accrual from current block" },
  { step: "cancel-stream",        actor: "sender",    desc: "Refund unstreamed portion, pay earned" },
];
