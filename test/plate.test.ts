import { describe, expect, it } from "vitest";
import { isValidPlate, validatePlate } from "../src/index.js";

describe("validatePlate", () => {
  it("accepts county and Bucharest plates and returns county data", () => {
    expect(validatePlate("CJ 12 ABC")).toEqual({
      valid: true,
      error: null,
      data: { plate: "CJ12ABC", countyCode: "CJ", county: "Cluj" },
    });
    expect(validatePlate("B 123 ABC").data).toEqual({
      plate: "B123ABC",
      countyCode: "B",
      county: "București",
    });
    expect(validatePlate("B-12-ABC").valid).toBe(true);
  });

  it("normalizes separators and letter case", () => {
    expect(validatePlate(" cj-12 abc ").data).toEqual({
      plate: "CJ12ABC",
      countyCode: "CJ",
      county: "Cluj",
    });
    expect(validatePlate("b.123.abc").data?.plate).toBe("B123ABC");
  });

  it("accepts known county codes", () => {
    expect(isValidPlate("AB12ABC")).toBe(true);
    expect(isValidPlate("IF12ABC")).toBe(true);
    expect(isValidPlate("VN12ABC")).toBe(true);
  });

  it.each([
    "CJ1ABC",
    "CJ1234ABC",
    "CJ12AB",
    "CJ12ABCD",
    "XX12ABC",
    "B1ABC",
    "B1234ABC",
    "B12AB",
    "B123ABCD",
    "12ABC",
  ])("rejects invalid plate %s", (plate) => {
    expect(isValidPlate(plate)).toBe(false);
  });

  it("explains malformed input", () => {
    expect(validatePlate("CJ1ABC").error).toContain("indicativul județului");
  });
});
