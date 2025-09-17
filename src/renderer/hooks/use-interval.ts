import { useEffect, useRef } from 'react';

type IntervalId = NodeJS.Timer | number | undefined;

export function useInterval(callback: () => void, delay: number | null): IntervalId | undefined {
  const savedCallback = useRef(callback);
  const intervalIdRef = useRef<IntervalId>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (typeof savedCallback?.current === 'function') {
        savedCallback.current();
      }
    };

    if (intervalIdRef.current !== undefined) {
      clearInterval(intervalIdRef.current);
    }

    if (delay !== null) {
      intervalIdRef.current = setInterval(tick, delay);
    }

    return () => {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = undefined;
    };
  }, [delay]);

  return intervalIdRef.current;
}
