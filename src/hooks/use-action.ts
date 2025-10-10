import { useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

type ServerAction<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

export function useAction<TInput, TOutput>(action: ServerAction<TInput, TOutput>) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { setLoading } = useLoading();

  const wrappedAction = async (input: TInput) => {
    setIsActionLoading(true);
    setLoading(true);
    try {
      return await action(input);
    } finally {
      setIsActionLoading(false);
      setLoading(false);
    }
  };

  return { wrappedAction, isActionLoading };
}
