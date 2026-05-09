import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const isFirst = useRef(true);
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setSavedTick((t) => t + 1);
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue, savedTick] as const;
}
