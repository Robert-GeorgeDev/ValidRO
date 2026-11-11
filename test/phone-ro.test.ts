import { describe, expect, it } from "vitest";
import { isValidPhoneRo, validatePhoneRo } from "../src/phone-ro.js";

describe("Romanian phone number", () => {
  it("normalizes national mobile numbers", () => {
    expect(validatePhoneRo("0723 456 789")).toEqual({
      valid: true,
      error: null,
      data: { normalized: "+40723456789" },
    });
    expect(validatePhoneRo("07-23-456-789").data).toEqual({ normalized: "+40723456789" });
  });

  it("accepts international prefixes and normalizes to E.164", () => {
    expect(validatePhoneRo("+40 723 456 789").data).toEqual({ normalized: "+40723456789" });
    expect(validatePhoneRo("0040723456789").data).toEqual({ normalized: "+40723456789" });
  });

  it("accepts Romanian landline numbers", () => {
    expect(validatePhoneRo("021 345 6789").data).toEqual({ normalized: "+40213456789" });
    expect(validatePhoneRo("0313456789").data).toEqual({ normalized: "+40313456789" });
  });

  it("rejects unsupported prefixes and malformed lengths", () => {
    expect(isValidPhoneRo("0123456789")).toBe(false);
    expect(isValidPhoneRo("072345678")).toBe(false);
    expect(isValidPhoneRo("+44123456789")).toBe(false);
    expect(isValidPhoneRo("not a phone number")).toBe(false);
  });

  it("returns Romanian error messages", () => {
    expect(validatePhoneRo("123").error).toContain("trebuie să înceapă");
  });
});
