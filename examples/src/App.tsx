// import './App.css'

import {
  computeGs1CheckDigit,
  encodeGid96,
  encodeSgtin96,
  encodeSgtin96FromEan13,
  encodeSgtin96FromEan8,
  encodeSgtin96FromGTIN12,
  encodeSgtin96FromGTIN13,
  encodeSgtin96FromGTIN8,
  encodeSgtin96FromUpcA,
  parseEpc,
  sgtin96ToGtin14,
  validateGs1CheckDigit,
} from '@schie/epc';
import { useMemo, useState } from 'react';
import { name, repository } from '../../package.json';

const url = repository?.url;

function App() {
  const [sgtinForm, setSgtinForm] = useState({
    companyPrefix: '0614141',
    itemReference: '812345',
    serial: '12345',
    filter: '3',
    partition: '',
  });

  const sgtinFormResult = useMemo(() => {
    try {
      const filterValue = sgtinForm.filter.trim() === '' ? undefined : Number(sgtinForm.filter);
      const partitionValue =
        sgtinForm.partition.trim() === '' ? undefined : Number(sgtinForm.partition);
      const result = encodeSgtin96({
        companyPrefix: sgtinForm.companyPrefix,
        itemReference: sgtinForm.itemReference,
        serial: sgtinForm.serial,
        filter: filterValue,
        partition: partitionValue,
      });
      return { ok: true as const, result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { ok: false as const, error: message };
    }
  }, [sgtinForm]);

  const sgtinInput = {
    companyPrefix: '0614141',
    itemReference: '812345',
    serial: 12345,
    filter: 3,
  };
  const sgtin = encodeSgtin96(sgtinInput);
  const parsedSgtin = parseEpc(sgtin.hex);
  const gid = encodeGid96({ managerNumber: 123, objectClass: 456, serial: 789 });
  const gtin12 = '036000291452';
  const gtin12CheckDigit = computeGs1CheckDigit(gtin12.slice(0, 11));
  const gtin12IsValid = validateGs1CheckDigit(gtin12);
  const sgtinFromGtin12 = encodeSgtin96FromGTIN12({
    gtin12,
    companyPrefixLength: 6,
    serial: 987,
    indicatorDigit: 1,
  });
  const sgtinFromUpc = encodeSgtin96FromUpcA({
    upc: gtin12,
    companyPrefixLength: 6,
    serial: 987,
    indicatorDigit: 1,
  });
  const gtin13 = '4006381333931';
  const sgtinFromGtin13 = encodeSgtin96FromGTIN13({
    gtin13,
    companyPrefixLength: 7,
    serial: 987,
  });
  const sgtinFromEan13 = encodeSgtin96FromEan13({
    ean13: gtin13,
    companyPrefixLength: 7,
    serial: 987,
  });
  const gtin8 = '96385074';
  const sgtinFromGtin8 = encodeSgtin96FromGTIN8({
    gtin8,
    companyPrefixLength: 3,
    serial: 987,
  });
  const sgtinFromEan8 = encodeSgtin96FromEan8({
    ean8: gtin8,
    companyPrefixLength: 3,
    serial: 987,
  });
  const gtin14FromSgtin = sgtin96ToGtin14(sgtinFromGtin12);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-base-200 px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-wide text-secondary">{name}</p>
          <p className="text-2xl font-semibold text-base-content">React examples</p>
          <p className="text-sm text-base-content/70">
            Drop-in snippets showing EPC encoding and parsing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a className="btn btn-outline btn-sm" href="../">
            API Docs
          </a>
          <a className="btn btn-primary btn-sm" href={url} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-200 shadow-sm lg:col-span-2">
          <div className="card-body space-y-4">
            <div>
              <h2 className="card-title">SGTIN-96 generator</h2>
              <p className="text-sm text-base-content/70">
                Enter GS1 components to generate an SGTIN-96 tag.
              </p>
            </div>
            <form className="grid gap-4 md:grid-cols-3">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Company prefix</span>
                </div>
                <input
                  className="input input-bordered"
                  value={sgtinForm.companyPrefix}
                  onChange={(event) =>
                    setSgtinForm((prev) => ({
                      ...prev,
                      companyPrefix: event.target.value,
                    }))
                  }
                  placeholder="0614141"
                />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Item reference</span>
                </div>
                <input
                  className="input input-bordered"
                  value={sgtinForm.itemReference}
                  onChange={(event) =>
                    setSgtinForm((prev) => ({
                      ...prev,
                      itemReference: event.target.value,
                    }))
                  }
                  placeholder="812345"
                />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Serial</span>
                </div>
                <input
                  className="input input-bordered"
                  value={sgtinForm.serial}
                  onChange={(event) =>
                    setSgtinForm((prev) => ({
                      ...prev,
                      serial: event.target.value,
                    }))
                  }
                  placeholder="12345"
                />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Filter (optional)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={sgtinForm.filter}
                  onChange={(event) =>
                    setSgtinForm((prev) => ({
                      ...prev,
                      filter: event.target.value,
                    }))
                  }
                  placeholder="3"
                />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Partition (optional)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={sgtinForm.partition}
                  onChange={(event) =>
                    setSgtinForm((prev) => ({
                      ...prev,
                      partition: event.target.value,
                    }))
                  }
                  placeholder="5"
                />
              </label>
            </form>
            <div className="rounded-lg bg-base-100 p-4">
              {sgtinFormResult.ok ? (
                <pre className="mockup-code text-xs">
                  <code>{JSON.stringify(sgtinFormResult.result, null, 2)}</code>
                </pre>
              ) : (
                <p className="text-sm text-error">{sgtinFormResult.error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">Encode SGTIN-96</h2>
            <p className="text-sm text-base-content/70">
              Build a tag from GS1 components and inspect the resulting hex + URI.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const sgtin = encodeSgtin96(${JSON.stringify(sgtinInput, null, 2)});`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(sgtin, null, 2)}</code>
            </pre>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">Parse EPC</h2>
            <p className="text-sm text-base-content/70">
              Feed any supported EPC hex and decode it by header.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const parsed = parseEpc('${sgtin.hex}');`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(parsedSgtin, null, 2)}</code>
            </pre>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">GTIN-12 / UPC-A to SGTIN-96</h2>
            <p className="text-sm text-base-content/70">
              Validate a GTIN-12 check digit and encode it. The UPC-A function is an alias.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const gtin12 = '${gtin12}';
const checkDigit = computeGs1CheckDigit(gtin12.slice(0, 11)); // ${gtin12CheckDigit}
const isValid = validateGs1CheckDigit(gtin12); // ${gtin12IsValid}
const sgtin = encodeSgtin96FromGTIN12({
  gtin12,
  companyPrefixLength: 6,
  serial: 987,
  indicatorDigit: 1,
});

// UPC-A is GTIN-12, so this produces the same EPC:
const fromUpc = encodeSgtin96FromUpcA({
  upc: gtin12,
  companyPrefixLength: 6,
  serial: 987,
  indicatorDigit: 1,
});`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(sgtinFromGtin12, null, 2)}</code>
            </pre>
            <p className="text-xs text-base-content/60">
              Alias produces the same EPC: {String(sgtinFromUpc.hex === sgtinFromGtin12.hex)}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">GTIN-13 / EAN-13 to SGTIN-96</h2>
            <p className="text-sm text-base-content/70">
              Encode a GTIN-13 directly or use its EAN-13 alias.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const sgtin = encodeSgtin96FromGTIN13({
  gtin13: '${gtin13}',
  companyPrefixLength: 7,
  serial: 987,
});

const fromEan = encodeSgtin96FromEan13({
  ean13: '${gtin13}',
  companyPrefixLength: 7,
  serial: 987,
});`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(sgtinFromGtin13, null, 2)}</code>
            </pre>
            <p className="text-xs text-base-content/60">
              Alias produces the same EPC: {String(sgtinFromEan13.hex === sgtinFromGtin13.hex)}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">GTIN-8 / EAN-8 to SGTIN-96</h2>
            <p className="text-sm text-base-content/70">
              Encode a GTIN-8 directly or use its EAN-8 alias.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const sgtin = encodeSgtin96FromGTIN8({
  gtin8: '${gtin8}',
  companyPrefixLength: 3,
  serial: 987,
});

const fromEan = encodeSgtin96FromEan8({
  ean8: '${gtin8}',
  companyPrefixLength: 3,
  serial: 987,
});`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(sgtinFromGtin8, null, 2)}</code>
            </pre>
            <p className="text-xs text-base-content/60">
              Alias produces the same EPC: {String(sgtinFromEan8.hex === sgtinFromGtin8.hex)}
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">SGTIN-96 to GTIN-14</h2>
            <p className="text-sm text-base-content/70">
              Recover the GTIN-14, including its computed GS1 check digit.
            </p>
            <pre className="mockup-code text-xs">
              <code>{`const gtin14 = sgtin96ToGtin14(sgtin); // '${gtin14FromSgtin}'`}</code>
            </pre>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body space-y-3">
            <h2 className="card-title">Encode GID-96</h2>
            <p className="text-sm text-base-content/70">Use GID-96 for non-GS1 identifiers.</p>
            <pre className="mockup-code text-xs">
              <code>{`const gid = encodeGid96({ managerNumber: 123, objectClass: 456, serial: 789 });`}</code>
            </pre>
            <pre className="mockup-code text-xs">
              <code>{JSON.stringify(gid, null, 2)}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
