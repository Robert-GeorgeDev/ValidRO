import { CNP_COUNTIES } from "./counties.js";
import { clean, fail, ok, type ValidationResult } from "./result.js";

const CNP_KEY = "279146358279";

export type Sex = "M" | "F" | null;

export interface CnpInfo {
  cnp: string;
  sex: Sex;
  birthDate: string; // ISO date, YYYY-MM-DD
  countyCode: string;
  county: string;
  /** true for codes 7, 8, 9 (foreign residents / foreign citizens) */
  foreigner: boolean;
}

/** Computes the CNP control digit from its first 12 digits. */
export function cnpControlDigit(first12: string): number {
  if (!/^\d{12}$/.test(first12)) {
    throw new Error("cnpControlDigit expects exactly 12 digits");
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(first12[i]) * Number(CNP_KEY[i]);
  }
  const rest = sum % 11;
  return rest === 10 ? 1 : rest;
}

function centuryFor(s: number, yy: number, now: Date): number | null {
  switch (s) {
    case 1:
    case 2:
      return 1900;
    case 3:
    case 4:
      return 1800;
    case 5:
    case 6:
      return 2000;
    case 7:
    case 8:
    case 9: {
      // The century is not encoded for foreigners: choose the most recent
      // century that does not put the birth date in the future.
      return 2000 + yy <= now.getFullYear() ? 2000 : 1900;
    }
    default:
      return null;
  }
}

function sexFor(s: number): Sex {
  if (s === 9) return null;
  return s % 2 === 1 ? "M" : "F";
}

/**
 * Validates a Romanian personal numeric code (CNP) and decodes it.
 *
 * @param input the CNP; spaces, dots and dashes are ignored
 * @param now reference date used to reject birth dates in the future
 */
export function validateCnp(input: string, now: Date = new Date()): ValidationResult<CnpInfo> {
  if (typeof input !== "string") return fail("CNP-ul trebuie să fie un șir de caractere");
  const cnp = clean(input);

  if (!/^\d{13}$/.test(cnp)) return fail("CNP-ul trebuie să aibă exact 13 cifre");

  const s = Number(cnp[0]);
  if (s === 0) return fail("Prima cifră (sexul) nu poate fi 0");

  const yy = Number(cnp.slice(1, 3));
  const mm = Number(cnp.slice(3, 5));
  const dd = Number(cnp.slice(5, 7));
  const century = centuryFor(s, yy, now);
  if (century === null) return fail("Prima cifră (sexul) nu este validă");
  const year = century + yy;

  const date = new Date(Date.UTC(year, mm - 1, dd));
  const dateIsReal =
    mm >= 1 &&
    mm <= 12 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === mm - 1 &&
    date.getUTCDate() === dd;
  if (!dateIsReal) return fail("Data nașterii din CNP nu este o dată validă");

  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (date.getTime() > today) return fail("Data nașterii din CNP este în viitor");

  const countyCode = cnp.slice(7, 9);
  const county = CNP_COUNTIES[countyCode];
  if (!county) return fail(`Codul de județ ${countyCode} nu există`);

  if (cnp.slice(9, 12) === "000") return fail("Numărul de ordine (NNN) nu poate fi 000");

  const expected = cnpControlDigit(cnp.slice(0, 12));
  if (expected !== Number(cnp[12])) {
    return fail(`Cifra de control este greșită (așteptat ${expected})`);
  }

  return ok({
    cnp,
    sex: sexFor(s),
    birthDate: date.toISOString().slice(0, 10),
    countyCode,
    county,
    foreigner: s >= 7,
  });
}

/** Shortcut that returns only true/false. */
export const isValidCnp = (input: string, now?: Date): boolean => validateCnp(input, now).valid;
