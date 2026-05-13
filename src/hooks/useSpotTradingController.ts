import { useEffect, useRef } from 'react';
import { wsService } from '@/services/websocket';

interface UseSpotTradingControllerProps {
  symbol: string;
  interval: string;
  enabled?: boolean;
}

export function useSpotTradingController({
  symbol,
  interval,
  enabled = true,
}: UseSpotTradingControllerProps) {
  const prevSymbolRef = useRef<string>('');
  const prevIntervalRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !wsService.isConnected()) return;

    const currentSymbol = symbol.toUpperCase();
    const prevSymbol = prevSymbolRef.current;
    const prevInterval = prevIntervalRef.current;

    // Handle symbol change
    if (prevSymbol && prevSymbol !== currentSymbol) {
      // Leave previous room
      wsService.emit('spot:leave_room', { symbol: prevSymbol });
    }

    // Join new room
    wsService.emit('spot:join_room', {
      symbol: currentSymbol,
      depth: 20,
      interval,
    });

    // Handle interval change
    if (prevInterval && prevInterval !== interval) {
      // Leave previous timeframe
      wsService.emit('spot:leave_timeframe', { interval: prevInterval });
    }

    // Join new timeframe
    wsService.emit('spot:join_timeframe', { interval });

    // Init candles for new symbol/interval
    wsService.emit('spot:init_candle', {
      symbol: currentSymbol,
      interval,
    });

    // Update refs
    prevSymbolRef.current = currentSymbol;
    prevIntervalRef.current = interval;

    // Cleanup on unmount or disable
    return () => {
      if (prevSymbol) {
        wsService.emit('spot:leave_room', { symbol: prevSymbol });
      }
      if (prevInterval) {
        wsService.emit('spot:leave_timeframe', { interval: prevInterval });
      }
    };
  }, [symbol, interval, enabled]);

  // Additional emits can be added here if needed
}