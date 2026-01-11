/**
 * Supported EPC encoding schemes.
 *
 * @example
 * ```ts
 * const scheme: EpcScheme = EpcScheme.SGTIN_96;
 * scheme;
 * // => 'sgtin-96'
 * ```
 */
export enum EpcScheme {
  SGTIN_96 = 'sgtin-96',
  GID_96 = 'gid-96',
}

/**
 * Parsed EPC result union.
 *
 * @example
 * ```ts
 * const result: EpcResult = {
 *   scheme: EpcScheme.GID_96,
 *   hex: '000000000000000000000000',
 *   binary: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *   uri: 'urn:epc:tag:gid-96:0.0.0',
 *   fields: { managerNumber: '0', objectClass: '0', serial: '0' },
 * };
 * result.scheme;
 * // => EpcScheme.GID_96
 * ```
 */
export type EpcResult = Sgtin96Result | Gid96Result;

/**
 * Input for encoding an SGTIN-96 EPC.
 *
 * @example
 * ```ts
 * const input: Sgtin96Input = {
 *   companyPrefix: '0614141',
 *   itemReference: '812345',
 *   serial: 12345,
 *   filter: 3,
 * };
 * input.companyPrefix;
 * // => '0614141'
 * ```
 */
export type Sgtin96Input = {
  /** Company prefix assigned by GS1. */
  companyPrefix: string | number;
  /** Item reference within the company prefix. */
  itemReference: string | number;
  /** Serial number for the individual item. */
  serial: string | number | bigint;
  /** Filter value used in tag encoding. */
  filter?: number;
  /** Partition value used in tag encoding. */
  partition?: number;
};

/**
 * Input for encoding a GID-96 EPC.
 *
 * @example
 * ```ts
 * const input: Gid96Input = { managerNumber: 1, objectClass: 2, serial: 3 };
 * input.serial;
 * // => 3
 * ```
 */
export type Gid96Input = {
  /** Manager number assigned by the issuer. */
  managerNumber: string | number;
  /** Object class within the manager number. */
  objectClass: string | number;
  /** Serial number for the individual item. */
  serial: string | number | bigint;
};

/**
 * Input for converting a UPC-A into an SGTIN-96 EPC.
 *
 * @example
 * ```ts
 * const input: UpcToSgtin96Input = {
 *   upc: '036000291452',
 *   companyPrefixLength: 6,
 *   serial: 123,
 *   indicatorDigit: 1,
 * };
 * input.upc;
 * // => '036000291452'
 * ```
 */
export type UpcToSgtin96Input = {
  /** 12-digit UPC-A code. */
  upc: string;
  /** Length of the company prefix portion. */
  companyPrefixLength: number;
  /** Serial number for the individual item. */
  serial: string | number | bigint;
  /** Indicator digit used to form the GTIN. */
  indicatorDigit?: number;
  /** Filter value used in tag encoding. */
  filter?: number;
  /** Partition value used in tag encoding. */
  partition?: number;
};

/**
 * SGTIN-96 encoding result.
 *
 * @example
 * ```ts
 * const result: Sgtin96Result = {
 *   scheme: EpcScheme.SGTIN_96,
 *   hex: '000000000000000000000000',
 *   binary: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *   uri: 'urn:epc:tag:sgtin-96:0.0000000.000000.0',
 *   fields: {
 *     filter: 0,
 *     partition: 5,
 *     companyPrefix: '0000000',
 *     itemReference: '000000',
 *     serial: '0',
 *   },
 * };
 * result.fields.serial;
 * // => '0'
 * ```
 */
export type Sgtin96Result = {
  /** EPC scheme for the result. */
  scheme: EpcScheme.SGTIN_96;
  /** 96-bit EPC represented as hex. */
  hex: string;
  /** 96-bit EPC represented as binary. */
  binary: string;
  /** Tag URI representation of the EPC. */
  uri: string;
  /** Parsed fields decoded from the EPC. */
  fields: {
    /** Filter value encoded in the tag. */
    filter: number;
    /** Partition value encoded in the tag. */
    partition: number;
    /** Company prefix assigned by GS1. */
    companyPrefix: string;
    /** Item reference within the company prefix. */
    itemReference: string;
    /** Serial number for the individual item. */
    serial: string;
  };
};

/**
 * GID-96 encoding result.
 *
 * @example
 * ```ts
 * const result: Gid96Result = {
 *   scheme: EpcScheme.GID_96,
 *   hex: '000000000000000000000000',
 *   binary: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *   uri: 'urn:epc:tag:gid-96:0.0.0',
 *   fields: { managerNumber: '0', objectClass: '0', serial: '0' },
 * };
 * result.uri;
 * // => 'urn:epc:tag:gid-96:0.0.0'
 * ```
 */
export type Gid96Result = {
  /** EPC scheme for the result. */
  scheme: EpcScheme.GID_96;
  /** 96-bit EPC represented as hex. */
  hex: string;
  /** 96-bit EPC represented as binary. */
  binary: string;
  /** Tag URI representation of the EPC. */
  uri: string;
  /** Parsed fields decoded from the EPC. */
  fields: {
    /** Manager number assigned by the issuer. */
    managerNumber: string;
    /** Object class within the manager number. */
    objectClass: string;
    /** Serial number for the individual item. */
    serial: string;
  };
};
