import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("rvus-token", () => {
  it("has correct name", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-name", [], deployer);
    expect(result).toBeOk(Cl.stringAscii("Rivus"));
  });

  it("has correct symbol", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-symbol", [], deployer);
    expect(result).toBeOk(Cl.stringAscii("RVUS"));
  });

  it("has 6 decimals", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-decimals", [], deployer);
    expect(result).toBeOk(Cl.uint(6));
  });

  it("total supply starts at zero", () => {
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-total-supply", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("minter can mint tokens", () => {
    const { result } = simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("mint increases recipient balance", () => {
    simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-balance", [Cl.principal(wallet1)], wallet1);
    expect(result).toBeOk(Cl.uint(1_000_000));
  });

  it("non-minter cannot mint", () => {
    const { result } = simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(100));
  });

  it("rejects zero mint amount", () => {
    const { result } = simnet.callPublicFn("rvus-token", "mint", [Cl.uint(0), Cl.principal(wallet1)], deployer);
    expect(result).toBeErr(Cl.uint(103));
  });

  it("minter can burn tokens", () => {
    simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("rvus-token", "burn", [Cl.uint(500_000), Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("token holder can transfer", () => {
    simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("rvus-token", "transfer",
      [Cl.uint(500_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("cannot transfer another user's tokens", () => {
    simnet.callPublicFn("rvus-token", "mint", [Cl.uint(1_000_000), Cl.principal(wallet1)], deployer);
    const { result } = simnet.callPublicFn("rvus-token", "transfer",
      [Cl.uint(500_000), Cl.principal(wallet1), Cl.principal(wallet2), Cl.none()], wallet2);
    expect(result).toBeErr(Cl.uint(101));
  });

  it("owner can update minter", () => {
    simnet.callPublicFn("rvus-token", "set-minter", [Cl.principal(wallet1)], deployer);
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-minter", [], deployer);
    expect(result).toBeOk(Cl.principal(wallet1));
  });

  it("owner can transfer ownership", () => {
    simnet.callPublicFn("rvus-token", "transfer-ownership", [Cl.principal(wallet1)], deployer);
    const { result } = simnet.callReadOnlyFn("rvus-token", "get-owner", [], deployer);
    expect(result).toBeOk(Cl.principal(wallet1));
  });
});
