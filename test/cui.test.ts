import { describe, expect, it } from "vitest";
import { cuiControlDigit, isValidCui, validateCui } from "../src/index.js";

describe("validateCui", () => {
  it("accepts a valid CUI with and without the RO prefix", () => {
    expect(validateCui("14399840")).toEqual({
      valid: true,
      error: null,
      data: { cui: "14399840", hasRoPrefix: false },
    });
    expect(validateCui("RO14399840").data).toEqual({ cui: "14399840", hasRoPrefix: true });
    expect(isValidCui("ro 14399840")).toBe(true);
  });

  it("rejects a wrong control digit", () => {
    const r = validateCui("14399841");
    expect(r.valid).toBe(false);
    expect(r.error).toContain("așteptat 0");
  });

  it.each([
    ["", "doar cifre"],
    ["RO", "doar cifre"],
    ["1439984A", "doar cifre"],
    ["1", "între 2 și 10"],
    ["12345678901", "între 2 și 10"],
    ["01439984", "nu poate începe cu 0"],
  ])("rejects %j (%s)", (cui, message) => {
    const r = validateCui(cui);
    expect(r.valid).toBe(false);
    expect(r.error).toContain(message);
  });

  it("maps remainder 10 to control digit 0", () => {
    let found = "";
    for (let n = 10; n < 100000 && !found; n++) {
      const body = String(n);
      const padded = body.padStart(9, "0");
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += Number(padded[i]) * Number("753217532"[i]);
      if ((sum * 10) % 11 === 10) found = body;
    }
    expect(found).not.toBe("");
    expect(cuiControlDigit(found)).toBe(0);
    expect(isValidCui(found + "0")).toBe(true);
  });
});
