// Enforces: BRAND(4)_PRODUCTNAME(7)_COLOUR(3)_QTY(4)
// BRAND/PRODUCTNAME/COLOUR: A–Z 0–9, uppercased; QTY: zero-padded digits.

export const BRAND_LEN   = 4;
export const PRODUCT_LEN = 7;
export const COLOUR_LEN  = 3;
export const QTY_LEN     = 4;

const SEGMENT_RE = /[^A-Z0-9]/g;

export const SKU_REGEX = new RegExp(
  `^[A-Z0-9]{${BRAND_LEN}}_[A-Z0-9]{${PRODUCT_LEN}}_[A-Z0-9]{${COLOUR_LEN}}_\\d{${QTY_LEN}}$`
);

function makeHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function sanitizeSegment(str, len, { allowTruncate = false, padChar } = {}) {
  if (typeof str !== 'string') throw makeHttpError(400, 'Segment must be a string');
  let s = str.toUpperCase().replace(SEGMENT_RE, '');
  if (allowTruncate && s.length > len) s = s.slice(0, len);
  if (padChar && s.length < len) s = s.padEnd(len, padChar);
  if (s.length !== len) throw makeHttpError(400, `Segment must be exactly ${len} alphanumeric characters`);
  return s;
}

export function padQty(qty) {
  const n = Number.parseInt(String(qty), 10);
  if (!Number.isFinite(n) || n <= 0) throw makeHttpError(400, 'QTY must be a positive integer');
  if (n > 9999) throw makeHttpError(409, 'QTY exceeds 9999');
  return String(n).padStart(QTY_LEN, '0');
}

export function formatSku({ brand, productName, colour, qty }) {
  const b = sanitizeSegment(brand,       BRAND_LEN);
  const p = sanitizeSegment(productName, PRODUCT_LEN);
  const c = sanitizeSegment(colour,      COLOUR_LEN);
  const q = padQty(qty);
  const sku = `${b}_${p}_${c}_${q}`;
  assertValidSku(sku);
  return sku;
}

export function isValidSku(s) {
  return typeof s === 'string' && SKU_REGEX.test(s);
}

export function assertValidSku(s) {
  if (!isValidSku(s)) {
    throw makeHttpError(
      400,
      'Invalid Item_SKU: expected BRAND(4)_PRODUCTNAME(7)_COLOUR(3)_QTY(4); A–Z/0–9 for the first three, digits for QTY.'
    );
  }
}

export function parseSku(s) {
  assertValidSku(s);
  const [brand, productName, colour, qtyStr] = s.split('_');
  return { brand, productName, colour, qty: Number.parseInt(qtyStr, 10) };
}

// Optional helper: derive a 7-char product code from free text
export function toProductCode(name) {
  return sanitizeSegment(String(name ?? ''), PRODUCT_LEN, { allowTruncate: true, padChar: 'X' });
}
