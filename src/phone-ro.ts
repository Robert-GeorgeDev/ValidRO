import { clean, fail, ok, type ValidationResult } from "./result.js";

export interface PhoneRoInfo {
  /** Romanian phone number normalized to E.164 format. */
  normalized: string;
}

/**
 * Validates a Romanian mobile or landline number and normalizes it to E.164.
 * Accepts national numbers (07..., 02... or 03...) and +40 / 0040 prefixes.
 * Spaces, dots and dashes are ignored.
 */
export function validatePhoneRo(input: string): ValidationResult<PhoneRoInfo> {
  if (typeof input !== "string") return fail("Numărul de telefon trebuie să fie un șir de caractere");

  const phone = clean(input);
  let nationalNumber: string;

  if (phone.startsWith("+40")) {
    nationalNumber = phone.slice(3);
  } else if (phone.startsWith("0040")) {
    nationalNumber = phone.slice(4);
  } else if (/^0/.test(phone)) {
    if (!/^0[237]\d{8}$/.test(phone)) {
      return fail("Numărul de telefon trebuie să fie un număr mobil sau fix din România");
    }
    nationalNumber = phone.slice(1);
  } else {
    return fail("Numărul de telefon trebuie să înceapă cu 0, +40 sau 0040");
  }

  if (!/^[237]\d{8}$/.test(nationalNumber)) {
    return fail("Numărul de telefon trebuie să fie un număr mobil sau fix din România");
  }

  return ok({ normalized: `+40${nationalNumber}` });
}

export const isValidPhoneRo = (input: string): boolean => validatePhoneRo(input).valid;
