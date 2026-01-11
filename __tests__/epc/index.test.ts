import { encodeGid96, encodeSgtin96, parseEpc } from '../../src/index.js';
import { EpcScheme } from '../../src/types.js';

describe('parseEpc', () => {
  it('parses SGTIN-96 hex strings', () => {
    const encoded = encodeSgtin96({
      companyPrefix: '0614141',
      itemReference: '812345',
      serial: 6789,
      filter: 1,
    });

    const parsed = parseEpc(encoded.hex);
    expect(parsed.scheme).toBe(EpcScheme.SGTIN_96);
  });

  it('parses GID-96 hex strings', () => {
    const encoded = encodeGid96({ managerNumber: 5, objectClass: 6, serial: 7 });
    const parsed = parseEpc(encoded.hex);

    expect(parsed.scheme).toBe(EpcScheme.GID_96);
  });

  it('rejects unsupported EPC headers', () => {
    expect(() => parseEpc('FF0000000000000000000000')).toThrow('Unsupported EPC header 0xFF');
  });
});
