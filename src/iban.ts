import { clean, fail, ok, type ValidationResult } from "./result.js";

export interface IbanInfo {
  /** IBAN without spaces, upper case */
  iban: string;
  /** IBAN grouped in blocks of 4, as printed on invoices */
  formatted: string;
  /** 4-letter bank code, e.g. BTRL, RNCB, TREZ */
  bankCode: string;
  /** true for State Treasury accounts (TREZ) */
  treasury: boolean;
}

/** ISO 13616 mod-97 check: works for IBANs of any country. */
export function ibanChecksumOk(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    const digits = code >= 65 && code <= 90 ? String(code - 55) : ch;
    for (const d of digits) {
      remainder = (remainder * 10 + Number(d)) % 97;
    }
  }
  return remainder === 1;
}

/** Validates a Romanian IBAN: RO + 2 check digits + 4-letter bank code + 16 characters. */
export function validateIbanRo(input: string): ValidationResult<IbanInfo> {
  if (typeof input !== "string") return fail("IBAN-ul trebuie să fie un șir de caractere");
  const iban = clean(input).toUpperCase();

  if (!iban.startsWith("RO")) return fail("IBAN-ul românesc trebuie să înceapă cu RO");
  if (iban.length !== 24) return fail("IBAN-ul românesc trebuie să aibă exact 24 de caractere");
  if (!/^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/.test(iban)) {
    return fail("Format invalid: RO + 2 cifre + 4 litere (codul băncii) + 16 caractere");
  }
  if (!ibanChecksumOk(iban)) return fail("Cifrele de control ale IBAN-ului sunt greșite");

  const bankCode = iban.slice(4, 8);
  return ok({
    iban,
    formatted: iban.replace(/(.{4})/g, "$1 ").trim(),
    bankCode,
    treasury: bankCode === "TREZ",
  });
}

export const isValidIbanRo = (input: string): boolean => validateIbanRo(input).valid;
