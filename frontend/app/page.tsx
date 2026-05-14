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
  { icon: "01", title: "Payroll",       desc: "Pay contributors automatically. STX flows every block until cancelled — no cron jobs, no trust required." },
  { icon: "02", title: "Vesting",       desc: "Define a cliff then stream linearly. Beneficiaries withdraw earned amounts at any time." },
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

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 space-y-24">

      {/* Hero */}
      <section className="space-y-6 pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-3 py-1 text-xs text-[#818cf8]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
          Built on Stacks · Secured by Bitcoin
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight max-w-2xl">
          Payment streaming,<br />block by block
        </h1>
        <p className="text-lg text-[#94a3b8] max-w-xl leading-relaxed">
          Open a stream and the recipient earns STX continuously — down to the block level.
          No cron jobs. No middlemen. All logic lives in Clarity smart contracts with Bitcoin finality.
        </p>
        <div className="flex gap-4 pt-2">
          <a
            href="https://github.com/opepraise/rivus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors"
          >
            <GitHubIcon className="text-black" />
            GitHub
          </a>
          <a
            href="https://github.com/opepraise/rivus/tree/main/contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-[#1e293b] px-5 py-2.5 text-sm font-medium text-[#e2e8f0] hover:border-[#94a3b8] transition-colors"
          >
            View Contracts
          </a>
        </div>
      </section>

      {/* Params */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {params.map((p) => (
          <div key={p.label} className="rounded-xl border border-[#1e293b] bg-[#0d1117] p-5 space-y-1 hover:border-[#6366f1]/30 transition-colors">
            <p className="text-xs text-[#94a3b8] uppercase tracking-wider">{p.label}</p>
            <p className="text-2xl font-semibold text-white">{p.value}</p>
          </div>
        ))}
      </section>

      {/* Use cases */}
      <section className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-white">Use cases</h2>
          <p className="mt-2 text-[#94a3b8]">Any recurring payment can be a stream.</p>
        </div>
      </section>

      {/* Nav */}
      <nav className="flex items-center justify-between sticky top-0 z-10 bg-[#080b0f]/80 backdrop-blur-sm -mx-6 px-6 py-4 border-b border-[#1e293b]/60">
        <span className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
          Rivus
        </span>
        <a
          href="https://github.com/opepraise/rivus"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
        >
          <GitHubIcon />
          View on GitHub
        </a>
      </nav>

    </main>
  );
}
