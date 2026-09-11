import { encodeGid96, encodeSgtin96, parseEpc } from '@schie/epc';
import { useMemo, useState } from 'react';
import EpcResultCard from '../EpcResultCard';

const EXAMPLES = [
  {
    label: 'SGTIN-96 example',
    hex: encodeSgtin96({
      companyPrefix: '0614141',
      itemReference: '812345',
      serial: 12345,
      filter: 3,
    }).hex,
  },
  {
    label: 'GID-96 example',
    hex: encodeGid96({ managerNumber: 123, objectClass: 456, serial: 789 }).hex,
  },
];

function EpcParserTool() {
  const [hex, setHex] = useState(EXAMPLES[0].hex);

  const parsed = useMemo(() => {
    if (hex.trim() === '') {
      return { ok: false as const, error: 'Enter an EPC hex string to parse.' };
    }
    try {
      return { ok: true as const, result: parseEpc(hex) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [hex]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">EPC hex</legend>
          <textarea
            className="textarea w-full font-mono"
            rows={3}
            value={hex}
            onChange={(event) => setHex(event.target.value)}
            placeholder="30341234567890ABCDEF1234"
            spellCheck={false}
          />
          <p className="label">Paste any SGTIN-96 or GID-96 EPC (hex) to decode it.</p>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setHex(example.hex)}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {parsed.ok ? (
            <EpcResultCard result={parsed.result} />
          ) : (
            <div role="alert" className="alert alert-warning">
              <span>{parsed.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EpcParserTool;
