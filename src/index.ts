import { useState, useCallback } from 'react';

export type LoadingHookValues = { message?: string; isLoading: boolean };

export type LoadingHookMethods = {
  start: (message?: string) => void;
  stop: () => void;
};

/**
 * Hook for managing loading indicator state.
 * Allows you to start and stop the loading boolean, and manage the loading indicator message.
 * @param initState Initial loading state. Defaults to false.
 * @param initMessage Initial message. Defaults to undefined.
 */
export const useLoading = (
  initState: boolean = false,
  initMessage?: string
): [LoadingHookValues, LoadingHookMethods] => {
  const [isLoading, setIsLoading] = useState<boolean>(initState);
  const [message, setMessage] = useState<string | undefined>(initMessage);

  const start = useCallback((message?: string) => {
    setIsLoading(true);
    setMessage(message);
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  return [
    { message, isLoading },
    { start, stop },
  ];
};
