import { clean, fail, ok, type ValidationResult } from "./result.js";

export const PLATE_COUNTIES: Readonly<Record<string, string>> = Object.freeze({
  AB: "Alba",
  AR: "Arad",
  AG: "Argeș",
  BC: "Bacău",
  BH: "Bihor",
  BN: "Bistrița-Năsăud",
  BT: "Botoșani",
  BV: "Brașov",
  BR: "Brăila",
  BZ: "Buzău",
  CS: "Caraș-Severin",
  CL: "Călărași",
  CT: "Constanța",
  CV: "Covasna",
  DB: "Dâmbovița",
  DJ: "Dolj",
  GL: "Galați",
  GR: "Giurgiu",
  GJ: "Gorj",
  HR: "Harghita",
  HD: "Hunedoara",
  IL: "Ialomița",
  IS: "Iași",
  IF: "Ilfov",
  MM: "Maramureș",
  MH: "Mehedinți",
  MS: "Mureș",
  NT: "Neamț",
  OT: "Olt",
  PH: "Prahova",
  SM: "Satu Mare",
  SJ: "Sălaj",
  SB: "Sibiu",
  SV: "Suceava",
  TR: "Teleorman",
  TM: "Timiș",
  TL: "Tulcea",
  VS: "Vaslui",
  VL: "Vâlcea",
  VN: "Vrancea",
  B: "București",
});

export interface PlateInfo {
  plate: string;
  countyCode: string;
  county: string;
}

/**
 * Validates the standard Romanian registration-plate format.
 * Spaces, dots and dashes are ignored; the returned plate is uppercase and compact.
 */
export function validatePlate(input: string): ValidationResult<PlateInfo> {
  if (typeof input !== "string") return fail("Numărul de înmatriculare trebuie să fie un șir de caractere");

  const plate = clean(input).toUpperCase();
  const bucharestMatch = /^B(\d{2,3})([A-Z]{3})$/.exec(plate);
  const countyMatch = /^([A-Z]{2})(\d{2})([A-Z]{3})$/.exec(plate);

  let countyCode: string;
  if (bucharestMatch) {
    countyCode = "B";
  } else if (countyMatch) {
    countyCode = countyMatch[1];
  } else {
    return fail("Numărul trebuie să conțină indicativul județului, 2 cifre (3 pentru București sunt permise) și 3 litere");
  }

  const county = PLATE_COUNTIES[countyCode];
  if (!county) return fail("Indicativul județului nu este valid");

  return ok({ plate, countyCode, county });
}

export const isValidPlate = (input: string): boolean => validatePlate(input).valid;
