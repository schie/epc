import {
  EpcScheme,
  type Sgtin96Input,
  type Sgtin96Result,
  type UpcToSgtin96Input,
} from './types.js';
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
  padDigits,
} from './_utils.js';

const SGTIN_96_HEADER = 0x30n;

/**
 * SGTIN-96 partition metadata for digit and bit lengths.
 *
 * @example
 * ```ts
 * const partition: PartitionDefinition = {
 *   partition: 5,
 *   companyPrefixDigits: 7,
 *   companyPrefixBits: 24,
 *   itemReferenceDigits: 6,
 *   itemReferenceBits: 20,
 * };
 * partition.partition;
 * // => 5
 * ```
 */
type PartitionDefinition = {
  partition: number;
  companyPrefixDigits: number;
  companyPrefixBits: number;
  itemReferenceDigits: number;
  itemReferenceBits: number;
};

const SGTIN_96_PARTITIONS: PartitionDefinition[] = [
  {
    partition: 0,
    companyPrefixDigits: 12,
    companyPrefixBits: 40,
    itemReferenceDigits: 1,
    itemReferenceBits: 4,
  },
  {
    partition: 1,
    companyPrefixDigits: 11,
    companyPrefixBits: 37,
    itemReferenceDigits: 2,
    itemReferenceBits: 7,
  },
  {
    partition: 2,
    companyPrefixDigits: 10,
    companyPrefixBits: 34,
    itemReferenceDigits: 3,
    itemReferenceBits: 10,
  },
  {
    partition: 3,
    companyPrefixDigits: 9,
    companyPrefixBits: 30,
    itemReferenceDigits: 4,
    itemReferenceBits: 14,
  },
  {
    partition: 4,
    companyPrefixDigits: 8,
    companyPrefixBits: 27,
    itemReferenceDigits: 5,
    itemReferenceBits: 17,
  },
  {
    partition: 5,
    companyPrefixDigits: 7,
    companyPrefixBits: 24,
    itemReferenceDigits: 6,
    itemReferenceBits: 20,
  },
  {
    partition: 6,
    companyPrefixDigits: 6,
    companyPrefixBits: 20,
    itemReferenceDigits: 7,
    itemReferenceBits: 24,
  },
];

/**
 * Encode SGTIN-96 from GS1 components.
 *
 * @example
 * ```ts
 * const result = encodeSgtin96({
 *   companyPrefix: '0614141',
 *   itemReference: '812345',
 *   serial: 12345,
 *   filter: 3,
 * });
 * result.uri;
 * // => 'urn:epc:tag:sgtin-96:3.0614141.812345.12345'
 * ```
 */
export function encodeSgtin96(input: Sgtin96Input): Sgtin96Result {
  const filter = normalizeFilter(input.filter);
  const companyPrefix = normalizeDigits(input.companyPrefix, 'companyPrefix');
  const itemReference = normalizeDigits(input.itemReference, 'itemReference');
  const serial = normalizeBigInt(input.serial, 'serial');
  const partition = resolveSgtinPartition(companyPrefix.length, input.partition);
  const partitionDef = SGTIN_96_PARTITIONS[partition];
  const companyPrefixDigits = padDigits(
    companyPrefix,
    partitionDef.companyPrefixDigits,
    'companyPrefix',
  );
  const itemReferenceDigits = padDigits(
    itemReference,
    partitionDef.itemReferenceDigits,
    'itemReference',
  );
  assertFitsBits(serial, 38, 'serial');

  const epc = buildEpc96([
    { value: SGTIN_96_HEADER, bits: 8 },
    { value: BigInt(filter), bits: 3 },
    { value: BigInt(partition), bits: 3 },
    { value: BigInt(companyPrefixDigits), bits: partitionDef.companyPrefixBits },
    { value: BigInt(itemReferenceDigits), bits: partitionDef.itemReferenceBits },
    { value: serial, bits: 38 },
  ]);

  const hex = formatHex(epc);
  return {
    scheme: EpcScheme.SGTIN_96,
    hex,
    binary: formatBinary(epc),
    uri: `urn:epc:tag:sgtin-96:${filter}.${companyPrefixDigits}.${itemReferenceDigits}.${serial.toString(10)}`,
    fields: {
      filter,
      partition,
      companyPrefix: companyPrefixDigits,
      itemReference: itemReferenceDigits,
      serial: serial.toString(10),
    },
  };
}

