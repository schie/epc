import { type EpcResult } from './types.js';
import {
  appendGs1CheckDigit,
  computeGs1CheckDigit,
  encodeSgtin96,
  encodeSgtin96FromUpcA,
  isSgtin96Header,
  parseSgtin96,
  validateGs1CheckDigit,
} from './sgtin-96.js';
import { encodeGid96, isGid96Header, parseGid96 } from './gid-96.js';
import { getBits, normalizeHex } from './_utils.js';

export { EpcScheme } from './types.js';
export type {
  EpcResult,
  Gid96Input,
  Gid96Result,
  Sgtin96Input,
  Sgtin96Result,
  UpcToSgtin96Input,
} from './types.js';
export {
  appendGs1CheckDigit,
  computeGs1CheckDigit,
  encodeGid96,
  encodeSgtin96,
  encodeSgtin96FromUpcA,
  validateGs1CheckDigit,
};

/**
 * Parse an EPC hex string into a structured result based on its header.
 *
 * @example
 * ```ts
 * const encoded = encodeGid96({ managerNumber: 1, objectClass: 2, serial: 3 });
 * const parsed = parseEpc(encoded.hex);
 * parsed.fields;
 * // => { managerNumber: '1', objectClass: '2', serial: '3' }
 * ```
 */
export function parseEpc(hex: string): EpcResult {
  const normalized = normalizeHex(hex);
  const value = BigInt(`0x${normalized}`);
  const header = getBits(value, 0, 8);
  if (isSgtin96Header(header)) {
    return parseSgtin96(value);
  }
  if (isGid96Header(header)) {
    return parseGid96(value);
  }
  throw new Error(`Unsupported EPC header 0x${header.toString(16).toUpperCase()}`);
}
