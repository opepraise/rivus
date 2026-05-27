;; Rivus Stream Registry
;; Core payment streaming - open, withdraw, cancel, pause, resume, top-up

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-ZERO-AMOUNT (err u301))
(define-constant ERR-STREAM-NOT-FOUND (err u302))
(define-constant ERR-NOT-RECIPIENT (err u303))
(define-constant ERR-NOT-SENDER (err u304))
(define-constant ERR-STREAM-CANCELLED (err u305))
(define-constant ERR-STREAM-COMPLETED (err u306))
(define-constant ERR-STREAM-PAUSED (err u307))
(define-constant ERR-STREAM-NOT-PAUSED (err u308))
(define-constant ERR-INVALID-BLOCKS (err u309))
(define-constant ERR-NOTHING-TO-WITHDRAW (err u310))
(define-constant ERR-MIN-AMOUNT (err u311))
(define-constant ERR-SELF-STREAM (err u312))
(define-constant ERR-MAX-AMOUNT (err u313))

(define-constant MIN_STREAM_AMOUNT u10000)
(define-constant MAX_STREAM_AMOUNT u1000000000000)
(define-constant MIN_STREAM_DURATION u10)

(define-data-var contract-owner principal tx-sender)
(define-data-var next-stream-id uint u0)
(define-data-var total-streams-opened uint u0)
(define-data-var total-streams-cancelled uint u0)
(define-data-var total-volume-streamed uint u0)

(define-map streams
  uint
  {
    sender: principal,
    recipient: principal,
    total-amount: uint,
    withdrawn: uint,
    rate-per-block: uint,
    start-block: uint,
    end-block: uint,
    last-withdraw-block: uint,
    pause-block: uint,
    paused-duration: uint,
    is-paused: bool,
    is-cancelled: bool,
    is-completed: bool
  }
)

(define-map sender-stream-count principal uint)
(define-map recipient-stream-count principal uint)

(define-private (get-next-id)
  (let ((id (var-get next-stream-id)))
    (var-set next-stream-id (+ id u1))
    id
  )
)

(define-private (compute-withdrawable
  (stream {
    sender: principal, recipient: principal, total-amount: uint, withdrawn: uint,
    rate-per-block: uint, start-block: uint, end-block: uint, last-withdraw-block: uint,
    pause-block: uint, paused-duration: uint, is-paused: bool, is-cancelled: bool, is-completed: bool
  })
)
  (if (get is-paused stream)
    u0
    (let (
      (effective-end (if (<= (get end-block stream) stacks-block-height)
                       (get end-block stream)
                       stacks-block-height))
      (adjusted-last (+ (get last-withdraw-block stream) (get paused-duration stream)))
      (elapsed (if (> effective-end adjusted-last) (- effective-end adjusted-last) u0))
      (earned (* elapsed (get rate-per-block stream)))
      (remaining (- (get total-amount stream) (get withdrawn stream)))
    )
      (if (<= earned remaining) earned remaining)
    )
  )
)

(define-public (open-stream (recipient principal) (total-amount uint) (start-block uint) (end-block uint))
  (let (
    (stream-id (get-next-id))
    (duration (if (> end-block start-block) (- end-block start-block) u0))
    (rate (if (> duration u0) (/ total-amount duration) u0))
  )
    (asserts! (not (is-eq tx-sender recipient)) ERR-SELF-STREAM)
    (asserts! (>= total-amount MIN_STREAM_AMOUNT) ERR-MIN-AMOUNT)
    (asserts! (>= duration MIN_STREAM_DURATION) ERR-INVALID-BLOCKS)
    (asserts! (> rate u0) ERR-INVALID-BLOCKS)
    (try! (contract-call? .stream-vault lock-stream-funds stream-id total-amount tx-sender))
    (map-set streams stream-id {
      sender: tx-sender,
      recipient: recipient,
      total-amount: total-amount,
      withdrawn: u0,
      rate-per-block: rate,
      start-block: start-block,
      end-block: end-block,
      last-withdraw-block: start-block,
      pause-block: u0,
      paused-duration: u0,
      is-paused: false,
      is-cancelled: false,
      is-completed: false
    })
    (map-set sender-stream-count tx-sender
      (+ (default-to u0 (map-get? sender-stream-count tx-sender)) u1))
    (map-set recipient-stream-count recipient
      (+ (default-to u0 (map-get? recipient-stream-count recipient)) u1))
    (var-set total-streams-opened (+ (var-get total-streams-opened) u1))
    (var-set total-volume-streamed (+ (var-get total-volume-streamed) total-amount))
    (ok stream-id)
  )
)

