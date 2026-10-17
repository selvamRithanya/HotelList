import { useCallback, useEffect, useState } from 'react';

// Must match the inline script in index.html, which applies the theme before first paint.
const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function storedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

const systemTheme = () => (window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light');

// Light/dark theme stored on <html data-theme>. Follows the OS setting until the user picks one.
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || storedTheme() || systemTheme()
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.(DARK_QUERY);
    if (!media) return undefined;
    const onChange = (event) => {
      if (!storedTheme()) setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be blocked (private mode); the theme still applies for this session.
    }
    setTheme(next);
  }, [theme]);

  return { theme, toggle };
}
