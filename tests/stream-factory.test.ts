import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

function setupAll() {
  simnet.callPublicFn("stream-vault", "set-registry",
    [Cl.principal(`${deployer}.stream-registry`)], deployer);
}

describe("stream-factory", () => {
  it("blocks per month is 4320", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-blocks-per-month", [], deployer);
    expect(result).toBeOk(Cl.uint(4320));
  });

  it("min stream amount is 10000", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-min-stream-amount", [], deployer);
    expect(result).toBeOk(Cl.uint(10_000));
  });

  it("estimates payroll total correctly", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-payroll-total",
      [Cl.uint(50_000), Cl.uint(3)], deployer);
    expect(result).toBeOk(Cl.uint(150_000));
  });

  it("estimates rate per block correctly", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-rate-per-block",
      [Cl.uint(100_000), Cl.uint(1000)], deployer);
    expect(result).toBeOk(Cl.uint(100));
  });

  it("returns error for zero duration rate estimate", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-rate-per-block",
      [Cl.uint(100_000), Cl.uint(0)], deployer);
    expect(result).toBeErr(Cl.uint(403));
  });

  it("total factory streams starts at zero", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-total-factory-streams", [], deployer);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("create-payroll-stream opens a stream via registry", () => {
    setupAll();
    const start = simnet.blockHeight + 2;
    const { result } = simnet.callPublicFn("stream-factory", "create-payroll-stream",
      [Cl.principal(wallet2), Cl.uint(50_000), Cl.uint(3), Cl.uint(start)], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("create-payroll-stream increments factory stream counter", () => {
    setupAll();
    const start = simnet.blockHeight + 2;
    simnet.callPublicFn("stream-factory", "create-payroll-stream",
      [Cl.principal(wallet2), Cl.uint(50_000), Cl.uint(3), Cl.uint(start)], wallet1);
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-total-factory-streams", [], deployer);
    expect(result).toBeOk(Cl.uint(1));
  });

  it("create-vesting-stream opens a stream via registry", () => {
    setupAll();
    const { result } = simnet.callPublicFn("stream-factory", "create-vesting-stream",
      [Cl.principal(wallet2), Cl.uint(100_000), Cl.uint(10), Cl.uint(500)], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it("rejects payroll with zero months", () => {
    setupAll();
    const start = simnet.blockHeight + 2;
    const { result } = simnet.callPublicFn("stream-factory", "create-payroll-stream",
      [Cl.principal(wallet2), Cl.uint(50_000), Cl.uint(0), Cl.uint(start)], wallet1);
    expect(result).toBeErr(Cl.uint(404));
  });

  it("rejects vesting with zero vesting blocks", () => {
    setupAll();
    const { result } = simnet.callPublicFn("stream-factory", "create-vesting-stream",
      [Cl.principal(wallet2), Cl.uint(100_000), Cl.uint(10), Cl.uint(0)], wallet1);
    expect(result).toBeErr(Cl.uint(403));
  });
});

describe("stream-factory estimate-vesting-end", () => {
  it("returns a future block for valid cliff and vesting", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-end",
      [Cl.uint(10), Cl.uint(500)], deployer);
    expect(result).toBeOk(Cl.uint(simnet.blockHeight + 510));
  });
});

describe("stream-factory owner", () => {
  it("get-owner returns deployer address", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-owner", [], deployer);
    expect(result).toBeOk(Cl.principal(deployer));
  });
});

describe("stream-factory vesting end estimate", () => {
  it("returns incrementing block for different cliff+vest combos", () => {
    const { result: r1 } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-end",
      [Cl.uint(5), Cl.uint(100)], deployer);
    const { result: r2 } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-end",
      [Cl.uint(10), Cl.uint(100)], deployer);
    expect(r1).toBeOk(Cl.uint(simnet.blockHeight + 105));
    expect(r2).toBeOk(Cl.uint(simnet.blockHeight + 110));
  });
});

describe("stream-factory time constants", () => {
  it("blocks per week is 1080", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-blocks-per-week", [], deployer);
    expect(result).toBeOk(Cl.uint(1080));
  });

  it("blocks per day is 144", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "get-blocks-per-day", [], deployer);
    expect(result).toBeOk(Cl.uint(144));
  });

  it("blocks per day times 7 equals blocks per week", () => {
    const { result: dayResult } = simnet.callReadOnlyFn("stream-factory", "get-blocks-per-day", [], deployer);
    const { result: weekResult } = simnet.callReadOnlyFn("stream-factory", "get-blocks-per-week", [], deployer);
    expect(dayResult).toBeOk(Cl.uint(144));
    expect(weekResult).toBeOk(Cl.uint(1080));
  });

  it("estimate-payroll-duration returns correct block count for 3 months", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-payroll-duration",
      [Cl.uint(3)], deployer);
    expect(result).toBeOk(Cl.uint(3 * 4320));
  });
});

describe("stream-factory estimate-weekly-cost", () => {
  it("returns correct breakdown for valid weekly stream", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-weekly-cost",
      [Cl.uint(50_000), Cl.uint(4)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "total-amount": Cl.uint(200_000),
      "total-blocks": Cl.uint(4 * 1080),
      "rate-per-block": Cl.uint(Math.floor(50_000 / 1080)),
      "weeks": Cl.uint(4),
    }));
  });

  it("rejects weekly cost below minimum stream amount", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-weekly-cost",
      [Cl.uint(1_000), Cl.uint(1)], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });

  it("rejects zero weeks", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-weekly-cost",
      [Cl.uint(50_000), Cl.uint(0)], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });
});

describe("stream-factory estimate-vesting-cost", () => {
  it("returns full cost breakdown for valid inputs", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-cost",
      [Cl.uint(100_000), Cl.uint(10), Cl.uint(500)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "total-amount": Cl.uint(100_000),
      "cliff-blocks": Cl.uint(10),
      "vesting-blocks": Cl.uint(500),
      "rate-per-block": Cl.uint(200),
      "total-blocks": Cl.uint(510),
    }));
  });

  it("accepts amount exactly at minimum", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-cost",
      [Cl.uint(10_000), Cl.uint(0), Cl.uint(100)], deployer);
    expect(result).toBeOk(Cl.tuple({
      "total-amount": Cl.uint(10_000),
      "cliff-blocks": Cl.uint(0),
      "vesting-blocks": Cl.uint(100),
      "rate-per-block": Cl.uint(100),
      "total-blocks": Cl.uint(100),
    }));
  });

  it("rejects amount below minimum", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-cost",
      [Cl.uint(9_999), Cl.uint(10), Cl.uint(500)], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });

  it("rejects zero vesting blocks", () => {
    const { result } = simnet.callReadOnlyFn("stream-factory", "estimate-vesting-cost",
      [Cl.uint(100_000), Cl.uint(10), Cl.uint(0)], deployer);
    expect(result).toBeErr(Cl.uint(404));
  });
});
