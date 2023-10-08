import { createContext, useContext, useLayoutEffect, useState } from "react";
import useEvent from "react-use-event-hook";

// modified, original from https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(
  key: string,
  initialValue: (oldValue: T | null) => T
): [T, (state: T | ((prevState: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(initialValue(null));

  const loadValue = useEvent(() => {
    if (typeof window === "undefined") {
      return initialValue(null);
    }

    try {
      const item = localStorage.getItem(key);
      return initialValue(JSON.parse(item));
    } catch (error) {
      console.error(error);
      return initialValue(null);
    }
  });

  useLayoutEffect(() => {
    setStoredValue(loadValue());
  }, [loadValue]);

  const setValue = useEvent(async (value: T | ((prevState: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  });

  return [storedValue, setValue];
}

export function createLocalStorageContext<T>(
  name: string,
  initialValue: (oldValue: T | null) => T
) {
  const InternalContext = createContext<
    [T, (state: T | ((prevState: T) => T)) => void]
  >([initialValue(null), () => {}]);

  return {
    Provider({ children }: { children: React.ReactNode }) {
      const [storedValue, setStoredValue] = useLocalStorage<T>(
        name,
        initialValue
      );

      return (
        <InternalContext.Provider value={[storedValue, setStoredValue]}>
          {children}
        </InternalContext.Provider>
      );
    },
    useContext: () => useContext(InternalContext),
  };
}
