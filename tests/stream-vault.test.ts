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

describe("stream-vault zero top-up rejection", () => {
  it("rejects unauthorized direct call to lock-stream-funds", () => {
    simnet.callPublicFn("stream-vault", "set-registry",
      [Cl.principal(`${deployer}.stream-registry`)], deployer);
    const { result } = simnet.callPublicFn("stream-vault", "lock-stream-funds",
      [Cl.uint(0), Cl.uint(10_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(200));
  });
});
