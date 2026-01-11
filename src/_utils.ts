const EPC96_BITS = 96;
const EPC96_HEX_LENGTH = 24;

/**
 * Pack EPC fields into a 96-bit payload.
 *
 * @example
 * ```ts
 * buildEpc96([{ value: 0n, bits: 96 }]);
 * // => 0n
 * ```
 */
export function buildEpc96(fields: Array<{ value: bigint; bits: number }>): bigint {
  let remaining = EPC96_BITS;
  let result = 0n;
  for (const field of fields) {
    if (field.bits <= 0) {
      throw new Error('Field bit length must be positive');
    }
    remaining -= field.bits;
    if (remaining < 0) {
      throw new Error('EPC fields exceed 96 bits');
    }
    const max = (1n << BigInt(field.bits)) - 1n;
    if (field.value < 0n || field.value > max) {
      throw new Error(`Field value ${field.value.toString(10)} exceeds ${field.bits} bits`);
    }
    result |= (field.value & max) << BigInt(remaining);
  }
  if (remaining !== 0) {
    throw new Error('EPC fields do not sum to 96 bits');
  }
  return result;
}

/**
 * Assert a value fits within the given bit width.
 *
 * @example
 * ```ts
 * assertFitsBits(10n, 4, 'value');
 * // => undefined
 * ```
 */
export function assertFitsBits(value: bigint, bits: number, field: string): void {
  const max = (1n << BigInt(bits)) - 1n;
  if (value > max) {
    throw new Error(`${field} must fit within ${bits} bits`);
  }
}

/**
 * Extract bits from a 96-bit value using MSB-based offsets.
 *
 * @example
 * ```ts
 * const value = buildEpc96([{ value: 0x30n, bits: 8 }, { value: 0n, bits: 88 }]);
 * getBits(value, 0, 8);
 * // => 48n
 * ```
 */
export function getBits(value: bigint, startFromMsb: number, length: number): bigint {
  const shift = BigInt(EPC96_BITS - startFromMsb - length);
  return (value >> shift) & ((1n << BigInt(length)) - 1n);
}

/**
 * Format a 96-bit value as uppercase hex.
 *
 * @example
 * ```ts
 * formatHex(0x30n);
 * // => '000000000000000000000030'
 * ```
 */
export function formatHex(value: bigint): string {
  return value.toString(16).toUpperCase().padStart(EPC96_HEX_LENGTH, '0');
}

/**
 * Format a 96-bit value as a binary string.
 *
 * @example
 * ```ts
 * formatBinary(0n);
 * // => '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
 * ```
 */
export function formatBinary(value: bigint): string {
  return value.toString(2).padStart(EPC96_BITS, '0');
}

/**
 * Normalize and validate a 96-bit hex EPC string.
 *
 * @example
 * ```ts
 * normalizeHex('000000000000000000000030');
 * // => '000000000000000000000030'
 * ```
 */
export function normalizeHex(hex: string): string {
  const normalized = hex.trim().toUpperCase();
  if (!/^[0-9A-F]+$/.test(normalized)) {
    throw new Error('EPC must be a hex string');
  }
  if (normalized.length !== EPC96_HEX_LENGTH) {
    throw new Error(`EPC must be ${EPC96_HEX_LENGTH} hex characters`);
  }
  return normalized;
}

/**
 * Normalize numeric input into a digit-only string.
 *
 * @example
 * ```ts
 * normalizeDigits('00123', 'code');
 * // => '00123'
 * ```
 */
export function normalizeDigits(value: string | number | bigint, field: string): string {
  let normalized: string;
  if (typeof value === 'string') {
    normalized = value.trim();
  } else if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${field} must be a non-negative integer`);
    }
    normalized = String(value);
  } else {
    if (value < 0n) {
      throw new Error(`${field} must be a non-negative integer`);
    }
    normalized = value.toString(10);
  }
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${field} must contain digits only`);
  }
  return normalized;
}

/**
 * Normalize numeric input into a non-negative bigint.
 *
 * @example
 * ```ts
 * normalizeBigInt('42', 'value');
 * // => 42n
 * ```
 */
export function normalizeBigInt(value: string | number | bigint, field: string): bigint {
  if (typeof value === 'bigint') {
    if (value < 0n) {
      throw new Error(`${field} must be non-negative`);
    }
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${field} must be a non-negative integer`);
    }
    return BigInt(value);
  }
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`${field} must contain digits only`);
  }
  return BigInt(trimmed);
}

/**
 * Left-pad a numeric string to a fixed length.
 *
 * @example
 * ```ts
 * padDigits('123', 5, 'code');
 * // => '00123'
 * ```
 */
export function padDigits(value: string, length: number, field: string): string {
  if (value.length > length) {
    throw new Error(`${field} must be at most ${length} digits`);
  }
  return value.padStart(length, '0');
}

/**
 * Format a bigint as a zero-padded decimal string.
 *
 * @example
 * ```ts
 * formatDigits(42n, 4);
 * // => '0042'
 * ```
 */
export function formatDigits(value: bigint, length: number): string {
  return value.toString(10).padStart(length, '0');
}

/**
 * Normalize and validate a digit string with exact length.
 *
 * @example
 * ```ts
 * normalizeFixedDigits('1234', 'code', 4);
 * // => '1234'
 * ```
 */
export function normalizeFixedDigits(value: string, field: string, length: number): string {
  const digits = normalizeDigits(value, field);
  if (digits.length !== length) {
    throw new Error(`${field} must be ${length} digits`);
  }
  return digits;
}
