import { encodeSgtin96 } from '@schie/epc';
import { useMemo, useState, type ChangeEvent } from 'react';
import EpcResultCard from '../EpcResultCard';

const INITIAL_FORM = {
  companyPrefix: '0614141',
  itemReference: '812345',
  serial: '12345',
  filter: '3',
  partition: '',
};

function SgtinEncoderTool() {
  const [form, setForm] = useState(INITIAL_FORM);

  const encoded = useMemo(() => {
    try {
      const filter = form.filter.trim() === '' ? undefined : Number(form.filter);
      const partition = form.partition.trim() === '' ? undefined : Number(form.partition);
      return {
        ok: true as const,
        result: encodeSgtin96({
          companyPrefix: form.companyPrefix,
          itemReference: form.itemReference,
          serial: form.serial,
          filter,
          partition,
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
      <fieldset className="fieldset grid gap-4 sm:grid-cols-2">
        <legend className="fieldset-legend">GS1 components</legend>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.companyPrefix}
            onChange={updateField('companyPrefix')}
            placeholder="0614141"
          />
          <span>Company prefix</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.itemReference}
            onChange={updateField('itemReference')}
            placeholder="812345"
          />
          <span>Item reference</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.serial}
            onChange={updateField('serial')}
            placeholder="12345"
          />
          <span>Serial</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            value={form.filter}
            onChange={updateField('filter')}
            placeholder="3"
          />
          <span>Filter (optional)</span>
        </label>

        <label className="floating-label sm:col-span-2">
          <input
            className="input w-full"
            value={form.partition}
            onChange={updateField('partition')}
            placeholder="5 (auto if omitted)"
          />
          <span>Partition (optional)</span>
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

export default SgtinEncoderTool;
