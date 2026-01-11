import {
  assertFitsBits,
  buildEpc96,
  formatBinary,
  formatDigits,
  formatHex,
  getBits,
  normalizeBigInt,
  normalizeDigits,
  normalizeFixedDigits,
  normalizeHex,
  padDigits,
} from '../../src/_utils.js';

describe('buildEpc96', () => {
  it('packs fields into a 96-bit value', () => {
    const value = buildEpc96([
      { value: 1n, bits: 8 },
      { value: 0n, bits: 88 },
    ]);

    expect(value).toBe(1n << 88n);
  });

  it('rejects non-positive bit lengths', () => {
    expect(() => buildEpc96([{ value: 0n, bits: 0 }])).toThrow('Field bit length must be positive');
  });

  it('rejects totals over 96 bits', () => {
    expect(() => buildEpc96([{ value: 0n, bits: 97 }])).toThrow('EPC fields exceed 96 bits');
  });

  it('rejects field values that do not fit', () => {
    expect(() =>
      buildEpc96([
        { value: 4n, bits: 2 },
        { value: 0n, bits: 94 },
      ]),
    ).toThrow('exceeds 2 bits');
  });

  it('rejects totals under 96 bits', () => {
    expect(() => buildEpc96([{ value: 1n, bits: 8 }])).toThrow('EPC fields do not sum to 96 bits');
  });
});

describe('assertFitsBits', () => {
  it('throws when the value exceeds the bit width', () => {
    expect(() => assertFitsBits(8n, 3, 'field')).toThrow('field must fit within 3 bits');
  });
});

describe('getBits', () => {
  it('extracts bits using MSB offsets', () => {
    const value = 1n << 95n;
    expect(getBits(value, 0, 1)).toBe(1n);
    expect(getBits(value, 1, 1)).toBe(0n);
  });
});

describe('formatters', () => {
  it('formats hex and binary with zero padding', () => {
    expect(formatHex(0n)).toBe('000000000000000000000000');
    expect(formatBinary(0n)).toBe('0'.repeat(96));
  });

  it('formats digits with padding', () => {
    expect(formatDigits(42n, 5)).toBe('00042');
  });
});

describe('normalizeHex', () => {
  it('normalizes and validates hex strings', () => {
    expect(normalizeHex('00aa00000000000000000000')).toBe('00AA00000000000000000000');
  });

  it('rejects non-hex input', () => {
    expect(() => normalizeHex('ZZ')).toThrow('EPC must be a hex string');
  });

  it('rejects invalid lengths', () => {
    expect(() => normalizeHex('ABC')).toThrow('EPC must be 24 hex characters');
  });
});

describe('normalizeDigits', () => {
  it('accepts digit-only strings', () => {
    expect(normalizeDigits(' 0123 ', 'field')).toBe('0123');
  });

  it('accepts numeric inputs', () => {
    expect(normalizeDigits(123, 'field')).toBe('123');
    expect(normalizeDigits(45n, 'field')).toBe('45');
  });

  it('rejects invalid numbers', () => {
    expect(() => normalizeDigits(-1, 'field')).toThrow('field must be a non-negative integer');
    expect(() => normalizeDigits(1.5, 'field')).toThrow('field must be a non-negative integer');
  });

  it('rejects invalid bigint values', () => {
    expect(() => normalizeDigits(-1n, 'field')).toThrow('field must be a non-negative integer');
  });

  it('rejects non-digit strings', () => {
    expect(() => normalizeDigits('12A3', 'field')).toThrow('field must contain digits only');
  });
});

describe('normalizeBigInt', () => {
  it('normalizes bigint, number, and string inputs', () => {
    expect(normalizeBigInt(5n, 'value')).toBe(5n);
    expect(normalizeBigInt(7, 'value')).toBe(7n);
    expect(normalizeBigInt(' 42 ', 'value')).toBe(42n);
  });

  it('rejects invalid bigint inputs', () => {
    expect(() => normalizeBigInt(-1n, 'value')).toThrow('value must be non-negative');
  });

  it('rejects invalid number inputs', () => {
    expect(() => normalizeBigInt(-1, 'value')).toThrow('value must be a non-negative integer');
    expect(() => normalizeBigInt(1.2, 'value')).toThrow('value must be a non-negative integer');
  });

  it('rejects invalid string inputs', () => {
    expect(() => normalizeBigInt('abc', 'value')).toThrow('value must contain digits only');
  });
});

describe('padDigits', () => {
  it('pads digits to a fixed length', () => {
    expect(padDigits('7', 3, 'field')).toBe('007');
  });

  it('rejects digits that are too long', () => {
    expect(() => padDigits('1234', 3, 'field')).toThrow('field must be at most 3 digits');
  });
});

describe('normalizeFixedDigits', () => {
  it('accepts the expected length', () => {
    expect(normalizeFixedDigits('1234', 'field', 4)).toBe('1234');
  });

  it('rejects mismatched lengths', () => {
    expect(() => normalizeFixedDigits('123', 'field', 4)).toThrow('field must be 4 digits');
  });
});
