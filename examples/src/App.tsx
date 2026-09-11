import { ArrowTopRightOnSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { name, repository } from '../../package.json';
import ThemeToggle from './components/ThemeToggle';
import EpcParserTool from './components/tools/EpcParserTool';
import GidEncoderTool from './components/tools/GidEncoderTool';
import Gs1CheckDigitTool from './components/tools/Gs1CheckDigitTool';
import GtinConverterTool from './components/tools/GtinConverterTool';
import SgtinEncoderTool from './components/tools/SgtinEncoderTool';

const url = repository?.url;

const TABS = [
  { label: 'Parse EPC', panel: <EpcParserTool /> },
  { label: 'Encode SGTIN-96', panel: <SgtinEncoderTool /> },
  { label: 'Encode GID-96', panel: <GidEncoderTool /> },
  { label: 'GTIN/EAN → SGTIN-96', panel: <GtinConverterTool /> },
  { label: 'GS1 check digit', panel: <Gs1CheckDigitTool /> },
];

function App() {
  return (
    <div className="min-h-screen bg-base-300">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <p className="text-lg font-semibold text-base-content">{name}</p>
        </div>
        <div className="navbar-end gap-2">
          <a className="btn btn-ghost btn-sm" href="../">
            <BookOpenIcon className="h-4 w-4" />
            API Docs
          </a>
          <a className="btn btn-ghost btn-sm" href={url} target="_blank" rel="noreferrer">
            GitHub
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-6 p-6 lg:p-10">
        <div>
          <p className="text-sm tracking-wide text-secondary uppercase">React examples</p>
          <h1 className="text-2xl font-semibold text-base-content">EPC playground</h1>
          <p className="text-sm text-base-content/70">
            Interactive tools for encoding and parsing EPC tags with{' '}
            <code className="text-xs">@schie/epc</code>.
          </p>
        </div>

        <div role="tablist" className="tabs tabs-lift">
          {TABS.map((tab, index) => (
            <Fragment key={tab.label}>
              <input
                type="radio"
                name="tool-tabs"
                role="tab"
                className="tab"
                aria-label={tab.label}
                defaultChecked={index === 0}
              />
              <div className="tab-content rounded-box border-base-300 bg-base-100 p-6">
                {tab.panel}
              </div>
            </Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
