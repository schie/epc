import {
  computeGs1CheckDigit,
  encodeSgtin96FromEan13,
  encodeSgtin96FromEan8,
  encodeSgtin96FromGtin12,
  encodeSgtin96FromGtin13,
  encodeSgtin96FromGtin8,
  encodeSgtin96FromUpcA,
  validateGs1CheckDigit,
  type Sgtin96Result,
} from '@schie/epc';
import { useMemo, useState, type ChangeEvent } from 'react';
import EpcResultCard from '../EpcResultCard';

type GtinLength = 8 | 12 | 13;

const LENGTHS: Array<{
  length: GtinLength;
  label: string;
  aliasLabel: string;
  defaultCode: string;
  defaultCompanyPrefixLength: string;
}> = [
  {
    length: 8,
    label: 'GTIN-8',
    aliasLabel: 'EAN-8',
    defaultCode: '96385074',
    defaultCompanyPrefixLength: '3',
  },
  {
    length: 12,
    label: 'GTIN-12',
    aliasLabel: 'UPC-A',
    defaultCode: '036000291452',
    defaultCompanyPrefixLength: '6',
  },
  {
    length: 13,
    label: 'GTIN-13',
    aliasLabel: 'EAN-13',
    defaultCode: '4006381333931',
    defaultCompanyPrefixLength: '7',
  },
];

type EncodeOptions = {
  companyPrefixLength: number;
  serial: string;
  indicatorDigit?: number;
  filter?: number;
  partition?: number;
};

function encodeByGtin(length: GtinLength, code: string, options: EncodeOptions): Sgtin96Result {
  switch (length) {
    case 8:
      return encodeSgtin96FromGtin8({ gtin8: code, ...options });
    case 12:
      return encodeSgtin96FromGtin12({ gtin12: code, ...options });
    case 13:
      return encodeSgtin96FromGtin13({ gtin13: code, ...options });
  }
}

function encodeByAlias(length: GtinLength, code: string, options: EncodeOptions): Sgtin96Result {
  switch (length) {
    case 8:
      return encodeSgtin96FromEan8({ ean8: code, ...options });
    case 12:
      return encodeSgtin96FromUpcA({ upc: code, ...options });
    case 13:
      return encodeSgtin96FromEan13({ ean13: code, ...options });
  }
}

const INITIAL_FORM = {
  length: 12 as GtinLength,
  code: LENGTHS[1].defaultCode,
  companyPrefixLength: LENGTHS[1].defaultCompanyPrefixLength,
  serial: '987',
  indicatorDigit: '1',
  filter: '',
  partition: '',
};

function GtinConverterTool() {
  const [form, setForm] = useState(INITIAL_FORM);
  const preset = LENGTHS.find((entry) => entry.length === form.length) ?? LENGTHS[1];

  const checkDigit = useMemo(() => {
    try {
      const payload = form.code.trim().slice(0, -1);
      if (payload === '') return null;
      return computeGs1CheckDigit(payload);
    } catch {
      return null;
    }
  }, [form.code]);

  const isValidCode = useMemo(() => {
    try {
      return validateGs1CheckDigit(form.code);
    } catch {
      return false;
    }
  }, [form.code]);

  const converted = useMemo(() => {
    try {
      const options: EncodeOptions = {
        companyPrefixLength: Number(form.companyPrefixLength),
        serial: form.serial,
        indicatorDigit: form.indicatorDigit.trim() === '' ? undefined : Number(form.indicatorDigit),
        filter: form.filter.trim() === '' ? undefined : Number(form.filter),
        partition: form.partition.trim() === '' ? undefined : Number(form.partition),
      };
      const result = encodeByGtin(form.length, form.code, options);
      const aliasResult = encodeByAlias(form.length, form.code, options);
      return { ok: true as const, result, aliasMatches: aliasResult.hex === result.hex };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [form]);

  const updateField =
    (field: 'code' | 'companyPrefixLength' | 'serial' | 'indicatorDigit' | 'filter' | 'partition') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const changeLength = (event: ChangeEvent<HTMLSelectElement>) => {
    const length = Number(event.target.value) as GtinLength;
    const next = LENGTHS.find((entry) => entry.length === length) ?? LENGTHS[1];
    setForm((prev) => ({
      ...prev,
      length,
      code: next.defaultCode,
      companyPrefixLength: next.defaultCompanyPrefixLength,
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <fieldset className="fieldset grid gap-4 sm:grid-cols-2">
          <legend className="fieldset-legend">GTIN / EAN → SGTIN-96</legend>

          <label className="floating-label">
            <select className="select w-full" value={form.length} onChange={changeLength}>
              {LENGTHS.map((entry) => (
                <option key={entry.length} value={entry.length}>
                  {entry.label} / {entry.aliasLabel}
                </option>
              ))}
            </select>
            <span>Code type</span>
          </label>

          <label className="floating-label">
            <input
              className="input w-full font-mono"
              value={form.code}
              onChange={updateField('code')}
              placeholder={preset.defaultCode}
            />
            <span>
              {preset.label} ({preset.length} digits, with check digit)
            </span>
          </label>

          <label className="floating-label">
            <input
              className="input w-full"
              value={form.companyPrefixLength}
              onChange={updateField('companyPrefixLength')}
              placeholder={preset.defaultCompanyPrefixLength}
            />
            <span>Company prefix length</span>
          </label>

          <label className="floating-label">
            <input
              className="input w-full"
              value={form.serial}
              onChange={updateField('serial')}
              placeholder="987"
            />
            <span>Serial</span>
          </label>

          <label className="floating-label">
            <input
              className="input w-full"
              value={form.indicatorDigit}
              onChange={updateField('indicatorDigit')}
              placeholder="1"
            />
            <span>Indicator digit (optional)</span>
          </label>

          <label className="floating-label">
            <input
              className="input w-full"
              value={form.filter}
              onChange={updateField('filter')}
              placeholder="1 (default)"
            />
            <span>Filter (optional)</span>
          </label>
        </fieldset>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-base-content/70">GS1 check digit for this code:</span>
          <span className="badge badge-neutral">{checkDigit ?? '—'}</span>
          <span className={`badge ${isValidCode ? 'badge-success' : 'badge-error'}`}>
            {isValidCode ? 'Valid code' : 'Invalid code'}
          </span>
        </div>

        {converted.ok && (
          <p className="text-xs text-base-content/60">
            <code>encodeSgtin96From{preset.aliasLabel.replace(/[^A-Za-z0-9]/g, '')}</code>{' '}
            produces the same EPC: {String(converted.aliasMatches)}
          </p>
        )}
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {converted.ok ? (
            <EpcResultCard result={converted.result} />
          ) : (
            <div role="alert" className="alert alert-warning">
              <span>{converted.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GtinConverterTool;
