import { clean, fail, ok, type ValidationResult } from "./result.js";

const CUI_KEY = "753217532";

export interface CuiInfo {
  /** the number without the RO prefix */
  cui: string;
  /** true when the input started with RO (VAT-registered form) */
  hasRoPrefix: boolean;
}

/** Computes the control digit for a CUI/CIF body (all digits except the last). */
export function cuiControlDigit(body: string): number {
  if (!/^\d{1,9}$/.test(body)) {
    throw new Error("cuiControlDigit expects 1 to 9 digits");
  }
  const padded = body.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(padded[i]) * Number(CUI_KEY[i]);
  }
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

/**
 * Validates a Romanian company fiscal code (CUI / CIF).
 * Accepts "14399840", "RO14399840" and "RO 14399840".
 */
export function validateCui(input: string): ValidationResult<CuiInfo> {
  if (typeof input !== "string") return fail("CUI-ul trebuie să fie un șir de caractere");
  let value = clean(input).toUpperCase();

  const hasRoPrefix = value.startsWith("RO");
  if (hasRoPrefix) value = value.slice(2);

  if (!/^\d+$/.test(value)) return fail("CUI-ul poate conține doar cifre (opțional prefixul RO)");
  if (value.length < 2 || value.length > 10) return fail("CUI-ul trebuie să aibă între 2 și 10 cifre");
  if (value[0] === "0") return fail("CUI-ul nu poate începe cu 0");

  const body = value.slice(0, -1);
  const expected = cuiControlDigit(body);
  if (expected !== Number(value[value.length - 1])) {
    return fail(`Cifra de control este greșită (așteptat ${expected})`);
  }

  return ok({ cui: value, hasRoPrefix });
}

export const isValidCui = (input: string): boolean => validateCui(input).valid;
