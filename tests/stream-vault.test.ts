import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("stream-vault", () => {
  it("total locked starts at zero", () => {
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-total-locked", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("stream balance returns zero for unknown stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("owner can set registry contract", () => {
    const { result } = simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    expect(result).toBeOk(Cl.principal(`${deployer}.stream-registry`));
  });

  it("non-owner cannot set registry", () => {
    const { result } = simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("only registry can lock funds directly", () => {
    const { result } = simnet.callPublicFn("stream-vault", "lock-stream-funds",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("only registry can release to recipient directly", () => {
    const { result } = simnet.callPublicFn("stream-vault", "release-to-recipient",
      [Cl.uint(0), Cl.uint(5_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("only registry can refund to sender directly", () => {
    const { result } = simnet.callPublicFn("stream-vault", "refund-to-sender",
      [Cl.uint(0), Cl.uint(5_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("only registry can top up funds directly", () => {
    const { result } = simnet.callPublicFn("stream-vault", "top-up-stream-funds",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("get-registry returns current registry address", () => {
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-registry", [], deployer);
    expect(result).toBeOk(Cl.principal(deployer));
  });
});

describe("stream-vault registry config", () => {
  it("registry address updates after set-registry", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-registry", [], deployer);
    expect(result).toBeOk(Cl.principal(`${deployer}.stream-registry`));
  });
});

describe("stream-vault utilization", () => {
  it("get-vault-utilization returns zero when no streams are locked", () => {
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-vault-utilization", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });
});

describe("stream-vault total-locked tracks stream funds", () => {
  it("total-locked increases after a stream is opened", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const start = simnet.blockHeight + 2;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(100_000), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-total-locked", [], deployer);
    expect(result).toBeOk(Cl.uint(100_000));
  });

  it("stream balance equals locked amount for a given stream id", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const start = simnet.blockHeight + 2;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(50_000), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.uint(50_000));
  });
});

describe("stream-vault zero top-up rejection", () => {
  it("rejects unauthorized direct call to lock-stream-funds", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const { result } = simnet.callPublicFn("stream-vault", "lock-stream-funds",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });
});

describe("stream-vault direct release rejection", () => {
  it("rejects unauthorized direct call to release-to-recipient", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const { result } = simnet.callPublicFn("stream-vault", "release-to-recipient",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet2)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });

  it("rejects unauthorized direct call to refund-to-sender", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const { result } = simnet.callPublicFn("stream-vault", "refund-to-sender",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });
});

describe("stream-vault multi-stream accounting", () => {
  it("vault total-locked decreases after a recipient withdrawal", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const start = simnet.blockHeight + 2;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(100_000), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    simnet.mineEmptyBlocks(start + 10 - simnet.blockHeight);
    simnet.callPublicFn("stream-registry", "withdraw-from-stream", [Cl.uint(0)], wallet2);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-total-locked", [], deployer);
    const { result: streamBal } = simnet.callReadOnlyFn("stream-vault", "get-stream-balance", [Cl.uint(0)], deployer);
    expect((result as any).value.value).toBeLessThan(100_000n);
    expect((streamBal as any).value.value).toBeLessThan(100_000n);
  });

  it("total-locked equals the sum of two open streams", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const start = simnet.blockHeight + 2;
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet2), Cl.uint(40_000), Cl.uint(start), Cl.uint(start + 100)], wallet1);
    simnet.callPublicFn("stream-registry", "open-stream",
      [Cl.principal(wallet1), Cl.uint(60_000), Cl.uint(start), Cl.uint(start + 100)], wallet2);
    const { result } = simnet.callReadOnlyFn("stream-vault", "get-total-locked", [], deployer);
    expect(result).toBeOk(Cl.uint(100_000));
  });
});
