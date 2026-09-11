import { sgtin96ToGtin14, type EpcResult } from '@schie/epc';
import CopyButton from './CopyButton';

const SCHEME_LABELS: Record<EpcResult['scheme'], string> = {
  'sgtin-96': 'SGTIN-96',
  'gid-96': 'GID-96',
};

function humanize(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());
}

type CodeRowProps = {
  label: string;
  value: string;
};

function CodeRow({ label, value }: CodeRowProps) {
  return (
    <div className="rounded-box bg-base-100 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-base-content/60 uppercase">
          {label}
        </span>
        <CopyButton value={value} />
      </div>
      <code className="block text-xs break-all">{value}</code>
    </div>
  );
}

type EpcResultCardProps = {
  result: EpcResult;
};

function EpcResultCard({ result }: EpcResultCardProps) {
  return (
    <div className="space-y-4">
      <span className="badge badge-primary badge-lg">{SCHEME_LABELS[result.scheme]}</span>

      <div className="overflow-x-auto">
        <table className="table table-sm">
          <tbody>
            {Object.entries(result.fields).map(([key, value]) => (
              <tr key={key}>
                <th className="w-1/3 font-normal text-base-content/70">{humanize(key)}</th>
                <td className="font-mono">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <CodeRow label="Hex" value={result.hex} />
        <CodeRow label="Binary" value={result.binary} />
        <CodeRow label="URI" value={result.uri} />
        {result.scheme === 'sgtin-96' && (
          <CodeRow label="GTIN-14 (via sgtin96ToGtin14)" value={sgtin96ToGtin14(result)} />
        )}
      </div>
    </div>
  );
}

export default EpcResultCard;
