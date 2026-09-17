import { describe, expect, it } from "vitest";
import { describeRiverRow, pageWindow, parseRiverParams, riverParamsToSearch } from "./moneyRiver";

describe("parseRiverParams", () => {
  it("defaults everything when the URL is bare", () => {
    expect(parseRiverParams(new URLSearchParams(""))).toEqual({
      race: "all",
      kind: "all",
      candidate: "",
      page: 1,
    });
  });

  it("reads valid values and upper-cases the race", () => {
    const p = new URLSearchParams(
      "race=ltgovernor&kind=outside&candidate=11111111-1111-1111-1111-111111111111&page=3",
    );
    expect(parseRiverParams(p)).toEqual({
      race: "LTGOVERNOR",
      kind: "outside",
      candidate: "11111111-1111-1111-1111-111111111111",
      page: 3,
    });
  });

  it("falls back on junk instead of throwing", () => {
    const p = new URLSearchParams("race=SENATE&kind=bribes&candidate=abbott&page=-2");
    expect(parseRiverParams(p)).toEqual({ race: "all", kind: "all", candidate: "", page: 1 });
    expect(parseRiverParams(new URLSearchParams("page=abc")).page).toBe(1);
  });

  it("round-trips through riverParamsToSearch, omitting defaults", () => {
    const f = { race: "ATTYGEN", kind: "loan" as const, candidate: "", page: 2 };
    const s = riverParamsToSearch(f);
    expect(s.toString()).toBe("race=ATTYGEN&kind=loan&page=2");
    expect(parseRiverParams(s)).toEqual(f);
    expect(riverParamsToSearch({ race: "all", kind: "all", candidate: "", page: 1 }).toString()).toBe("");
  });
});

describe("describeRiverRow", () => {
  const base = { candidate_name: "Greg Abbott", support_oppose: null };
  it("reads each kind as a sentence", () => {
    expect(describeRiverRow({ ...base, kind: "contribution", counterparty: "Jane Doe" })).toEqual({
      subject: "Jane Doe", verb: "gave to", object: "Greg Abbott",
    });
    expect(describeRiverRow({ ...base, kind: "expenditure", counterparty: "Anedot Inc" })).toEqual({
      subject: "Greg Abbott", verb: "paid", object: "Anedot Inc",
    });
    expect(describeRiverRow({ ...base, kind: "loan", counterparty: "Greg Abbott" })).toEqual({
      subject: "Greg Abbott", verb: "lent to", object: "Greg Abbott",
    });
    expect(describeRiverRow({ ...base, kind: "outside", counterparty: "Some PAC", support_oppose: "O" }).verb)
      .toBe("spent to oppose");
    expect(describeRiverRow({ ...base, kind: "outside", counterparty: "Some PAC", support_oppose: "S" }).verb)
      .toBe("spent to support");
  });
  it("labels a missing counterparty rather than printing blank", () => {
    expect(describeRiverRow({ ...base, kind: "contribution", counterparty: "  " }).subject).toBe("Unitemized");
  });
});

describe("pageWindow", () => {
  it("computes the visible range and clamps the page", () => {
    expect(pageWindow(1, 50, 120)).toEqual({ pages: 3, current: 1, from: 1, to: 50 });
    expect(pageWindow(3, 50, 120)).toEqual({ pages: 3, current: 3, from: 101, to: 120 });
    expect(pageWindow(9, 50, 120)).toEqual({ pages: 3, current: 3, from: 101, to: 120 });
    expect(pageWindow(1, 50, 0)).toEqual({ pages: 1, current: 1, from: 0, to: 0 });
  });
});
