import {
  appendGs1CheckDigit,
  computeGs1CheckDigit,
  encodeSgtin96,
  encodeSgtin96FromUpcA,
  isSgtin96Header,
  parseSgtin96,
  resolveSgtinPartition,
  validateGs1CheckDigit,
} from '../../src/sgtin-96.js';
import { buildEpc96 } from '../../src/_utils.js';

const SAMPLE_COMPANY_PREFIX = '0614141';
const SAMPLE_ITEM_REFERENCE = '812345';

const baseInput = {
  companyPrefix: SAMPLE_COMPANY_PREFIX,
  itemReference: SAMPLE_ITEM_REFERENCE,
  serial: 12345,
  filter: 3,
} as const;

describe('encodeSgtin96 and parseSgtin96', () => {
  it('round-trips SGTIN-96 fields', () => {
    const encoded = encodeSgtin96(baseInput);
    const parsed = parseSgtin96(BigInt(`0x${encoded.hex}`));

    expect(encoded.scheme).toBe(parsed.scheme);
    expect(encoded.fields).toEqual(parsed.fields);
    expect(encoded.uri).toBe(
      `urn:epc:tag:sgtin-96:${baseInput.filter}.${SAMPLE_COMPANY_PREFIX}.${SAMPLE_ITEM_REFERENCE}.${baseInput.serial}`,
    );
    expect(encoded.binary).toHaveLength(96);
  });

  it('defaults filter to zero when omitted', () => {
    const encoded = encodeSgtin96({
      companyPrefix: SAMPLE_COMPANY_PREFIX,
      itemReference: SAMPLE_ITEM_REFERENCE,
      serial: 1,
    });

    expect(encoded.fields.filter).toBe(0);
  });

  it('rejects invalid filter values', () => {
    expect(() =>
      encodeSgtin96({
        companyPrefix: SAMPLE_COMPANY_PREFIX,
        itemReference: SAMPLE_ITEM_REFERENCE,
        serial: 1,
        filter: 9,
      }),
    ).toThrow('Filter must be an integer between 0 and 7');
  });

  it('rejects serials that exceed 38 bits', () => {
    expect(() =>
      encodeSgtin96({
        companyPrefix: SAMPLE_COMPANY_PREFIX,
        itemReference: SAMPLE_ITEM_REFERENCE,
        serial: 274_877_906_944n,
      }),
    ).toThrow('serial must fit within 38 bits');
  });

  it('rejects unsupported partitions when parsing', () => {
    const value = buildEpc96([
      { value: 0x30n, bits: 8 },
      { value: 0n, bits: 3 },
      { value: 7n, bits: 3 },
      { value: 0n, bits: 40 },
      { value: 0n, bits: 4 },
      { value: 0n, bits: 38 },
    ]);

    expect(() => parseSgtin96(value)).toThrow('Unsupported SGTIN-96 partition 7');
  });
});

describe('GS1 check digit helpers', () => {
  it.each([
    { payload: '03600029145', checkDigit: 2 },
    { payload: '72527273070', checkDigit: 6 },
  ])('computes, appends, and validates check digits for $payload', ({ payload, checkDigit }) => {
    expect(computeGs1CheckDigit(payload)).toBe(checkDigit);
    expect(appendGs1CheckDigit(payload)).toBe(`${payload}${checkDigit}`);
    expect(validateGs1CheckDigit(`${payload}${checkDigit}`)).toBe(true);
  });

  it('rejects empty payloads', () => {
    expect(() => computeGs1CheckDigit('')).toThrow('payload must contain at least one digit');
  });

  it('rejects too-short codes', () => {
    expect(() => validateGs1CheckDigit('1')).toThrow('code must contain at least two digits');
  });

  it('returns false for mismatched check digits', () => {
    expect(validateGs1CheckDigit('036000291453')).toBe(false);
  });
});

describe('encodeSgtin96FromUpcA', () => {
  it('encodes a valid UPC-A into SGTIN-96', () => {
    const encoded = encodeSgtin96FromUpcA({
      upc: '036000291452',
      companyPrefixLength: 6,
      serial: 123,
      indicatorDigit: 1,
    });

    expect(encoded.fields.filter).toBe(1);
    expect(encoded.fields.companyPrefix).toBe('0036000');
    expect(encoded.fields.itemReference).toBe('129145');
  });

  it('defaults the indicator digit to zero', () => {
    const encoded = encodeSgtin96FromUpcA({
      upc: '036000291452',
      companyPrefixLength: 6,
      serial: 123,
    });

    expect(encoded.fields.itemReference).toBe('029145');
  });

  it('rejects invalid company prefix lengths', () => {
    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 0,
        serial: 1,
      }),
    ).toThrow('companyPrefixLength must be a positive integer');

    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 11,
        serial: 1,
      }),
    ).toThrow('companyPrefixLength must leave room for an item reference');
  });

  it('rejects UPCs with invalid check digits', () => {
    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291453',
        companyPrefixLength: 6,
        serial: 1,
      }),
    ).toThrow('UPC check digit mismatch: expected 2, got 3');
  });

  it('rejects invalid indicator digits', () => {
    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 6,
        serial: 1,
        indicatorDigit: 10,
      }),
    ).toThrow('indicatorDigit must be an integer between 0 and 9');
  });

  it('rejects invalid serial values', () => {
    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 6,
        serial: 0,
      }),
    ).toThrow('serial must be a positive integer');

    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 6,
        serial: 274_877_906_944,
      }),
    ).toThrow('serial must be less than or equal to 274877906943');

    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 6,
        serial: '1234567890123',
      }),
    ).toThrow('serial must be 1 to 12 digits');

    expect(() =>
      encodeSgtin96FromUpcA({
        upc: '036000291452',
        companyPrefixLength: 6,
        serial: '0001',
      }),
    ).toThrow('serial must not start with 0');
  });
});

describe('resolveSgtinPartition', () => {
  it('resolves partitions and validates explicit choices', () => {
    expect(resolveSgtinPartition(7)).toBe(5);
    expect(resolveSgtinPartition(7, 5)).toBe(5);
  });

  it('rejects unsupported partitions and mismatches', () => {
    expect(() => resolveSgtinPartition(7, 6)).toThrow(
      'Partition 6 expects company prefix length 6, got 7',
    );
    expect(() => resolveSgtinPartition(7, 7)).toThrow('Unsupported SGTIN-96 partition 7');
    expect(() => resolveSgtinPartition(5)).toThrow(
      'Unsupported company prefix length 5 for SGTIN-96',
    );
  });
});

describe('isSgtin96Header', () => {
  it('identifies the SGTIN-96 header', () => {
    expect(isSgtin96Header(0x30n)).toBe(true);
    expect(isSgtin96Header(0x31n)).toBe(false);
  });
});
