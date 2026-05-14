;; Rivus Stream Vault
;; Custodial contract holding STX for active payment streams
;; Only stream-registry can lock, release, or refund funds

(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-ZERO-AMOUNT (err u201))
(define-constant ERR-INSUFFICIENT-BALANCE (err u202))
(define-constant ERR-NO-VAULT (err u203))

(define-data-var contract-owner principal tx-sender)
(define-data-var registry-contract principal tx-sender)
(define-data-var total-locked uint u0)

(define-map stream-balances uint uint)

(define-public (set-registry (new-registry principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set registry-contract new-registry)
    (ok new-registry)
  )
)

(define-public (lock-stream-funds (stream-id uint) (amount uint) (sender principal))
  (begin
    (asserts! (is-eq contract-caller (var-get registry-contract)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (try! (stx-transfer? amount sender (as-contract tx-sender)))
    (map-set stream-balances stream-id amount)
    (var-set total-locked (+ (var-get total-locked) amount))
    (ok amount)
  )
)

(define-public (release-to-recipient (stream-id uint) (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq contract-caller (var-get registry-contract)) ERR-NOT-AUTHORIZED)
    (let ((locked (unwrap! (map-get? stream-balances stream-id) ERR-NO-VAULT)))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= locked amount) ERR-INSUFFICIENT-BALANCE)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (map-set stream-balances stream-id (- locked amount))
    (var-set total-locked (- (var-get total-locked) amount))
    (ok amount)
    )
  )
)

(define-public (refund-to-sender (stream-id uint) (amount uint) (sender principal))
  (begin
    (asserts! (is-eq contract-caller (var-get registry-contract)) ERR-NOT-AUTHORIZED)
    (let ((locked (unwrap! (map-get? stream-balances stream-id) ERR-NO-VAULT)))
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= locked amount) ERR-INSUFFICIENT-BALANCE)
    (try! (as-contract (stx-transfer? amount tx-sender sender)))
    (map-set stream-balances stream-id (- locked amount))
    (var-set total-locked (- (var-get total-locked) amount))
    (ok amount)
    )
  )
)

(define-public (top-up-stream-funds (stream-id uint) (amount uint) (sender principal))
  (let ((current (default-to u0 (map-get? stream-balances stream-id))))
    (asserts! (is-eq contract-caller (var-get registry-contract)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (try! (stx-transfer? amount sender (as-contract tx-sender)))
    (map-set stream-balances stream-id (+ current amount))
    (var-set total-locked (+ (var-get total-locked) amount))
    (ok amount)
  )
)

(define-read-only (get-stream-balance (stream-id uint))
  (ok (default-to u0 (map-get? stream-balances stream-id)))
)

(define-read-only (get-total-locked)
  (ok (var-get total-locked))
)

(define-read-only (get-registry)
  (ok (var-get registry-contract))
)
