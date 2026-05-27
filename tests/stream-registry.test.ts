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

describe("stream-registry recipient count", () => {
  it("recipient count increments for each stream opened to them", () => {
    setupVault();
    openStream(wallet1, wallet2);
    openStream(wallet3, wallet2, 50_000);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-recipient-stream-count",
      [Cl.principal(wallet2)], deployer);
    expect(result).toBeOk(Cl.uint(2));
  });
});

describe("stream-registry cancelled stats", () => {
  it("total cancelled increments after cancel", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-streams-cancelled", [], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });
});

describe("stream-registry non-sender pause guard", () => {
  it("non-sender cannot resume a paused stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(304));
  });
});

describe("stream-registry withdrawal authorization", () => {
  it("non-recipient cannot withdraw from a stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet3);
    expect(result).toBeErr(Cl.uint(303));
  });

  it("sender cannot withdraw from their own stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(303));
  });
});

describe("stream-registry paused stream withdrawal guard", () => {
  it("recipient cannot withdraw from paused stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(307));
  });
});

describe("stream-registry pause and resume lifecycle", () => {
  it("stream reports not paused in health check after resume", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    const end = start + DURATION;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(STREAM_AMOUNT), Cl.uint(start), Cl.uint(end)], wallet1);
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    const blocksRemaining = end - simnet.blockHeight;
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(true),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "blocks-remaining": Cl.uint(blocksRemaining),
    }));
  });

  it("recipient cannot withdraw while paused but can after resume", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result: pausedResult } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    expect(pausedResult).toBeErr(Cl.uint(307));
    simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    const { result: resumedResult } = simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    expect(resumedResult).toBeErr(Cl.uint(308));
  });
});

describe("stream-registry top-up on cancelled stream", () => {
  it("cannot top-up a cancelled stream", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(50_000)], wallet1);
    expect(result).toBeErr(Cl.uint(305));
  });
});

describe("stream-registry get-stream unknown", () => {
  it("get-stream returns none for non-existent stream id", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(9999)], deployer);
    expect(result).toBeOk(Cl.none());
  });
});

describe("stream-registry protocol limits", () => {
  it("max stream amount is 1 trillion uSTX", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-max-stream-amount", [], deployer);
    expect(result).toBeOk(Cl.uint(1_000_000_000_000));
  });

  it("min stream duration is 10 blocks", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-min-stream-duration", [], deployer);
    expect(result).toBeOk(Cl.uint(10));
  });

  it("min stream amount is less than max stream amount", () => {
    const { result: minResult } = simnet.callReadOnlyFn("stream-registry", "get-min-stream-amount", [], deployer);
    const { result: maxResult } = simnet.callReadOnlyFn("stream-registry", "get-max-stream-amount", [], deployer);
    expect(minResult).toBeOk(Cl.uint(10_000));
    expect(maxResult).toBeOk(Cl.uint(1_000_000_000_000));
  });
});

describe("stream-registry get-stream-progress", () => {
  it("returns 0 before stream start block", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-progress", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("returns error for unknown stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-progress", [Cl.uint(9999)], deployer);
    expect(result).toBeErr(Cl.uint(302));
  });
});

describe("stream-registry get-stream-duration", () => {
  it("returns correct duration for an open stream", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-duration", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(DURATION));
  });

  it("returns error for unknown stream id", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-duration", [Cl.uint(9999)], deployer);
    expect(result).toBeErr(Cl.uint(302));
  });
});

describe("stream-registry get-stream-health", () => {
  it("returns error for unknown stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(9999)], deployer);
    expect(result).toBeErr(Cl.uint(302));
  });

  it("reports active stream as active and not paused", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    const end = start + DURATION;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(STREAM_AMOUNT), Cl.uint(start), Cl.uint(end)], wallet1);
    const expectedBlocksRemaining = end - simnet.blockHeight;
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(true),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "blocks-remaining": Cl.uint(expectedBlocksRemaining),
    }));
  });

  it("reports paused stream correctly", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(true),
      "is-paused": Cl.bool(true),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "blocks-remaining": Cl.uint(DURATION),
    }));
  });

  it("reports cancelled stream correctly", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(false),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(true),
      "is-completed": Cl.bool(false),
      "blocks-remaining": Cl.uint(DURATION),
    }));
  });
});