(define-public (withdraw-from-stream (stream-id uint))
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
    (amount (compute-withdrawable stream))
  )
    (asserts! (is-eq tx-sender (get recipient stream)) ERR-NOT-RECIPIENT)
    (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
    (asserts! (not (get is-paused stream)) ERR-STREAM-PAUSED)
    (asserts! (> amount u0) ERR-NOTHING-TO-WITHDRAW)
    (try! (contract-call? .stream-vault release-to-recipient stream-id amount tx-sender))
    (let ((new-withdrawn (+ (get withdrawn stream) amount)))
      (map-set streams stream-id (merge stream {
        withdrawn: new-withdrawn,
        last-withdraw-block: stacks-block-height,
        paused-duration: u0,
        is-completed: (>= new-withdrawn (get total-amount stream))
      }))
    )
    (ok amount)
  )
)

(define-public (cancel-stream (stream-id uint))
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
    (earned (compute-withdrawable stream))
    (remaining (- (get total-amount stream) (+ (get withdrawn stream) earned)))
  )
    (asserts! (is-eq tx-sender (get sender stream)) ERR-NOT-SENDER)
    (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
    (asserts! (not (get is-completed stream)) ERR-STREAM-COMPLETED)
    (try! (if (> earned u0)
      (contract-call? .stream-vault release-to-recipient stream-id earned (get recipient stream))
      (ok u0)
    ))
    (try! (if (> remaining u0)
      (contract-call? .stream-vault refund-to-sender stream-id remaining tx-sender)
      (ok u0)
    ))
    (map-set streams stream-id (merge stream {
      is-cancelled: true,
      withdrawn: (+ (get withdrawn stream) earned)
    }))
    (var-set total-streams-cancelled (+ (var-get total-streams-cancelled) u1))
    (ok true)
  )
)

(define-public (pause-stream (stream-id uint))
  (let ((stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get sender stream)) ERR-NOT-SENDER)
    (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
    (asserts! (not (get is-completed stream)) ERR-STREAM-COMPLETED)
    (asserts! (not (get is-paused stream)) ERR-STREAM-PAUSED)
    (map-set streams stream-id (merge stream {
      is-paused: true,
      pause-block: stacks-block-height
    }))
    (ok true)
  )
)

(define-public (resume-stream (stream-id uint))
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
    (additional-paused (- stacks-block-height (get pause-block stream)))
  )
    (asserts! (is-eq tx-sender (get sender stream)) ERR-NOT-SENDER)
    (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
    (asserts! (get is-paused stream) ERR-STREAM-NOT-PAUSED)
    (map-set streams stream-id (merge stream {
      is-paused: false,
      pause-block: u0,
      paused-duration: (+ (get paused-duration stream) additional-paused)
    }))
    (ok true)
  )
)

