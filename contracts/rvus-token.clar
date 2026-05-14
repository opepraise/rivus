;; Rivus Protocol Token (RVUS)
;; SIP-010 compliant fungible token used for protocol rewards

(impl-trait .sip010-trait.sip010-trait)

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-TOKEN-OWNER (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-ZERO-AMOUNT (err u103))

(define-fungible-token rvus)

(define-data-var contract-owner principal tx-sender)
(define-data-var minter principal tx-sender)
(define-data-var token-uri (optional (string-utf8 256)) none)

(define-public (set-minter (new-minter principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set minter new-minter)
    (ok new-minter)
  )
)

(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (ok new-owner)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq contract-caller (var-get minter)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (ft-mint? rvus amount recipient)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq contract-caller (var-get minter)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (ft-burn? rvus amount owner)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (try! (ft-transfer? rvus amount sender recipient))
    (match memo m (print m) 0x)
    (ok true)
  )
)

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set token-uri new-uri)
    (ok true)
  )
)

(define-read-only (get-name) (ok "Rivus"))
(define-read-only (get-symbol) (ok "RVUS"))
(define-read-only (get-decimals) (ok u6))
(define-read-only (get-balance (account principal)) (ok (ft-get-balance rvus account)))
(define-read-only (get-total-supply) (ok (ft-get-supply rvus)))
(define-read-only (get-token-uri) (ok (var-get token-uri)))
(define-read-only (get-owner) (ok (var-get contract-owner)))
(define-read-only (get-minter) (ok (var-get minter)))

;; Protocol-level burn allowance for stream settlement
(define-public (protocol-burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq contract-caller (var-get minter)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (ft-burn? rvus amount owner)
  )
)
