import { useRef, useEffect } from 'react';

type CompareFunction<T> = (prev: T | null, next: T) => boolean;

export function useMemoCompare<T>(next: T, compare: CompareFunction<T>): T {
  const previousRef = useRef<T | null>(null);
  const previous = previousRef.current;
  const isEqual = compare(previous, next);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual && previous ? previous : next;
}
