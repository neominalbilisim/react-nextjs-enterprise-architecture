import { useEffect, useState } from "react";

// MODÜL 2 · Custom Hook Tasarımı
// İş mantığını (logic) UI katmanından ayıran, 'use' ile başlayan
// yeniden kullanılabilir bir hook örneği.

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
