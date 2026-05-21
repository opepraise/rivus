import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("sip010-trait compliance via rvus-token", () => {
  it("get-name returns Rivus", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-name", [], deployer);
    expect(result).toBeOk(Cl.stringAscii("Rivus"));
  });

  it("get-symbol returns RVUS", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-symbol", [], deployer);
    expect(result).toBeOk(Cl.stringAscii("RVUS"));
  });

  it("get-decimals returns 6", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-decimals", [], deployer);
    expect(result).toBeOk(Cl.uint(6));
  });

  it("get-balance returns zero for address with no tokens", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-balance",
      [Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("get-total-supply returns zero before any mint", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-total-supply", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("get-token-uri returns none before being set", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-token-uri", [], deployer);
    expect(result).toBeOk(Cl.none());
  });

  it("transfer reduces sender balance and increases recipient balance", () => {
    simnet.callPublicFn("rvus-token", "set-minter", [Cl.principal(deployer)], deployer);
    simnet.callPublicFn("rvus-token", "mint", [Cl.uint(500_000), Cl.principal(wallet1)], deployer);
    simnet.callPublicFn("rvus-token", "transfer",
      [Cl.uint(100_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()], wallet1);
    const { result: bal1 } = simnet.callReadOnlyFn("rvus-token", "get-balance",
      [Cl.principal(wallet1)], deployer);
    const { result: bal2 } = simnet.callReadOnlyFn("rvus-token", "get-balance",
      [Cl.principal(wallet2)], deployer);
    expect(bal1).toBeOk(Cl.uint(400_000));
    expect(bal2).toBeOk(Cl.uint(100_000));
  });
});
