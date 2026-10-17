import { useEffect, useState } from 'react';

// useState that remembers its value in localStorage (falls back silently if storage is unavailable).
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be blocked (private mode); the value still works for this session.
    }
  }, [key, value]);

  return [value, setValue];
}