/**
 * Parse a 96-bit SGTIN value into its components.
 *
 * @example
 * ```ts
 * const encoded = encodeSgtin96({
 *   companyPrefix: '0614141',
 *   itemReference: '812345',
 *   serial: 12345,
 *   filter: 3,
 * });
 * const parsed = parseSgtin96(BigInt(`0x${encoded.hex}`));
 * parsed.fields;
 * // => { filter: 3, partition: 5, companyPrefix: '0614141', itemReference: '812345', serial: '12345' }
 * ```
 */
export function parseSgtin96(value: bigint): Sgtin96Result {
  const filter = Number(getBits(value, 8, 3));
  const partition = Number(getBits(value, 11, 3));
  const partitionDef = SGTIN_96_PARTITIONS[partition];
  if (!partitionDef) {
    throw new Error(`Unsupported SGTIN-96 partition ${partition}`);
  }

  const companyPrefixBits = partitionDef.companyPrefixBits;
  const itemReferenceBits = partitionDef.itemReferenceBits;
  const companyPrefix = getBits(value, 14, companyPrefixBits);
  const itemReference = getBits(value, 14 + companyPrefixBits, itemReferenceBits);
  const serial = value & ((1n << 38n) - 1n);
  const companyPrefixDigits = formatDigits(companyPrefix, partitionDef.companyPrefixDigits);
  const itemReferenceDigits = formatDigits(itemReference, partitionDef.itemReferenceDigits);

  return {
    scheme: EpcScheme.SGTIN_96,
    hex: formatHex(value),
    binary: formatBinary(value),
    uri: `urn:epc:tag:sgtin-96:${filter}.${companyPrefixDigits}.${itemReferenceDigits}.${serial.toString(10)}`,
    fields: {
      filter,
      partition,
      companyPrefix: companyPrefixDigits,
      itemReference: itemReferenceDigits,
      serial: serial.toString(10),
    },
  };
}

/**
 * Compute the GS1 mod-10 check digit for a payload.
 *
 * @example
 * ```ts
 * computeGs1CheckDigit('03600029145');
 * // => 2
 * ```
 */
