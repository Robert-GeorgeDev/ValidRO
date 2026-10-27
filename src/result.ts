export type ValidationResult<T = undefined> =
  | { valid: true; error: null; data: T }
  | { valid: false; error: string; data: null };

export const ok = <T>(data: T): ValidationResult<T> => ({ valid: true, error: null, data });

export const fail = <T = never>(error: string): ValidationResult<T> => ({
  valid: false,
  error,
  data: null,
});

/** Removes spaces, dashes and dots that people commonly type. */
export const clean = (input: string): string => input.replace(/[\s.\-]/g, "");
