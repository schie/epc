import { appendGs1CheckDigit, computeGs1CheckDigit, validateGs1CheckDigit } from '@schie/epc';
import { useMemo, useState } from 'react';

function ComputeCard() {
  const [payload, setPayload] = useState('03600029145');

  const computed = useMemo(() => {
    try {
      return { ok: true as const, checkDigit: computeGs1CheckDigit(payload), appended: appendGs1CheckDigit(payload) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [payload]);

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body space-y-4">
        <div>
          <h3 className="card-title">Compute & append</h3>
          <p className="text-sm text-base-content/70">
            Enter a payload (a GTIN/UPC without its check digit).
          </p>
        </div>
        <label className="floating-label">
          <input
            className="input w-full font-mono"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            placeholder="03600029145"
          />
          <span>Payload</span>
        </label>
        {computed.ok ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-base-content/70">Check digit:</span>
              <span className="badge badge-primary">{computed.checkDigit}</span>
            </div>
            <div className="rounded-box bg-base-100 p-3">
              <span className="text-xs font-semibold tracking-wide text-base-content/60 uppercase">
                Appended code
              </span>
              <code className="block text-sm break-all">{computed.appended}</code>
            </div>
          </div>
        ) : (
          <div role="alert" className="alert alert-warning">
            <span>{computed.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ValidateCard() {
  const [code, setCode] = useState('036000291452');

  const validated = useMemo(() => {
    try {
      return { ok: true as const, isValid: validateGs1CheckDigit(code) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [code]);

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body space-y-4">
        <div>
          <h3 className="card-title">Validate a code</h3>
          <p className="text-sm text-base-content/70">
            Enter a full GTIN/UPC (including its check digit).
          </p>
        </div>
        <label className="floating-label">
          <input
            className="input w-full font-mono"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="036000291452"
          />
          <span>Code</span>
        </label>
        {validated.ok ? (
          <span className={`badge ${validated.isValid ? 'badge-success' : 'badge-error'}`}>
            {validated.isValid ? 'Valid check digit' : 'Invalid check digit'}
          </span>
        ) : (
          <div role="alert" className="alert alert-warning">
            <span>{validated.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Gs1CheckDigitTool() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ComputeCard />
      <ValidateCard />
    </div>
  );
}

export default Gs1CheckDigitTool;
