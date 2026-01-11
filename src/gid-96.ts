import { EpcScheme, type Gid96Input, type Gid96Result } from './types.js';
import {
  assertFitsBits,
  buildEpc96,
  formatBinary,
  formatHex,
  getBits,
  normalizeBigInt,
} from './_utils.js';

const GID_96_HEADER = 0x35n;

/**
 * Encode a GID-96 EPC.
 *
 * @example
 * ```ts
 * const result = encodeGid96({ managerNumber: 1, objectClass: 2, serial: 3 });
 * result.uri;
 * // => 'urn:epc:tag:gid-96:1.2.3'
 * ```
 */
export function encodeGid96(input: Gid96Input): Gid96Result {
  const managerNumber = normalizeBigInt(input.managerNumber, 'managerNumber');
  const objectClass = normalizeBigInt(input.objectClass, 'objectClass');
  const serial = normalizeBigInt(input.serial, 'serial');
  assertFitsBits(managerNumber, 28, 'managerNumber');
  assertFitsBits(objectClass, 24, 'objectClass');
  assertFitsBits(serial, 36, 'serial');

  const epc = buildEpc96([
    { value: GID_96_HEADER, bits: 8 },
    { value: managerNumber, bits: 28 },
    { value: objectClass, bits: 24 },
    { value: serial, bits: 36 },
  ]);

  const hex = formatHex(epc);
  return {
    scheme: EpcScheme.GID_96,
    hex,
    binary: formatBinary(epc),
    uri: `urn:epc:tag:gid-96:${managerNumber.toString(10)}.${objectClass.toString(10)}.${serial.toString(10)}`,
    fields: {
      managerNumber: managerNumber.toString(10),
      objectClass: objectClass.toString(10),
      serial: serial.toString(10),
    },
  };
}

/**
 * Parse a 96-bit GID value into its components.
 *
 * @example
 * ```ts
 * const encoded = encodeGid96({ managerNumber: 1, objectClass: 2, serial: 3 });
 * const parsed = parseGid96(BigInt(`0x${encoded.hex}`));
 * parsed.fields;
 * // => { managerNumber: '1', objectClass: '2', serial: '3' }
 * ```
 */
export function parseGid96(value: bigint): Gid96Result {
  const managerNumber = getBits(value, 8, 28);
  const objectClass = getBits(value, 36, 24);
  const serial = getBits(value, 60, 36);

  return {
    scheme: EpcScheme.GID_96,
    hex: formatHex(value),
    binary: formatBinary(value),
    uri: `urn:epc:tag:gid-96:${managerNumber.toString(10)}.${objectClass.toString(10)}.${serial.toString(10)}`,
    fields: {
      managerNumber: managerNumber.toString(10),
      objectClass: objectClass.toString(10),
      serial: serial.toString(10),
    },
  };
}

/**
 * Determine whether a header matches GID-96.
 *
 * @example
 * ```ts
 * isGid96Header(0x35n);
 * // => true
 * ```
 */
export function isGid96Header(header: bigint): boolean {
  return header === GID_96_HEADER;
}
