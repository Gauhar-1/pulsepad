'use client';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useMemoCompare } from './use-memo-compare';

interface UseDocState<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T>(
  docRef: DocumentReference | null
): UseDocState<T> {
  const [state, setState] = useState<UseDocState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const docRefMemo = useMemoCompare(docRef, (prev) => {
    return prev && docRef && prev.isEqual(docRef);
  });

  useEffect(() => {
    if (!docRefMemo) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    const unsubscribe = onSnapshot(
      docRefMemo,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as T;
          setState({ data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: null });
        }
      },
      (error: FirestoreError) => {
        setState({ data: null, loading: false, error });
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, [docRefMemo]);

  return state;
}
