import { useEffect, useRef, useState } from "react";

/**
 * SSR-safe localStorage hook.
 * Always renders `initial` on first paint (server + client) to avoid
 * hydration mismatches, then hydrates from localStorage in an effect.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [savedTick, setSavedTick] = useState(0);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (skip until after hydration so we don't overwrite stored data with the initial value).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setSavedTick((t) => t + 1);
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue, savedTick] as const;
}