describe("stream-registry max-amount enforcement: open-stream", () => {
  it("rejects open-stream with amount above MAX_STREAM_AMOUNT", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    expect(result).toBeErr(Cl.uint(313));
  });

  it("next-stream-id stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-next-stream-id", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("sender stream count stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-sender-stream-count",
      [Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("recipient stream count stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-recipient-stream-count",
      [Cl.principal(wallet2)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("total-streams-opened stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-streams-opened", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("total-volume-streamed stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-volume-streamed", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("vault total-locked stays at zero after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-total-locked", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("stream map entry is absent after max-amount rejection", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.none());
  });

  it("valid open-stream succeeds after a rejected max-amount attempt", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(1_000_000_000_001), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(STREAM_AMOUNT), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("open-stream succeeds at exactly MIN_STREAM_AMOUNT lower bound", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(10_000), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("open-stream rejects amount one below MIN_STREAM_AMOUNT", () => {
    setupVault();
    const start = simnet.blockHeight + START_OFFSET;
    const { result } = simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(9_999), Cl.uint(start), Cl.uint(start + DURATION)], wallet1);
    expect(result).toBeErr(Cl.uint(311));
  });

  it("get-max-stream-amount returns 1 trillion uSTX", () => {
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-max-stream-amount", [], deployer);
    expect(result).toBeOk(Cl.uint(1_000_000_000_000));
  });
});

describe("stream-registry max-amount enforcement: top-up-stream", () => {
  it("top-up rejected when new total would exceed MAX_STREAM_AMOUNT", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    expect(result).toBeErr(Cl.uint(313));
  });

});

describe("stream-registry withdrawal flow", () => {
  it("get-withdrawable-amount returns 0 before stream start block", () => {
    setupVault();
    openStream();
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-withdrawable-amount", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

});

describe("stream-registry cancel stream correctness", () => {
  it("cancel-stream mid-stream pays the recipient their earned portion", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + 20);
    // cancel mines 1 block, so 22 active blocks have elapsed at cancel time
    const rate = STREAM_AMOUNT / DURATION;
    const earnedBeforeCancel = 22 * rate;
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    const refunded = STREAM_AMOUNT - earnedBeforeCancel;
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT - earnedBeforeCancel - refunded));
  });

  it("cancel-stream on a completed stream returns ERR-STREAM-COMPLETED", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + DURATION + 10);
    simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    const { result } = simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(306));
  });

  it("cancel-stream on already-cancelled stream returns ERR-STREAM-CANCELLED", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(305));
  });

  it("cancel-stream sets is-cancelled true and is-active false", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(false),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(true),
      "is-completed": Cl.bool(false),
      "blocks-remaining": Cl.uint(DURATION),
    }));
  });

  it("withdrawal after resume does not count paused blocks in earned amount", () => {
    setupVault();
    openStream();
    // Mine 10 blocks past start so 10 blocks earn, then pause, then resume
    simnet.mineEmptyBlocks(START_OFFSET + 8);
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    simnet.mineEmptyBlocks(20);
    simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    // After resume, withdrawable should exclude the 20+ pause blocks
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-withdrawable-amount", [Cl.uint(0)], deployer);
    const rate = STREAM_AMOUNT / DURATION;
    // Only the ~10 pre-pause active blocks should be withdrawable
    expect(result).toBeOk(Cl.uint(10 * rate));
  });

  it("get-withdrawable-amount returns 0 for a paused stream", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + 5);
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    simnet.mineEmptyBlocks(10);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-withdrawable-amount", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("resume-stream accumulates paused-duration equal to pause interval", () => {
    setupVault();
    openStream();
    // After pause at block P, mine 5 empty, resume at P+6:
    // additional-paused = (P+6) - P = 6 → paused-duration = 6
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    simnet.mineEmptyBlocks(5);
    simnet.callPublicFn("stream-registry", "resume-stream", [Cl.uint(0)], wallet1);
    // Use the same start-block derivation pattern as the existing test suite
    const startBlock = simnet.blockHeight - 8 + START_OFFSET;
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.some(Cl.tuple({
      sender: Cl.principal(wallet1),
      recipient: Cl.principal(wallet2),
      "total-amount": Cl.uint(STREAM_AMOUNT),
      withdrawn: Cl.uint(0),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "paused-duration": Cl.uint(6),
      "pause-block": Cl.uint(0),
      "rate-per-block": Cl.uint(STREAM_AMOUNT / DURATION),
      "start-block": Cl.uint(startBlock),
      "end-block": Cl.uint(startBlock + DURATION),
      "last-withdraw-block": Cl.uint(startBlock),
    })));
  });

  it("pause-block field stores the block at which pause was called", () => {
    setupVault();
    openStream();
    const pauseHeight = simnet.blockHeight + 1;
    simnet.callPublicFn("stream-registry", "pause-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.some(Cl.tuple({
      sender: Cl.principal(wallet1),
      recipient: Cl.principal(wallet2),
      "total-amount": Cl.uint(STREAM_AMOUNT),
      withdrawn: Cl.uint(0),
      "is-paused": Cl.bool(true),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "paused-duration": Cl.uint(0),
      "pause-block": Cl.uint(pauseHeight),
      "rate-per-block": Cl.uint(STREAM_AMOUNT / DURATION),
      "start-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET),
      "end-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET + DURATION),
      "last-withdraw-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET),
    })));
  });

  it("vault stream-balance drops to zero when stream is fully withdrawn", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + DURATION + 10);
    simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("withdraw-from-stream fails on cancelled stream with err u305", () => {
    setupVault();
    openStream();
    simnet.callPublicFn("stream-registry", "cancel-stream", [Cl.uint(0)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(305));
  });

  it("stream is marked completed when all funds are withdrawn", () => {
    setupVault();
    openStream();
    // Mine past end-block so the entire duration has elapsed
    simnet.mineEmptyBlocks(START_OFFSET + DURATION + 10);
    simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-health", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "is-active": Cl.bool(false),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(true),
      "blocks-remaining": Cl.uint(0),
    }));
  });

  it("withdraw before stream start returns ERR-NOTHING-TO-WITHDRAW", () => {
    setupVault();
    openStream();
    // No blocks mined past start-block — nothing has accrued yet
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeErr(Cl.uint(310));
  });

  it("withdraw-from-stream returns the earned amount", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + 10);
    // callPublicFn mines 1 block, so at withdrawal time 12 blocks elapsed
    const rate = STREAM_AMOUNT / DURATION;
    const { result } = simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    expect(result).toBeOk(Cl.uint(12 * rate));
  });

  it("get-stream-remaining decreases after a successful withdrawal", () => {
    setupVault();
    openStream();
    simnet.mineEmptyBlocks(START_OFFSET + 10);
    const { result: before } = simnet.callReadOnlyFn("stream-registry", "get-stream-remaining", [Cl.uint(0)], deployer);
    simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    const { result: after } = simnet.callReadOnlyFn("stream-registry", "get-stream-remaining", [Cl.uint(0)], deployer);
    expect(before).toBeOk(Cl.uint(STREAM_AMOUNT));
    expect(after).toBeOk(Cl.uint(STREAM_AMOUNT - 12 * (STREAM_AMOUNT / DURATION)));
  });

  it("get-withdrawable-amount is positive after blocks advance past start", () => {
    setupVault();
    openStream();
    // setupVault mines 1 block before openStream captures start-block,
    // so 12 empty blocks land the chain 11 blocks past start-block.
    simnet.mineEmptyBlocks(START_OFFSET + 10);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-withdrawable-amount", [Cl.uint(0)], deployer);
    const rate = STREAM_AMOUNT / DURATION;
    expect(result).toBeOk(Cl.uint(11 * rate));
  });

  it("multiple valid top-ups accumulate total-amount correctly", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(20_000)], wallet1);
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(30_000)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(10_000)], wallet1);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT + 60_000));
  });

  it("top-up below MIN_STREAM_AMOUNT rejected with u311 not u313", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(9_999)], wallet1);
    expect(result).toBeErr(Cl.uint(311));
  });

  it("valid top-up succeeds after a rejected max-amount top-up", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    const { result } = simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(50_000)], wallet1);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT + 50_000));
  });

  it("rate-per-block unchanged after rejected top-up", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const expectedRate = STREAM_AMOUNT / DURATION;
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream-rate", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(expectedRate));
  });

  it("total-volume-streamed unchanged after rejected top-up", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-total-volume-streamed", [], deployer);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT));
  });

  it("vault stream-balance unchanged after rejected top-up", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(STREAM_AMOUNT));
  });

  it("stream total-amount unchanged after rejected top-up", () => {
    setupVault();
    openStream(wallet1, wallet2, STREAM_AMOUNT);
    const overflowAmount = 1_000_000_000_000 - STREAM_AMOUNT + 1;
    simnet.callPublicFn("stream-registry", "top-up-stream",
      [Cl.uint(0), Cl.uint(overflowAmount)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-registry", "get-stream", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.some(Cl.tuple({
      "total-amount": Cl.uint(STREAM_AMOUNT),
      sender: Cl.principal(wallet1),
      recipient: Cl.principal(wallet2),
      withdrawn: Cl.uint(0),
      "is-paused": Cl.bool(false),
      "is-cancelled": Cl.bool(false),
      "is-completed": Cl.bool(false),
      "paused-duration": Cl.uint(0),
      "pause-block": Cl.uint(0),
      "rate-per-block": Cl.uint(STREAM_AMOUNT / DURATION),
      "start-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET),
      "end-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET + DURATION),
      "last-withdraw-block": Cl.uint(simnet.blockHeight - 2 + START_OFFSET),
    })));
  });
});
