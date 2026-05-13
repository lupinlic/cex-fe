'use client';

import React, { useEffect, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { initializeRealtimeSync } from '@/store/realtimeStore';
import { useSpotTradingData } from '@/store/spotTradingStore';
import { useWebSocketConnection } from '@/services/websocket';
import { useSpotTradingController } from '@/hooks/useSpotTradingController';
import { useSpotTradingSync } from '@/hooks/useSpotTradingSync';
import { useInitializeBalance } from '@/hooks/useInitializeBalance';
import { Toaster } from 'react-hot-toast';

/**
 * Providers component
 * Wraps the entire app with necessary providers:
 * - QueryClientProvider for React Query
 * - WebSocket initialization and management
 * - Realtime data synchronization
 * - Spot trading socket sync
 * - Balance data initialization
 * - Toast notifications
 */
function ProvidersContent({ children }: { children: React.ReactNode }) {
  useInitializeBalance();
  const { connect } = useWebSocketConnection();
  const { symbol, interval } = useSpotTradingData();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  // Use the new hooks
  useSpotTradingController({ symbol, interval });
  useSpotTradingSync({ userId });

  useEffect(() => {
    initializeRealtimeSync();

    const connectWebSocket = async () => {
      try {
        await connect();
        console.log('✅ WebSocket connected successfully');
      } catch (error) {
        console.error('❌ Failed to connect to WebSocket:', error);
        // Don't use mock, just log error
      }
    };

    connectWebSocket();

    return () => {
      // Cleanup is handled by the hooks
    };
  }, [connect]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContent>{children}</ProvidersContent>
    </QueryClientProvider>
  );
}
