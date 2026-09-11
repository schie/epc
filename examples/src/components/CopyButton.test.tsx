import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CopyButton from './CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('copies the value to the clipboard and shows confirmation', async () => {
    render(<CopyButton value="hello world" />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
  });

  it('reverts to the default label after a short delay', async () => {
    render(<CopyButton value="hello world" label="Copy hex" />);

    fireEvent.click(screen.getByRole('button', { name: /copy hex/i }));
    expect(await screen.findByText('Copied!')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Copy hex')).toBeInTheDocument(), {
      timeout: 2000,
    });
  });
});
