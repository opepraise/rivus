export interface ArchitectureLayer {
  label: string;
  components: string[];
  desc: string;
}

export const architectureLayers: ArchitectureLayer[] = [
  {
    label: "Interface layer",
    components: ["stream-factory"],
    desc: "Batch helpers — payroll schedules and vesting streams wrapping registry calls",
  },
  {
    label: "Registry layer",
    components: ["stream-registry"],
    desc: "Business logic — open, withdraw, cancel, pause, resume, top-up",
  },
  {
    label: "Vault layer",
    components: ["stream-vault"],
    desc: "STX custody — only the registry can move funds from the vault",
  },
  {
    label: "Token layer",
    components: ["rvus-token", "sip010-trait"],
    desc: "Native protocol token implementing the SIP-010 fungible token standard",
  },
];
