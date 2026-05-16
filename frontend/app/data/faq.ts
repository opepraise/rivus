export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "What is Rivus?",
    answer:
      "Rivus is an on-chain payment streaming protocol built on Stacks. It lets you open a stream that continuously transfers STX to a recipient on every block — no cron jobs, no trusted intermediaries.",
  },
  {
    question: "How does per-block streaming work?",
    answer:
      "When you open a stream, you specify a total deposit and a rate per block. The registry contract computes accrued balance as (current block − start block − paused blocks) × rate. Recipients can withdraw their accrued balance at any time.",
  },
  {
    question: "What is the minimum stream amount?",
    answer:
      "The minimum deposit is 10,000 uSTX (0.01 STX) and the stream must run for at least 10 blocks. These limits prevent dust spam attacks on the contract.",
  },
  {
    question: "Can a stream be cancelled?",
    answer:
      "Yes. The sender can cancel at any time. The contract pays out the recipient's earned balance instantly and refunds the remaining unstreamed STX to the sender.",
  },
  {
    question: "What does the RVUS token do?",
    answer:
      "RVUS is the native protocol token deployed as a SIP-010 fungible token. It is used for governance and protocol incentives. It does not gate stream creation — anyone can stream STX without holding RVUS.",
  },
  {
    question: "Is Rivus audited?",
    answer:
      "Rivus is open-source and community-reviewed. A formal third-party audit is planned before mainnet deployment. Check the GitHub repository for the latest audit status.",
  },
  {
    question: "Which network is Rivus deployed on?",
    answer:
      "Rivus contracts are written for Stacks (Clarity 3, epoch 3.1) and target mainnet. The repository includes simnet and devnet deployment configurations for local testing.",
  },
  {
    question: "How do I top up an existing stream?",
    answer:
      "Call top-up-stream with the stream ID and additional STX. The contract adds the deposit to the vault and recalculates the end block based on the new balance and existing rate.",
  },
];
