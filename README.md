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

### Test commands

| Command | Purpose |
|---|---|
| `npm test` | Run all unit tests |
| `npm run test:report` | Run tests with coverage and cost reports |
| `npm run test:watch` | Watch mode — re-runs on file changes |

## Stream Lifecycle

```
open-stream  →  [active]        →  withdraw-from-stream (recipient, anytime)
                                 →  top-up-stream (sender, adds more STX)
                                 →  pause-stream (sender, stops accrual)
                                     →  resume-stream (sender, restarts)
                                 →  cancel-stream (sender, refunds remainder)
                [paused]         →  resume-stream (sender, restarts accrual)
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

### Authorization by contract

| Contract | User auth | Cross-contract auth |
|---|---|---|
| `stream-registry` | `tx-sender` (sender/recipient check) | — |
| `stream-vault` | — | `contract-caller` (registry check) |
| `rvus-token` | `tx-sender` (transfer, ownership) | `contract-caller` (mint, burn) |

- Cross-contract calls (vault, token mint/burn) use `contract-caller` to prevent principal spoofing
- User-facing auth (registry open/withdraw/cancel) uses `tx-sender` — the actual transaction origin
- Token transfers use `tx-sender` to prevent unauthorized spending
- Auth check runs before vault lookup in release/refund functions (defense-in-depth)
- Minimum stream amount (10,000 uSTX) and minimum duration (10 blocks) prevent dust spam

## License

MIT

## Interaction Script

A multi-user interaction script is available at `/Users/mac/Documents/DEBY/stacks/interact-rivus.js`.

It sends 7 transactions per user per round across all 5 contracts, with a minimum of **10,000 uSTX** per stream interaction. Fill in `OWNER_KEY` before running:

```bash
node /Users/mac/Documents/DEBY/stacks/interact-rivus.js
```
