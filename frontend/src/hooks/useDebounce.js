import { useEffect, useState } from 'react';

/** Debounces a fast-changing value (e.g. search input) for use in
 * effects/API calls. */
export default function useDebounce(value, delayMs) {
  const delay = delayMs || 400;
  const [debounced, setDebounced] = useState(value);

  useEffect(
    function scheduleUpdate() {
      const timer = setTimeout(function applyValue() {
        setDebounced(value);
      }, delay);
      return function cleanup() {
        clearTimeout(timer);
      };
    },
    [value, delay]
  );

  return debounced;
}