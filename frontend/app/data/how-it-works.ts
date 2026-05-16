export interface HowItWorksStep {
  number: string;
  title: string;
  desc: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: "01",
    title: "Deposit STX into a stream",
    desc: "Call open-stream with a recipient address, total deposit, and blocks-per-token rate. Funds are locked in the stream-vault contract.",
  },
  {
    number: "02",
    title: "Tokens accrue every block",
    desc: "For each Stacks block that passes, the recipient earns rate uSTX. Paused blocks are excluded from the accrual calculation.",
  },
  {
    number: "03",
    title: "Recipient withdraws at any time",
    desc: "Call withdraw-from-stream to transfer all earned and unclaimed STX to the recipient's wallet — no waiting period required.",
  },
  {
    number: "04",
    title: "Sender manages the stream",
    desc: "The sender can top up, pause, resume, or cancel. Cancellation sends earned tokens to the recipient and refunds the rest.",
  },
];
