'use client';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useMemoCompare } from './use-memo-compare';

interface UseCollectionState<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T>(
  query: Query | null
): UseCollectionState<T> {
  const [state, setState] = useState<UseCollectionState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const queryRef = useRef<Query | null>(null);

  const queryMemo = useMemoCompare(query, (prev) => {
    return prev && query && prev.isEqual(query);
  });

  useEffect(() => {
    if (!queryMemo) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    if (queryRef.current && queryRef.current.isEqual(queryMemo)) {
        return;
    }
    
    queryRef.current = queryMemo;
    setState((s) => ({ ...s, loading: true, error: null }));

    const unsubscribe = onSnapshot(
      queryMemo,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setState({ data, loading: false, error: null });
      },
      (error: FirestoreError) => {
        setState({ data: null, loading: false, error });
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, [queryMemo]);

  return state;
}
