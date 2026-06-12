# Rivus

On-chain payment streaming protocol on Stacks. Open a stream, and the recipient earns STX continuously — down to the block level. Built for payroll, DAO contributor payments, token vesting, and subscription billing.

## Protocol Overview


| Contract | Role |
|---|---|
| `sip010-trait` | SIP-010 fungible token interface — trait definition |
| `rvus-token` | RVUS — the protocol native token (SIP-010) |
| `stream-vault` | Custodian for streamed STX; only the registry can move funds |
| `stream-registry` | Core registry: open, withdraw, cancel, pause, resume, top-up |
| `stream-factory` | Batch helpers for payroll schedules and vesting streams |

## Deployed Contracts (Mainnet)

All five contracts are live on Stacks mainnet under deployer `SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R`.

| Contract | Address |
|---|---|
| `sip010-trait` | [`SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.sip010-trait`](https://explorer.hiro.so/txid/SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.sip010-trait?chain=mainnet) |
| `rvus-token` | [`SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.rvus-token`](https://explorer.hiro.so/txid/SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.rvus-token?chain=mainnet) |
| `stream-vault` | [`SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-vault`](https://explorer.hiro.so/txid/SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-vault?chain=mainnet) |
| `stream-registry` | [`SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-registry`](https://explorer.hiro.so/txid/SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-registry?chain=mainnet) |
| `stream-factory` | [`SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-factory`](https://explorer.hiro.so/txid/SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R.stream-factory?chain=mainnet) |

## Key Parameters

| Parameter | Value |
|---|---|
| Minimum stream amount | 10,000 uSTX |
| Maximum stream amount | 1,000,000,000,000 uSTX (1 trillion) |
| Minimum stream duration | 10 blocks |
| Blocks per month | 4,320 (~10 min/block) |
| Rate precision | Per-block linear accrual |
| Network | Stacks mainnet (Clarity 3, epoch 3.1) |

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

> **Amount limits:** `monthly-amount × months` for payroll and `total` for vesting must each be within `[10,000, 1,000,000,000,000]` uSTX. Streams topped up via `top-up-stream` are subject to the same ceiling on their running total.

## Deployment

Contracts are already deployed to mainnet (see above). To re-deploy or target another network:

```bash
./scripts/deploy.sh testnet   # or mainnet
```

Post-deploy setup:
```bash
# Authorize stream-registry in the vault
clarinet call stream-vault set-registry <stream-registry-address>
# Authorize a minter for the token
clarinet call rvus-token set-minter <minter-address>
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js landing page runs at `http://localhost:3000`. Set `NEXT_PUBLIC_BASE_URL` in `frontend/.env` for a custom canonical URL (used by Vercel in production).

## Error Code Reference

| Code | Constant | Contract | Description |
|---|---|---|---|
| u100 | `ERR-NOT-AUTHORIZED` | `rvus-token` | Caller is not the owner |
| u101 | `ERR-NOT-TOKEN-OWNER` | `rvus-token` | tx-sender is not the token holder |
| u102 | `ERR-INSUFFICIENT-BALANCE` | `rvus-token` | Transfer amount exceeds balance |
| u103 | `ERR-ZERO-AMOUNT` | `rvus-token` | Amount must be greater than zero |
| u200 | `ERR-NOT-AUTHORIZED` | `stream-vault` | Caller is not the registry |
| u201 | `ERR-ZERO-AMOUNT` | `stream-vault` | Amount must be greater than zero |
| u202 | `ERR-INSUFFICIENT-BALANCE` | `stream-vault` | Vault balance too low |
| u203 | `ERR-NO-VAULT` | `stream-vault` | No balance entry for stream ID |
| u300 | `ERR-NOT-AUTHORIZED` | `stream-registry` | General auth failure |
| u301 | `ERR-ZERO-AMOUNT` | `stream-registry` | Amount is zero |
| u302 | `ERR-STREAM-NOT-FOUND` | `stream-registry` | Stream ID does not exist |
| u303 | `ERR-NOT-RECIPIENT` | `stream-registry` | tx-sender is not the stream recipient |
| u304 | `ERR-NOT-SENDER` | `stream-registry` | tx-sender is not the stream sender |
| u305 | `ERR-STREAM-CANCELLED` | `stream-registry` | Stream is already cancelled |
| u306 | `ERR-STREAM-COMPLETED` | `stream-registry` | Stream is already completed |
| u307 | `ERR-STREAM-PAUSED` | `stream-registry` | Stream is paused |
| u308 | `ERR-STREAM-NOT-PAUSED` | `stream-registry` | Stream is not paused |
| u309 | `ERR-INVALID-BLOCKS` | `stream-registry` | Invalid block range or zero rate |
| u310 | `ERR-NOTHING-TO-WITHDRAW` | `stream-registry` | No accrued balance to withdraw |
| u311 | `ERR-MIN-AMOUNT` | `stream-registry` | Amount below 10,000 uSTX minimum |
| u312 | `ERR-SELF-STREAM` | `stream-registry` | Sender and recipient are the same |
| u313 | `ERR-MAX-AMOUNT` | `stream-registry` | Amount exceeds 1 trillion uSTX ceiling |
| u403 | `ERR-INVALID-BLOCKS` | `stream-factory` | Invalid block duration |
| u404 | `ERR-MIN-AMOUNT` | `stream-factory` | Amount below minimum |

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
- Maximum stream amount (1,000,000,000,000 uSTX) is enforced in both `open-stream` and `top-up-stream` — the guard on `top-up-stream` checks the post-top-up total, not just the top-up increment, so cumulative top-ups cannot silently breach the ceiling

## License

MIT

## Interaction Script

A multi-user interaction script (`interact-rivus.js`) exercises all 5 contracts across multiple wallets.

It sends 7 transactions per user per round — open, top-up, pause, resume, payroll stream, vesting stream, and cancel — with a minimum of **10,000 uSTX** per stream interaction. Fill in `OWNER_KEY` before running:

```bash
node interact-rivus.js
```
