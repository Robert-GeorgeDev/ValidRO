import { describe, expect, it } from "vitest";
import { ibanChecksumOk, isValidIbanRo, validateIbanRo } from "../src/index.js";

// Official example from the ISO 13616 IBAN registry.
const EXAMPLE = "RO49AAAA1B31007593840000";

describe("validateIbanRo", () => {
  it("accepts the registry example and formats it", () => {
    const r = validateIbanRo(EXAMPLE);
    expect(r.valid).toBe(true);
    expect(r.data).toEqual({
      iban: EXAMPLE,
      formatted: "RO49 AAAA 1B31 0075 9384 0000",
      bankCode: "AAAA",
      treasury: false,
    });
  });

  it("accepts lower case and spaces", () => {
    expect(isValidIbanRo("ro49 aaaa 1b31 0075 9384 0000")).toBe(true);
  });

  it("flags treasury accounts", () => {
    // Build a valid TREZ IBAN by computing its check digits.
    const bban = "TREZ" + "1234567890123456";
    const numeric = (bban + "RO00")
      .split("")
      .map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c))
      .join("");
    const check = 98 - Number(BigInt(numeric) % 97n);
    const iban = "RO" + String(check).padStart(2, "0") + bban;
    const r = validateIbanRo(iban);
    expect(r.valid).toBe(true);
    expect(r.data?.treasury).toBe(true);
  });

  it.each([
    ["DE89370400440532013000", "înceapă cu RO"],
    ["RO49AAAA1B3100759384000", "24 de caractere"],
    ["RO49AAA11B31007593840000", "Format invalid"],
    ["RO48AAAA1B31007593840000", "control"],
    ["RO49AAAA1B31007593840001", "control"],
  ])("rejects %s (%s)", (iban, message) => {
    const r = validateIbanRo(iban);
    expect(r.valid).toBe(false);
    expect(r.error).toContain(message);
  });

  it("checks other countries' IBANs with the generic mod-97 helper", () => {
    expect(ibanChecksumOk("DE89370400440532013000")).toBe(true);
    expect(ibanChecksumOk("GB82WEST12345698765432")).toBe(true);
  });
});
