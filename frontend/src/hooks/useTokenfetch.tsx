import { useEffect } from 'react';
import { useTokenStore } from './useTokenstore';

export const useTokenData = () => {
  const { tokens, isLoading, error, fetchTokens } = useTokenStore();

  useEffect(() => {
    if (tokens.length === 0 && !isLoading && !error) {
      fetchTokens();
    }
  }, [tokens.length, isLoading, error, fetchTokens]);

  return { tokens, isLoading, error };
};