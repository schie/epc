import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import GtinConverterTool from './GtinConverterTool';

describe('GtinConverterTool', () => {
  it('converts the default GTIN-12/UPC-A code and confirms the alias matches', () => {
    render(<GtinConverterTool />);

    expect(screen.getByText('Valid code')).toBeInTheDocument();
    expect(screen.getByText(/produces the same EPC: true/)).toBeInTheDocument();
    expect(screen.getByText('SGTIN-96')).toBeInTheDocument();
  });

  it('switches to GTIN-13/EAN-13 and converts its default code', async () => {
    const user = userEvent.setup();
    render(<GtinConverterTool />);

    await user.selectOptions(screen.getByLabelText('Code type'), '13');

    expect(screen.getByDisplayValue('4006381333931')).toBeInTheDocument();
    expect(screen.getByText('Valid code')).toBeInTheDocument();
    expect(screen.getByText(/produces the same EPC: true/)).toBeInTheDocument();
  });

  it('switches to GTIN-8/EAN-8 and converts its default code', async () => {
    const user = userEvent.setup();
    render(<GtinConverterTool />);

    await user.selectOptions(screen.getByLabelText('Code type'), '8');

    expect(screen.getByDisplayValue('96385074')).toBeInTheDocument();
    expect(screen.getByText('Valid code')).toBeInTheDocument();
    expect(screen.getByText(/produces the same EPC: true/)).toBeInTheDocument();
  });

  it('flags an invalid check digit', async () => {
    const user = userEvent.setup();
    render(<GtinConverterTool />);

    const codeInput = screen.getByLabelText(/GTIN-12/);
    await user.clear(codeInput);
    await user.type(codeInput, '036000291459');

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });
});
