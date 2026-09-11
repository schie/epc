import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const STORAGE_KEY = 'epc-example-theme';

function getInitialTheme(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function persistTheme(isDark: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  } catch {
    // Ignore storage errors (e.g. private browsing).
  }
}

function ThemeToggle() {
  const [defaultChecked] = useState(getInitialTheme);

  return (
    <label
      className="swap swap-rotate btn btn-ghost btn-circle"
      aria-label="Toggle dark theme"
    >
      <input
        type="checkbox"
        className="theme-controller"
        value="dark"
        defaultChecked={defaultChecked}
        onChange={(event) => persistTheme(event.target.checked)}
      />
      <SunIcon className="swap-off h-5 w-5" />
      <MoonIcon className="swap-on h-5 w-5" />
    </label>
  );
}

export default ThemeToggle;
