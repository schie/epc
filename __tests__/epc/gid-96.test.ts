import { encodeGid96, isGid96Header, parseGid96 } from '../../src/gid-96.js';

describe('encodeGid96 and parseGid96', () => {
  it('round-trips GID-96 fields', () => {
    const encoded = encodeGid96({ managerNumber: 1, objectClass: 2, serial: 3 });
    const parsed = parseGid96(BigInt(`0x${encoded.hex}`));

    expect(parsed.scheme).toBe(encoded.scheme);
    expect(parsed.fields).toEqual(encoded.fields);
    expect(parsed.uri).toBe('urn:epc:tag:gid-96:1.2.3');
  });

  it('rejects values that exceed bit limits', () => {
    expect(() => encodeGid96({ managerNumber: 268_435_456, objectClass: 1, serial: 1 })).toThrow(
      'managerNumber must fit within 28 bits',
    );
  });
});

describe('isGid96Header', () => {
  it('identifies the GID-96 header', () => {
    expect(isGid96Header(0x35n)).toBe(true);
    expect(isGid96Header(0x36n)).toBe(false);
  });
});
