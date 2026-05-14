import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const STREAM_AMOUNT = 100_000;  // 100,000 uSTX
const START_OFFSET = 2;
const DURATION = 100;

function setupVault() {
  simnet.callPublicFn("stream-vault", "set-registry",
    [Cl.principal(`${deployer}.stream-registry`)], deployer);
}

function openStream(sender = wallet1, recipient = wallet2, amount = STREAM_AMOUNT) {
  const start = simnet.blockHeight + START_OFFSET;
  const end = start + DURATION;
  return simnet.callPublicFn("stream-registry", "open-stream",
    [Cl.principal(recipient), Cl.uint(amount), Cl.uint(start), Cl.uint(end)], sender);
}

describe("stream-registry", () => {
  it("total streams opened starts at zero", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-streams-opened", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("next stream id starts at zero", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-next-stream-id", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("minimum stream amount is 10000 uSTX", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-min-stream-amount", [], deployer);
    expect(result).toBeOk(Cl.uint(10_000));
  });

  it("sender can open a stream", () => {
    setupVault();
    const { result } = openStream();
    expect(result).toBeOk(Cl.uint(0));
  });

  it("opening stream increments total streams counter", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-streams-opened", [], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it("opening stream increments sender stream count", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-sender-stream-count",
      [Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it("opening stream increments recipient stream count", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-recipient-stream-count",
      [Cl.principal(wallet2)], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it("rejects stream below minimum amount", () => {
    setupVault();
    const start = simnet.blockHeight + 2;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(9_999), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    expect(result).toBeErr(Cl.uint(311));
  });

  it("rejects self-stream", () => {
    setupVault();
    const start = simnet.blockHeight + 2;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet1), Cl.uint(STREAM_AMOUNT), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    expect(result).toBeErr(Cl.uint(312));
  });

  it("rejects stream with duration below minimum", () => {
    setupVault();
    const start = simnet.blockHeight + 2;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(STREAM_AMOUNT), Cl.uint(start), Cl.uint(start + 5)], wallet1);
    expect(result).toBeErr(Cl.uint(309));
  });

  it("stream is retrievable after opening", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.some(Cl.tuple({
      sender: Cl.principal(wallet1),
      recipient: Cl.principal(wallet2),
      "total-amount": Cl.uint(STREAM_AMOUNT),
      withdrawn: Cl.uint(0),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "paused-duration": Cl.uint(0),
      "pause-block": Cl.uint(0),
      "rate-per-block": Cl.uint(STREAM_AMOUNT / DURATION),
      "start-block": Cl.uint(simnet.blockHeight - 1 + START_OFFSET),
      "end-block": Cl.uint(simnet.blockHeight - 1 + START_OFFSET + DURATION),
      "last-withdraw-block": Cl.uint(simnet.blockHeight - 1 + START_OFFSET),
    })));
  });

  it("sender can pause an active stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("cannot pause an already paused stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(307));
  });

  it("sender can resume a paused stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("cannot resume a non-paused stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(308));
  });

  it("non-sender cannot pause stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(304));
  });

  it("sender can cancel stream and get refund", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("cannot cancel an already cancelled stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(305));
  });

  it("non-sender cannot cancel stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(304));
  });

  it("sender can top-up an active stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(50_000)], wallet1);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT + 50_000));
  });

  it("non-sender cannot top-up stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(50_000)], wallet2);
    expect(result).toBeErr(Cl.uint(304));
  });

  it("total volume tracks all opened streams", () => {
    setupVault();
    openStream(wallet1, wallet2, 50_000);
    openStream(wallet2, wallet1, 60_000);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-volume-streamed", [], deployer);
    expect(result).toBeOk(Cl.uint(110_000));
  });
});

describe("stream-registry helpers", () => {
  it("get-stream-rate returns correct rate per block", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-rate", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT / DURATION));
  });

  it("get-stream-remaining returns total amount before any withdrawal", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-remaining", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT));
  });

  it("get-stream-rate returns error for unknown stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-rate", [Cl.uint(999)], deployer);
    expect(result).toBeErr(Cl.uint(302));
  });
});

describe("stream-registry is-stream-active", () => {
  it("returns true for a freshly opened stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "is-stream-active", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("returns false after stream is cancelled", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "is-stream-active", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(false));
  });
});

describe("stream-registry protocol stats", () => {
  it("protocol stats shows correct totals after two streams", () => {
    setupVault();
    openStream(wallet1, wallet2, 50_000);
    openStream(wallet2, wallet1, 60_000);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-protocol-stats", [], deployer);
    expect(result).toBeOk(Cl.tuple({
      "total-opened": Cl.uint(2),
      "total-cancelled": Cl.uint(0),
      "total-volume": Cl.uint(110_000),
      "next-id": Cl.uint(2),
    }));
  });
});

describe("stream-registry elapsed time", () => {
  it("get-stream-elapsed returns zero before stream start block", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-elapsed", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("get-stream-elapsed returns error for unknown stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-elapsed", [Cl.uint(999)], deployer);
    expect(result).toBeErr(Cl.uint(302));
  });
});

describe("stream-registry top-up below minimum", () => {
  it("rejects top-up below minimum amount", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(9_999)], wallet1);
    expect(result).toBeErr(Cl.uint(311));
  });
});
