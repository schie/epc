import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('defaults to light theme when nothing is stored', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('restores a previously stored dark preference', () => {
    window.localStorage.setItem('epc-example-theme', 'dark');
    render(<ThemeToggle />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('persists the choice when toggled', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('checkbox'));

    expect(window.localStorage.getItem('epc-example-theme')).toBe('dark');
  });
});
