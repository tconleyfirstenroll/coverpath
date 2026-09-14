// SSN formatting/validation helpers for the enrollment form. Mirrors
// agent360-rebuild's src/lib/ssn.ts (that's the server that ultimately
// stores/encrypts the value — kept in sync here so the two forms behave
// identically; the two repos don't share code).

/**
 * True for a plausible, correctly-shaped SSN: 9 digits, formatted as
 * XXX-XX-XXXX once dashes are normalized, excluding ranges the SSA never
 * issues (000/666/9xx area, 00 group, 0000 serial).
 */
export function isValidSSN(value: string | null | undefined): boolean {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 9) return false;
  const area = digits.slice(0, 3);
  const group = digits.slice(3, 5);
  const serial = digits.slice(5, 9);
  if (area === '000' || area === '666' || area.startsWith('9')) return false;
  if (group === '00') return false;
  if (serial === '0000') return false;
  return true;
}

/** Formats raw/partial digit input into XXX-XX-XXXX as the user types. */
export function formatSSNInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)].filter(Boolean);
  return parts.join('-');
}
