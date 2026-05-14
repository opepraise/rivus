const contracts = [
  { name: "sip010-trait",    role: "SIP-010 fungible token standard interface" },
  { name: "rvus-token",      role: "RVUS — the protocol native token" },
  { name: "stream-vault",    role: "Holds STX for active streams; only registry can move funds" },
  { name: "stream-registry", role: "Open / withdraw / cancel / pause / resume / top-up streams" },
  { name: "stream-factory",  role: "Batch helpers: payroll schedules and vesting streams" },
];

const params = [
  { label: "Min Stream",     value: "10,000 uSTX" },
  { label: "Min Duration",   value: "10 blocks" },
  { label: "Rate",           value: "Per-block linear" },
  { label: "Blocks/Month",   value: "4,320" },
  { label: "Stream Token",   value: "STX" },
  { label: "Protocol Token", value: "RVUS" },
];

const useCases = [
  { icon: "01", title: "Payroll",       desc: "Pay contributors automatically — no cron jobs, no trust required. STX flows every block until cancelled." },
  { icon: "02", title: "Vesting",       desc: "Define a cliff, then stream tokens linearly. Beneficiaries withdraw earned amounts at any time." },
  { icon: "03", title: "Subscriptions", desc: "Protocol fees, SaaS billing, DAO memberships — any recurring payment can be a stream." },
];

const lifecycle = [
  { step: "open-stream",          actor: "sender",    desc: "Lock STX in vault, set rate per block" },
  { step: "withdraw-from-stream", actor: "recipient", desc: "Claim earned balance at any time" },
  { step: "top-up-stream",        actor: "sender",    desc: "Add more STX, rate recalculates" },
  { step: "pause-stream",         actor: "sender",    desc: "Pause accrual; blocks stop counting" },
  { step: "resume-stream",        actor: "sender",    desc: "Restart accrual from current block" },
  { step: "cancel-stream",        actor: "sender",    desc: "Refund unstreamed portion, pay earned" },
];

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 space-y-24">
    </main>
  );
}
