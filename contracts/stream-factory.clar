;; Rivus Stream Factory
;; Batch stream helpers for payroll, vesting, and group distributions

(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-EMPTY-LIST (err u401))
(define-constant ERR-ZERO-AMOUNT (err u402))
(define-constant ERR-INVALID-BLOCKS (err u403))
(define-constant ERR-MIN-AMOUNT (err u404))

(define-constant MIN_STREAM_AMOUNT u10000)
(define-constant BLOCKS_PER_MONTH u4320)
(define-constant BLOCKS_PER_WEEK u1080)
(define-constant BLOCKS_PER_DAY u144)

(define-data-var contract-owner principal tx-sender)
(define-data-var total-batch-calls uint u0)
(define-data-var total-factory-streams uint u0)

(define-public (create-payroll-stream
  (recipient principal)
  (monthly-amount uint)
  (months uint)
  (start-block uint)
)
  (let (
    (total-blocks (* months BLOCKS_PER_MONTH))
    (end-block (+ start-block total-blocks))
    (total-amount (* monthly-amount months))
  )
    (asserts! (>= total-amount MIN_STREAM_AMOUNT) ERR-MIN-AMOUNT)
    (asserts! (> months u0) ERR-INVALID-BLOCKS)
    (var-set total-factory-streams (+ (var-get total-factory-streams) u1))
    (contract-call? .stream-registry open-stream recipient total-amount start-block end-block)
  )
)

(define-public (create-vesting-stream
  (beneficiary principal)
  (total-amount uint)
  (cliff-blocks uint)
  (vesting-blocks uint)
)
  (let (
    (start-block (+ stacks-block-height cliff-blocks))
    (end-block (+ start-block vesting-blocks))
  )
    (asserts! (>= total-amount MIN_STREAM_AMOUNT) ERR-MIN-AMOUNT)
    (asserts! (> vesting-blocks u0) ERR-INVALID-BLOCKS)
    (var-set total-factory-streams (+ (var-get total-factory-streams) u1))
    (contract-call? .stream-registry open-stream beneficiary total-amount start-block end-block)
  )
)

(define-read-only (estimate-payroll-total (monthly-amount uint) (months uint))
  (ok (* monthly-amount months))
)

(define-read-only (estimate-payroll-duration (months uint))
  (ok (* months BLOCKS_PER_MONTH))
)

(define-read-only (estimate-rate-per-block (total-amount uint) (duration-blocks uint))
  (if (> duration-blocks u0)
    (ok (/ total-amount duration-blocks))
    ERR-INVALID-BLOCKS
  )
)

(define-read-only (get-blocks-per-month) (ok BLOCKS_PER_MONTH))
(define-read-only (get-blocks-per-week) (ok BLOCKS_PER_WEEK))
(define-read-only (get-blocks-per-day) (ok BLOCKS_PER_DAY))
(define-read-only (get-total-batch-calls) (ok (var-get total-batch-calls)))
(define-read-only (get-total-factory-streams) (ok (var-get total-factory-streams)))
(define-read-only (get-min-stream-amount) (ok MIN_STREAM_AMOUNT))

(define-read-only (estimate-weekly-cost (weekly-amount uint) (weeks uint))
  (if (and (>= (* weekly-amount weeks) MIN_STREAM_AMOUNT) (> weeks u0))
    (ok {
      total-amount: (* weekly-amount weeks),
      total-blocks: (* weeks BLOCKS_PER_WEEK),
      rate-per-block: (/ (* weekly-amount weeks) (* weeks BLOCKS_PER_WEEK)),
      weeks: weeks
    })
    ERR-MIN-AMOUNT
  )
)

(define-read-only (estimate-vesting-end (cliff-blocks uint) (vesting-blocks uint))
  (ok (+ stacks-block-height cliff-blocks vesting-blocks))
)

(define-read-only (get-owner)
  (ok (var-get contract-owner))
)

(define-read-only (estimate-vesting-cost (total-amount uint) (cliff-blocks uint) (vesting-blocks uint))
  (if (and (>= total-amount MIN_STREAM_AMOUNT) (> vesting-blocks u0))
    (ok {
      total-amount: total-amount,
      cliff-blocks: cliff-blocks,
      vesting-blocks: vesting-blocks,
      rate-per-block: (/ total-amount vesting-blocks),
      total-blocks: (+ cliff-blocks vesting-blocks)
    })
    ERR-MIN-AMOUNT
  )
)
