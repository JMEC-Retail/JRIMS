// Enforces: VENDOR(3)_CATEGORY(5)_BRAND(4)_INCR(5)
// Segments are A–Z / 0–9; INCR is zero-padded digits.

export const VENDOR_LEN   = 3;
export const CATEGORY_LEN = 5;
export const BRAND_LEN    = 4;
export const INCR_LEN     = 5;

const SEGMENT_RE = /[^A-Z0-9]/g;

export const ITEM_ID_REGEX = new RegExp(
  `^[A-Z0-9]{${VENDOR_LEN}}_[A-Z0-9]{${CATEGORY_LEN}}_[A-Z0-9]{${BRAND_LEN}}_\\d{${INCR_LEN}}$`
);

export function sanitizeSegment(str, len, { allowTruncate = false } = {}) {
  if (typeof str !== 'string') throw makeHttpError(400, 'Segment must be a string');
  const cleaned = str.toUpperCase().replace(SEGMENT_RE, '');
  if (cleaned.length === len) return cleaned;
  if (allowTruncate && cleaned.length > len) return cleaned.slice(0, len);
  throw makeHttpError(400, `Segment must be exactly ${len} alphanumeric characters`);
}

export function padIncrement(n) {
  const num = Number.parseInt(String(n), 10);
  if (!Number.isFinite(num) || num < 0) throw makeHttpError(400, 'Increment must be a non-negative integer');
  const max = Number('9'.repeat(INCR_LEN));
  if (num > max) throw makeHttpError(409, `Increment exceeds ${max}`);
  return String(num).padStart(INCR_LEN, '0');
}

export function formatItemId({ vendor, category, brand, increment }) {
  const v   = sanitizeSegment(vendor,   VENDOR_LEN);
  const c   = sanitizeSegment(category, CATEGORY_LEN);
  const b   = sanitizeSegment(brand,    BRAND_LEN);
  const inc = padIncrement(increment);
  const id  = `${v}_${c}_${b}_${inc}`;
  assertValidItemId(id);
  return id;
}

export function isValidItemId(id) {
  return typeof id === 'string' && ITEM_ID_REGEX.test(id);
}

export function assertValidItemId(id) {
  if (!isValidItemId(id)) {
    throw makeHttpError(
      400,
      'Invalid Item_ID format: expected VENDOR(3)_CATEGORY(5)_BRAND(4)_INCREMENT(5), A–Z/0–9 only.'
    );
  }
}

export function parseItemId(id) {
  assertValidItemId(id);
  const [vendor, category, brand, inc] = id.split('_');
  return { vendor, category, brand, increment: Number.parseInt(inc, 10) };
}

// Small helper to make consistent HTTP-ish errors
function makeHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
