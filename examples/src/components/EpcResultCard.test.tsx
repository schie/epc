import { encodeGid96, encodeSgtin96, sgtin96ToGtin14 } from '@schie/epc';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EpcResultCard from './EpcResultCard';

describe('EpcResultCard', () => {
  it('renders SGTIN-96 fields, hex, binary, URI, and the derived GTIN-14', () => {
    const result = encodeSgtin96({
      companyPrefix: '0614141',
      itemReference: '812345',
      serial: 12345,
      filter: 3,
    });

    render(<EpcResultCard result={result} />);

    expect(screen.getByText('SGTIN-96')).toBeInTheDocument();
    expect(screen.getByText('Company Prefix')).toBeInTheDocument();
    expect(screen.getByText('0614141')).toBeInTheDocument();
    expect(screen.getByText(result.hex)).toBeInTheDocument();
    expect(screen.getByText(result.binary)).toBeInTheDocument();
    expect(screen.getByText(result.uri)).toBeInTheDocument();
    expect(screen.getByText(sgtin96ToGtin14(result))).toBeInTheDocument();
  });

  it('renders GID-96 fields without a GTIN-14 row', () => {
    const result = encodeGid96({ managerNumber: 123, objectClass: 456, serial: 789 });

    render(<EpcResultCard result={result} />);

    expect(screen.getByText('GID-96')).toBeInTheDocument();
    expect(screen.getByText('Manager Number')).toBeInTheDocument();
    expect(screen.getByText('Object Class')).toBeInTheDocument();
    expect(screen.queryByText(/GTIN-14/)).not.toBeInTheDocument();
  });
});
