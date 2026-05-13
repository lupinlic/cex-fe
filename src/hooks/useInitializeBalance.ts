import { useEffect } from 'react';
import { useBalanceStore } from '@/store/balanceStore';

/**
 * Hook to initialize and refresh balance data on component mount
 * Automatically fetches balance from API when called
 */
export function useInitializeBalance() {
  const { refreshBalances } = useBalanceStore();

  useEffect(() => {
    // Only initialize balance if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && user) {
      const initializeBalance = async () => {
        try {
          await refreshBalances();
        } catch (error) {
          console.error('Failed to initialize balance:', error);
        }
      };

      initializeBalance();
    }
  }, [refreshBalances]);
}