(define-public (top-up-stream (stream-id uint) (amount uint))
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR-STREAM-NOT-FOUND))
    (new-total (+ (get total-amount stream) amount))
    (remaining-blocks (if (> (get end-block stream) stacks-block-height)
                         (- (get end-block stream) stacks-block-height) u0))
    (new-rate (if (> remaining-blocks u0)
                  (/ (- new-total (get withdrawn stream)) remaining-blocks)
                  (get rate-per-block stream)))
  )
    (asserts! (is-eq tx-sender (get sender stream)) ERR-NOT-SENDER)
    (asserts! (not (get is-cancelled stream)) ERR-STREAM-CANCELLED)
    (asserts! (not (get is-completed stream)) ERR-STREAM-COMPLETED)
    (asserts! (>= amount MIN_STREAM_AMOUNT) ERR-MIN-AMOUNT)
    (try! (contract-call? .stream-vault top-up-stream-funds stream-id amount tx-sender))
    (map-set streams stream-id (merge stream {
      total-amount: new-total,
      rate-per-block: new-rate
    }))
    (var-set total-volume-streamed (+ (var-get total-volume-streamed) amount))
    (ok new-total)
  )
)

(define-read-only (get-stream (stream-id uint))
  (ok (map-get? streams stream-id))
)

(define-read-only (get-withdrawable-amount (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok (compute-withdrawable stream))
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-sender-stream-count (sender principal))
  (ok (default-to u0 (map-get? sender-stream-count sender)))
)

(define-read-only (get-recipient-stream-count (recipient principal))
  (ok (default-to u0 (map-get? recipient-stream-count recipient)))
)

(define-read-only (get-total-streams-opened) (ok (var-get total-streams-opened)))
(define-read-only (get-total-streams-cancelled) (ok (var-get total-streams-cancelled)))
(define-read-only (get-total-volume-streamed) (ok (var-get total-volume-streamed)))
(define-read-only (get-next-stream-id) (ok (var-get next-stream-id)))
(define-read-only (get-min-stream-amount) (ok MIN_STREAM_AMOUNT))
(define-read-only (get-max-stream-amount) (ok MAX_STREAM_AMOUNT))
(define-read-only (get-min-stream-duration) (ok MIN_STREAM_DURATION))

(define-read-only (get-owner)
  (ok (var-get contract-owner))
)

(define-read-only (is-stream-active (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok (and
      (not (get is-cancelled stream))
      (not (get is-completed stream))
      (<= stacks-block-height (get end-block stream))
    ))
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-stream-rate (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok (get rate-per-block stream))
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-stream-remaining (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok (- (get total-amount stream) (get withdrawn stream)))
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-stream-progress (stream-id uint))
  (match (map-get? streams stream-id)
    stream (let (
      (duration (- (get end-block stream) (get start-block stream)))
      (elapsed (if (> stacks-block-height (get start-block stream))
                   (if (<= stacks-block-height (get end-block stream))
                       (- stacks-block-height (get start-block stream))
                       duration)
                   u0))
    )
      (if (> duration u0)
        (ok (/ (* elapsed u100) duration))
        (ok u100)
      )
    )
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-stream-duration (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok (- (get end-block stream) (get start-block stream)))
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-stream-elapsed (stream-id uint))
  (match (map-get? streams stream-id)
    stream
    (let ((from (get last-withdraw-block stream))
          (to (if (<= (get end-block stream) stacks-block-height)
                  (get end-block stream)
                  stacks-block-height)))
      (ok (if (> to from) (- to from) u0))
    )
    ERR-STREAM-NOT-FOUND
  )
)

(define-read-only (get-protocol-stats)
  (ok {
    total-opened: (var-get total-streams-opened),
    total-cancelled: (var-get total-streams-cancelled),
    total-volume: (var-get total-volume-streamed),
    next-id: (var-get next-stream-id)
  })
)

(define-read-only (get-stream-health (stream-id uint))
  (match (map-get? streams stream-id)
    stream (ok {
      is-active: (and
        (not (get is-cancelled stream))
        (not (get is-completed stream))
        (<= stacks-block-height (get end-block stream))
      ),
      is-paused: (get is-paused stream),
      is-cancelled: (get is-cancelled stream),
      is-completed: (get is-completed stream),
      blocks-remaining: (if (> (get end-block stream) stacks-block-height)
                           (- (get end-block stream) stacks-block-height)
                           u0)
    })
    ERR-STREAM-NOT-FOUND
  )
)
