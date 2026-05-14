# Rivus

On-chain payment streaming protocol on Stacks. Open a stream, and the recipient earns STX continuously — down to the block level. Built for payroll, DAO contributor payments, token vesting, and subscription billing.

## Protocol Overview

| Contract | Role |
|---|---|
| `sip010-trait` | SIP-010 fungible token interface |
| `rvus-token` | RVUS — the protocol's native token |
| `stream-vault` | Holds STX for active streams; only registry can move funds |
| `stream-registry` | Core: open / withdraw / cancel / pause / resume / top-up streams |
| `stream-factory` | Batch helpers: payroll schedules and vesting streams |

## Key Parameters

| Parameter | Value |
|---|---|
| Minimum stream amount | 10,000 uSTX |
| Minimum stream duration | 10 blocks |
| Blocks per month | 4,320 (~10 min/block) |
| Rate precision | Per-block linear accrual |

## Getting Started

**Requirements:** [Clarinet](https://docs.hiro.so/clarinet) >= 3.0, Node >= 18

```bash
npm install
npm test
```

## Stream Lifecycle

```
open-stream  →  [active]  →  withdraw-from-stream (recipient, anytime)
                           →  top-up-stream (sender, adds more STX)
                           →  pause-stream (sender, stops accrual)
                               →  resume-stream (sender, restarts)
                           →  cancel-stream (sender, refunds remainder)
```

## Batch Operations

```bash
# Payroll: 3-month salary stream for a contributor
clarinet call stream-factory create-payroll-stream <recipient> <monthly-amount> 3 <start-block>

# Vesting: 1-year vest with 3-month cliff
clarinet call stream-factory create-vesting-stream <beneficiary> <total> <cliff-blocks> <vest-blocks>
```

## Deployment

```bash
./scripts/deploy.sh testnet
```

Post-deploy setup:
```bash
# Authorize stream-registry in the vault
clarinet call stream-vault set-registry <stream-registry-address>
```

## Security

- All cross-contract auth uses `contract-caller` (not `tx-sender`)
- Vault uses `as-contract` for safe STX custody
- Auth check runs before vault lookup in release/refund functions
- Minimum stream amount (10,000 uSTX) prevents dust spam

## License

MIT

## Interaction Script

A multi-user interaction script is available at `/Users/mac/Documents/DEBY/stacks/interact-rivus.js`.

It sends 7 transactions per user per round across all 5 contracts, with a minimum of **10,000 uSTX** per stream interaction. Fill in `OWNER_KEY` before running:

```bash
node /Users/mac/Documents/DEBY/stacks/interact-rivus.js
```