export function computeGs1CheckDigit(payload: string): number {
  if (payload.trim().length === 0) {
    throw new Error('payload must contain at least one digit');
  }
  const digits = normalizeDigits(payload, 'payload');
  let sum = 0;
  let position = 1;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const digit = Number(digits[i]);
    sum += digit * (position % 2 === 1 ? 3 : 1);
    position += 1;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Append the GS1 check digit to a payload.
 *
 * @example
 * ```ts
 * appendGs1CheckDigit('03600029145');
 * // => '036000291452'
 * ```
 */
export function appendGs1CheckDigit(payload: string): string {
  const digits = normalizeDigits(payload, 'payload');
  const checkDigit = computeGs1CheckDigit(digits);
  return `${digits}${checkDigit}`;
}

/**
 * Validate a GS1 check digit at the end of the code.
 *
 * @example
 * ```ts
 * validateGs1CheckDigit('036000291452');
 * // => true
 * ```
 */
export function validateGs1CheckDigit(code: string): boolean {
  const digits = normalizeDigits(code, 'code');
  if (digits.length < 2) {
    throw new Error('code must contain at least two digits');
  }
  const payload = digits.slice(0, -1);
  const expected = computeGs1CheckDigit(payload);
  return expected === Number(digits[digits.length - 1]);
}

/**
 * Convert a UPC-A into an SGTIN-96 EPC.
 *
 * @example
 * ```ts
 * const result = encodeSgtin96FromUpcA({
 *   upc: '036000291452',
 *   companyPrefixLength: 6,
 *   serial: 123,
 *   indicatorDigit: 1,
 * });
 * result.fields;
 * // => { filter: 1, partition: 5, companyPrefix: '0036000', itemReference: '129145', serial: '123' }
 * ```
 */
export function encodeSgtin96FromUpcA(input: UpcToSgtin96Input): Sgtin96Result {
  const upc = normalizeFixedDigits(input.upc, 'upc', 12);
  if (!Number.isInteger(input.companyPrefixLength) || input.companyPrefixLength <= 0) {
    throw new Error('companyPrefixLength must be a positive integer');
  }
  if (input.companyPrefixLength >= 11) {
    throw new Error('companyPrefixLength must leave room for an item reference');
  }

  const payload = upc.slice(0, 11);
  const expectedCheck = computeGs1CheckDigit(payload);
  const actualCheck = Number(upc[11]);
  if (expectedCheck !== actualCheck) {
    throw new Error(`UPC check digit mismatch: expected ${expectedCheck}, got ${actualCheck}`);
  }

  const indicatorDigit = normalizeIndicatorDigit(input.indicatorDigit);
  const companyPrefix = upc.slice(0, input.companyPrefixLength);
  const itemReference = upc.slice(input.companyPrefixLength, 11);
  const gs1CompanyPrefix = `0${companyPrefix}`;
  const itemReferenceWithIndicator = `${indicatorDigit}${itemReference}`;
  const serial = normalizeSgtinSerial(input.serial);
  const filter = input.filter ?? 1;

  return encodeSgtin96({
    companyPrefix: gs1CompanyPrefix,
    itemReference: itemReferenceWithIndicator,
    serial,
    filter,
    partition: input.partition,
  });
}

/**
 * Resolve the SGTIN partition based on company prefix length.
 *
 * @example
 * ```ts
 * resolveSgtinPartition(7);
 * // => 5
 * ```
 */
export function resolveSgtinPartition(companyPrefixDigits: number, partition?: number): number {
  if (partition !== undefined) {
    const def = SGTIN_96_PARTITIONS[partition];
    if (!def) {
      throw new Error(`Unsupported SGTIN-96 partition ${partition}`);
    }
    if (def.companyPrefixDigits !== companyPrefixDigits) {
      throw new Error(
        `Partition ${partition} expects company prefix length ${def.companyPrefixDigits}, got ${companyPrefixDigits}`,
      );
    }
    return partition;
  }
  const match = SGTIN_96_PARTITIONS.find((def) => def.companyPrefixDigits === companyPrefixDigits);
  if (!match) {
    throw new Error(`Unsupported company prefix length ${companyPrefixDigits} for SGTIN-96`);
  }
  return match.partition;
}

/**
 * Determine whether a header matches SGTIN-96.
 *
 * @example
 * ```ts
 * isSgtin96Header(0x30n);
 * // => true
 * ```
 */
export function isSgtin96Header(header: bigint): boolean {
  return header === SGTIN_96_HEADER;
}

/**
 * Normalize an SGTIN filter value (0-7).
 *
 * @example
 * ```ts
 * normalizeFilter();
 * // => 0
 * ```
 */
function normalizeFilter(filter?: number): number {
  if (filter === undefined) {
    return 0;
  }
  if (!Number.isInteger(filter) || filter < 0 || filter > 7) {
    throw new Error('Filter must be an integer between 0 and 7');
  }
  return filter;
}

/**
 * Normalize the indicator digit for GTIN/SGTIN.
 *
 * @example
 * ```ts
 * normalizeIndicatorDigit(5);
 * // => '5'
 * ```
 */
function normalizeIndicatorDigit(value?: number): string {
  if (value === undefined) {
    return '0';
  }
  if (!Number.isInteger(value) || value < 0 || value > 9) {
    throw new Error('indicatorDigit must be an integer between 0 and 9');
  }
  return String(value);
}

/**
 * Normalize the SGTIN serial number to a valid bigint.
 *
 * @example
 * ```ts
 * normalizeSgtinSerial(123);
 * // => 123n
 * ```
 */
function normalizeSgtinSerial(value: string | number | bigint): bigint {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const isDigits = /^\d+$/.test(trimmed);
    if (isDigits && trimmed.length > 12) {
      throw new Error('serial must be 1 to 12 digits');
    }
    if (isDigits && trimmed.startsWith('0') && trimmed.length > 1) {
      throw new Error('serial must not start with 0');
    }
  }
  const serial = normalizeBigInt(value, 'serial');
  if (serial <= 0n) {
    throw new Error('serial must be a positive integer');
  }
  if (serial > 274_877_906_943n) {
    throw new Error('serial must be less than or equal to 274877906943');
  }
  return serial;
}
