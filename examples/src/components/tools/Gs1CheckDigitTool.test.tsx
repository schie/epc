import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Gs1CheckDigitTool from './Gs1CheckDigitTool';

describe('Gs1CheckDigitTool', () => {
  it('computes the check digit and appended code for the default payload', () => {
    render(<Gs1CheckDigitTool />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('036000291452')).toBeInTheDocument();
  });

  it('validates the default full code as valid', () => {
    render(<Gs1CheckDigitTool />);

    expect(screen.getByText('Valid check digit')).toBeInTheDocument();
  });

  it('flags an incorrect check digit as invalid', async () => {
    const user = userEvent.setup();
    render(<Gs1CheckDigitTool />);

    const codeInput = screen.getByLabelText('Code');
    await user.clear(codeInput);
    await user.type(codeInput, '036000291459');

    expect(screen.getByText('Invalid check digit')).toBeInTheDocument();
  });
});
