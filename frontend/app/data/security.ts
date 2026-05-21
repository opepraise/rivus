export const securityProperties: string[] = [
  "All cross-contract auth uses contract-caller, not tx-sender — prevents principal spoofing",
  "stream-vault auth check runs before vault lookup — no state read before authorization",
  "Vault uses as-contract for safe STX custody and transfer to recipients",
  "Minimum stream amount (10,000 uSTX) and duration (10 blocks) prevent dust spam",
  "Pause/resume tracks paused duration so accrual is never double-counted",
  "Self-stream guard rejects open-stream when sender equals recipient",
  "Top-up enforces minimum amount to prevent micro-increment manipulation",
];
