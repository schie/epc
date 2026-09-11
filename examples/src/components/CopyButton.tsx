import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type CopyButtonProps = {
  value: string;
  label?: string;
};

function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="btn btn-ghost btn-xs" onClick={handleCopy}>
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

export default CopyButton;
