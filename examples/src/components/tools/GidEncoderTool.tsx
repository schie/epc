import { encodeGid96 } from '@schie/epc';
import { useMemo, useState, type ChangeEvent } from 'react';
import EpcResultCard from '../EpcResultCard';

const INITIAL_FORM = {
  managerNumber: '123',
  objectClass: '456',
  serial: '789',
};

function GidEncoderTool() {
  const [form, setForm] = useState(INITIAL_FORM);

  const encoded = useMemo(() => {
    try {
      return {
        ok: true as const,
        result: encodeGid96({
          managerNumber: form.managerNumber,
          objectClass: form.objectClass,
          serial: form.serial,
        }),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [form]);

  const updateField =
    (field: keyof typeof INITIAL_FORM) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <fieldset className="fieldset grid gap-4">
        <legend className="fieldset-legend">GID-96 components</legend>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.managerNumber}
            onChange={updateField('managerNumber')}
            placeholder="123"
          />
          <span>Manager number</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.objectClass}
            onChange={updateField('objectClass')}
            placeholder="456"
          />
          <span>Object class</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.serial}
            onChange={updateField('serial')}
            placeholder="789"
          />
          <span>Serial</span>
        </label>
      </fieldset>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {encoded.ok ? (
            <EpcResultCard result={encoded.result} />
          ) : (
            <div role="alert" className="alert alert-warning">
              <span>{encoded.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GidEncoderTool;
