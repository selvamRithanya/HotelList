import { useCallback, useEffect, useState } from 'react';

const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

function describeError(err) {
  if (err.code === 1) return 'Location permission was denied.';
  if (err.code === 3) return 'Finding your location timed out.';
  return 'Your location could not be determined.';
}

// Wraps the browser Geolocation API. With `auto`, the position is requested on mount.
// status: idle | locating | success | denied | error | unsupported
export function useGeolocation({ auto = false } = {}) {
  const [state, setState] = useState({
    status: isSupported ? 'idle' : 'unsupported',
    position: null,
    error: isSupported ? null : 'Your browser does not support geolocation.',
  });

  const locate = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!isSupported) {
          reject(new Error('Your browser does not support geolocation.'));
          return;
        }
        setState((s) => ({ ...s, status: 'locating', error: null }));
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const position = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
            setState({ status: 'success', position, error: null });
            resolve(position);
          },
          (err) => {
            const message = describeError(err);
            setState({ status: err.code === 1 ? 'denied' : 'error', position: null, error: message });
            reject(new Error(message));
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      }),
    []
  );

  useEffect(() => {
    if (auto) locate().catch(() => {});
  }, [auto, locate]);

  return { ...state, supported: isSupported, locate };
}
